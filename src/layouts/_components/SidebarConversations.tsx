import AccountItem from "@/components/AccountItem";
import SidebarConversationList from "@/components/SidebarConversationList";
import SearchNotFound from "@/components/SearchNotFound";
import useGetUserConversation from "@/hooks/useGetUserConversations";
import { AuthType } from "@/stores/AuthContext";
import {
   selectCurrentConversation,
   storingCurrentConversation,
   storingMessages,
} from "@/stores/CurrentConversationSlice";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { seenMessages } from "@/stores/ConversationSlice";

type Props = {
   auth: AuthType;
   isSearch: boolean;
   searchResult: User | null;
};
export default function SidebarConversations({ auth, isSearch, searchResult }: Props) {
   // hooks
   const dispatch = useDispatch();
   const { conversationDetails, status } = useGetUserConversation();
   const { currentConversationInStore, tempUser } = useSelector(
      selectCurrentConversation
   );

   type Default = {
      type: "default";
      cDetail: ConversationDetail;
   };

   type NewConversation = {
      type: "new";
      user: User;
   };

   const handleActiveConversation = (props: Default | NewConversation) => {
      switch (props.type) {
         case "default":
            if (
               currentConversationInStore?.conversation.id ===
               props.cDetail.conversation.id
            )
               return;

            const { cDetail } = props;

            if (!!cDetail.countNewMessages)
               dispatch(seenMessages({ conversation_id: cDetail.conversation.id }));

            dispatch(
               storingCurrentConversation({
                  conversationDetail: cDetail,
                  tempUser: null,
               })
            );

            break;
         case "new":
            if (tempUser?.id === props.user.id) return;
            dispatch(
               storingMessages({
                  messages: [],
                  messageStatus: "successful",
                  replace: true,
               })
            );
            dispatch(
               storingCurrentConversation({
                  conversationDetail: null,
                  tempUser: props.user,
               })
            );
      }
   };

   const classes = {
      conversationList:
         "flex-grow sm:top-[130px] w-full flex flex-col no-scrollbar overflow-y-auto",
      container: "relative w-[70px] sm:w-[360px] flex-shrink-0 border-r h-screen",
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

   const renderConversations = () => {
      if (isSearch) {
         if (searchResult) {
            const existingCDetail = conversationDetails.filter((c) =>
               c.conversation.members.find(
                  (m) => m.user_id !== auth.id && m.user_id === searchResult.id
               )
            );

            if (existingCDetail.length)
               return (
                  <SidebarConversationList
                     cb={(c) =>
                        handleActiveConversation({
                           type: "default",
                           cDetail: c,
                        })
                     }
                     cDetails={existingCDetail}
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
                  onClick={() =>
                     handleActiveConversation({ type: "new", user: searchResult })
                  }
                  className={`${classes.conversationItem} ${
                     isActive ? classes.activeConversation : ""
                  }`}
               >
                  <AccountItem type="default" fullName={searchResult.fullName} />
               </div>
            );
         }

         return <SearchNotFound />;
      }

      if (!!conversationDetails.length)
         return (
            <SidebarConversationList
               cDetails={conversationDetails}
               cb={(c) => handleActiveConversation({ type: "default", cDetail: c })}
            />
         );

      return <p className="text-center">...</p>;
   };

   // console.log("check conversations", conversationDetails);

   return (
      <div className={classes.conversationList}>
         {status === "loading" && conversationSkeleton}
         {status !== "loading" && (
            <>
               {status === "successful" ? (
                  <>{renderConversations()}</>
               ) : (
                  <p>Some thing went wrong</p>
               )}
            </>
         )}
      </div>
   );
}
