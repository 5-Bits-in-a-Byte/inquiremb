import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavigationWrapper from "./components/navigation/NavigationWrapper";
import Courses from "./components/courses/Courses";
import SignUp from "./components/signUp/SignUp";
import Login from "./components/signUp/Login";
import "./fonts/fonts.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <NavigationWrapper>
            <Courses />
          </NavigationWrapper>
        </Route>
        <Route path="/signup" exact>
          <SignUp />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
