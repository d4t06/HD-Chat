import { useState } from "react";
import Button from "../../components/ui/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import AccountItem from "../../components/AccountItem";
import { Link } from "react-router-dom";
import { useAuth } from "@/stores/AuthContext";
import Search from "./Search";
import { useConversation } from "@/stores/ConversationContext";
import ConversationItem from "@/components/ConversationItem";

export default function Sidebar({ id: conversation_id }: { id?: string }) {
   const [searchResult, setResult] = useState<User[]>([]);

   // hooks
   const { auth, loading } = useAuth();
   const { conversations } = useConversation();

   const classes = {
      container: "w-[70px] sm:w-[360px] flex-shrink-0 border-r h-screen overflow-hidden",
      button: "p-[4px]",
      header: "flex justify-center sm:justify-between items-center",
      conversationList:
         "flex flex-col h-[calc(100vh-7.25rem)] overflow-y-auto no-scrollbar",
   };

   return (
      <>
         <div className={classes.container}>
            {/* top */}
            <div className="px-2 sm:px-4 pt-2 sm:pb-[16px]">
               {/* header */}
               <div className={classes.header}>
                  {loading ? (
                     <AccountItem type="loading" />
                  ) : (
                     <>
                        {auth && (
                           <AccountItem
                              active={true}
                              type="default"
                              fullName={auth.fullName}
                           />
                        )}
                     </>
                  )}
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
               {!!searchResult.length &&
                  searchResult.map((u, index) => (
                     <Link
                        key={index}
                        to={`/conversation/null?name=${u.fullName}&userID=${u.id}`}
                        className={`hover:bg-[#f3f3f5] p-2 sm:px-4`}
                     >
                        <AccountItem type="default" fullName={u.fullName} />
                     </Link>
                  ))}

               {conversations.map((c, index) => (
                  <Link
                     key={index}
                     to={`/conversation/${c.id}`}
                     className={`hover:bg-[#f3f3f5] p-2 sm:px-4`}
                  >
                     {loading ? (
                        <AccountItem type="loading" />
                     ) : (
                        <>
                           {auth && <ConversationItem type="default" c={c} auth={auth} />}
                        </>
                     )}
                  </Link>
               ))}
            </div>
         </div>
      </>
   );
}
