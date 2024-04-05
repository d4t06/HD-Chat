import { ReactNode } from "react";

type Props = {
   cb: () => void;
   children: ReactNode;
};
export default function MenuItem({ cb, children }: Props) {
   const classes = {
      menuItem: `hover:bg-[#f3f3f5]  rounded-[4px] px-[10px] h-[44px] w-full flex items-center`,
   };

   return (
      <button className={`${classes.menuItem}`} onClick={cb}>
         {children}
      </button>
   );
}
