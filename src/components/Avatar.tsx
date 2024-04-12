import { VariantProps, cva } from "class-variance-authority";
import Skeleton from "./Skeleton";
import { generateHSL } from "@/utils/getUniqueColor";

const avatarVariant = cva("flex-shrink-0", {
   variants: {
      size: {
         primary: "h-[44px] w-[44px] text-[24px]",
         small: "h-[40px] w-[40px] text-[22px]",
         tiny: "h-[28px] w-[28px] text-[16px]",
      },
   },
   defaultVariants: {
      size: "primary",
   },
});

interface Props extends VariantProps<typeof avatarVariant> {
   type: "default";
   active?: boolean;
   fullName: string;
   className?: string;
   blank?: boolean; //for message item
   bubble?: number
}

interface LoadingProps extends VariantProps<typeof avatarVariant> {
   className?: string;
   type: "loading";
}

export default function AvatarPlaceholder({ size, ...props }: Props | LoadingProps) {
   const classes = {
      frame: "w-full h-full rounded-[99px] flex items-center justify-center",
   };

   if (props.type === "loading")
      return <Skeleton className={avatarVariant({ size, className: props.className })} />;

   if (props.type === "default") {
      const { fullName, active, className = "", blank = false, bubble = 0 } = props;

      const color = generateHSL(fullName);

      return (
         <div
            className={avatarVariant({ size, className: className || "" + " relative" })}
         >
            {!blank && (
               <div style={{ backgroundColor: color }} className={classes.frame}>
                  <p className="text-[#fff]">{fullName.charAt(0)}</p>
                  {active && (
                     <span className="absolute border-[3px] border-white p-[5px] bg-emerald-400 rounded-full bottom-[0px] right-[-2px]"></span>
                  )}
                  
                  {!!bubble && (
                     <span className="absolute rounded-[99px] top-[-4px] right-[-2px] text-[14px] flex items-center justify-center w-[20px] h-[20px] font-[500] leading-[12px] bg-red-500 text-white">{bubble < 9 ? bubble : "n"}</span>
                  )}
               </div>
            )}
         </div>
      );
   }
}
