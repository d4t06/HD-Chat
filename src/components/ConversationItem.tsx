import { AuthType } from "@/stores/AuthContext";
import AccountItem, { AccountItemProps } from "./AccountItem";
import { useMemo, useRef } from "react";

type SideBarConversation = {
   in: "sidebar";
};

type ChatScrrenConversation = {
   in: "chat-scrren";
};

type Props = Omit<AccountItemProps, "fullName"> & {
   c: Conversation;
   auth: AuthType;
} & (SideBarConversation | ChatScrrenConversation);
export default function ConversationItem({ c, auth, type, desc, ...props }: Props) {
   const recipient = useRef<User>();
   const finalDesc = useRef<string>();

   const conversationName = useMemo(() => {
      if (!!c.name) return c.name;

      const anotherMembers = c.members.filter((m) => m.user_id != auth.id);
      if (c.members.length === 2) {
         recipient.current = anotherMembers[0].user;
         return recipient.current.fullName;
      }

      let name = "";
      anotherMembers.forEach((m) => (name += m.user.fullName + ", "));
      return name;
   }, [auth, c]);

   switch (props.in) {
      case "sidebar":
         finalDesc.current = desc;
         break;
      case "chat-scrren":
         if (c.members.length > 2) finalDesc.current = `${c.members.length} members`;
         else
            finalDesc.current = recipient.current?.last_seen
               ? "Last seen: " +
                 new Date(recipient.current.last_seen).toLocaleString("en-us")
               : "";
   }

   return (
      <AccountItem
         desc={finalDesc.current}
         type="default"
         {...props}
         fullName={conversationName}
      />
   );
}
