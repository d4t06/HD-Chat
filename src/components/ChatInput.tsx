import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Button from "./ui/Button";
import {
   ElementRef,
   KeyboardEvent,
   ReactNode,
   RefObject,
   useMemo,
   useRef,
   useState,
} from "react";
import { useSocket } from "@/stores/SocketContext";
import { useSelector } from "react-redux";
import { selectCurrentConversation } from "@/stores/CurrentConversationSlice";
import useMessageActions from "@/hooks/useMessageActions";
import useSendMessageToNewConversation from "@/hooks/useNewConversation";
import { useAuth } from "@/stores/AuthContext";
import useUploadImage from "@/hooks/useUploadImage";
import PreviewImageList from "./PreviewImagesList";
// import useMemberActions from "@/hooks/useMemberActions";

type Props = {
   lastMessageRef: RefObject<HTMLDivElement>;
};

export default function ChatInput({ lastMessageRef }: Props) {
   const [message, setMessage] = useState("");
   const imageInputRef = useRef<ElementRef<"input">>(null);
   const isFetching = useRef(false);

   //hooks
   const { auth } = useAuth();

   const { socket } = useSocket();
   const { sendMessage } = useMessageActions();
   const { handleInputChange, handleSendImage } = useUploadImage();
   const { sendMessageToNewConversation } = useSendMessageToNewConversation();
   const { currentConversationInStore, tempImages } = useSelector(
      selectCurrentConversation
   );

   const clear = () => setMessage("");

   const handleSendMessage = async (type: "image" | "text" | "icon") => {
      try {
         if (!socket || !auth) throw new Error("socket not found");

         if (!currentConversationInStore) {
            return sendMessageToNewConversation(message);
         }

         switch (type) {
            case "image":
               const inputEle = imageInputRef.current;
               if (!inputEle) return;

               await handleSendImage(imageInputRef.current);
               break;
            case "text":
               if (!message) return;

               const messageSchema: MessageSchema = {
                  conversation_id: currentConversationInStore.id,
                  content: message,
                  from_user_id: auth.id,
                  type: "text",
                  status: "sending",
               };

               const toUserIds = currentConversationInStore.members.map((m) => m.user_id);
               return sendMessage({ message: messageSchema, toUserIds }, {});
            case "icon":
         }
      } catch (error) {
         console.log({ message: error });
      } finally {
         clear();
         isFetching.current = false;

         lastMessageRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
         });
      }
   };

   const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Enter") {
         if (!isFetching.current) {
            isFetching.current = true;
            handleSendMessage("text");
         }
      }
   };

   const SendButton = ({
      children,
      onClick,
   }: {
      children: ReactNode;
      onClick: () => void;
   }) => {
      return (
         <Button
            className={`h-[34px] w-[34px] ml-[10px]`}
            variant={"push"}
            size={"clear"}
            colors="secondary"
            onClick={onClick}
         >
            {children}
         </Button>
      );
   };

   const renderSendButton = useMemo(() => {
      if (tempImages.length)
         return (
            <SendButton onClick={() => handleSendMessage("image")}>
               <PaperAirplaneIcon className="w-[20px]" />
            </SendButton>
         );

      if (message)
         return (
            <SendButton onClick={() => handleSendMessage("text")}>
               <PaperAirplaneIcon className="w-[20px]" />
            </SendButton>
         );

      return (
         <SendButton onClick={() => handleSendMessage("icon")}>
            <span>&#128075;</span>
         </SendButton>
      );
   }, [message, tempImages]);

   const classes = {
      container: "flex p-2 sm:p-4 border-t",
      button: "p-[4px]",
      inputContainer:
         "bg-[#f3f3f5] flex-grow ml-[10px] border-[2px] border-[#ccc] rounded-[16px] px-3",
      input: " h-[32px] bg-transparent w-full font-[500] text-[#1f1f1f]  outline-none",
   };

   return (
      <div
         className={`${classes.container} ${
            tempImages.length ? "items-end" : "items-center"
         }`}
      >
         <input
            ref={imageInputRef}
            onChange={handleInputChange}
            type="file"
            multiple
            accept="image/*"
            id="image-choose"
            className="hidden"
         />
         <Button variant={"push"} size={"clear"} colors="secondary">
            <label className="flex cursor-pointer p-[4px]" htmlFor="image-choose">
               <PhotoIcon className="w-[22px]" />
            </label>
         </Button>
         <div className="flex-grow flex">
            <div className={classes.inputContainer}>
               <PreviewImageList />

               <input
                  className={classes.input}
                  placeholder="Message..."
                  type="text"
                  disabled={!!tempImages.length}
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  onKeyUp={handleKeyUp}
               />
            </div>
         </div>

         {renderSendButton}
      </div>
   );
}
