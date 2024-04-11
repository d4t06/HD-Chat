import { selectCurrentConversation } from "@/stores/CurrentConversationSlice";
import { useSelector } from "react-redux";
import { AuthType } from "@/stores/AuthContext";
import SidebarConversationItem from "./SidebarConversationItem";

type Props = {
   conversations: Conversation[];
   cb: (c: Conversation) => void;
   auth: AuthType;
};
export default function ConversationList({ cb, auth, conversations }: Props) {
   const { currentConversationInStore } = useSelector(selectCurrentConversation);

   const mapContent = conversations.map((c, index) => {
      const isActive = currentConversationInStore?.id == c.id;

      const callback = () => cb(c);

      return (
         <SidebarConversationItem
            cb={callback}
            auth={auth}
            key={index}
            active={isActive}
            conversation={c}
         />
      );
   });

   return (
      <div className="">
         <h5 className="pl-4 hidden sm:block">Your conversations</h5>
         {mapContent}
      </div>
   );
}
