import { selectCurrentConversation } from "@/stores/CurrentConversationSlice";
import { useSelector } from "react-redux";
import SidebarConversationItem from "./SidebarConversationItem";

type Props = {
   cDetails: ConversationDetail[];
   cb: (c: ConversationDetail) => void;
};
export default function SidebarConversationList({ cb, cDetails }: Props) {
   const { currentConversationInStore } = useSelector(selectCurrentConversation);

   const mapContent = cDetails.map((cDetail, index) => {
      const isActive =
         currentConversationInStore?.conversation.id == cDetail.conversation.id;

      const callback = () => cb(cDetail);

      return (
         <SidebarConversationItem
            cb={callback}
            key={index}
            active={isActive}
            cDetail={cDetail}
         />
      );
   });

   return (
      <>
         <h5 className="pl-4 hidden sm:block pb-[6px]">Your conversations</h5>
         {mapContent}
      </>
   );
}
