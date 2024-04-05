import { selectCurrentConversation } from "@/stores/CurrentConversationSlice";
import { useSelector } from "react-redux";
import { AuthType } from "@/stores/AuthContext";
import SidebarConversationItem from "./SidebarConversationItem";

type Props = {
   conversations: Conversation[];
   cb: () => void;
   auth: AuthType;
};
export default function ConversationList({ cb, auth, conversations }: Props) {
   const { currentConversationInStore } = useSelector(selectCurrentConversation);

   return conversations.map((c, index) => {
      const isActive = currentConversationInStore?.id == c.id;

      return (
         <SidebarConversationItem
            cb={cb}
            auth={auth}
            key={index}
            active={isActive}
            conversation={c}
         />
      );
   });
}
