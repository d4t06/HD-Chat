import { ArrowPathIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Button from "./ui/Button";
import AccountItem from "./AccountItem";
import ConversationItem from "./ConversationItem";
import { useAuth } from "@/stores/AuthContext";
import ChatInput from "./ChatInput";
import useCurrentConversationMessage from "@/hooks/useCurrentConversationMessages";
import MessageList from "./MessageList";
import { ElementRef, useRef } from "react";

export default function ChatScreen() {
   const lastMessageRef = useRef<ElementRef<"div">>(null);

   const classes = {
      container: "h-screen overflow-hidden relative flex flex-col",
      button: "p-[4px]",
      messageListContainer: "flex-grow-1 p-2 sm:p-4 h-full overflow-auto space-y-[2px]",
   };

   // hooks
   const { auth } = useAuth();
   const { currentConversationInStore, tempUser, messageStatus } =
      useCurrentConversationMessage();

   if ((!currentConversationInStore && !tempUser) || !auth) return <></>;

   return (
      <div className={classes.container}>
         {/* top */}
         <div className="flex flex-row justify-between h-[60px] px-4 py-2 items-center ">
            <>
               {currentConversationInStore ? (
                  <ConversationItem
                     in="chat-scrren"
                     keepNameInSmall={true}
                     type="default"
                     auth={auth}
                     c={currentConversationInStore}
                     size="small"
                  />
               ) : (
                  <>
                     {tempUser ? (
                        <AccountItem
                           keepNameInSmall={true}
                           type="default"
                           fullName={tempUser?.fullName}
                           size="small"
                           desc="New conversation"
                        />
                     ) : (
                        <p>Some thing went wrong</p>
                     )}
                  </>
               )}
            </>

            <div className="flex">
               <Button
                  className={classes.button + " ml-[10px]"}
                  variant={"push"}
                  size={"clear"}
                  colors="secondary"
               >
                  <Bars3Icon className="w-[22px]" />
               </Button>
            </div>
         </div>

         {/* main content */}
         <div className={classes.messageListContainer}>
            {messageStatus === "loading" && (
               <span>
                  <ArrowPathIcon className="w-[24px] animate-spin" />
               </span>
            )}

            {messageStatus !== "loading" && (
               <>
                  {messageStatus === "successful" && <MessageList auth={auth} />}
                  {messageStatus === "error" && <p>Some thing went wrong</p>}
               </>
            )}

            <div className="!mb-[30px]" ref={lastMessageRef}></div>
         </div>

         {/* chat input */}
         <ChatInput lastMessageRef={lastMessageRef} />
      </div>
   );
}
