import { ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
   close: () => void;
   children: ReactNode;
   zIndex?: string;
};

export default function Modal({ close, children, zIndex = 'z-[99]' }: Props) {
   return createPortal(
      <>
         <div onClick={close} className={`fixed inset-0 bg-black/60 ${zIndex}`}></div>

         <div
            className={`fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ${zIndex}`}
         >
            <div className="py-[12px] px-[16px] rounded-[8px] bg-white">{children}</div>
         </div>
      </>,
      document.body
   );
}
