use leptos::*;
use wasm_bindgen::prelude::*;
use web_sys::{MessageEvent, WebSocket};
use crate::models::*;

#[derive(Clone, Default, Debug, PartialEq)]
pub struct GlobalState {
    pub user: Option<User>,
    pub ws: Option<WebSocket>,
    pub current_trailer: Option<TrailerResponse>,
    pub current_view: String,
    pub trailers: Vec<TrailerResponse>,
    pub ws_connected: bool,
}

impl GlobalState {
    pub fn new() -> Self {
        GlobalState {
            user: Default::default(),
            ws: None,
            current_trailer: None,
            current_view: "login".to_string(),
            trailers: vec![],
            ws_connected: false,
        }
    }

    pub fn connect_websocket(&mut self, trailers: Vec<TrailerResponse>, set_trailers: SignalSetter<Vec<TrailerResponse>>) {
        let trailers = trailers.clone();
        let set_trailers = set_trailers.clone();
        
        let ws = WebSocket::new("ws://192.168.4.97:9001").unwrap();
        log::info!("WebSocket created");
        
        let onopen_callback = Closure::<dyn FnMut()>::new(move || {
            log::info!("WebSocket connection opened");
        });

        let onclose_callback = Closure::<dyn FnMut()>::new(move || {
            log::info!("WebSocket connection closed");
        });

        let onerror_callback = Closure::<dyn FnMut()>::new(move || {
            log::error!("WebSocket connection error");
        });

        let onmessage_callback = {
            Closure::<dyn FnMut(_)>::new(move |event: MessageEvent| {
                if let Some(data) = event.data().as_string() {
                    log::info!("Received message: {}", data);
                    if let Ok(incoming_message) = serde_json::from_str::<IncomingMessage>(&data) {
                        match incoming_message.r#type.as_str() {
                            "hot_trailer" => {
                                log::info!("hot_trailer event: {:?}", incoming_message.data);
                                if let Some(message) = incoming_message.data.get("message").and_then(|v| v.as_str()) {
                                    let mut updated_trailers = trailers.clone();
                                    for trailer in updated_trailers.iter_mut() {
                                        if trailer.TrailerID == message {
                                            trailer.Schedule.IsHot = !trailer.Schedule.IsHot;
                                        }
                                    }
                                    set_trailers(updated_trailers);
                                }
                            }
                            _ => {
                                log::info!("Unknown event type: {:?}", incoming_message.r#type);
                            }
                        }
                    } else {
                        log::error!("Failed to deserialize message: {}", data);
                    }
                } else {
                    log::error!("Failed to get string from event data");
                }
            })
        };

        ws.set_onopen(Some(onopen_callback.as_ref().unchecked_ref()));
        ws.set_onclose(Some(onclose_callback.as_ref().unchecked_ref()));
        ws.set_onerror(Some(onerror_callback.as_ref().unchecked_ref()));
        ws.set_onmessage(Some(onmessage_callback.as_ref().unchecked_ref()));

        onopen_callback.forget();
        onclose_callback.forget();
        onerror_callback.forget();
        onmessage_callback.forget();

        log::info!("WebSocket event handlers set");

        self.ws = Some(ws);
        self.ws_connected = true;
        
    }

    pub fn send_ws_message(&self, message: &str) {
        if let Some(ws) = &self.ws {
            if ws.ready_state() == WebSocket::OPEN {
                log::info!("WebSocket is open, sending message: {}", message);
                if let Err(e) = ws.send_with_str(message) {
                    log::error!("Failed to send WebSocket message: {:?}", e);
                }
            } else {
                log::error!("WebSocket is not open, current state: {}", ws.ready_state());
            }
        } else {
            log::error!("WebSocket is not initialized");
        }
    }
}