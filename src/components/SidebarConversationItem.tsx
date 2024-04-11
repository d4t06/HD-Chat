import { Bars3Icon } from "@heroicons/react/24/outline";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { AuthType } from "@/stores/AuthContext";
import ConversationItem from "./ConversationItem";
import ConversationMenu from "./ConversationMenu";
import { useState } from "react";

type Props = {
   conversation: Conversation;
   active: boolean;
   cb: () => void;
   auth: AuthType;
};
export default function SidebarConversationItem({ conversation, cb, active, auth }: Props) {
   const classes = {
      active: "!bg-[#c2e7ff]",
      conversationItem: "hover:bg-[#f3f3f5] p-2 sm:px-4 w-full",
      menuIcon: "absolute right-4 top-[50%] translate-y-[-50%] hidden sm:group-hover:block",
   };

   const [isOpenMenu, setIsOpenMenu] = useState(false);

   return (
      <div className="relative group">
         <div
            className={`${classes.conversationItem} ${active ? classes.active : ""}`}
            onClick={cb}
         >
            <ConversationItem in="sidebar" type="default" c={conversation} auth={auth} />
         </div>
         <Popover
            isOpenFromParent={isOpenMenu}
            setIsOpenFromParent={setIsOpenMenu}
            placement="bottom"
         >
            <PopoverTrigger className={`${classes.menuIcon} ${isOpenMenu ? "!block" : ""}`}>
               {/* <Button
                  size={"clear"}
                  variant={"push"}
                  colors={"secondary"}
                  className="p-[4px] ml-auto !absolute right-4 hidden group-hover:block top-[50%] translate-y-[-50%]"
               > */}
               <Bars3Icon className="w-[22px]" />
               {/* </Button> */}
            </PopoverTrigger>

            <PopoverContent>{isOpenMenu && <ConversationMenu />}</PopoverContent>
         </Popover>
      </div>
   );
}
