import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Courses from "./components/courses/Courses";
import LeftNavBar from "./components/navigation/LeftNavBar";
import TopNavBar from "./components/navigation/TopNavBar";
import SignUp from "./components/signUp/SignUp";

function App() {
  return (
    <Router>
      <Switch>
        {/* Only renders Nav bars for urls included within the path array */}
        <Route path={["/"]} exact>
          <LeftNavBar />
          <TopNavBar />
        </Route>
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
