import { Ref, forwardRef } from "react";
// import AvatarPlaceholder from "./Avatar";

type OtherMessage = {
   type: "other";
   user: User;
   message: Message;
   showAvatar: boolean;
};

type SelfMessage = {
   type: "self";
   message: Message;
};

function MessageItem(props: OtherMessage | SelfMessage, ref: Ref<HTMLDivElement>) {
   const classes = {
      container: "flex",
      textContainer: "bg-[#f3f3f5] px-[12px] py-[8px] rounded-[8px]",
   };



   return (
      <div ref={ref || null} className={`last:pb-[30px] ml-auto`}>
        {props.type ==='other' && props.showAvatar && <p>Show</p>}
        
         <p className={`${classes.textContainer}`}>{props.message.content}</p>
      </div>
   );
}

export default forwardRef(MessageItem);
