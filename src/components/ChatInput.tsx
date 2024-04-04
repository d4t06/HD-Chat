import { PaperAirplaneIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Button from "./ui/Button";
import { useState } from "react";
import { useSocket } from "@/stores/SocketContext";

export default function ChatInput() {
   const [message, setMessage] = useState("");

   //    hooks
   const { socket } = useSocket();

   const handleSendMessage = async () => {

      console.log('chec socket', socket)

      if (!socket) return;

      console.log("sent");
      socket.send("asdfjaksjdf")

   };

   const classes = {
      container: "flex items-center p-2 sm:p-4 border-t",
      button: "p-[4px]",
   };

   return (
      <div className={classes.container}>
         <Button
            className={classes.button}
            variant={"push"}
            size={"clear"}
            colors="secondary"
         >
            <PhotoIcon className="w-[22px]" />
         </Button>
         <input
            className="h-[36px] ml-[10px] flex-grow border-[2px] border-[#ccc] bg-[#f3f3f5] rounded-full px-2 sm:px-4 outline-none"
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
   );
}
