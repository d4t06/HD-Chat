import { Route, HashRouter, Routes } from "react-router-dom";
import { Route as RouteType, privateRoutes, publicRoutes } from "./system/route";
import DefaultLayout from "./layouts/DefaultLayout";
import PersistLogin from "./components/PersitLogin";
import RequireAuth from "./components/RequireAuth";

function App() {
   const renderRoute = (routes: RouteType[]) => {
      return routes.map((r) => {
         let Layout = DefaultLayout;
         const Page = r.component;
         if (r.layout) Layout = r.layout;

         return (
            <Route
               key={r.path}
               path={r.path}
               element={
                  <Layout key={r.path}>
                     <Page />
                  </Layout>
               }
            />
         );
      });
   };

   return (
      <HashRouter>
         <Routes>
            {renderRoute(publicRoutes)}

            <Route element={<PersistLogin />}>
               <Route element={<RequireAuth />}>{renderRoute(privateRoutes)}</Route>
            </Route>
         </Routes>
      </HashRouter>
   );
}

export default App;
