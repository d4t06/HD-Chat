import { Bars3Icon, CameraIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Button from "./ui/Button";

type Props = {
   conversation: string;
   messages: string;
};

export default function ChatScreen(props: Props) {
   return (
      <div className="h-screen overflow-hidden relative">
         {/* top */}
         <div className="p-4 border-b">
            <div className="flex flex-row justify-between h-12 items-center ">
               {/* {conversation && <AccountItem chatScreen conversation={conversationParsed} />} */}
               <div className="flex gap-4">
                  <Button>
                     <CameraIcon className="w-[24px]" />
                  </Button>
                  <Button>
                     <Bars3Icon className="w-[24px]" />
                  </Button>
               </div>
            </div>
         </div>

         {/* main content */}
         <div className="h-[calc(100vh-10rem)] p-4 overflow-auto flex flex-col gap-10">
            {/* {renderMessage()} */}
         </div>

         {/* chat input */}
         <div className="p-4 border-t absolute bottom-0 left-0 right-0 z-10 bg-white">
            <div className="h-12 flex flex-row items-center gap-4">
               <Button>
                <PhotoIcon className="w-[24px]" />
               </Button>
               <input
                  className="h-full flex-1 bg-gray-100 rounded-full pl-3 outline-none"
                  placeholder="Message..."
                  type="text"
                //   value={inputValue}
                //   onChange={(e) => setInputValue(e.target.value)}
                //   onKeyDown={(e) => handleSendMessage(e)}
                  // value={mess}
               />
               <Button>
                  <span>&#128075;</span>
               </Button>
            </div>
         </div>
      </div>
   );
}
