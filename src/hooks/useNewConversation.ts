import {
   selectCurrentConversation,
   storingCurrentConversation,
} from "@/stores/CurrentConversationSlice";
import { useDispatch, useSelector } from "react-redux";
import useMessageActions from "./useMessageActions";
import useConversationActions from "./useConversationActions";
import useMemberActions from "./useMemberActions";
import { useAuth } from "@/stores/AuthContext";
import { conversationDetailFactory } from "@/utils/appHelper";
import { addConversation } from "@/stores/ConversationSlice";

export default function useSendMessageToNewConversation() {
   const dispatch = useDispatch();

   const { auth } = useAuth();
   // const { setConversations, conversations } = useConversation();

   const { tempUser } = useSelector(selectCurrentConversation);

   const { sendMessage } = useMessageActions();
   const { createConversation, sendConversation } = useConversationActions();
   const { addMember } = useMemberActions();

   const sendMessageToNewConversation = async (
      messageSchemaNoConversation: MessageSchemaNoConversation
   ) => {
      if (!auth || !tempUser) throw new Error("temp user not found");
      try {
         const c = await createConversation({ name: "" });

         const firstMessage: MessageSchema = {
            ...messageSchemaNoConversation,
            conversation_id: c.id,
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

         const { token, ...restAuth } = auth;

         other["user"] = tempUser;
         owner["user"] = restAuth;

         c["members"] = [owner, other];

         const cDetail = conversationDetailFactory([c], auth)[0];

         dispatch(addConversation({ conversationDetail: cDetail }));

         dispatch(
            storingCurrentConversation({
               conversationDetail: cDetail,
               tempUser: null,
            })
         );

         const newMessage = await sendMessage(
            { message: firstMessage, toUserIds: [other.user_id] },
            { sendMessage: false }
         );

         if (!newMessage) throw new Error("new message not found");

         sendConversation({
            conversation: c,
            message: newMessage,
            toUserID: other.user_id,
         });
      } catch (error) {
         console.log({ message: error });
      }
   };

   return {
      sendMessageToNewConversation,
   };
}
