import ImageMessage from "./ImageMessage";

type Props = {
   message: Message;
   self?: boolean;
   className?: string;
};
export default function MessageContent({ message, self, className = "" }: Props) {
   const classes = {
      textContainer:
         "bg-[#f3f3f5] px-[12px] py-[6px] rounded-[8px] break-words overflow-hidden",
   };

   switch (message.type) {
      case "text":
      case "emoji":
      case "system-log":
         return (
            <p
               className={`${classes.textContainer} ${
                  self ? "!bg-[#0084ff] text-[#fff]" : ""
               }`}
            >
               {message.content}
            </p>
         );
      case "image":
         return <ImageMessage message={message} />;
   }
}
