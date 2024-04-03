import { ArrowPathIcon, Bars3Icon, PhotoIcon } from "@heroicons/react/24/outline";
import Button from "./ui/Button";
import AccountItem from "./AccountItem";
import { useParams, useSearchParams } from "react-router-dom";
import useCurrentConversation from "@/hooks/useCurrentConversation";
import ConversationItem from "./ConversationItem";
import { useAuth } from "@/stores/AuthContext";

type Props = {};

export default function ChatScreen(props: Props) {
   const classes = {
      container: "h-screen overflow-hidden relative",
      button: "p-[4px]",
      chatBarContainer:
         "p-2 sm:p-4 border-t absolute bottom-0 left-0 right-0 z-10 bg-white",
   };

   const params = useParams();
   const { auth } = useAuth();
   const [searchParams, setSearchParams] = useSearchParams();

   const { currentConversation, isFetching, messages } = useCurrentConversation({
      searchParams,
      conversation_id: params.id,
   });

   if (!currentConversation && !searchParams.get("name"))
      return <p>Some thing went wrong</p>;

   return (
      <div className={classes.container}>
         {/* top */}
         <div className="px-4 py-2">
            <div className="flex flex-row justify-between h-12 items-center ">
               {auth && (
                  <>
                     {currentConversation ? (
                        <ConversationItem
                           type="default"
                           auth={auth}
                           c={currentConversation}
                           size="small"
                           desc="1 hour ago"
                        />
                     ) : (
                        <AccountItem
                           type="default"
                           fullName={searchParams.get("name") || ""}
                           size="small"
                           desc="New conversation"
                        />
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
            {isFetching && (
               <span>
                  <ArrowPathIcon className="w-[24px]" />
               </span>
            )}
         </div>

         {/* chat input */}
         <div className={classes.chatBarContainer}>
            <div className="flex items-center">
               <Button
                  className={classes.button}
                  variant={"push"}
                  size={"clear"}
                  colors="secondary"
               >
                  <PhotoIcon className="w-[22px]" />
               </Button>
               <input
                  className="h-[36px] ml-[10px] flex-grow border-[2px] border-[#ccc] bg-[#f3f3f5] rounded-full px-2 sm:px-4 outline-none"
                  placeholder="Message..."
                  type="text"
                  //   value={inputValue}
                  //   onChange={(e) => setInputValue(e.target.value)}
                  //   onKeyDown={(e) => handleSendMessage(e)}
                  // value={mess}
               />

               <Button
                  className={`h-[34px] w-[34px] ml-[10px]`}
                  variant={"push"}
                  size={"clear"}
                  colors="secondary"
               >
                  <span>&#128075;</span>
               </Button>
            </div>
         </div>
      </div>
   );
}
