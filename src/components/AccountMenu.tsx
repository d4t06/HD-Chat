import PopupWrapper from "./ui/PopupWrapper";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Modal from "./Modal";
import ConfirmModal from "./Modal/ConfirmModal";
import useLogout from "@/hooks/useLogout";
import MenuItem from "./ui/MenuItem";
import { useAuth } from "@/stores/AuthContext";

export default function AccountMenu() {
   const [openModal, setOpenModal] = useState(false);
   const {auth} = useAuth()

   const { logout, isFetching } = useLogout();

   const closeModal = () => setOpenModal(false);

   const classes = {
      icon: "w-[22px] mr-[5px]",
      fullName: 'px-[10px] font-[500] leading-[44px] border-b border-black.15' 
   };

   return (
      <>
         <PopupWrapper variant={"thin"}>
            <h5 className={classes.fullName}>{auth?.fullName}</h5>
            <MenuItem cb={() => setOpenModal(true)}>
               <ArrowRightStartOnRectangleIcon className={classes.icon} />
               Log out
            </MenuItem>
         </PopupWrapper>

         {openModal && (
            <Modal close={closeModal}>
               <ConfirmModal title="Log out :v ?" callback={logout} close={closeModal} loading={isFetching} />
            </Modal>
         )}
      </>
   );
}
