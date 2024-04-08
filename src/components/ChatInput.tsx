import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Button from "./ui/Button";
import { FormEvent, useState } from "react";
import { useSocket } from "@/stores/SocketContext";
import { useSelector } from "react-redux";
import { selectCurrentConversation } from "@/stores/CurrentConversationSlice";
import useMessageActions from "@/hooks/useMessageActions";
import useSendMessageToNewConversation from "@/hooks/useNewConversation";
import { useAuth } from "@/stores/AuthContext";

export default function ChatInput() {
   const [message, setMessage] = useState("");

   //hooks
   const { auth } = useAuth();
   const { currentConversationInStore } = useSelector(selectCurrentConversation);
   const { socket } = useSocket();
   const { sendMessage } = useMessageActions();

   const { sendMessageToNewConversation } = useSendMessageToNewConversation();

   const clear = () => setMessage("");

   const handleSendMessage = async (e: FormEvent) => {
      e.preventDefault();
      if (!socket) return;

      if (!currentConversationInStore) {
         sendMessageToNewConversation(message);
      } else {
         if (auth) {
            const messageSchema: MessageSchema = {
               conversation_id: currentConversationInStore.id,
               content: message,
               from_user_id: auth.id,
               type: "text",
               status: "sending",
            };
            sendMessage(messageSchema, {});
         }
      }

      clear();
   };

   const classes = {
      container: "flex items-center p-2 sm:p-4 border-t",
      button: "p-[4px]",
      input: "flex-grow h-[36px] ml-[10px] font-[500] text-[#1f1f1f] border-[2px] border-[#ccc] bg-[#f3f3f5] rounded-full px-2 sm:px-4 outline-none",
   };

   return (
      <div className={classes.container}>
         <label htmlFor="image-upload">
            <Button
               className={classes.button}
               variant={"push"}
               size={"clear"}
               colors="secondary"
            >
               <PhotoIcon className="w-[22px]" />
            </Button>
         </label>
         <div className="flex-grow flex">
            <input
               className={classes.input}
               placeholder="Message..."
               type="text"
               onChange={(e) => setMessage(e.target.value)}
               value={message}
            />

            <Button
               className={`h-[34px] w-[34px] ml-[10px]`}
               variant={"push"}
               size={"clear"}
               colors="secondary"
               onClick={handleSendMessage}
            >
               {message ? (
                  <PaperAirplaneIcon className="w-[20px]" />
               ) : (
                  <span>&#128075;</span>
               )}
            </Button>
         </div>
      </div>
   );
}
