import useSearchUser from "@/hooks/useSearchUser";
import { Dispatch, SetStateAction } from "react";
import {
   ArrowPathIcon,
   MagnifyingGlassIcon,
   XMarkIcon,
} from "@heroicons/react/24/outline";

type Props = {
   setResult: Dispatch<SetStateAction<User | null>>;
   setIsSearch: Dispatch<SetStateAction<boolean>>;
};

export default function Search({ setResult, setIsSearch }: Props) {
   const { inputAttrs, isFetching, phoneNumber, handleClear } = useSearchUser({
      setResult,
      setIsSearch
   });

   const classes = {
      searchContainer:
         "bg-[#f3f3f5] overflow-hidden border-[2px] border-[#ccc] rounded-[99px] flex",
      input: "h-[34px] font-[500] font-[#1f1f1f] flex-1 ml-[10px] bg-transparent outline-none",
      iconContainer: 'px-[10px] flex items-center border-r-[1px]',
      icon: "w-[24px]",
   };

   const renderIcon = () => {
      if (isFetching)
         return (
            <div className={classes.iconContainer}>
               <ArrowPathIcon className={classes.icon + " animate-spin"} />
            </div>
         );
      if (phoneNumber)
         return (
            <button onClick={handleClear} className={classes.iconContainer + ' hover:bg-[#e1e1e1] border-[#ccc] border-r-[1px]'}>
               <XMarkIcon className={classes.icon} />
            </button>
         );
      else
         return (
            <div className={classes.iconContainer}>
               <MagnifyingGlassIcon className={classes.icon} />
            </div>
         );
   };

   return (
      <div className={classes.searchContainer}>
         {renderIcon()}
         <input
            {...inputAttrs}
            className={classes.input}
            placeholder="Search..."
            type="text"
         />
      </div>
   );
}
