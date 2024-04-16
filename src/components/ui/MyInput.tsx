import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
   cb: (value: string) => void;
}
export const inputClasses = {
   input: "w-full font-[500] text-[#1f1f1f] placeholder-[#808080] bg-[#f3f3f5] outline-none border border-[#ccc]",
};

export default function MyInput({ cb, className, type, ...props }: Props) {
   return (
      <input
         onChange={(e) => cb(e.target.value)}
         type={type || "text"}
         className={`${inputClasses.input} ${className} `}
         {...props}
      />
   );
}
