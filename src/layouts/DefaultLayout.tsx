import { ReactNode } from "react";
import Sidebar from "./_components/Sidebar";
import messageNotify from "@/assets/messenger.mp3"

export default function DefaultLayout({ children }: { children: ReactNode }) {
   return (
      <div className="flex">
         <Sidebar />
         {children}

         <audio src={messageNotify} className="hidden notify"></audio>
      </div>
   );
}
