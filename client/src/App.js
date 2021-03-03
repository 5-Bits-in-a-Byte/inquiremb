import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavigationWrapper from "./components/navigation/NavigationWrapper";
import Courses from "./components/courses/Courses";
import SignUp from "./components/signUp/SignUp";
import "./fonts/fonts.css";
import Messages from "./components/messages/Messages";
import Home from "./components/home/Home";
import ClassView from "./components/forumsAndPosts/ClassView";
import CommentView from "./components/comments/CommentView";

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
        <Route path="/classView" exact>
          <NavigationWrapper>
            <ClassView classroomName={"CIS 422"} />
          </NavigationWrapper>
        </Route>
        <Route path="/commentView" exact>
          <NavigationWrapper>
            <CommentView classroomName={"CIS 422"} />
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
