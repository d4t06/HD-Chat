import usePrivateRequest from "./usePrivateRequest";

const CONVERSATION_URL = "/conversations";

export default function useConversationActions() {
   const privateRequest = usePrivateRequest();

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

   const deleteConversation = () => {
      console.log("delete conversation");
   };

   return { createConversation, getAllUserConversations, deleteConversation };
}
