import { ArrowPathIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Button from "./ui/Button";
import AccountItem from "./AccountItem";
import ConversationItem from "./ConversationItem";
import { useAuth } from "@/stores/AuthContext";
import ChatInput from "./ChatInput";
import { useSelector } from "react-redux";
import { selectCurrentConversation } from "@/stores/CurrentConversationSlice";
import useCurrentConversationMessage from "@/hooks/useCurrentConversationMessages";
// import MessageItem from "./MessageItem";
// import { useRef } from "react";
import MessageList from "./MessageList";
import { useMemo } from "react";

export default function ChatScreen() {
   // const from_user_id = useRef<number | null>(null);
   // const showAvatar = useRef(false);

   const classes = {
      container: "h-screen overflow-hidden relative",
      button: "p-[4px]",
      chatBarContainer: "absolute bottom-0 left-0 right-0 z-10 bg-white",
      messagesWrapper:
         "relative h-[calc(100vh-60px-60px)] after:content-[''] after:absolute after:left-0 after:right-0 after:top-0 after:h-[100%]  after:pointer-events-none",
      messageListContainer:
         "p-4 h-full overflow-auto flex flex-col items-start space-y-[2px]",
   };

   // hooks
   const { auth } = useAuth();

   useCurrentConversationMessage();

   const { messageStatus, currentConversationInStore, tempUser, messages } = useSelector(
      selectCurrentConversation
   );

   const renderMessageList = useMemo(() => {
      if (!auth) return;

      return <MessageList auth={auth} messages={messages} />;
   }, [messages.length]);

   // console.log("chat screen render");

   if ((!currentConversationInStore && !tempUser) || !auth) return <></>;

   return (
      <div className={classes.container}>
         {/* top */}
         <div className="flex flex-row justify-between h-[60px] px-4 py-2 items-center ">
            <>
               {currentConversationInStore ? (
                  <ConversationItem
                     keepNameInSmall={true}
                     type="default"
                     auth={auth}
                     c={currentConversationInStore}
                     size="small"
                     desc="1 hour ago"
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
         <div className={classes.messagesWrapper}>
            <div className={classes.messageListContainer}>
               {messageStatus === "loading" && (
                  <span>
                     <ArrowPathIcon className="w-[24px] animate-spin" />
                  </span>
               )}

               {messageStatus !== "loading" && (
                  <>
                     {messageStatus === "successful" && renderMessageList}
                     {messageStatus === "error" && <p>Some thing went wrong</p>}
                  </>
               )}
            </div>
         </div>

         {/* chat input */}
         <div className={classes.chatBarContainer}>
            <ChatInput />
         </div>
      </div>
   );
}
