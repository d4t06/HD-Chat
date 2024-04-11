import { AuthType } from "@/stores/AuthContext";
import MessageItem from "./Message/MessageItem";
import { useSelector } from "react-redux";
import { selectCurrentConversation } from "@/stores/CurrentConversationSlice";
import { useMemo, useRef } from "react";

type Props = {
   auth: AuthType;
};

export default function MessageList({ auth }: Props) {
   const { currentConversationInStore, messages, tempImageMessages } = useSelector(
      selectCurrentConversation
   );

   const from_user_id = useRef<number | null>(null);
   let isNewSection = false;

   const renderTempsMessage = useMemo(() => {
      if (!!tempImageMessages.length) {
         // const isNewSection = messages[messages.length - 1].id !== auth.id;

         return tempImageMessages.map((m, index) => (
            <MessageItem key={index} type="temp-image" message={m} />
         ));
      }
   }, [tempImageMessages]);

   const renderMessages = useMemo(
      () =>
         !!messages.length &&
         messages.map((m, index) => {
            if (m.from_user_id !== from_user_id.current) isNewSection = true;
            else isNewSection = false;

            from_user_id.current = m.from_user_id;

            const isSelf = m.from_user_id === auth.id;

            if (isSelf)
               return (
                  <MessageItem
                     className={isNewSection ? "pt-[20px]" : ""}
                     key={index}
                     type="self"
                     isNewSection={isNewSection}
                     message={m}
                  />
               );

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
                  isNewSection={isNewSection}
                  className={isNewSection ? "pt-[20px]" : ""}
               />
            );
         }),
      [messages]
   );

   return (
      <>
         {renderMessages}
         {renderTempsMessage}
      </>
   );
}
