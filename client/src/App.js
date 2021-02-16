import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Courses from "./components/courses/Courses";
import SignUp from "./components/signUp/SignUp";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Courses />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
