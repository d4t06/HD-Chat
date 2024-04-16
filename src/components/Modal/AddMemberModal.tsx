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

   const handleAddMemberToConversation = async () => {
      try {
         if (currentConversationInStore === null || auth === null) return;

         setIsFetching(true);

         const targetCDetail = conversationDetails.find(
            (_cDetail) =>
               _cDetail.conversation.id === currentConversationInStore.conversation.id
         );

         if (targetCDetail === undefined)
            throw new Error("target conversation not found");

         selectCDetails.forEach((cDetail) => {
            if (cDetail.recipient === null) throw new Error("recipient  not found");

            targetCDetail.conversation.members.push(cDetail.recipient);
            targetCDetail.name = targetCDetail.name + ", " + cDetail.name;
         });

         targetCDetail.recipient = null;

         const toUserIds: number[] = [];
         let content = "";
         selectCDetails.forEach((cDetail, index) => {
            if (!cDetail.recipient)
               throw new Error("invalid recipient when send message");
            toUserIds.push(cDetail.recipient.user_id);

            if (index + 1 < selectCDetails.length)
               content = content + cDetail.name + ", ";
            else content = content + cDetail.name;
         });

         content = content + ` added by ${auth.fullName}`;

         const messageSchema: MessageSchema = {
            content,
            conversation_id: currentConversationInStore.conversation.id,
            from_user_id: auth.id,
            status: "seen",
            type: "system-log",
         };

         // only send to current member
         const newMessage = await sendMessage(
            { message: messageSchema, toUserIds },
            { sendMessage: false }
         );

         if (!newMessage) throw new Error("newMessage error");

         // send conversation with  message to new members
         selectCDetails.forEach((cDetail) => {
            if (!cDetail.recipient)
               throw new Error("invalid recipient when send message");

            sendConversation({
               conversation: cDetail.conversation,
               message: newMessage,
               toUserIDs: [cDetail.recipient.user_id],
            });
         });

         dispatch(
            storingCurrentConversation({
               conversationDetail: targetCDetail,
               tempUser: null,
            })
         );

         dispatch(updateConversation({ cDetail: targetCDetail }));
      } catch (error) {
         console.log({ message: error });
      } finally {
         setIsFetching(false);
      }
   };

   return (
      <div className="flex flex-col w-[700px] max-w-[80vw] h-[500px] max-h-[80vh]">
         <ModalHeader close={close} title="Add member" />
         <div className="flex-grow flex flex-col">
            <div className="flex-grow overflow-auto">
               <SelectConversationList
                  type="add-member"
                  setSelectCDetails={setSelectCDetails}
               />
            </div>
            <div className="flex justify-center">
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
