import { Bars3Icon, CameraIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Button from "./ui/Button";
import AvatarPlaceholder from "./Avatar";
import AccountItem from "./AccountItem";
import { useEffect } from "react";
import { io } from "socket.io-client";

type Props = {};

export default function ChatScreen(props: Props) {
   const classes = {
      container: "h-screen overflow-hidden relative",
      button: "p-[4px]",
      chatBarContainer: "p-2 sm:p-4 border-t absolute bottom-0 left-0 right-0 z-10 bg-white",
   };

   useEffect(() => {
      const socket = io("http://localhost:8080", {path: '/websocket'});
      console.log(socket);
   }, []);

   return (
      <div className={classes.container}>
         {/* top */}
         <div className="px-4 py-2">
            <div className="flex flex-row justify-between h-12 items-center ">
               <AccountItem type="default" fullName={"Admin"} size="small" desc="1 hour ago" />
               <div className="flex">
                  <Button
                     className={classes.button + " ml-[10px]"}
                     variant={"push"}
                     size={"clear"}
                     colors="secondary"
                  >
                     <Bars3Icon className="w-[22px]" />
                  </Button>
               </div>
            </div>
         </div>

         {/* main content */}
         <div className="h-[calc(100vh-10rem)] p-4 overflow-auto flex flex-col gap-10">
            {/* {renderMessage()} */}
         </div>

         {/* chat input */}
         <div className={classes.chatBarContainer}>
            <div className="flex items-center">
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
                  //   value={inputValue}
                  //   onChange={(e) => setInputValue(e.target.value)}
                  //   onKeyDown={(e) => handleSendMessage(e)}
                  // value={mess}
               />

               <Button
                  className={`h-[34px] w-[34px] ml-[10px]`}
                  variant={"push"}
                  size={"clear"}
                  colors="secondary"
               >
                  <span>&#128075;</span>
               </Button>
            </div>
         </div>
      </div>
   );
}
