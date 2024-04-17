import { generateHSL } from "@/utils/getUniqueColor";
import EmojiMessage from "./EmojiMessage";
import ImageMessage from "./ImageMessage";
import StickerMessage from "./StickerMessage";
import { convertDateStringToString } from "@/utils/appHelper";

type Props = {
   message: Message;
   self?: boolean;
   className?: string;
   userFullName?: string;
};
export default function MessageContent({ message, self, userFullName }: Props) {
   const classes = {
      textContainer:
         "bg-[#f3f3f5] px-[12px] py-[6px] rounded-[8px] break-words overflow-hidden",
   };

   const content = () => {
      switch (message.type) {
         case "text":
            return <p>{message.content}</p>;
         case "emoji":
            return <EmojiMessage message={message} />;
         case "image":
            return <ImageMessage type="default" message={message} />;
         case "sticker":
            return <StickerMessage message={message} />;
         case "system-log":
            return <p className="text-center text-[#808080]">{message.content}</p>;
      }
   };

   const color = userFullName ? generateHSL(userFullName) : "";

   switch (message.type) {
      case "text":
         return (
            <div
               className={`${classes.textContainer} ${
                  self ? "!bg-[#cd1818] text-[#fff]" : ""
               }`}
            >
               {userFullName && (
                  <span style={{ color }} className="text-[14px] mb-[10px]">
                     {userFullName}
                  </span>
               )}
               {content()}
            </div>
         );
      case "emoji":
      case "image":
      case "sticker":
         return (
            <div className="flex flex-col items-start">
               {userFullName && (
                  <span
                     style={{ color }}
                     className="text-[14px] mb-[4px] px-[8px] bg-[#f3f3f5] rounded-[99px]"
                  >
                     {userFullName}
                  </span>
               )}
               {content()}
            </div>
         );
      case "system-log":
         return (
            <p className="text-center text-[#808080] text-[14px] py-[10px]">
               {message.content} - {convertDateStringToString(message.send_at)}
            </p>
         );
   }
}
