import { ReactElement, ReactNode } from "react";
import ConversationPage from "../Pages/Conversation";
import HomePage from "../Pages/Home";
import LoginPage from "../Pages/Login";
import RegisterPage from "../Pages/Register";
import LoginLayout from "../layouts/AuthLayout";
import DefaultLayout from "../layouts/DefaultLayout";

export type Route = {
   path: string;
   component: () => ReactElement;
   layout: (pros: { children: ReactNode }) => ReactElement;
};

const publicRoutes: Route[] = [
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

const privateRoutes = [
   {
      path: "/",
      component: HomePage,
      layout: DefaultLayout,
   },
   {
      path: "/conversation/:id",
      component: ConversationPage,
      layout: DefaultLayout,
   },
];

export { publicRoutes, privateRoutes };
