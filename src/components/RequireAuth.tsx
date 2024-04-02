import { Navigate, Outlet } from "react-router-dom";
import loadingGif from "@/assets/loading.gif";
import { useAuth } from "../stores/AuthContext";

export default function RequireAuth() {
   const { auth, loading } = useAuth();

   if (loading)
      return (
         <div className="h-screen flex items-center">
            <img className="mx-auto w-[200px]" src={loadingGif} alt="" />
         </div>
      );

   return auth ? <Outlet /> : <Navigate to="/login" />;
}
