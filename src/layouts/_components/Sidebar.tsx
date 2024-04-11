import { useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import { Bars3Icon } from "@heroicons/react/24/outline";
import AccountItem from "../../components/AccountItem";
import { useAuth } from "@/stores/AuthContext";
import Search from "./Search";
import { useConversation } from "@/stores/ConversationContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import AccountMenu from "@/components/AccountMenu";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentConversation, storingConversation } from "@/stores/CurrentConversationSlice";
import ConversationList from "@/components/ConversationList";
import SearchNotFound from "@/components/SearchNotFound";

export default function Sidebar() {
   const [searchResult, setResult] = useState<User>();
   const [isSearch, setIsSearch] = useState(false);

   // hooks
   const dispatch = useDispatch();
   const { auth } = useAuth();
   const { conversations, status } = useConversation();
   const { currentConversationInStore, tempUser } = useSelector(selectCurrentConversation);

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
            if (currentConversationInStore?.id === props.conversation.id) return;
            dispatch(
               storingConversation({
                  currentConversationInStore: props.conversation,
                  tempUser: null,
                  messageStatus: "loading",
               })
            );

            break;
         case "new":
            if (tempUser?.id === props.user.id) return;
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

   console.log("check is searhc", isSearch);

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

      if (isSearch) {
         if (searchResult) {
            const existingConversation = conversations.find((c) =>
               c.members.find((m) => m.user_id === searchResult.id)
            );

            if (existingConversation)
               return (
                  <ConversationList
                     cb={() =>
                        handleActiveConversation({
                           type: "default",
                           conversation: existingConversation,
                        })
                     }
                     conversations={[existingConversation]}
                     auth={auth}
                  />
               );

            const isSelf = searchResult.id === auth?.id;

            if (isSelf) {
               return (
                  <div className={`${classes.conversationItem}`}>
                     <AccountItem
                        type="default"
                        fullName={`${searchResult.fullName}`}
                        desc="Your account"
                     />
                  </div>
               );
            }

            const isActive = tempUser ? tempUser.id == searchResult.id : false;
            return (
               <div
                  onClick={() => handleActiveConversation({ type: "new", user: searchResult })}
                  className={`${classes.conversationItem} ${
                     isActive ? classes.activeConversation : ""
                  }`}
               >
                  <AccountItem type="default" fullName={searchResult.fullName} />
               </div>
            );
         }

         return <SearchNotFound />
      }

      if (!!conversations.length)
         return (
            <ConversationList
               auth={auth}
               conversations={conversations}
               cb={(c) => handleActiveConversation({ type: "default", conversation: c })}
            />
         );
   }, [conversations, currentConversationInStore, searchResult, isSearch]);

   return (
      <>
         <div className={classes.container}>
            {/* top */}
            <div className="p-2 sm:p-4">
               {/* header */}
               <div className={classes.header}>
                  <Popover placement="bottom-start">
                     <PopoverTrigger className="sm:pointer-events-none">
                        {auth && (
                           <AccountItem active={true} type="default" fullName={auth.fullName} />
                        )}
                     </PopoverTrigger>

                     <PopoverContent>
                        <div className="sm:hidden">
                           <AccountMenu />
                        </div>
                     </PopoverContent>
                  </Popover>

                  <div className="hidden sm:flex">
                     <Popover placement="bottom-end">
                        <PopoverTrigger>
                           <Button
                              className={classes.button}
                              variant={"push"}
                              size={"clear"}
                              colors="secondary"
                           >
                              <Bars3Icon className="w-[22px]" />
                           </Button>
                        </PopoverTrigger>

                        <PopoverContent>
                           <AccountMenu />
                        </PopoverContent>
                     </Popover>
                  </div>
               </div>

               {/* search */}
               <div className="mt-[16px] hidden sm:block">
                  <Search setIsSearch={setIsSearch} setResult={setResult} />
               </div>
            </div>

            {/*  conversation list */}
            <div className={classes.conversationList}>
               {status === "loading" && conversationSkeleton}
               {status !== "loading" && (
                  <>
                     {status === "successful" ? (
                        <>
                           {!!conversations.length || searchResult ? (
                              <>
                                 {/* {renderSearchResult} */}
                                 {renderConversations}
                              </>
                           ) : (
                              <p className="text-center">...</p>
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
