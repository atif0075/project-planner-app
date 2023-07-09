import HomePage from "../pages/home.jsx";
import LoginPage from "../pages/Auth/login.jsx";
import NotFoundPage from "../pages/404.jsx";
import AddStoriesPage from "../pages/addStories.jsx";
import AddIterationPage from "../pages/addIterations.jsx";
import AddTasksPage from "../pages/addTasks.jsx";
import viewTaskPage from "../pages/viewTask.jsx";

var routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/login/",
    component: LoginPage,
  },
  {
    path: "/add-iterations/:id/:name/",
    component: AddIterationPage,
  },
  {
    path: "/add-stories/:projectId/:iterationId/:name/",
    component: AddStoriesPage,
  },
  {
    path: "/add-tasks/:projectId/:iterationId/:storyId/:name/",
    component: AddTasksPage,
  },
  {
    path: "/view-task/:id",
    name: "view-task",
    component: viewTaskPage,
  },
  {
    path: "(.*)",
    component: NotFoundPage,
  },
];

export default routes;
