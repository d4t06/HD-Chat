import { Navigate, Outlet } from "react-router-dom";
import loadingGif from "@/assets/loading.gif";
import { useAuth } from "../stores/AuthContext";
import { useEffect, useRef, useState } from "react";
import usePrivateRequest from "@/hooks/usePrivateRequest";

export default function RequireAuth() {
   const [isFetching, setIsFetching] = useState(true);
   const ranEffect = useRef(false);

   const { auth, loading } = useAuth();
   const privateRequest = usePrivateRequest();

   useEffect(() => {
      if (loading) return;

      const updateLastSeen = async () => {
         try {
            if (auth)
               privateRequest.patch(`/users/${auth.id}`, {
                  last_seen: new Date().toISOString(),
                  fullName: auth.fullName,
               });
         } catch (error) {
            console.log({ message: error });
         } finally {
            setIsFetching(false);
         }
      };

      if (auth) {
         if (!ranEffect.current) {
            ranEffect.current = true;
            updateLastSeen();
         }
      } else setIsFetching(false);
   }, [auth, loading]);

   if (loading || isFetching)
      return (
         <div className="h-screen flex items-center">
            <img className="mx-auto w-[200px]" src={loadingGif} alt="" />
         </div>
      );

   return auth ? <Outlet /> : <Navigate to="/login" />;
}
