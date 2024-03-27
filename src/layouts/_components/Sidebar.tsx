import { useState } from "react";
import Button from "../../components/ui/Button";
import {
   Bars3Icon,
   CheckIcon,
   MagnifyingGlassIcon,
   PlusIcon,
   XMarkIcon,
} from "@heroicons/react/24/outline";
import Modal from "../../components/Modal";

export default function Sidebar({ id: conversation_id }: { id?: string }) {
   const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

   const [newConversation, setNewConverSation] = useState<string>("");
   const [error, setError] = useState<boolean>(false);

   // const [currentConversation, setCurrentConversation] = useState<number>(0);

   const handleCloseModal = () => {
      setIsOpenModal(false);
      setNewConverSation("");
   };

   return (
      <>
         <div className="border-r h-screen overflow-hidden">
            {/* top */}
            <div className="p-4">
               {/* header */}
               <div className="flex justify-between h-12 items-center">
                  <div className="rounded-full flex-shrink-0 border-2 border-gray-200"></div>
                  <div className="flex gap-4">
                     <Button
                     // onclick={() => setIsOpenModal(true)}
                     >
                        <PlusIcon className="w-[24px]" />
                     </Button>
                     <Button>
                        <Bars3Icon className="w-[24px]" />
                     </Button>
                  </div>
               </div>

               {/* search */}
               <div className="mt-5">
                  <div className="w-full">
                     <div className="bg-slate-100 p-4 rounded-full h-12 overflow-hidden flex flex-row">
                        <Button className="bg-transparent text-xl h-full pl-3">
                           <MagnifyingGlassIcon className="w-[24px]" />
                        </Button>
                        <input
                           className="h-full flex-1 bg-transparent pl-3 outline-none"
                           placeholder="Search..."
                           type="text"
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* bottom */}
            {/*  conversation list */}
            <div className=" flex flex-col gap-2 overflow-auto p-4 h-[calc(100vh-7.25rem)] overflow-y-auto border-t border-transparent hover:border-gray-200">
               {/* {conversations?.length &&
                  conversations.map((conversation, index) => (
                     <Link href={`/conversations/${conversation.id}`} key={conversation.id}>
                        <AccountItem
                           active={conversation.id == conversation_id}
                           conversation={conversation}
                        />
                     </Link>
                  ))} */}
            </div>
         </div>

         {isOpenModal && (
            <Modal close={() => setIsOpenModal(false)}>
               <div className="p-8 w-2/5  bg-slate-200 rounded-lg flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute z-20 gap-4 items-center">
                  <h1 className="mr-auto text-2xl uppercase text-gray-800">Add new conversation</h1>
                  <div className="flex flex-row h-12 bg-slate-50 rounded-xl w-full">
                     <input
                        placeholder="Email..."
                        type="text"
                        className="px-4 flex-1 bg-transparent outline-none"
                        // value={newConversation}
                        // onChange={(e) => handleSetNewConverSation(e.target.value)}
                     />
                     <span className="bg-transparent pr-5 py-3 h-full">
                        {error ? (
                           <XMarkIcon className="w-[24px]" />
                        ) : (
                           <CheckIcon className="w-[24px]" />
                        )}
                     </span>
                  </div>
                  <div className="flex justify-end w-full">
                     <Button>Add</Button>
                  </div>
               </div>
            </Modal>
         )}
      </>
   );
}
