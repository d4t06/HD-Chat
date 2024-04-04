import { selectCurrentConversation, storingConversation } from "@/stores/CurrentConversationSlice";
import { useDispatch, useSelector } from "react-redux";
import useMessageActions from "./useMessageActions";
import useConversationActions from "./useConversationActions";
import useMemberActions from "./useMemberActions";
import { useAuth } from "@/stores/AuthContext";
import { useConversation } from "@/stores/ConversationContext";

export default function useSendMessageToNewConversation() {
   const dispatch = useDispatch();

   const { auth } = useAuth();
   const { setConversations } = useConversation();

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

         const ownerMember: MemberSchema = {
            conversation_id: c.id,
            is_owner: true,
            user_id: auth.id,
         };

         const member: MemberSchema = {
            conversation_id: c.id,
            is_owner: false,
            user_id: tempUser.id,
         };

         const m1 = await addMember(ownerMember);
         const m2 = await addMember(member);

         if (m1 && m2) {
            c.members = [m1, m2];

            setConversations((prev) => [c, ...prev]);

            dispatch(
               storingConversation({
                  currentConversationInStore: c,
               })
            );
         }

         await sendMessage(firstMessage);
      } catch (error) {
         console.log({ message: error });
      }
   };

   return {
      sendMessageToNewConversation,
   };
}
