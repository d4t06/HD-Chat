import { useSocket } from "@/stores/SocketContext";
import usePrivateRequest from "./usePrivateRequest";

const CONVERSATION_URL = "/conversations";

export default function useConversationActions() {
   const privateRequest = usePrivateRequest();

   const { socket } = useSocket();

   const getAllUserConversations = async (user_id: number) => {
      const res = await privateRequest.get(CONVERSATION_URL, {
         params: {
            userID: user_id,
         },
      });

      return res.data.data as Conversation[];
   };

   const createConversation = async ({ name }: { name: string }) => {
      const res = await privateRequest.post(CONVERSATION_URL, { name });
      return res.data.data as Conversation;
   };

   const sendConversation = ({
      conversation,
      message,
      toUserIDs,
   }: {
      conversation: Conversation;
      message: Message;
      toUserIDs: number[];
   }) => {
      if (!socket) return;

      socket.send(
         "/app/conversations",
         {},
         JSON.stringify({ payload: { conversation, message }, to_user_ids: toUserIDs })
      );
   };

   return { createConversation, getAllUserConversations, sendConversation };
}
