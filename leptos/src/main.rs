mod state;
mod models;
mod Router;
mod trucks;
use leptos::*;
use state::*;
use Router::Router;

#[component]
fn App() -> impl IntoView {
    let global_state = create_rw_signal(GlobalState::new());

    provide_context(global_state);

    view! {
        <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        height: 100vh;
        width: 100vw;
        margin-top: 7vh;">
            <Router />
        </div>
    }
}


fn main() {
    // Initialize logging for better error messages
    console_log::init_with_level(log::Level::Debug).expect("error initializing log");

    // Mount the App component to the body of the web page
    mount_to_body(|| view! { <App /> });
}