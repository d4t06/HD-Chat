import useCurrentConversationMessage from "@/hooks/useCurrentConversationMessages";
import { useAuth } from "@/stores/AuthContext";
import { convertDateStringToString } from "@/utils/appHelper";
import AccountItem from "./AccountItem";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import Button from "./ui/Button";
import ConversationMenu from "./ConversationMenu";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function ChatScreenHeader() {
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

   const desc =
      currentConversationInStore === null
         ? "New conversation"
         : convertDateStringToString(
              currentConversationInStore.recipient?.last_seen || ""
           );

   return (
      <div
         className={classes.container}
      >
         <AccountItem
            keepNameInSmall={true}
            type="default"
            size="small"
            fullName={conversationName || ""}
            desc={desc || ""}
         />

         <div className="flex">
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
                  <ConversationMenu />
               </PopoverContent>
            </Popover>
         </div>
      </div>
   );
}
