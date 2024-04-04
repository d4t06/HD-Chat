import { selectCurrentConversation, storingConversation } from "@/stores/CurrentConversationSlice";
import { useDispatch, useSelector } from "react-redux";
import useMessageActions from "./useMessageActions";
import useConversationActions from "./useConversationActions";
import useMemberActions from "./useMemberActions";
import { useAuth } from "@/stores/AuthContext";

export default function useSendMessageToNewConversation() {
   const { auth } = useAuth();
   const dispatch = useDispatch();
   const { tempUser } = useSelector(selectCurrentConversation);

   const { sendMessage } = useMessageActions();
   const { createConversation } = useConversationActions();
   const { addMember } = useMemberActions();

   const sendMessageToNewConversation = async (message: string) => {
      if (!auth || !tempUser) return;
      try {
         const c = await createConversation({ name: "" });

         const firstMessage: MessageSchema = {
            conversation_id: c.id,
            content: message,
            from_user_id: auth.id,
            type: "text",
         };

         dispatch(
            storingConversation({
               currentConversationInStore: c,
               messages: [firstMessage],
            })
         );

         const ownerMember: MemberSchema = {
            conversation_id: c.id,
            is_owner: true,
            user_id: auth?.id,
         };

         const member: MemberSchema = {
            conversation_id: c.id,
            is_owner: false,
            user_id: tempUser.id,
         };

         await addMember(ownerMember);
         await addMember(member);

         await sendMessage(firstMessage);
      } catch (error) {}
   };

   return {
      sendMessageToNewConversation,
   };
}
