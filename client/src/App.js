import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavigationWrapper from "./components/navigation/NavigationWrapper";
import Courses from "./components/courses/Courses";
import SignUp from "./components/signUp/SignUp";
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
      </Switch>
    </Router>
  );
}

export default App;
