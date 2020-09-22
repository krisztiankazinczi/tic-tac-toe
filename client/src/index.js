import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import css from "./utils/theme";

import { AuthProvider } from "./store/authProvider";
import reducer, { initialState } from "./store/authReducer";

const styles = css;

const theme = createMuiTheme(styles);

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <AuthProvider initialState={initialState} reducer={reducer}>
        <App />
      </AuthProvider>
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
