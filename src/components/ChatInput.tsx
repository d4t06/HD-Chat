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
import { PaperAirplaneIcon } from "@heroicons/react/16/solid";
import { emojis } from "@/assets/emoji";
import { stickers } from "@/assets/sticker";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
// import useMemberActions from "@/hooks/useMemberActions";

type Props = {
   lastMessageRef: RefObject<HTMLDivElement>;
};

export default function ChatInput({ lastMessageRef }: Props) {
   const [message, setMessage] = useState("");
   const imageInputRef = useRef<ElementRef<"input">>(null);
   const [isFetching, setIsFetching] = useState(false);

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

   const handleSendMessage = async (type: Message["type"]) => {
      try {
         if (!socket || !auth) throw new Error("socket not found");

         let messageSchemaNoConversation: MessageSchemaNoConversation | null = null;

         setIsFetching(true);

         // init message obj
         switch (type) {
            case "text":
               if (!message) return;

               messageSchemaNoConversation = {
                  content: message,
                  from_user_id: auth.id,
                  type: "text",
                  status: "seen",
               };
               break;

            case "emoji":
               const randomEmoji = emojis[Math.ceil(Math.random() * emojis.length - 1)];

               messageSchemaNoConversation = {
                  content: randomEmoji,
                  from_user_id: auth.id,
                  type: "emoji",
                  status: "seen",
               };

               break;

            case "sticker":
               const randomSticker =
                  stickers[Math.ceil(Math.random() * stickers.length - 1)];

               messageSchemaNoConversation = {
                  content: randomSticker,
                  from_user_id: auth.id,
                  type: "sticker",
                  status: "seen",
               };
         }

         if (!messageSchemaNoConversation) throw new Error("message schema not found");

         // if new conversation
         if (!currentConversationInStore) {
            await sendMessageToNewConversation(messageSchemaNoConversation);
            return;
         }

         // send message
         switch (type) {
            case "image":
               const inputEle = imageInputRef.current;
               if (!inputEle) return;

               await handleSendImage(imageInputRef.current);

               break;
            case "text":
            case "emoji":
            case "system-log":
            case "sticker":
               const messageSchema: MessageSchema = {
                  ...messageSchemaNoConversation,
                  conversation_id: currentConversationInStore.conversation.id,
               };

               const toUserIds = currentConversationInStore.conversation.members.map(
                  (m) => m.user_id
               );

               await sendMessage({ message: messageSchema, toUserIds });
         }
      } catch (error) {
         console.log({ message: error });
      } finally {
         clear();
         setIsFetching(false);

         lastMessageRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
         });
      }
   };

   const handleKeyUp = (e: KeyboardEvent) => {
      if (isFetching) return;
      if (e.code === "Enter") {
         handleSendMessage("text");
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
            disabled={isFetching}
         >
            {children}
         </Button>
      );
   };

   const renderSendButton = useMemo(() => {
      if (isFetching)
         return (
            <SendButton onClick={() => {}}>
               <ArrowPathIcon className="w-[20px] animate-spin text-[#cd1818]" />
            </SendButton>
         );
      if (tempImages.length)
         return (
            <SendButton onClick={() => handleSendMessage("image")}>
               <PaperAirplaneIcon className="text-[#cd1818] w-[20px]" />
            </SendButton>
         );

      if (message)
         return (
            <SendButton onClick={() => handleSendMessage("text")}>
               <PaperAirplaneIcon className="text-[#cd1818] w-[20px]" />
            </SendButton>
         );

      return (
         <SendButton onClick={() => handleSendMessage("emoji")}>
            <svg height="28px" viewBox="0 0 36 36" width="28px">
               <path
                  clip-rule="evenodd"
                  d="M18 29c6.075 0 11-4.925 11-11S24.075 7 18 7 7 11.925 7 18s4.925 11 11 11zm-5.25-13c0-1.25.563-2 1.5-2 .938 0 1.5.75 1.5 2s-.563 2-1.5 2c-.938 0-1.5-.75-1.5-2zm7.5 0c0-1.25.563-2 1.5-2 .938 0 1.5.75 1.5 2s-.563 2-1.5 2c-.938 0-1.5-.75-1.5-2zm-7.52 5.464a1 1 0 011.41-.12 5.963 5.963 0 003.856 1.406c1.47 0 2.813-.528 3.856-1.406a1 1 0 111.288 1.53 7.962 7.962 0 01-5.144 1.876 7.962 7.962 0 01-5.144-1.877 1 1 0 01-.121-1.409z"
                  fill="#cd1818"
                  fillRule="evenodd"
               ></path>
            </svg>
         </SendButton>
      );
   }, [message, tempImages, isFetching]);

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
         <Button
            onClick={() => handleSendMessage("sticker")}
            variant={"push"}
            size={"clear"}
            colors="secondary"
         >
            <svg height="28px" viewBox="0 0 36 36" width="28px">
               <path
                  d="M8 12a4 4 0 014-4h12a4 4 0 014 4v5a1 1 0 01-1 1h-3a6 6 0 00-6 6v3a1 1 0 01-1 1h-5a4 4 0 01-4-4V12z"
                  fill="#cd1818"
               ></path>
               <path
                  d="M20 27c0 .89 1.077 1.33 1.707.7l5.993-5.993c.63-.63.19-1.707-.7-1.707h-3a4 4 0 00-4 4v3z"
                  fill="#cd1818"
               ></path>
            </svg>
         </Button>
         <Button className="ml-[6px]" variant={"push"} size={"clear"} colors="secondary">
            <label className="flex cursor-pointer" htmlFor="image-choose">
               <svg height="28px" viewBox="0 0 36 36" width="28px">
                  <path d="M13.5 16.5a2 2 0 100-4 2 2 0 000 4z" fill="#cd1818"></path>
                  <path
                     clipRule="evenodd"
                     d="M7 12v12a4 4 0 004 4h14a4 4 0 004-4V12a4 4 0 00-4-4H11a4 4 0 00-4 4zm18-1.5H11A1.5 1.5 0 009.5 12v9.546a.25.25 0 00.375.217L15 18.803a6 6 0 016 0l5.125 2.96a.25.25 0 00.375-.217V12a1.5 1.5 0 00-1.5-1.5z"
                     fill="#cd1818"
                     fillRule="evenodd"
                  ></path>
               </svg>
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
