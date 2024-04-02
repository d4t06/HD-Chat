import { VariantProps, cva } from "class-variance-authority";
import { ReactNode } from "react";

const classes = {
   push: 'relative p-[10px] active:translate-y-[2px] active:before:shadow-none before:z-[-1] before:border-[2px]  before:absolute before:content-[""]  before:inset-0 before:rounded-[8px] rounded-[8px]',
};

const frameVariant = cva(`${classes.push}`, {
   variants: {
      colors: {
         primary:
            "before:bg-[#cd1818] before:border-[#a40000] text-[#fff] before:shadow-[0_2px_0_#a40000]",
         secondary:
            "before:bg-[#f6f6f6] before:border-[#ccc] text-[#333] before:shadow-[0_2px_0_#ccc]",
         clear: "",
      },
   },
   defaultVariants: {
      colors: "primary",
   },
});

interface Props extends VariantProps<typeof frameVariant> {
   className?: string;
   children: ReactNode;
}

export default function PushFrame({ className, colors, children }: Props) {
   return <div className={frameVariant({ colors, className })}>{children}</div>;
}
