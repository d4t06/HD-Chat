import { ReactNode } from "react";
import Sidebar from "./_components/Sidebar";

export default function DefaultLayout({ children }: { children: ReactNode }) {
   return (
      <div className="flex">
         <Sidebar />
         {children}
      </div>
   );
}
