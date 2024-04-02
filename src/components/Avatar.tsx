import { VariantProps, cva } from "class-variance-authority";
import Skeleton from "./Skeleton";
import { generateHSL } from "@/utils/getUniqueColor";

const avatarVariant = cva("", {
   variants: {
      size: {
         primary: "h-[44px] w-[44px] text-[24px]",
         small: "h-[40px] w-[40px] text-[22px]",
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
}

interface LoadingProps extends VariantProps<typeof avatarVariant> {
   className?: string;
   type: "loading";
}

export default function AvatarPlaceholder({ size, ...props }: Props | LoadingProps) {
   const classes = {
      frame: "w-full h-full rounded-[99px] flex items-center justify-center",
   };

   if (props.type === "loading") return <Skeleton className={avatarVariant({ size })} />;

   if (props.type === "default") {
      const { fullName, active, className = "" } = props;

      const color = generateHSL(fullName);

      return (
         <div className={avatarVariant({ size, className: className || "" + " relative" })}>
            <div style={{ backgroundColor: color }} className={classes.frame}>
               <p className="text-[#fff]">{fullName.charAt(0)}</p>
               {active && (
                  <span className="absolute border-[3px] border-white p-[5px] bg-emerald-400 rounded-full bottom-[0px] right-[-2px]"></span>
               )}
            </div>
         </div>
      );
   }
}
