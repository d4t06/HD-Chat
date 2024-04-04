import { useAuth } from "@/stores/AuthContext";
import { privateRequest } from "@/utils/request";
import { useState } from "react";

export default function useLogout() {
   const [isFetching, setIsFetching] = useState(false);

   const { setAuth } = useAuth();

   const logout = async () => {
      try {
         setIsFetching(true);
         await privateRequest.get("/auth/logout");
         setAuth(null);
      } catch (error) {
         console.log({ message: error });
      } finally {
         setIsFetching(false);
      }
   };

   return { logout, isFetching };
}
