import React from "react";
import ReactDOM from 'react-dom/client';
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { TourProvider } from "@reactour/tour"
import "./i18n"
import store from "./store";

const steps = [
  {
    selector: ".first-step",
    content: "This is my first Step",
  },
  // ...
]


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.Fragment>
      <BrowserRouter>
        <TourProvider steps={steps} rtl>
          <App />
        </TourProvider>
      </BrowserRouter>
    </React.Fragment>
  </Provider>
);

serviceWorker.unregister()
