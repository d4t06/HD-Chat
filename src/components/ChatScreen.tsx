import { ArrowPathIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Button from "./ui/Button";
import AccountItem from "./AccountItem";
import ConversationItem from "./ConversationItem";
import { useAuth } from "@/stores/AuthContext";
import ChatInput from "./ChatInput";
import { useSelector } from "react-redux";
import { selectCurrentConversation } from "@/stores/CurrentConversationSlice";
import useCurrentConversationMessage from "@/hooks/useCurrentConversationMessages";
import MessageItem from "./MessageItem";
import { useRef } from "react";

export default function ChatScreen() {
   const from_user_id = useRef<number | null>(null);

   const classes = {
      container: "h-screen overflow-hidden relative",
      button: "p-[4px]",
      chatBarContainer: "absolute bottom-0 left-0 right-0 z-10 bg-white",
   };

   // hooks
   const { auth } = useAuth();

   useCurrentConversationMessage();

   const { messageStatus, currentConversationInStore, tempUser, messages } = useSelector(
      selectCurrentConversation
   );

   if ((!currentConversationInStore && !tempUser) || !auth) return <></>;

   return (
      <div className={classes.container}>
         {/* top */}
         <div className="px-4 py-2">
            <div className="flex flex-row justify-between h-12 items-center ">
               <>
                  {currentConversationInStore ? (
                     <ConversationItem
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
         </div>

         {/* main content */}
         <div className="h-[calc(100vh-10rem)] p-4 overflow-auto flex flex-col">
            {messageStatus === "loading" && (
               <span>
                  <ArrowPathIcon className="w-[24px]" />
               </span>
            )}

            {messageStatus !== "loading" && (
               <>
                  {messageStatus === "successful" &&
                     messages.map((m, index) => {
                        let showAvatar = false;
                        const isSelf = m.from_user_id === auth.id;
                        if (isSelf)
                           return <MessageItem key={index} type="self" message={m} />;

                        const member = currentConversationInStore?.members.find(
                           (mem) => mem.user_id === m.from_user_id
                        );

                        if (m.from_user_id !== from_user_id.current) {
                           showAvatar = true;
                        } else showAvatar = false;
                        
                        from_user_id.current = m.from_user_id;

                        if (!member) return <p>Member not found</p>;

                        return (
                           <MessageItem
                              key={index}
                              type="other"
                              user={member.user}
                              message={m}
                              showAvatar={showAvatar}
                           />
                        );
                     })}
                  {messageStatus === "error" && <p>Some thing went wrong</p>}
               </>
            )}
         </div>

         {/* chat input */}
         <div className={classes.chatBarContainer}>
            <ChatInput />
         </div>
      </div>
   );
}
