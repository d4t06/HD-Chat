import AccountItem from "@/components/AccountItem";
import AccountMenu from "@/components/AccountMenu";
import Modal from "@/components/Modal";
import CreateGroupModal from "@/components/Modal/CreateGroupModal";
import SidebarMenu from "@/components/SidebarMenu";
import Button from "@/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { useAuth } from "@/stores/AuthContext";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";

export type ChatSidebarMenuModal = "close" | "add-group" | "setting";


export default function SidebarHeader() {
   const { auth } = useAuth();
   const [openModal, setOpenModal] = useState<ChatSidebarMenuModal>("close");


   const closeModal = () => setOpenModal("close");

   const renderModal = useMemo(() => {
      if (openModal === "close") return;

      switch (openModal) {
         case "add-group":
         case "setting":
            return <CreateGroupModal />
      }
   }, [openModal]);

   const classes = {
      button: "p-[4px]",
      header: "flex justify-center sm:justify-between items-center",
   };

   return (
      <div className={classes.header}>
         <Popover placement="bottom-start">
            <PopoverTrigger>
               {auth && (
                  <AccountItem active={true} type="default" fullName={auth.fullName} />
               )}
            </PopoverTrigger>

            <PopoverContent>
               <AccountMenu />
            </PopoverContent>
         </Popover>

         <Popover placement="bottom-end">
            <PopoverTrigger>
               <Button
                  className="p-[4px]"
                  size={"clear"}
                  variant={"push"}
                  colors={"secondary"}
               >
                  <Bars3Icon className="w-[22px]" />
               </Button>
            </PopoverTrigger>

            <PopoverContent>
               <SidebarMenu setOpenModal={setOpenModal} />
            </PopoverContent>
         </Popover>

         {openModal !== "close" && <Modal close={closeModal}>{renderModal}</Modal>}

      </div>
   );
}
