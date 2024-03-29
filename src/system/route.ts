import HomePage from "../Pages/Home";
import LoginPage from "../Pages/Login";
import RegisterPage from "../Pages/Register";
import LoginLayout from "../layouts/AuthLayout";

const routes = [
   {
      path: "/",
      component: HomePage,
   },
   {
      path: "/login",
      component: LoginPage,
      layout: LoginLayout,
   },
   {
      path: "/register",
      component: RegisterPage,
      layout: LoginLayout,
   },
];

export default routes;
