import { useAuth } from "@/stores/AuthContext";
import { reset, storingConversation } from "@/stores/CurrentConversationSlice";
import { privateRequest } from "@/utils/request";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function useLogout() {
   const [isFetching, setIsFetching] = useState(false);

   const { setAuth } = useAuth();
   const dispatch = useDispatch();

   const logout = async () => {
      try {
         setIsFetching(true);
         await privateRequest.get("/auth/logout");
         setAuth(null);
         dispatch(reset());
      } catch (error) {
         console.log({ message: error });
      } finally {
         setIsFetching(false);
      }
   };

   return { logout, isFetching };
}
