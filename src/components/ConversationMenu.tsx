import PopupWrapper from "./ui/PopupWrapper";
import {
   ArrowLeftStartOnRectangleIcon,
   BellSlashIcon,
   PlusIcon,
} from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction } from "react";
import MenuItem from "./ui/MenuItem";
import { ChatScreenMenuModal } from "./ChatScreenHeader";

type Props = {
   setOpenModal: Dispatch<SetStateAction<ChatScreenMenuModal>>;
};

export default function ConversationMenu({ setOpenModal }: Props) {
   // hooks

   const classes = {
      icon: "w-[22px] mr-[5px]",
   };

   return (
      <>
         <PopupWrapper variant={"thin"}>
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
         </PopupWrapper>
      </>
   );
}
