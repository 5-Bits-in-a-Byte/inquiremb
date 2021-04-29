import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavigationWrapper from "./components/navigation/NavigationWrapper";
import Courses from "./components/courses/Courses";
import SignUp from "./components/signUp/SignUp";
import Login from "./components/signUp/Login";
import "./fonts/fonts.css";
// import Messages from "./components/messages/Messages";
import Home from "./components/home/Home";
import ClassView from "./components/posts/ClassView";
import CommentView from "./components/comments/CommentView";
import { UserProvider } from "./components/context/UserProvider";
import { UserRoleProvider } from "./components/context/UserRoleProvider";
import PrivateRoute from "./PrivateRoute";
import ConfigView from "./components/configPage/ConfigView";

function App() {
  return (
    <Router>
      <UserProvider>
        <UserRoleProvider>
          <Switch>
            <PrivateRoute path="/home" exact>
              <NavigationWrapper>
                <Home />
              </NavigationWrapper>
            </PrivateRoute>
            <PrivateRoute path="/" exact>
              <NavigationWrapper>
                <Courses />
              </NavigationWrapper>
            </PrivateRoute>
            <Route path="/signup" exact>
              <SignUp />
            </Route>
            <Route path="/login" exact>
              <Login />
            </Route>
            <PrivateRoute path="/course/:courseId" exact>
              <NavigationWrapper>
                <ClassView />
              </NavigationWrapper>
            </PrivateRoute>
            <PrivateRoute path="/course/:courseId/post/:postid" exact>
              <NavigationWrapper>
                <CommentView />
              </NavigationWrapper>
            </PrivateRoute>
            <PrivateRoute path="/course/:courseId/config">
              <NavigationWrapper>
                <ConfigView />
              </NavigationWrapper>
            </PrivateRoute>
          </Switch>
        </UserRoleProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
