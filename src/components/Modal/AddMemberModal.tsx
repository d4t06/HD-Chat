import { selectAllConversations, updateConversation } from "@/stores/ConversationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import ModalHeader from "./ModalHeader";
import Button from "../ui/Button";
import {
   selectCurrentConversation,
   storingCurrentConversation,
} from "@/stores/CurrentConversationSlice";
import useConversationActions from "@/hooks/useConversationActions";
import { useAuth } from "@/stores/AuthContext";
import useMessageActions from "@/hooks/useMessageActions";
import SelectConversationList from "./SelectConversationList";
import useMemberActions from "@/hooks/useMemberActions";
type Props = {
   close: () => void;
};

export default function AddMemberModal({ close }: Props) {
   const [isFetching, setIsFetching] = useState(false);
   const [selectCDetails, setSelectCDetails] = useState<ConversationDetail[]>([]);

   // hooks
   const dispatch = useDispatch();
   const { auth } = useAuth();
   const { conversationDetails } = useSelector(selectAllConversations);
   const { currentConversationInStore } = useSelector(selectCurrentConversation);

   const { sendConversation } = useConversationActions();
   const { sendMessage } = useMessageActions();
   const { addMember } = useMemberActions();

   const handleAddMemberToConversation = async () => {
      try {
         if (currentConversationInStore === null || auth === null) return;

         setIsFetching(true);

         const newConversationDetails = conversationDetails.slice();

         const currentCDetail = newConversationDetails.find(
            (_cDetail) =>
               _cDetail.conversation.id === currentConversationInStore.conversation.id
         );

         if (currentCDetail === undefined)
            throw new Error("target conversation not found");

         // make copy of conversation detail
         const newCurrentCDetail = { ...currentCDetail };
         // make copy of conversation detail conversation
         const newCurrentCDetailConversation = { ...newCurrentCDetail.conversation };

         const newMembers: Member[] = [...newCurrentCDetailConversation.members];

         // selectCDetails.forEach((cDetail) => {});

         for await (const cDetail of selectCDetails) {
            if (cDetail.recipient === null) throw new Error("recipient not found");

            // cannot push member directly
            // newCurrentCDetail.conversation.members.push(cDetail.recipient)
            // push member
            newMembers.push(cDetail.recipient);

            // api add member to current conversation
            const newMemberSchema: MemberSchema = {
               conversation_id: newCurrentCDetailConversation.id,
               is_owner: false,
               user_id: cDetail.recipient.user_id,
            };
            await addMember(newMemberSchema);

            // add member name if conversation not define specific name
            // can mutate name directly
            if (!currentCDetail.conversation.name) {
               newCurrentCDetail.name = newCurrentCDetail.name + ", " + cDetail.name;
            }
         }
         // update member to copy conversation
         newCurrentCDetailConversation.members = newMembers;

         // update conversation to copy conversation detail
         newCurrentCDetail.conversation = newCurrentCDetailConversation;

         let content = "";

         selectCDetails.forEach((cDetail, index) => {
            // if not last index
            if (index + 1 < selectCDetails.length)
               content = content + cDetail.name + ", ";
            else content = content + cDetail.name;
         });

         content = content + ` added by ${auth.fullName}`;

         const messageSchema: MessageSchema = {
            content,
            conversation_id: newCurrentCDetail.conversation.id,
            from_user_id: auth.id,
            status: "seen",
            type: "system-log",
         };

         // only send message to curren members
         const toUserIDs = newCurrentCDetail.conversation.members.map((m) => m.user_id);

         const newMessage = await sendMessage(
            { message: messageSchema, toUserIds: toUserIDs },
            { sendMessage: false }
         );

         if (!newMessage) throw new Error("newMessage error");

         // send  current conversation to new members
         selectCDetails.forEach((cDetail) => {
            if (!cDetail.recipient)
               throw new Error("invalid recipient when send message");

            sendConversation({
               conversation: newCurrentCDetail.conversation,
               message: newMessage,
               toUserIDs: [cDetail.recipient.user_id],
            });
         });

         dispatch(
            storingCurrentConversation({
               conversationDetail: newCurrentCDetail,
               tempUser: null,
            })
         );

         dispatch(updateConversation({ cDetail: newCurrentCDetail }));
      } catch (error) {
         console.log({ message: error });
      } finally {
         setIsFetching(false);
         close();
      }
   };

   if (!currentConversationInStore) return <></>;

   return (
      <div className="flex flex-col w-[700px] max-w-[80vw] h-[500px] max-h-[80vh]">
         <ModalHeader
            close={close}
            title={`Add member to '${currentConversationInStore?.name}'`}
         />
         <div className="flex-grow flex flex-col overflow-hidden">
            <div className="flex-grow overflow-auto">
               <SelectConversationList
                  type="add-member"
                  setSelectCDetails={setSelectCDetails}
                  existingMembers={currentConversationInStore.conversation.members}
               />
            </div>
            <div className="flex justify-center py-[4px]">
               <Button
                  onClick={handleAddMemberToConversation}
                  disabled={!selectCDetails.length}
                  isLoading={isFetching}
                  className="font-[500]"
                  variant={"push"}
               >
                  Add
                  {!!selectCDetails.length && (
                     <span className="ml-[6px]">({selectCDetails.length})</span>
                  )}
               </Button>
            </div>
         </div>
      </div>
   );
}
