import AvatarPlaceholder from "./Avatar";
import Skeleton from "./Skeleton";

export type AccountItemProps = {
   type: "default";
   fullName: string;
   size?: "primary" | "small";
   className?: string;
   desc?: string;
   bubble?: number; 
   active?: boolean;
   keepNameInSmall?: boolean;
};

type Loading = {
   type: "loading";
   size?: "primary" | "small";
   className?: string;
};

export default function AccountItem({
   size = "primary",
   ...props
}: AccountItemProps | Loading) {
   if (props.type === "loading")
      return (
         <div className="flex justify-center sm:justify-start">
            <AvatarPlaceholder
               type="loading"
               className={props.className || ""}
               size={size}
            />
            <div className="ml-[10px] hidden sm:block">
               <Skeleton className="h-[20px] w-[200px]" />
               <Skeleton className="h-[16px] w-[60px] mt-[4px]" />
            </div>
         </div>
      );

   if (props.type === "default") {
      const { fullName, className, desc, active, keepNameInSmall = false, bubble } = props;
      return (
         <div
            className={`flex cursor-pointer justify-center sm:justify-start ${
               className || ""
            }`}
         >
            <AvatarPlaceholder
               active={active}
               type="default"
               size={size}
               fullName={fullName}
               bubble={bubble}
            />
            <div className={`ml-[10px] ${keepNameInSmall ? "" : "hidden sm:block"}`}>
               <p className="leading-[20px] font-[500] text-[#1f1f1f]">{fullName}</p>
               {desc && <p className="font-[500] text-[14px] text-[#808080]">{desc}</p>}
            </div>
         </div>
      );
   }
}
