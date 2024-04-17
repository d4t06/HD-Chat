import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/stores/AuthContext";
import ChatInput from "./ChatInput";
import useCurrentConversationMessage from "@/hooks/useCurrentConversationMessages";
import MessageList from "./MessageList";
import { ElementRef, useEffect, useRef } from "react";

import ChatScreenHeader from "./ChatScreenHeader";

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

   // scroll to last message when enter to conversation
   useEffect(() => {
      if (messageStatus === "successful") {
         lastMessageRef.current?.scrollIntoView({ behavior: "instant", block: "center" });
      }
   }, [messageStatus]);

   if ((currentConversationInStore === null && tempUser === null) || !auth) return <></>;

   return (
      <div className={classes.container}>
         {/* top */}
         <ChatScreenHeader />

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

            <div className="!mb-[60px] last-message" ref={lastMessageRef}></div>
         </div>

         {/* chat input */}
         <ChatInput lastMessageRef={lastMessageRef} />
      </div>
   );
}
