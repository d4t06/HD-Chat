import PopupWrapper from "./ui/PopupWrapper";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Modal from "./Modal";
import ConfirmModal from "./Modal/ConfirmModal";
import useLogout from "@/hooks/useLogout";
import MenuItem from "./ui/MenuItem";

export default function AccountMenu() {
   const [openModal, setOpenModal] = useState(false);

   const { logout, isFetching } = useLogout();

   const closeModal = () => setOpenModal(false);

   const classes = {
      icon: "w-[22px] mr-[5px]",
   };

   return (
      <>
         <PopupWrapper variant={"thin"}>
            <MenuItem cb={() => setOpenModal(true)}>
               <ArrowRightStartOnRectangleIcon className={classes.icon} />
               Log out
            </MenuItem>
         </PopupWrapper>

         {openModal && (
            <Modal close={closeModal}>
               <ConfirmModal callback={logout} close={closeModal} loading={isFetching} />
            </Modal>
         )}
      </>
   );
}
