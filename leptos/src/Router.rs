use ev::Event;
use leptos::*;
use reqwest::Client;
use wasm_bindgen_futures::spawn_local;
use crate::models::{LoginRequest, LoginResponse, User};
use crate::state::GlobalState;
use crate::trucks::AllTrailers;

#[component]
pub fn Router() -> impl IntoView {
    let username = create_rw_signal("".to_string());
    let password = create_rw_signal("".to_string());
    let app_state = expect_context::<RwSignal<GlobalState>>();

    let (user, set_user) = create_slice(
        app_state,
        |state| state.user.clone(),
        |state, u| state.user = u,
    );

    let (current_view, set_current_view) = create_slice(
        app_state,
        |state| state.current_view.clone(),
        |state, c| state.current_view = c,
    );

    let on_login = {
        let username = username.clone();
        let password = password.clone();


        move |_| {
            let username = username.get().clone();
            let password = password.get().clone();

            spawn_local(async move {
                let client = Client::new();
                let request = LoginRequest {
                    username: username.clone(),
                    password: password.clone(),
                };

                match client.post("http://192.168.4.97:8000/login")
                    .json(&request)
                    .send()
                    .await {
                    Ok(resp) => {
                        match resp.json::<LoginResponse>().await {
                            Ok(login_response) => {
                                let usr = Some(User {
                                    username: login_response.user.username,
                                    role: login_response.user.role,
                                    token: login_response.token,
                                    refresh_token: login_response.refresh_token,
                                });
                                set_user(usr);
                                log::info!("{:?}", user.get());
                                set_current_view("landing".to_string());
                            },
                            Err(error) => log::info!("Failed to parse JSON: {:?}", error),
                        }
                    },
                    Err(error) => log::info!("Failed to login: {:?}", error),
                }
            });
        }
    };

    let on_username_input = move |e: Event| {
        let input = event_target_value(&e);
        username.set(input);
    };

    let on_password_input = move |e: Event| {
        let input = event_target_value(&e);
        password.set(input);
    };

    view! {
        <div style="text-align: center;">
            {move || {
                if let Some(user) = user.get() {
                    view! {
                        <>
                        {match current_view.get().as_str() {
                            "landing" => view! { <AllTrailers />},
                            _ => view! { <NotFound /> },
                        }}
                        </>
                    }
                } else {
                    view! {
                        <>
                            <h1>{ "Login" }</h1>
                            <input type="text" placeholder="Username" value={move || username.get()} on:input={on_username_input} />
                            <input type="password" placeholder="Password" value={move || password.get()} on:input={on_password_input} />
                            <button on:click={on_login}>{ "Login" }</button>
                        </>
                    }
                }
            }}
        </div>
    }
    
}

#[component]
fn NotFound() -> impl IntoView {
    view! {
        <h1>"Page Not Found"</h1>
    }
}

