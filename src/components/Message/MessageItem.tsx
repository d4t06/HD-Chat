import { Ref, forwardRef, useMemo } from "react";
import AvatarPlaceholder from "../Avatar";
import { Bars3Icon, FaceSmileIcon } from "@heroicons/react/24/outline";
import MessageContent from "./MessageContent";
import ImageMessage from "./ImageMessage";
// import AvatarPlaceholder from "./Avatar";

type OtherMessage = {
   type: "other";
   user: User;
   message: Message;
   showAvatar: boolean;
};

type TempImageMessage = {
   type: "temp-image";
   message: MessageSchema;
};

type SelfMessage = {
   type: "self";
   message: Message;
};

function MessageItem(
   props: OtherMessage | SelfMessage | TempImageMessage,
   ref: Ref<HTMLDivElement>
) {
   const classes = {
      messageContainer: "flex w-full group last:pb-[30px]",
      textContainer: "bg-[#f3f3f5] px-[12px] py-[6px] rounded-[8px] break-words overflow-hidden",
      button: "p-[4px] rounded-[99px] hover:bg-[#f3f3f5] ",
   };

   // console.log(props.type)

   // if (props.type == "other") {
   //    console.log("message  from other", props.showAvatar);
   // }

   const messageCta = (
      <div className="flex  opacity-0 group-hover:opacity-[1] items-center px-[6px] max-w-[100%]">
         <button className={classes.button}>
            <FaceSmileIcon className="w-[18px] text-[#a8a8a8]" />
         </button>

         <button className={classes.button}>
            <Bars3Icon className="w-[18px] text-[#a8a8a8]" />
         </button>
      </div>
   );

   const messageContent = useMemo(() => {
      switch (props.type) {
         case "other":
            return (
               <div ref={ref || null}>
                  <div className="flex">
                     <AvatarPlaceholder
                        fullName={props.user.fullName}
                        className="mr-[6px] flex-shrink-0"
                        type="default"
                        size={"tiny"}
                        blank={!props.showAvatar}
                     />
                     <MessageContent message={props.message} />
                  </div>
               </div>
            );

         case "self":
            return (
               <div ref={ref || null}>
                  <MessageContent self={true} message={props.message} />
               </div>
            );
         case "temp-image":
            return <ImageMessage type="temp" message={props.message} />;
      }
   }, []);

   const messageContainer = useMemo(() => {
      switch (props.type) {
         case "other":
            return (
               <div className={classes.messageContainer}>
                  <div className="max-w-[600px]">{messageContent}</div>

                  {/* cta */}
                  {messageCta}
               </div>
            );
         case "self":
         case "temp-image":
            return (
               <div className={`${classes.messageContainer} flex-row-reverse justify-start`}>
                  <div className="max-w-[600px]">{messageContent}</div>

                  {messageCta}
               </div>
            );
      }
   }, []);

   return messageContainer;
}

export default forwardRef(MessageItem);
