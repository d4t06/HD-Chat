import { useMemo, useEffect } from "react";
import { useConversation } from "@/stores/ConversationContext";
import useMessageActions from "./useMessageActions";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentConversation, storingConversation } from "@/stores/CurrentConversationSlice";

type Props = {
   conversation_id?: string;
};

export default function useCurrentConversation({ conversation_id }: Props) {
   // hooks
   const dispatch = useDispatch();
   const { status } = useSelector(selectCurrentConversation);

   const { conversations } = useConversation();
   const { getCurrentConversationMessages } = useMessageActions();

   const getCurrentConversation = () => {
      if (conversation_id) {
         return conversations.find((c) => c.id === +conversation_id);
      }
   };

   const currentConversation = useMemo(() => getCurrentConversation(), [conversation_id]);

   const handleInitConversation = async () => {
      console.log("run init conversion");

      try {
         // if found conversation
         if (conversation_id && currentConversation) {
            dispatch(
               storingConversation({
                  currentConversationInStore: currentConversation,
               })
            );

            const messages = await getCurrentConversationMessages(+conversation_id);

            dispatch(
               storingConversation({
                  messages,
                  status: "successful",
               })
            );

            // if no have conversation
         } else {
            dispatch(
               storingConversation({
                  status: "successful",
               })
            );
         }
      } catch (error) {
         console.log({ message: error });
         dispatch(
            storingConversation({
               status: "error",
            })
         );
      }
   };

   useEffect(() => {
      if (status === "successful") return;

      handleInitConversation();

      return () => {
         // if user change to another conversation
         dispatch(storingConversation({ status: "loading", tempUser: null }));
      };
   }, [conversation_id]);
}
