import { Route, BrowserRouter, Routes } from "react-router-dom";
import routes from "./system/route";
import DefaultLayout from "./layouts/DefaultLayout";

function App() {
   return (
      <BrowserRouter basename="My-Chat">
         <Routes>
            <>
               {routes.map((r) => {
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
               })}
            </>
         </Routes>
      </BrowserRouter>
   );
}

export default App;
