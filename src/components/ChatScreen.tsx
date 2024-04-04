import { ArrowPathIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Button from "./ui/Button";
import AccountItem from "./AccountItem";
import { useParams } from "react-router-dom";
import useCurrentConversation from "@/hooks/useCurrentConversation";
import ConversationItem from "./ConversationItem";
import { useAuth } from "@/stores/AuthContext";
import ChatInput from "./ChatInput";
import { useSelector } from "react-redux";
import { selectCurrentConversation } from "@/stores/CurrentConversationSlice";


export default function ChatScreen() {
   const classes = {
      container: "h-screen overflow-hidden relative",
      button: "p-[4px]",
      chatBarContainer: "absolute bottom-0 left-0 right-0 z-10 bg-white",
   };

   // hooks
   const params = useParams();
   const { auth } = useAuth();

   useCurrentConversation({
      conversation_id: params.id,
   });

   const { status, currentConversationInStore, tempUser } = useSelector(selectCurrentConversation);

   if (!auth) return <p>Some thing went wrong</p>;

   return (
      <div className={classes.container}>
         {/* top */}
         <div className="px-4 py-2">
            <div className="flex flex-row justify-between h-12 items-center ">
               {status === "loading" ? (
                  <AccountItem type="loading" />
               ) : (
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
               )}

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
         <div className="h-[calc(100vh-10rem)] p-4 overflow-auto flex flex-col gap-10">
            {status === "loading" && (
               <span>
                  <ArrowPathIcon className="w-[24px]" />
               </span>
            )}
         </div>

         {/* chat input */}
         <div className={classes.chatBarContainer}>
            <ChatInput  />
         </div>
      </div>
   );
}
