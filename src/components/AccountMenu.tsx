import { useAuth } from "@/stores/AuthContext";
import PopupWrapper from "./ui/PopupWrapper";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Modal from "./Modal";
import ConfirmModal from "./Modal/ConfirmModal";
import useLogout from "@/hooks/useLogout";

export default function AccountMenu() {
   const [openModal, setOpenModal] = useState(false);

   const { logout, isFetching } = useLogout();

   const closeModal = () => setOpenModal(false);

   const classes = {
      menuItem: `hover:bg-[#f3f3f5]  rounded-[4px] w-full px-[10px] h-[44px] inline-flex items-center`,
      icon: "w-[25px] mr-[5px]",
      divide: `h-[1px]  w-[calc(100%-20px)] mb-[10px] mt-[20px] mx-auto bg-[#ccc]`,
   };

   return (
      <>
         <PopupWrapper variant={"thin"}>
            <button className={`${classes.menuItem}`} onClick={() => setOpenModal(true)}>
               <ArrowRightStartOnRectangleIcon className={classes.icon} />
               Log out
            </button>
         </PopupWrapper>

         {openModal && (
            <Modal close={closeModal}>
               <ConfirmModal callback={logout} close={close} loading={isFetching} />
            </Modal>
         )}
      </>
   );
}
