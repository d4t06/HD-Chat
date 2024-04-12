import { Bars3Icon } from "@heroicons/react/24/outline";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import ConversationMenu from "./ConversationItemMenu";
import { useMemo, useState } from "react";
import AccountItem from "./AccountItem";

type Props = {
   cDetail: ConversationDetail;
   active: boolean;
   cb: () => void;
};
export default function SidebarConversationItem({ cDetail, cb, active }: Props) {
   const classes = {
      active: "!bg-[#c2e7ff]",
      conversationItem: "hover:bg-[#f3f3f5] p-2 sm:px-4 w-full",
      menuIcon:
         "absolute right-4 top-[50%] translate-y-[-50%] hidden sm:group-hover:block",
   };

   const [isOpenMenu, setIsOpenMenu] = useState(false);

   const desc = useMemo(() => {
      if (!cDetail.newMessage) return "";

      switch (cDetail.newMessage.type) {
         case "text":
            return cDetail.newMessage.content;
         case "image":
            return "Send your an image";
         case "emoji":
            return "Send your an emoji";
         case "sticker":
            return "Send your a sticker";
         case "system-log":
            return "System log";
      }
   }, [cDetail]);

   return (
      <div className="relative group">
         <div
            className={`${classes.conversationItem} ${active ? classes.active : ""}`}
            onClick={cb}
         >
            <AccountItem
               bubble={cDetail.countNewMessages}
               desc={desc}
               type="default"
               fullName={cDetail.name}
            />
         </div>
         <Popover
            isOpenFromParent={isOpenMenu}
            setIsOpenFromParent={setIsOpenMenu}
            placement="bottom"
         >
            <PopoverTrigger
               className={`${classes.menuIcon} ${isOpenMenu ? "!block" : ""}`}
            >
               <Bars3Icon className="w-[22px]" />
            </PopoverTrigger>

            <PopoverContent>{isOpenMenu && <ConversationMenu />}</PopoverContent>
         </Popover>
      </div>
   );
}
