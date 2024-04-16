import PopupWrapper from "./ui/PopupWrapper";
import {
   ArrowLeftStartOnRectangleIcon,
   BellSlashIcon,
   PlusIcon,
} from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useMemo } from "react";
import MenuItem from "./ui/MenuItem";
import { ChatScreenMenuModal } from "./ChatScreenHeader";
import { CurrentConversation } from "@/stores/CurrentConversationSlice";

type Props = {
   currentConversation: CurrentConversation;
   setOpenModal: Dispatch<SetStateAction<ChatScreenMenuModal>>;
};

export default function ConversationMenu({ setOpenModal, currentConversation }: Props) {
   // hooks

   const isGroup = useMemo(
      () => currentConversation.conversation.members.length >= 3,
      [currentConversation]
   );

   const classes = {
      icon: "w-[22px] mr-[5px]",
   };

   const oneMemberConversationMenu = (
      <MenuItem cb={() => {}}>
         <BellSlashIcon className={classes.icon} />
         Mute
      </MenuItem>
   );

   const groupConversationMenu = (
      <>
         <MenuItem cb={() => setOpenModal("add-member")}>
            <PlusIcon className={classes.icon} />
            Add member
         </MenuItem>
         <MenuItem cb={() => {}}>
            <BellSlashIcon className={classes.icon} />
            Mute
         </MenuItem>
         <MenuItem cb={() => {}}>
            <ArrowLeftStartOnRectangleIcon className={classes.icon} />
            Left
         </MenuItem>
      </>
   );

   const renderConversation = useMemo(() => {
      if (isGroup) return groupConversationMenu;
      return oneMemberConversationMenu;
   }, [currentConversation]);

   return (
      <>
         <PopupWrapper variant={"thin"}>{renderConversation}</PopupWrapper>
      </>
   );
}
