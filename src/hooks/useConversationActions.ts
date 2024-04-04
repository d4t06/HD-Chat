import usePrivateRequest from "./usePrivateRequest";

const CONVERSATION_URL = "/conversations";

export default function useConversationActions() {
   const privateRequest = usePrivateRequest();

   const createConversation = async ({ name }: { name: string }) => {
      const res = await privateRequest.post(CONVERSATION_URL, { name });
      return res.data.data as Conversation;
      // try {
      // } catch (error) {
      //    console.log({ message: error });
      // }
   };

   return { createConversation };
}
