import { selectAllConversations } from "@/stores/ConversationSlice";
import { Dispatch, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import AccountItem from "../AccountItem";

type AddMember = {
   type: "add-member";
   setSelectCDetails: Dispatch<SetStateAction<ConversationDetail[]>>;
   existingMembers: Member[];
};

type CreateGroup = {
   type: "create-group";
   setSelectCDetails: Dispatch<SetStateAction<ConversationDetail[]>>;
};

type Props = AddMember | CreateGroup;

export default function SelectConversationList({ setSelectCDetails, ...props }: Props) {
   const [_selectCDetails, _setSelectCDetails] = useState<ConversationDetail[]>([]);

   const { conversationDetails } = useSelector(selectAllConversations);

   const twoMemberConversationDetails = conversationDetails.filter((cDetail) => {
      return !!cDetail.recipient;
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
      if (cDetail.recipient === null) return <p>data error</p>;

      const active = !!_selectCDetails.find(
         (_cDetail) => _cDetail.conversation.id === cDetail.conversation.id
      );

      const isDisable =
         props.type === "create-group"
            ? false
            : !!props.existingMembers.find(
                 (m) => m.user_id === (cDetail.recipient as Member).user_id
              );

      return (
         <div
            onClick={() => handleToggleConversation(cDetail)}
            key={index}
            className={`${classes.conversationItem} 
              ${active ? classes.active : ""}
              ${isDisable ? `${classes.active} disable` : ""}`}
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
