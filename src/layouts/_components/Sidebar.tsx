import { useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import AccountItem from "../../components/AccountItem";
import { useAuth } from "@/stores/AuthContext";
import Search from "./Search";
import { useConversation } from "@/stores/ConversationContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import AccountMenu from "@/components/AccountMenu";
import { useDispatch, useSelector } from "react-redux";
import {
   selectCurrentConversation,
   storingConversation,
} from "@/stores/CurrentConversationSlice";
import SidebarConversationItem from "@/components/SidebarConversationItem";

export default function Sidebar() {
   const [searchResult, setResult] = useState<User[]>([]);

   // hooks
   const dispatch = useDispatch();
   const { auth } = useAuth();
   const { conversations, status } = useConversation();
   const { currentConversationInStore, tempUser } = useSelector(
      selectCurrentConversation
   );

   type Default = {
      type: "default";
      conversation: Conversation;
   };

   type NewConversation = {
      type: "new";
      user: User;
   };

   const handleActiveConversation = (props: Default | NewConversation) => {
      switch (props.type) {
         case "default":
            dispatch(
               storingConversation({
                  currentConversationInStore: props.conversation,
                  tempUser: null,
               })
            );

            break;
         case "new":
            dispatch(
               storingConversation({
                  currentConversationInStore: null,
                  tempUser: props.user,
                  messages: [],
                  messageStatus: "successful",
                  replace: true,
               })
            );
      }
   };

   const classes = {
      container: "relative w-[70px] sm:w-[360px] flex-shrink-0 border-r h-screen",
      button: "p-[4px]",
      header: "flex justify-center sm:justify-between items-center",
      conversationList:
         "absolute top-[60px] sm:top-[130px] bottom-0 left-0 right-0 flex flex-col no-scrollbar overflow-y-auto",
      activeConversation: "!bg-[#c2e7ff]",
      conversationItem: "hover:bg-[#f3f3f5] p-2 sm:px-4 w-full",
   };

   const conversationSkeleton = useMemo(
      () =>
         [...Array(5).keys()].map((key) => (
            <div key={key} className={classes.conversationItem}>
               <AccountItem type="loading" className="rounded-[99px]" />
            </div>
         )),
      []
   );

   const renderConversations = useMemo(() => {
      if (!auth) return;

      if (!!conversations.length && !searchResult.length)
         return conversations.map((c, index) => {
            const isActive = currentConversationInStore?.id == c.id;

            return (
               <SidebarConversationItem
                  cb={() =>
                     !isActive
                        ? handleActiveConversation({ type: "default", conversation: c })
                        : {}
                  }
                  auth={auth}
                  key={index}
                  active={isActive}
                  conversation={c}
               />
            );
         });
   }, [conversations, currentConversationInStore, searchResult]);

   const renderSearchResult = useMemo(
      () =>
         !!searchResult.length &&
         searchResult.map((u, index) => {
            const isActive = tempUser?.id === u.id;

            return (
               <div
                  key={index}
                  onClick={() =>
                     !isActive ? handleActiveConversation({ type: "new", user: u }) : {}
                  }
                  className={`${classes.conversationItem} ${
                     isActive ? classes.activeConversation : ""
                  }`}
               >
                  <AccountItem type="default" fullName={u.fullName} />
               </div>
            );
         }),
      [searchResult, tempUser]
   );

   console.log("check conversation", conversations, currentConversationInStore);

   return (
      <>
         <div className={classes.container}>
            {/* top */}
            <div className="p-2 sm:p-4">
               {/* header */}
               <div className={classes.header}>
                  <Popover placement="bottom-start">
                     <PopoverTrigger>
                        {auth && (
                           <AccountItem
                              active={true}
                              type="default"
                              fullName={auth.fullName}
                           />
                        )}
                     </PopoverTrigger>

                     <PopoverContent>
                        <AccountMenu />
                     </PopoverContent>
                  </Popover>

                  <div className="hidden sm:flex">
                     <Button
                        className={classes.button}
                        variant={"push"}
                        size={"clear"}
                        colors="secondary"
                     >
                        <PlusIcon className="w-[22px]" />
                     </Button>
                  </div>
               </div>

               {/* search */}
               <div className="mt-[16px] hidden sm:block">
                  <Search setResult={setResult} />
               </div>

               {/* <div className="mt-[14px] pt-[14px] border-t sm:hidden"></div> */}
            </div>

            {/*  conversation list */}
            <div className={classes.conversationList}>
               {status === "loading" && conversationSkeleton}
               {status !== "loading" && (
                  <>
                     {status === "successful" ? (
                        <>
                           {!!conversations.length || !!searchResult.length ? (
                              <>
                                 {renderSearchResult}
                                 {renderConversations}
                              </>
                           ) : (
                              <p className="text-center">No conversation jet...</p>
                           )}
                        </>
                     ) : (
                        <p>Some thing went wrong</p>
                     )}
                  </>
               )}
            </div>
         </div>
      </>
   );
}
