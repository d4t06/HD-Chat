import AvatarPlaceholder from "./Avatar";
import Skeleton from "./Skeleton";

export type AccountItemProps = {
   type: "default";
   fullName: string;
   size?: "primary" | "small";
   className?: string;
   desc?: string;
   active?: boolean;
};

type Loading = {
   type: "loading";
   size?: "primary" | "small";
};

export default function AccountItem({ size = "primary", ...props }: AccountItemProps | Loading) {
   if (props.type === "loading") return;
   <div className="flex justify-center sm:justify-start">
      <AvatarPlaceholder type="loading" size={size} />
      <div className="ml-[10p]">
         <Skeleton className="h-[22px] w-[100px]" />
         <Skeleton className="h-[22px] w-[60px]" />
      </div>
   </div>;

   if (props.type === "default") {
      const { fullName, className, desc, active } = props;
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
            />
            <div className="ml-[10px] hidden sm:block">
               <p className="leading-[20px] font-[500] text-[#1f1f1f]">{fullName}</p>
               {desc && <p className="text-[14px] text-[#808080]">{desc}</p>}
            </div>
         </div>
      );
   }
}
