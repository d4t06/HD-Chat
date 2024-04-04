import { Dispatch, SetStateAction } from "react";
import Button from "../ui/Button";
import ModalHeader from "./ModalHeader";

type Props = {
   callback: () => void;
   title?: string;
   desc?: string;
   buttonLabel?: string;
   loading: boolean;
   className?: string;
   close: () => void;
};

export default function ConfirmModal({
   loading,
   callback,
   title,
   close,
   buttonLabel,
   //   reserve,
   desc = "This action cannot be undone",
   className,
}: //   children,
Props) {
   return (
      <div
         className={`${className || "w-[400px] max-w-[calc(90vw-40px)]"} ${
            loading ? "opacity-60 pointer-events-none" : ""
         }`}
      >
         <ModalHeader close={close} title={title || "Wait a minute"} />
         <div className="flex gap-[10px] mt-[20px]">
            <Button onClick={close} variant="push" colors="secondary">
               Close
            </Button>
            <Button isLoading={loading} variant={"push"} onClick={callback}>
               {buttonLabel || "Yes please"}
            </Button>
         </div>
      </div>
   );
}
