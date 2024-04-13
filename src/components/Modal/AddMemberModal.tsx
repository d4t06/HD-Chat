import { selectAllConversations, updateConversation } from "@/stores/ConversationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import ModalHeader from "./ModalHeader";
import Button from "../ui/Button";
import {
   selectCurrentConversation,
   storingCurrentConversation,
} from "@/stores/CurrentConversationSlice";
import AccountItem from "../AccountItem";
import useConversationActions from "@/hooks/useConversationActions";
import { useAuth } from "@/stores/AuthContext";
import useMessageActions from "@/hooks/useMessageActions";
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

   const twoMemberConversationDetails = conversationDetails.filter(
      (cDetail) =>
         !!cDetail.recipient &&
         currentConversationInStore?.recipient !== cDetail.recipient
   );

   const handleToggleConversation = (target: ConversationDetail) => {
      const newCDetails = [...selectCDetails];

      const index = newCDetails.findIndex(
         (cDetail) => cDetail.conversation.id === target.conversation.id
      );

      if (index !== -1) newCDetails.splice(index, 1);
      else newCDetails.push(target);

      setSelectCDetails(newCDetails);
   };

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
               toUserID: cDetail.recipient.user_id,
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

   const classes = {
      active: "!bg-[#c2e7ff]",
      conversationItem:
         "hover:bg-[#f3f3f5] rounded-[6px] p-2 sm:px-4 w-full cursor-pointer",
   };

   const mapContent = twoMemberConversationDetails.map((cDetail, index) => {
      const active = !!selectCDetails.find(
         (cDetail) => cDetail.conversation.id === cDetail.conversation.id
      );

      return (
         <div
            onClick={() => handleToggleConversation(cDetail)}
            key={index}
            className={`${classes.conversationItem} 
            ${active ? classes.active : ""}`}
         >
            <AccountItem
               bubble={cDetail.countNewMessages}
               type="default"
               fullName={cDetail.name}
            />
         </div>
      );
   });

   return (
      <div className="flex flex-col w-[700px] max-w-[80vw] h-[500px] max-h-[80vh]">
         <ModalHeader close={close} title="Add member" />
         <div className="flex-grow flex flex-col">
            <div className="flex-grow overflow-auto">{mapContent}</div>
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
