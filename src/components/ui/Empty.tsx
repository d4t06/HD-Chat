import { PlusIcon } from "@heroicons/react/16/solid";
import { ReactNode } from "react";

type Props = {
   onClick?: () => void;
   children?: ReactNode;
   className?: string;
};
export default function Empty({ onClick, children, className = "" }: Props) {
   const classes = {
      container: `group relative pt-[100%] `,
      frame: `absolute inset-0 border rounded-[14px] border-black/15 ${
         !children ? "cursor-pointer  hover:opacity-80" : ""
      }`,
   };

   return (
      <div onClick={onClick} className={`${classes.container} `}>
         <div className={`${classes.frame} ${className}`}>
            {children || <PlusIcon className="text-[#333] select-none w-[24px]" />}
         </div>
      </div>
   );
}
