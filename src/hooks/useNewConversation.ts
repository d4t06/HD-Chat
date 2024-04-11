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
   const { setConversations, conversations } = useConversation();

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
            status: "seen",
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

         const owner = await addMember(ownerMember);
         const other = await addMember(member);

         if (!owner || !other) throw new Error("member not found");

         other["user"] = tempUser;

         c["members"] = [owner, other];

         const newConversations = [c, ...conversations];
         setConversations(newConversations);

         dispatch(
            storingConversation({
               currentConversationInStore: c,
               tempUser: null,
            })
         );

         await sendMessage({ message: firstMessage, toUserIds: [other.user_id] }, {});
      } catch (error) {
         console.log({ message: error });
      }
   };

   return {
      sendMessageToNewConversation,
   };
}
