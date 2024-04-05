import { useEffect, useRef } from "react";
import useMessageActions from "./useMessageActions";
import { useDispatch, useSelector } from "react-redux";
import {
   selectCurrentConversation,
   storingConversation,
} from "@/stores/CurrentConversationSlice";

export default function useCurrentConversationMessage() {
   const ranInit = useRef(false);

   // hooks
   const dispatch = useDispatch();
   const { currentConversationInStore } = useSelector(selectCurrentConversation);

   const { getCurrentConversationMessages } = useMessageActions();

   const handleInitConversation = async () => {
      try {
         if (ranInit.current) return;
         // if found conversation
         if (!currentConversationInStore) return;

         console.log("run init conversion");
         const messages = await getCurrentConversationMessages(
            currentConversationInStore.id
         );

         dispatch(
            storingConversation({
               messages,
               messageStatus: "successful",
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

   useEffect(() => {
      if (!currentConversationInStore) {
         dispatch(
            storingConversation({
               messageStatus: "successful",
            })
         );
      } else handleInitConversation();

      return () => {
         ranInit.current = false;
         dispatch(storingConversation({ messageStatus: "loading", tempUser: null }));
      };
   }, [currentConversationInStore]);
}
