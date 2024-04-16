import { useMemo } from "react";
import AvatarPlaceholder from "../Avatar";
import { Bars3Icon, FaceSmileIcon } from "@heroicons/react/24/outline";
import MessageContent from "./MessageContent";
import ImageMessage from "./ImageMessage";
import { convertDateStringToString } from "@/utils/appHelper";

type OtherMessage = {
   type: "other";
   user: User;
   message: Message;
   isNewSection: boolean;
   showName: boolean;
};

type TempImageMessage = {
   type: "temp-image";
   message: MessageSchema;
};

type SystemMessage = {
   type: "system";
   message: Message;
};

type SelfMessage = {
   type: "self";
   message: Message;
   isNewSection: boolean;
};

function MessageItem(
   props: (OtherMessage | SelfMessage | TempImageMessage | SystemMessage) & {
      className?: string;
   }
) {
   const classes = {
      messageContainer: "flex group",
      textContainer:
         "bg-[#f3f3f5] px-[12px] py-[6px] rounded-[8px] break-words overflow-hidden",
      button: "p-[4px] rounded-[99px] hover:bg-[#f3f3f5] ",
   };

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
               <div className="flex">
                  <AvatarPlaceholder
                     fullName={props.user.fullName}
                     className="mr-[6px] flex-shrink-0"
                     type="default"
                     size={"tiny"}
                     blank={!props.isNewSection}
                  />
                  <MessageContent
                     userFullName={props.showName ? props.user.fullName : ""}
                     message={props.message}
                  />
               </div>
            );

         case "self":
            return <MessageContent self={true} message={props.message} />;
         case "temp-image":
            return <ImageMessage type="temp" message={props.message} />;
         case "system":
            return <MessageContent message={props.message} />;
      }
   }, []);

   const messageContainer = useMemo(() => {
      switch (props.type) {
         case "other":
            return (
               <>
                  {props.isNewSection && (
                     <p className="text-[14px] text-[#808080] text-center">
                        {convertDateStringToString(props.message.send_at)}
                     </p>
                  )}
                  <div className={`${classes.messageContainer} ${props.className || ""}`}>
                     <div className="max-w-[500px]">{messageContent}</div>
                     {messageCta}
                  </div>
               </>
            );
         case "self":
            return (
               <>
                  {props.isNewSection && (
                     <p className="text-[14px] text-[#808080] text-center">
                        {convertDateStringToString(props.message.send_at)}
                     </p>
                  )}

                  <div
                     className={`${
                        classes.messageContainer
                     } flex-row-reverse justify-start  ${props.className || ""}`}
                  >
                     <div className="max-w-[100px]">{messageContent}</div>
                     {messageCta}
                  </div>
               </>
            );
         case "temp-image":
            return (
               <div
                  className={`${
                     classes.messageContainer
                  } flex-row-reverse justify-start  ${props.className || ""}`}
               >
                  <div className="max-w-[100px]">{messageContent}</div>
                  {messageCta}
               </div>
            );
         case "system":
            return <div className="w-full">{messageContent}</div>;
      }
   }, []);

   return messageContainer;
}

export default MessageItem;
