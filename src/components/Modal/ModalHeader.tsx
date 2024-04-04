import { XMarkIcon } from "@heroicons/react/20/solid";
import Button from "../ui/Button";

export default function ModalHeader({
   close,
   title,
}: {
   title: string;
   close: () => void;
}) {
   return (
      <div className="flex justify-between items-start mb-[15px]">
         <h1 className="text-[26px] font-semibold">{title}</h1>
         <Button
            size={"clear"}
            colors={"secondary"}
            variant={"push"}
            className="p-[4px]"
            onClick={close}
         >
            <XMarkIcon className="w-[20px]" />
         </Button>
      </div>
   );
}
