import { useEffect } from "react";
import { privateRequest } from "../utils/request";
import useRefreshToken from "./useRefreshToken";
import { useAuth } from "../stores/AuthContext";

const usePrivateRequest = () => {
   const refresh = useRefreshToken();
   const { auth } = useAuth();

   useEffect(() => {
      if (!auth) return;
      const requestIntercept = privateRequest.interceptors.request.use(
         (config) => {
            // Do something before request is sent
            //  console.log("handle before request sent");
            if (!config.headers["Authorization"]) {
               config.headers["Authorization"] = `Bearer ${auth.token}`;
            }

            // console.log("private request auth =", auth)
            return config;
         },
         (err) => Promise.reject(err) // Do something with response error
      );

      const responseIntercept = privateRequest.interceptors.response.use(
         (response) => response, // Do something with response data

         async (err) => {
            // Do something with response error
            const prevRequest = err?.config;

            if (err?.response?.status === 401) {
               if (!prevRequest?.sent) {
                  prevRequest["sent"] = true;
                  const newToken = await refresh();
                  prevRequest.headers["Authorization"] = `bearer ${newToken}`;
               }

               return privateRequest(prevRequest);
            }
            return Promise.reject(err);
         }
      );

      return () => {
         privateRequest.interceptors.request.eject(requestIntercept);
         privateRequest.interceptors.response.eject(responseIntercept);
      };
   }, [auth, refresh]);

   return privateRequest;
};

export default usePrivateRequest;
