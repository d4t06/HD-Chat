import { useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import AccountItem from "../../components/AccountItem";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/stores/AuthContext";
import Search from "./Search";
import { useConversation } from "@/stores/ConversationContext";
import ConversationItem from "@/components/ConversationItem";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import AccountMenu from "@/components/AccountMenu";
import { useDispatch, useSelector } from "react-redux";
import {
   selectCurrentConversation,
   storingConversation,
} from "@/stores/CurrentConversationSlice";

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
               })
            );
      }
   };

   const classes = {
      container: "w-[70px] sm:w-[360px] flex-shrink-0 border-r h-screen overflow-hidden",
      button: "p-[4px]",
      header: "flex justify-center sm:justify-between items-center",
      conversationList:
         "flex flex-col h-[calc(100vh-7.25rem)] overflow-y-auto no-scrollbar",
      activeConversation: "!bg-[#c2e7ff]",
      conversationItem: "hover:bg-[#f3f3f5] p-2 sm:px-4",
   };

   const conversationSkeleton = useMemo(
      () =>
         [...Array(5).keys()].map((key) => (
            <div className={classes.conversationItem}>
               <AccountItem key={key} type="loading" className="rounded-[99px]" />
            </div>
         )),
      []
   );

   const renderConversations = useMemo(() => {
      if (!!conversations.length)
         return conversations.map((c, index) => (
            <button
               key={index}
               className={`${classes.conversationItem} ${
                  currentConversationInStore?.id == c.id ? classes.activeConversation : ""
               }`}
               onClick={() =>
                  handleActiveConversation({ type: "default", conversation: c })
               }
            >
               {auth && <ConversationItem type="default" c={c} auth={auth} />}
            </button>
         ));

      return <p>No conversation jet...</p>;
   }, [conversations, currentConversationInStore]);

   const renderSearchResult = useMemo(
      () =>
         !!searchResult.length &&
         searchResult.map((u, index) => (
            <button
               key={index}
               onClick={() => handleActiveConversation({ type: "new", user: u })}
               className={`${classes.conversationItem} ${
                  tempUser?.id === u.id ? classes.activeConversation : ""
               }`}
            >
               <AccountItem type="default" fullName={u.fullName} />
            </button>
         )),
      [searchResult, tempUser]
   );

   return (
      <>
         <div className={classes.container}>
            {/* top */}
            <div className="px-2 sm:px-4 pt-2 sm:pb-[16px]">
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
                           {renderSearchResult}
                           {renderConversations}
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
