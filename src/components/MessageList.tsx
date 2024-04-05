import { AuthType } from "@/stores/AuthContext";
import MessageItem from "./MessageItem";
import { useSelector } from "react-redux";
import { selectCurrentConversation } from "@/stores/CurrentConversationSlice";
import { useRef } from "react";

type Props = {
   messages: Message[];
   auth: AuthType;
};

export default function MessageList({ messages, auth }: Props) {
   const { currentConversationInStore } = useSelector(selectCurrentConversation);

   const from_user_id = useRef<number | null>(null);
   let showAvatar = false;

   const renderMessages =
      !!messages.length &&
      messages.map((m, index) => {
         if (m.from_user_id !== from_user_id.current) showAvatar = true;
         else showAvatar = false;

         from_user_id.current = m.from_user_id;

         // console.log("from user id:", m.from_user_id, " current:", from_user_id.current);

         const isSelf = m.from_user_id === auth.id;
         if (isSelf) return <MessageItem key={index} type="self" message={m} />;

         const member = currentConversationInStore?.members.find(
            (mem) => mem.user_id === m.from_user_id
         );

         if (!member) return <p key={index}>Member not found</p>;

         return (
            <MessageItem
               key={index}
               type="other"
               user={member.user}
               message={m}
               showAvatar={showAvatar}
            />
         );
      });

   return <>{renderMessages}</>;
}
