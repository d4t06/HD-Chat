type Props = {
   active?: boolean;
   conversation: { users: string[] };
   chatScreen?: boolean;
   onClick?: () => void;
};

export default function AccountItem({ active, chatScreen, conversation, onClick }: Props) {
   return (
      <div
         className={`cursor-pointer flex flex-row items-center ${
            chatScreen ? "px-2 py-1 w-fit" : "w-full p-3"
         } rounded-lg hover:bg-slate-100 ${active ? "bg-slate-100" : ""}`}
      >
         <div className="h-[3rem] w-[3rem] bg-gray-300 rounded-full text-center flex-shrink-0">
            <span className="text-2xl text-white leading-[3rem]">{"huudat0123460"?.charAt(0)}</span>
         </div>

         <div className="ml-4">
            <h3 className={`text-md`}>
               huudat0123460@gmail.com
            </h3>

            {!chatScreen ? (
               <p className="text-sm mt-1 text-gray-500">Da gui mot anh</p>
            ) : (
               <p className="text-md mt-1 text-gray-500">1 hours ago</p>
            )}
         </div>
      </div>
   );
}
