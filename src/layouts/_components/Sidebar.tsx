import { useState } from "react";
import { useAuth } from "@/stores/AuthContext";
import Search from "./Search";
import SidebarConversations from "./SidebarConversations";
import SidebarHeader from "./SidebarHeader";

export default function Sidebar() {
   const [searchResult, setResult] = useState<User | null>(null);
   const [isSearch, setIsSearch] = useState(false);

   // hooks
   const { auth } = useAuth();

   const classes = {
      container:
         "relative w-[70px] sm:w-[360px] flex-shrink-0 border-r border-black/10 h-screen",
   };

   if (!auth) return;

   return (
      <>
         <div className={classes.container}>
            <div className="p-2 sm:p-4">
               <SidebarHeader />

               <div className="mt-[16px] hidden sm:block">
                  <Search setIsSearch={setIsSearch} setResult={setResult} />
               </div>
            </div>

            <SidebarConversations
               auth={auth}
               isSearch={isSearch}
               searchResult={searchResult}
            />
         </div>
      </>
   );
}
