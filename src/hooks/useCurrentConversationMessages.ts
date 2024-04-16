import { useEffect, useRef } from "react";
import useMessageActions from "./useMessageActions";
import { useDispatch, useSelector } from "react-redux";
import {
   selectCurrentConversation,
   setMessageStatus,
   storingMessages,
} from "@/stores/CurrentConversationSlice";

export default function useCurrentConversationMessage() {
   const isNewConversation = useRef(false);

   // hooks
   const dispatch = useDispatch();
   const { currentConversationInStore, tempUser, messageStatus } = useSelector(
      selectCurrentConversation
   );
   const { getCurrentConversationMessages } = useMessageActions();

   const handleInitConversation = async () => {
      try {
         // if no conversation in store
         if (!currentConversationInStore || isNewConversation.current) {
            isNewConversation.current = false;

            return dispatch(
               setMessageStatus({
                  messageStatus: "successful",
               })
            );
         }

         dispatch(
            setMessageStatus({
               messageStatus: "loading",
            })
         );

         const messages = await getCurrentConversationMessages(
            currentConversationInStore.conversation.id
         );

         if (!messages) throw new Error("Messages is undefined");

         dispatch(
            storingMessages({
               messages: messages,
               messageStatus: "successful",
               replace: true,
            })
         );
      } catch (error) {
         console.log({ message: error });
         dispatch(
            setMessageStatus({
               messageStatus: "error",
            })
         );
      }
   };

   useEffect(() => {
      handleInitConversation();
   }, [currentConversationInStore?.conversation.id]);

   useEffect(() => {
      if (tempUser) isNewConversation.current = true;
   }, [tempUser]);

   return { currentConversationInStore, tempUser, messageStatus };
}
