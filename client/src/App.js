import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GameMode from "./components/GameMode";

import StartPage from "./components/StartPage";


const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={StartPage} />
        <Route exact path="/selectGameMode" component={GameMode} />

      </Switch>
    </Router>
  );
};

export default App;
