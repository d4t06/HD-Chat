import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Button from "./ui/Button";
import { Dispatch, FormEvent, useState } from "react";
import { useSocket } from "@/stores/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentConversation } from "@/stores/CurrentConversationSlice";
import useMessageActions from "@/hooks/useMessageActions";
import useConversationActions from "@/hooks/useConversationActions";

// type Props = {
//    isNewConversation: boolean;
//    setMessages: Dispatch<SetStateAction<Message[]>>;
// };

export default function ChatInput() {
   const [message, setMessage] = useState("");

   //hooks
   const dispatch = useDispatch();
   const { currentConversationInStore, messages, tempUser } =
      useSelector(selectCurrentConversation);
   const { socket } = useSocket();
   const {sendMessage} = useMessageActions()
   const {createConversation} =useConversationActions()

   const clear = () => setMessage("");

   const handleSendMessage = async (e: FormEvent) => {
      e.preventDefault();
      if (!socket) return;

      // 
      if (!currentConversationInStore && tempUser) {

      }

      socket.send(JSON.stringify({ name: "asdf", content: message }));
      clear();
   };

   const classes = {
      container: "flex items-center p-2 sm:p-4 border-t",
      button: "p-[4px]",
      input: "flex-grow h-[36px] ml-[10px] font-[500] text-[#1f1f1f] border-[2px] border-[#ccc] bg-[#f3f3f5] rounded-full px-2 sm:px-4 outline-none",
   };

   return (
      <div className={classes.container}>
         <Button className={classes.button} variant={"push"} size={"clear"} colors="secondary">
            <PhotoIcon className="w-[22px]" />
         </Button>
         <form className="flex-grow flex" action="" onSubmit={handleSendMessage}>
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
               type="submit"
            >
               {message ? <PaperAirplaneIcon className="w-[20px]" /> : <span>&#128075;</span>}
            </Button>
         </form>
      </div>
   );
}
