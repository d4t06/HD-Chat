import { Ref, forwardRef } from "react";
import AvatarPlaceholder from "./Avatar";
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
      textContainer: "bg-[#f3f3f5] px-[12px] py-[6px] rounded-[8px]",
   };

   // console.log(props.type)

   // if (props.type == "other") {
   //    console.log("message  from other", props.showAvatar);
   // }

   switch (props.type) {
      case "other":
         return (
            <div ref={ref || null} className={`last:pb-[30px]`}>
               <div className="flex">
                  <AvatarPlaceholder
                     fullName={props.user.fullName}
                     className="mr-[6px]"
                     type="default"
                     size={"tiny"}
                     blank={!props.showAvatar}
                  />
                  <p className={`${classes.textContainer}`}>{props.message.content}</p>
               </div>
            </div>
         );

      case "self":
         return (
            <div ref={ref || null} className={`last:pb-[30px] ml-auto`}>
               <p className={`${classes.textContainer} !bg-[#0084ff] text-[#fff]`}>
                  {props.message.content}
               </p>
            </div>
         );
   }
}

export default forwardRef(MessageItem);
