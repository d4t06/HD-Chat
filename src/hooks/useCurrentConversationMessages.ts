import { useEffect } from "react";
import useMessageActions from "./useMessageActions";
import { useDispatch, useSelector } from "react-redux";
import {
   selectCurrentConversation,
   storingMessages,
} from "@/stores/CurrentConversationSlice";

export default function useCurrentConversationMessage() {
   // hooks
   const dispatch = useDispatch();
   const { currentConversationInStore, tempUser, messageStatus } = useSelector(
      selectCurrentConversation
   );
   const { getCurrentConversationMessages } = useMessageActions();

   const handleInitConversation = async () => {
      try {
         // if no conversation in store
         if (!currentConversationInStore)
            return dispatch(
               storingMessages({
                  messageStatus: "successful",
               })
            );

         dispatch(
            storingMessages({
               messageStatus: "loading",
            })
         );

         const messages = await getCurrentConversationMessages(
            currentConversationInStore.id
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
            storingMessages({
               messageStatus: "error",
            })
         );
      }
   };

   // problem after send new message to new user auto set status = loading
   useEffect(() => {
      handleInitConversation();
   }, [currentConversationInStore]);

   return { currentConversationInStore, tempUser, messageStatus };
}
