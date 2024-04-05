import { useEffect } from "react";
import useMessageActions from "./useMessageActions";
import { useDispatch, useSelector } from "react-redux";
import {
   selectCurrentConversation,
   storingConversation,
} from "@/stores/CurrentConversationSlice";
import { useConversation } from "@/stores/ConversationContext";

export default function useCurrentConversationMessage() {
   // hooks
   const dispatch = useDispatch();
   const { status: getConversationStatus } = useConversation();
   const { currentConversationInStore, tempUser } = useSelector(
      selectCurrentConversation
   );
   const { getCurrentConversationMessages } = useMessageActions();

   const handleInitConversation = async () => {
      try {
         // if found conversation
         if (!currentConversationInStore) return;

         const messages = await getCurrentConversationMessages(
            currentConversationInStore.id
         );
         dispatch(
            storingConversation({
               messages,
               messageStatus: "successful",
               replace: true,
            })
         );
      } catch (error) {
         console.log({ message: error });
         dispatch(
            storingConversation({
               messageStatus: "error",
            })
         );
      }
   };

   // problem after send new message to new user auto set status = loading
   useEffect(() => {
      if (getConversationStatus === "loading" || getConversationStatus === "error")
         return;

      if (!currentConversationInStore) {
         dispatch(
            storingConversation({
               messageStatus: "successful",
            })
         );
      } else handleInitConversation();

      // return () => {
      //    dispatch(
      //       storingConversation({ messageStatus: "loading", messages: [], replace: true })
      //    );
      // };
   }, [currentConversationInStore, tempUser]);
}
