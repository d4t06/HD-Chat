import { ReactNode } from "react";
import { VariantProps, cva } from "class-variance-authority";

const popupVariant = cva("", {
   variants: {
      variant: {
         default: "py-[20px] px-[14px]",
         thin: "p-[6px]",
      },
   },
   defaultVariants: {
      variant: "default",
   },
});

interface Props extends VariantProps<typeof popupVariant> {
   children: ReactNode;
   className?: string;
}

export default function PopupWrapper({ children, variant, className }: Props) {
   return (
      <div
         className={`wrapper rounded-[6px]  text-[#333] bg-[#fff] border-[1px] 
         ${popupVariant({ variant,className,})}
         `}
      >
         {children}
      </div>
   );
}
