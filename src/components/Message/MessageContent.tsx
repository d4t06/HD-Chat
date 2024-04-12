import EmojiMessage from "./EmojiMessage";
import ImageMessage from "./ImageMessage";
import StickerMessage from "./StickerMessage";

type Props = {
   message: Message;
   self?: boolean;
   className?: string;
};
export default function MessageContent({ message, self }: Props) {
   const classes = {
      textContainer:
         "bg-[#f3f3f5] px-[12px] py-[6px] rounded-[8px] break-words overflow-hidden",
   };

   switch (message.type) {
      case "text":
         return (
            <p
               className={`${classes.textContainer} ${
                  self ? "!bg-[#cd1818] text-[#fff]" : ""
               }`}
            >
               {message.content}
            </p>
         );
      case "emoji":
         return <EmojiMessage message={message} />;
      case "image":
         return <ImageMessage type="default" message={message} />;
      case "sticker":
         return <StickerMessage message={message} />;
      case "system-log":
   }
}
