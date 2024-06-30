use std::sync::{Arc, Mutex};

use leptos::*;
use reqwest::Client;
use serde_json::json;
use wasm_bindgen_futures::spawn_local;
use crate::state::GlobalState;
use crate::models::{TrailerResponse, HotTrailerRequest, TrailerSchedule};

fn render_locations(locations: &Vec<String>) -> String {
    let mut txt = String::new();
    for location in locations {
        match location.as_str() {
            "18008" => txt.push_str(" AR"),
            "18044" => txt.push_str(" FF"),
            "22010" => txt.push_str(" 40"),
            _ => {}
        }
    }
    txt.trim().to_string()
}

#[component]
pub fn AllTrailers() -> impl IntoView {
    let app_state = expect_context::<RwSignal<GlobalState>>();
    let user = create_memo(move |_| app_state().user);
    let (view, set_view) = create_slice(
        app_state,
        |state| state.current_view.clone(), 
        |state, v| state.current_view = v);
    let (trailers, set_trailers) = create_slice(
        app_state,
        |state| state.trailers.clone(), 
        |state, t| state.trailers = t);
    
        create_effect(move |_| {
            let state = app_state.clone();
            if !state().trailers.is_empty() && !state().ws_connected {
                state.update(|state| {
                    state.connect_websocket(trailers.get(), set_trailers);
                })
            }
            || ()
        });
    
    let toggle_hot = move |trailer_id: String| {
        let app_state = app_state.clone();

        spawn_local(async move {
            let client = Client::new();
            if let Some(user) = &app_state().user {
                let request = HotTrailerRequest {
                    TrailerID: trailer_id.clone(),
                };

                match client.post("http://192.168.4.97:8000/api/hot_trailer")
                    .header("Authorization", format!("Bearer {}", user.token))
                    .json(&request)
                    .send()
                    .await {
                    Ok(resp) => {
                        match resp.json::<Vec<TrailerSchedule>>().await {
                            Ok(trailer_response) => {
                                log::info!("{:?}", trailer_response);
                                let message = json!({
                                    "type": "hot_trailer",
                                    "data": {
                                        "message": trailer_id.clone()
                                    }
                                }).to_string();
                                log::info!("Sending WebSocket message: {}", message);
                                app_state().send_ws_message(&message);
                            },
                            Err(error) => log::error!("Error: {:?}", error),
                        }
                    },
                    Err(error) => log::error!("{:?}", error)
                }
            }
        });
    };

    create_effect(move |_| {
        let app_state = app_state.clone();

        spawn_local(async move {
            let client = Client::new();
            if let Some(user) = &app_state().user {
                match client.get("http://192.168.4.97:8000/api/schedule_trailer")
                    .header("Authorization", format!("Bearer {}", user.token))
                    .send()
                    .await {
                    Ok(resp) => {
                        match resp.json::<Vec<TrailerResponse>>().await {
                            Ok(trailer_response) => {
                                set_trailers(trailer_response);
                            },
                            Err(error) => log::error!("Error: {:?}", error),
                        }
                    },
                    Err(error) => log::error!("{:?}", error)
                }
            }
        });
    });

    move || {
        view! {
            <div>
            <h1 style="text-align: center;">{ "Testing All Trailers" }</h1>
            <table>
                <thead>
                    <tr style="text-align: center;">
                        <th>{"Request Date"}</th>
                        <th>{"Trailer ID"}</th>
                        <th>{"SCAC"}</th>
                        <th>{"Plant"}</th>
                        <th>{"Last Free Day"}</th>
                        <th>{"Scheduled Date"}</th>
                        <th>{"Scheduled Time"}</th>
                        <th>{"Arrival Time"}</th>
                        <th>{"Door"}</th>
                        <th>{"Hot?"}</th>
                    </tr>
                </thead>
                <tbody>
                { move || {
                    trailers.get().iter().map(|trailer| {
                        let trailer_id = trailer.TrailerID.clone();
                        let tr = trailer.clone();
                        view! {
                            <tr style={
                                if trailer.Schedule.IsHot {
                                    "background-color: red; text-align: center;"
                                } else {
                                    "text-align: center;"
                                }
                            }>
                                <td>{trailer.Schedule.RequestDate.clone()}</td>
                                <td>
                                    <a>
                                        {trailer.TrailerID.clone()}
                                    </a>
                                </td>
                                <td>{trailer.Schedule.CarrierCode.clone()}</td>
                                <td>{render_locations(&trailer.CiscoIDs)}</td>
                                <td>{trailer.Schedule.LastFreeDate.clone()}</td>
                                <td>{trailer.Schedule.ScheduleDate.clone()}</td>
                                <td>{trailer.Schedule.ScheduleTime.clone()}</td>
                                <td>{trailer.Schedule.ArrivalTime.clone()}</td>
                                <td>{trailer.Schedule.DoorNumber.clone()}</td>
                                <td>
                                    <button style={
                                        if trailer.Schedule.IsHot {
                                            "background-color: #4CAF50; color: white; padding: 14px 20px; border: none; cursor: pointer; border-radius: 4px;"
                                        } else {
                                            "background-color: #F44336; color: white; padding: 14px 20px; border: none; cursor: pointer; border-radius: 4px;"
                                        }
                                    } on:click=move |_| toggle_hot(trailer_id.clone())>
                                        { if trailer.Schedule.IsHot { "Mark Not Hot" } else { "Mark Hot" } }
                                    </button>
                                </td>
                            </tr>
                        }
                    }).collect::<Vec<_>>()
                }}
                </tbody>
            </table>
        </div>
        }
    }
}