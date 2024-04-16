import { useAuth } from "@/stores/AuthContext";
import { resetConversations } from "@/stores/ConversationSlice";
import { resetCurrentConversation } from "@/stores/CurrentConversationSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function useLogout() {
   const [isFetching, setIsFetching] = useState(false);

   const { setAuth } = useAuth();
   const dispatch = useDispatch();

   const logout = async () => {
      try {
         setIsFetching(true);
         await axios.get("http://localhost:8080/auth/logout", {
            withCredentials: true,
         });
      } catch (error) {
         console.log({ message: error });
      } finally {
         setIsFetching(false);
         dispatch(resetCurrentConversation());
         dispatch(resetConversations());

         setAuth(null);
      }
   };

   return { logout, isFetching };
}
