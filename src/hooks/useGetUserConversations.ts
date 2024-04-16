import { AuthType, useAuth } from "@/stores/AuthContext";
import { useEffect, useRef } from "react";
import useConversationActions from "./useConversationActions";
import { sleep } from "@/utils/appHelper";
import { useDispatch, useSelector } from "react-redux";
import {
   initConversationDetail,
   selectAllConversations,
   setConversationStatus,
} from "@/stores/ConversationSlice";

export default function useGetUserConversation() {
   const ranGetConversation = useRef(false);

   // hooks
   const dispatch = useDispatch();
   const { auth, loading } = useAuth();
   // const { setConversations, conversations, tempConversations, setStatus, status } =
   //    useConversation();
   const { conversationDetails, status } = useSelector(selectAllConversations);

   const { getAllUserConversations } = useConversationActions();

   const handleGetUserConversations = async (auth: AuthType) => {
      try {
         if (!auth) return;

         console.log(">>> api get user conversation");
         // setStatus("loading");
         dispatch(setConversationStatus({ status: "loading" }));

         await sleep(2000);
         const conversations = await getAllUserConversations(auth.id);
         if (conversations) {
            // setConversations(conversations);
            return dispatch(
               initConversationDetail({ auth, conversations, status: "successful" })
            );
         }

         return dispatch(setConversationStatus({ status: "successful" }));

         // setStatus("successful");
      } catch (error) {
         console.log({ message: error });
         dispatch(setConversationStatus({ status: "error" }));
      }
   };

   useEffect(() => {
      // app always require auth
      if (!auth || loading) return;

      if (!ranGetConversation.current) {
         ranGetConversation.current = true;
         handleGetUserConversations(auth);
      }
   }, [loading, loading]);

   return { conversationDetails, status };
}
