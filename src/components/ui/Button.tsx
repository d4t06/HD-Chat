import { ButtonHTMLAttributes, FC, MouseEventHandler, ReactNode } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const classes = {
   primary: "text-white rounded-[6px]  hover:brightness-90 text-[14px] bg-[#cd1818]",
   push: 'active:translate-y-[2px] active:before:shadow-none before:z-[-1] before:border-[2px]  before:absolute before:content-[""]  before:inset-0 ',
   active: "translate-y-[2px] before:shadow-none",
};

const buttonVariant = cva(
   "inline-flex justify-center items-center disabled:opacity-[.6] disabled:pointer-events-none relative  z-0",
   {
      variants: {
         variant: {
            primary: classes.primary,
            push: classes.push,
            clear: "",
         },
         size: {
            primary: "px-[20px] py-[4px]",
            full: "w-full py-[4px]",
            clear: "",
         },
         rounded: {
            primary: "before:rounded-[8px] rounded-[8px]",
            lg: "before:rounded-[12px] rounded-[12px]",
            max: "before:rounded-[99px] rounded-[99px]",
            clear: "",
         },
         colors: {
            primary:
               "before:bg-[#cd1818] before:border-[#a40000] text-[#fff] before:shadow-[0_2px_0_#a40000]",
            secondary:
               "before:bg-[#f6f6f6] before:border-[#ccc] text-[#333] before:shadow-[0_2px_0_#ccc]",
            clear: "",
         },
      },

      defaultVariants: {
         variant: "primary",
         size: "primary",
         rounded: "primary",
         colors: "primary",
      },
   }
);

interface Props
   extends ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<typeof buttonVariant> {
   children: ReactNode;
   isLoading?: boolean;
   onClick?: MouseEventHandler;
}

const Button: FC<Props> = ({
   className,
   children,
   variant,
   size,
   colors,
   rounded,
   isLoading,
   onClick,
   disabled,
   ...props
}) => {
   return (
      <button
         type="button"
         onClick={(e) => (onClick ? onClick(e) : "")}
         disabled={isLoading || disabled}
         className={buttonVariant({ variant, size, colors, rounded, className })}
         {...props}
      >
         {isLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : null}
         {!isLoading && children}
      </button>
   );
};

export default Button;
