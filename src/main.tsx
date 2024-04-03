import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AuthProvider from "./stores/AuthContext.tsx";
import ThemeProvider from "./stores/ThemeContext.tsx";
import SocketProvider from "./stores/SocketContext.tsx";
import ConversationProvider from "./stores/ConversationContext.tsx";
import { Provider } from "react-redux";
import store from "./stores/redux.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
      <AuthProvider>
         <ThemeProvider>
            <SocketProvider>
               <ConversationProvider>
                  <Provider store={store}>
                     <App />
                  </Provider>
               </ConversationProvider>
            </SocketProvider>
         </ThemeProvider>
      </AuthProvider>
   </React.StrictMode>
);
