import PopupWrapper from "./ui/PopupWrapper";
import { PlusIcon } from "@heroicons/react/24/outline";
import MenuItem from "./ui/MenuItem";
import { Dispatch, SetStateAction } from "react";
import { ChatSidebarMenuModal } from "@/layouts/_components/SidebarHeader";

type Props = {
   setOpenModal: Dispatch<SetStateAction<ChatSidebarMenuModal>>;
};

export default function SidebarMenu({ setOpenModal }: Props) {
   const classes = {
      icon: "w-[22px] mr-[5px]",
      fullName: "px-[10px] font-[500] leading-[44px] border-b border-black.15",
   };

   return (
      <>
         <PopupWrapper variant={"thin"}>
            <MenuItem cb={() => setOpenModal("add-group")}>
               <PlusIcon className={classes.icon} />
               Create group
            </MenuItem>
         </PopupWrapper>
      </>
   );
}
