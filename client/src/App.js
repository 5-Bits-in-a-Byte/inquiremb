import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavigationWrapper from "./components/navigation/NavigationWrapper";
import Courses from "./components/courses/Courses";
import SignUp from "./components/signUp/SignUp";
import "./fonts/fonts.css";
import Messages from "./components/messages/Messages";
import Home from "./components/home/Home";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/home" exact>
          <NavigationWrapper>
            <Home />
          </NavigationWrapper>
        </Route>
        <Route path="/" exact>
          <NavigationWrapper>
            <Courses />
          </NavigationWrapper>
        </Route>
        <Route path="/messages" exact>
          <NavigationWrapper>
            <Messages />
          </NavigationWrapper>
        </Route>
        <Route path="/signup" exact>
          <SignUp />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
