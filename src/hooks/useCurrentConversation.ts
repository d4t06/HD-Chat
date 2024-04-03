import { useState, useMemo, useEffect } from "react";
import { useConversation } from "@/stores/ConversationContext";
import useMessageActions from "./useMessageActions";

type Props = {
   searchParams: URLSearchParams;
   conversation_id?: string;
};

export default function useCurrentConversation({ searchParams, conversation_id }: Props) {
   const [isFetching, setIsFetching] = useState(true);
   const [messages, setMessages] = useState<Message[]>([]);

   // hooks
   const { conversations } = useConversation();
   const { getCurrentConversationMessages } = useMessageActions();

   const getCurrentConversation = () => {
      if (conversation_id) {
         return conversations.find((c) => c.id === +conversation_id);
      }
   };

   const currentConversation = useMemo(
      () => getCurrentConversation(),
      [searchParams, conversation_id]
   );

   const handleGetCurrentMessage = async () => {
      try {
         if (currentConversation) {
            const messages = await getCurrentConversationMessages(currentConversation.id);
            if (messages) setMessages(messages);
         }
      } catch (error) {
         console.log({ messages: error });
      } finally {
         setIsFetching(false);
      }
   };

   useEffect(() => {
      if (currentConversation) {
         handleGetCurrentMessage();
      } else setTimeout(() => setIsFetching(false), 1000);
   });

   return { currentConversation, isFetching, messages };
}
