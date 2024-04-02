import AvatarPlaceholder from "./Avatar";

type Props = {
   conversation: Conversation;
   size?: "primary" | "small";
   className?: string;
};

export default function ConversationItem({ conversation, size = "primary", className }: Props) {
   return (
      <div className={`flex cursor-pointer justify-center sm:justify-start ${className || ""}`}>
         <AvatarPlaceholder size={size} firstChar={conversation.username.charAt(0)} />
         <div className="ml-[10px] hidden sm:block">
            <p className="text-[16px] leading-[20px]">{conversation.username}</p>
            <p className="text-[14px]">blablalbalbla</p>
         </div>
      </div>
   );
}
