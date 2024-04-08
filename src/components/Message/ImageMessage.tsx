import { ArrowPathIcon } from "@heroicons/react/24/outline";

type Props = {
   message: Message;
};
export default function ImageMessage({ message }: Props) {
   switch (message.status) {
      case "sending":
         return (
            <div className="flex items-center justify-center rounded-[8px] border border-[#ccc] overflow-hidden">
               <img className="opacity-[60] " src={message.content} />
               <ArrowPathIcon className="w-[24px] " />
            </div>
         );
      default:
         <div className="rounded-[8px] border border-[#ccc] overflow-hidden">
            <img src={message.content} />
         </div>;
   }
}
