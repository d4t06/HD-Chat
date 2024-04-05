import PopupWrapper from "./ui/PopupWrapper";
import { BellSlashIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Modal from "./Modal";
import ConfirmModal from "./Modal/ConfirmModal";
import MenuItem from "./ui/MenuItem";
import useConversationActions from "@/hooks/useConversationActions";

export default function ConversationMenu() {
   const [openModal, setOpenModal] = useState(false);

   // hooks
   const { deleteConversation } = useConversationActions();

   const closeModal = () => setOpenModal(false);

   const classes = {
      icon: "w-[22px] mr-[5px]",
   };

   return (
      <>
         <PopupWrapper variant={"thin"}>
            <MenuItem cb={() => setOpenModal(true)}>
               <TrashIcon className={classes.icon} />
               Delete conversation
            </MenuItem>
            <MenuItem cb={() => setOpenModal(true)}>
               <BellSlashIcon className={classes.icon} />
               Mute
            </MenuItem>
            <MenuItem cb={() => setOpenModal(true)}>
               <MinusIcon className={classes.icon} />
               Block
            </MenuItem>
         </PopupWrapper>

         {openModal && (
            <Modal close={closeModal}>
               <ConfirmModal  
                  callback={deleteConversation}
                  close={closeModal}
                  loading={false}
               />
            </Modal>
         )}
      </>
   );
}
