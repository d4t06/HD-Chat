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

   const sendConversation = ({ c, toUserID }: { c: Conversation; toUserID: number }) => {
      if (!socket) return;

      socket.send(
         "/app/conversations",
         {},
         JSON.stringify({ conversation: c, to_user_id: toUserID })
      );
   };

   return { createConversation, getAllUserConversations, sendConversation };
}
