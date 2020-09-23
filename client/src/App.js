import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GameMode from "./components/GameMode";

import StartPage from "./components/StartPage";
import WaitingRoom from "./components/WaitingRoom";


const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={StartPage} />
        <Route exact path="/selectGameMode" component={GameMode} />
        <Route exact path="/waitingRoom/:mode" component={WaitingRoom} />

      </Switch>
    </Router>
  );
};

export default App;
