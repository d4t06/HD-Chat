import { ArrowPathIcon } from "@heroicons/react/24/outline";

type Default = {
   type: "default";
   message: Message;
};

type Temp = {
   type: "temp";
   message: MessageSchema;
};
export default function ImageMessage(props: Default | Temp) {
   const handleImageOnLoaded = () => {
      if (props.type === "temp") {
         if (props.message.content.includes("blob")) {
            URL.revokeObjectURL(props.message.content);
         }
      }
   };

   const renderContent = () => {
      switch (props.type) {
         case "temp":
            return (
               <div className="flex relative items-center justify-center rounded-[8px] border border-[#ccc] overflow-hidden">
                  <img
                     onLoad={handleImageOnLoaded}
                     className="opacity-[.4]"
                     src={props.message.content}
                  />
                  <ArrowPathIcon className="absolute text-[#000] w-[24px] animate-spin" />
               </div>
            );
         default:
            return (
               <div className="rounded-[8px] border border-[#ccc] overflow-hidden">
                  <img src={props.message.content} />
               </div>
            );
      }
   };

   return renderContent();
}
