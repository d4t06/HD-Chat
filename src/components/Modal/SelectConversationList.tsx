import { selectAllConversations } from "@/stores/ConversationSlice";
import { selectCurrentConversation } from "@/stores/CurrentConversationSlice";
import { Dispatch, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import AccountItem from "../AccountItem";

type Props = {
   setSelectCDetails: Dispatch<SetStateAction<ConversationDetail[]>>;
   type: "add-member" | "create-group";
};

export default function SelectConversationList({ setSelectCDetails, type }: Props) {
   const [_selectCDetails, _setSelectCDetails] = useState<ConversationDetail[]>([]);

   const { conversationDetails } = useSelector(selectAllConversations);
   const { currentConversationInStore } = useSelector(selectCurrentConversation);

   const twoMemberConversationDetails = conversationDetails.filter((cDetail) => {
      if (type === "create-group") return !!cDetail.recipient;
      if (type === "add-member")
         return (
            !!cDetail.recipient &&
            currentConversationInStore?.recipient !== cDetail.recipient
         );
   });

   const handleToggleConversation = (target: ConversationDetail) => {
      const newCDetails = [..._selectCDetails];

      const index = newCDetails.findIndex(
         (cDetail) => cDetail.conversation.id === target.conversation.id
      );

      if (index !== -1) newCDetails.splice(index, 1);
      else newCDetails.push(target);

      setSelectCDetails(newCDetails);
      _setSelectCDetails(newCDetails);
   };

   const classes = {
      active: "!bg-[#c2e7ff]",
      conversationItem:
         "hover:bg-[#f3f3f5] rounded-[6px] p-2 sm:px-4 w-full cursor-pointer",
   };

   const mapContent = twoMemberConversationDetails.map((cDetail, index) => {
      const active = !!_selectCDetails.find(
         (_cDetail) => _cDetail.conversation.id === cDetail.conversation.id
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

   return mapContent;
}
