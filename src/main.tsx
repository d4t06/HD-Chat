import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AuthProvider from "./stores/AuthContext.tsx";
import ThemeProvider from "./stores/ThemeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
      <AuthProvider>
         <ThemeProvider>
            <App />
         </ThemeProvider>
      </AuthProvider>
   </React.StrictMode>
);
