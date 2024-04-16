import useCurrentConversationMessage from "@/hooks/useCurrentConversationMessages";
import { useAuth } from "@/stores/AuthContext";
import { convertDateStringToString } from "@/utils/appHelper";
import AccountItem from "./AccountItem";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import Button from "./ui/Button";
import ConversationMenu from "./ConversationMenu";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Modal from "./Modal";
import { useMemo, useState } from "react";
import AddMemberModal from "./Modal/AddMemberModal";

export type ChatScreenMenuModal = "close" | "add-member" | "setting";

export default function ChatScreenHeader() {
   const [openModal, setOpenModal] = useState<ChatScreenMenuModal>("close");

   const classes = {
      button: "p-[4px]",
      container:
         "relative flex flex-row justify-between h-[60px] px-4 py-2 items-center shadow-sm",
   };

   // hooks
   const { auth } = useAuth();
   const { currentConversationInStore, tempUser } = useCurrentConversationMessage();

   if ((currentConversationInStore === null && tempUser === null) || !auth) return <></>;

   const conversationName =
      currentConversationInStore === null
         ? tempUser?.fullName
         : currentConversationInStore.name;

   const desc = useMemo(() => {
      if (currentConversationInStore === null) return "New conversation";

      if (currentConversationInStore.conversation.members.length == 2) {
         if (!currentConversationInStore.recipient) return "some thing went wrong";
         return convertDateStringToString(
            currentConversationInStore.recipient.user.last_seen || ""
         );
      } else return `${currentConversationInStore.conversation.members.length} members`;
   }, [currentConversationInStore]);

   const closeModal = () => setOpenModal("close");

   const renderModal = useMemo(() => {
      if (openModal === "close") return;

      switch (openModal) {
         case "add-member":
         case "setting":
            return <AddMemberModal close={closeModal} />;
      }
   }, [openModal]);

   return (
      <>
         <div className={classes.container}>
            <AccountItem
               keepNameInSmall={true}
               type="default"
               size="small"
               fullName={conversationName || ""}
               desc={desc || ""}
            />

            <div className="flex">
               {currentConversationInStore && (
                  <Popover placement="bottom-end">
                     <PopoverTrigger>
                        <Button
                           className={classes.button + " ml-[10px]"}
                           variant={"push"}
                           size={"clear"}
                           colors="secondary"
                        >
                           <Bars3Icon className="w-[22px]" />
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent>
                        <ConversationMenu
                           currentConversation={currentConversationInStore}
                           setOpenModal={setOpenModal}
                        />
                     </PopoverContent>
                  </Popover>
               )}
            </div>
         </div>

         {openModal !== "close" && <Modal close={closeModal}>{renderModal}</Modal>}
      </>
   );
}
