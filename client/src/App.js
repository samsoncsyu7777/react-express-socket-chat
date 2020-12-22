import React, { useState, useMemo, useEffect } from "react";
import { Redirect } from "react-router";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import { theme } from "./themes/theme";
import SignUp from "./pages/SignUp";
import Chats from "./pages/Chats";

import "./App.css";

function App(props) {

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/signup" />} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={SignUp} />
          <Route path="/chats" component={Chats} />

        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
