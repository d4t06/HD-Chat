import { AuthType } from "@/stores/AuthContext";
import MessageItem from "./Message/MessageItem";
import { useSelector } from "react-redux";
import { selectCurrentConversation } from "@/stores/CurrentConversationSlice";
import { useMemo } from "react";
import { nanoid } from "@reduxjs/toolkit";

type Props = {
   auth: AuthType;
};

export default function MessageList({ auth }: Props) {
   const { currentConversationInStore, messages, tempImageMessages } = useSelector(
      selectCurrentConversation
   );

   let from_user_id = 999;
   let isNewSection = false;

   const isInGroup = currentConversationInStore
      ? currentConversationInStore.conversation.members.length >= 3
      : false;

   const renderTempsMessage = useMemo(() => {
      if (!currentConversationInStore) return <></>;
      
      if (!!tempImageMessages.length) {
         return tempImageMessages.map((m) => {
            if (m.conversation_id === currentConversationInStore?.conversation.id)
               return <MessageItem key={nanoid(4)} type="temp-image" message={m} />;
         });
      }
   }, [tempImageMessages]);

   const renderMessages = useMemo(
      () =>
         !!messages.length &&
         messages.map((m, index) => {
            if (m.type === "system-log")
               return (
                  <MessageItem
                     className={"pt-[20px]"}
                     key={index}
                     type="system"
                     message={m}
                  />
               );

            // the first message is alway new section
            if (m.from_user_id !== from_user_id) {
               isNewSection = true;
            } else isNewSection = false;

            from_user_id = m.from_user_id;

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

            const member = currentConversationInStore?.conversation.members.find(
               (mem) => mem.user_id === m.from_user_id
            );

            if (!member) return <p key={index}>Member not found</p>;

            return (
               <MessageItem
                  key={index}
                  type="other"
                  user={member.user}
                  message={m}
                  showName={isInGroup ? isNewSection : false}
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
