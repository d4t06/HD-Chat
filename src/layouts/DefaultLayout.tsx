import { ReactNode } from "react";

export default function DefaultLayout({ children }: { children: ReactNode }) {
   return (
      <div className="">
         <p>This is default layout</p>
         {children}
      </div>
   );
}
