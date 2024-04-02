import { useEffect, useRef } from "react";
// import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../stores/AuthContext";
import useRefreshToken from "../hooks/useRefreshToken";
import { sleep } from "@/utils/appHelper";

export default function PersistLogin() {
   const { auth, setLoading } = useAuth();
   const refresh = useRefreshToken();
   const ranEffect = useRef(false);
   const runCB = useRef(false);

   useEffect(() => {
      const verifyRefreshToken = async () => {
         try {
            runCB.current = true;
            await refresh();
         } catch (error) {
            console.error(error);
         } finally {
            if (import.meta.env.DEV) await sleep(1000);
            setLoading(false);
         }
      };

      if (!ranEffect.current && auth == null) verifyRefreshToken();
      else if (!runCB.current) setLoading(false);

      return () => {
         ranEffect.current = true;
      };
   }, []);

   return <Outlet />;
}
