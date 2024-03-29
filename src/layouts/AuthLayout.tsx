import { HomeIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../components/ui/Button";

export default function LoginLayout({ children }: { children: ReactNode }) {
   const location = useLocation();
   const from = location?.state?.from || "/";

   return (
      <div className=" relative h-screen w-screen bg-[#f0f4f9]">
         <Link to={from || "/"}>
            <Button
               size={"clear"}
               variant="push"
               className="!absolute z-[99] bottom-[15px] left-[15px] h-[36px] w-[36px]"
            >
               <HomeIcon className="w-[22px]" />
            </Button>
         </Link>
         <div className="flex h-full">{children}</div>
      </div>
   );
}
