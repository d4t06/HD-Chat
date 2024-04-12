import { useState } from "react";
import AccountItem from "../../components/AccountItem";
import { useAuth } from "@/stores/AuthContext";
import Search from "./Search";
import AccountMenu from "@/components/AccountMenu";
import SidebarConversations from "./SidebarConversations";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";

export default function Sidebar() {
   const [searchResult, setResult] = useState<User | null>(null);
   const [isSearch, setIsSearch] = useState(false);

   // hooks
   const { auth } = useAuth();

   const classes = {
      container: "relative w-[70px] sm:w-[360px] flex-shrink-0 border-r border-black/10 h-screen",
      button: "p-[4px]",
      header: "flex justify-center sm:justify-between items-center",
   };

   if (!auth) return;

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
                           <AccountItem
                              active={true}
                              type="default"
                              fullName={auth.fullName}
                           />
                        )}
                     </PopoverTrigger>

                     <PopoverContent>
                        <div className="sm:hidden">
                           <AccountMenu />
                        </div>
                     </PopoverContent>
                  </Popover>
               </div>

               {/* search */}
               <div className="mt-[16px] hidden sm:block">
                  <Search setIsSearch={setIsSearch} setResult={setResult} />
               </div>
            </div>

            {/*  conversation list */}
            <SidebarConversations
               auth={auth}
               isSearch={isSearch}
               searchResult={searchResult}
            />
         </div>
      </>
   );
}
