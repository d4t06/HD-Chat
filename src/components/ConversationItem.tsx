import { AuthType } from "@/stores/AuthContext";
import AccountItem, { AccountItemProps } from "./AccountItem";
import { useMemo } from "react";

type Props = Omit<AccountItemProps, "fullName"> & {
   c: Conversation;
   auth: AuthType;
};
export default function ConversationItem({ c, auth, type, ...props }: Props) {
   const conversationName = useMemo(() => {
      if (!!c.name) return c.name;

      const anotherMembers = c.members.filter((m) => m.user_id != auth.id);

      let name = "";
      anotherMembers.forEach((m) => (name += m.user.fullName));
      return name;
   }, [auth, c]);

   return <AccountItem type="default" {...props} fullName={conversationName} />;
}
