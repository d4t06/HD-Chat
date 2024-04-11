import { useAuth } from "@/stores/AuthContext";
import { useConversation } from "@/stores/ConversationContext";
import { reset } from "@/stores/CurrentConversationSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function useLogout() {
   const [isFetching, setIsFetching] = useState(false);
   const { setConversations } = useConversation();

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
         dispatch(reset());
         setConversations([]);

         setAuth(null);
      }
   };

   return { logout, isFetching };
}
