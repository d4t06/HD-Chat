import { useState } from "react";
import Button from "../../components/ui/Button";
import { CheckIcon, MagnifyingGlassIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Modal from "../../components/Modal";
import AccountItem from "../../components/AccountItem";
import { Link } from "react-router-dom";
import { useAuth } from "@/stores/AuthContext";

export default function Sidebar({ id: conversation_id }: { id?: string }) {
   const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

   const [newConversation, setNewConverSation] = useState<string>("");
   const [error, setError] = useState<boolean>(false);

   // const [currentConversation, setCurrentConversation] = useState<number>(0);

   // hooks
   const { auth, loading } = useAuth();

   const handleCloseModal = () => {
      setIsOpenModal(false);
      setNewConverSation("");
   };

   const classes = {
      container: "w-[70px] sm:w-[360px] flex-shrink-0 border-r h-screen overflow-hidden",
      button: "p-[4px]",
      header: "flex justify-center sm:justify-between items-center",
      searchContainer: "pl-[10px] bg-[#f3f3f5] border-[2px] border-[#ccc] rounded-[99px] flex",
      input: "h-[34px] pl-[10px] flex-1 bg-transparent outline-none",
      conversationList: "flex flex-col h-[calc(100vh-7.25rem)] overflow-y-auto no-scrollbar",
   };

   return (
      <>
         <div className={classes.container}>
            {/* top */}
            <div className="px-2 sm:px-4 pt-2 sm:pb-[16px]">
               {/* header */}
               <div className={classes.header}>
                  {loading ? (
                     <AccountItem type="loading" />
                  ) : (
                     <>
                        {auth && (
                           <AccountItem active={true} type="default" fullName={auth.fullName} />
                        )}
                     </>
                  )}
                  <div className="hidden sm:flex">
                     <Button
                        className={classes.button}
                        variant={"push"}
                        size={"clear"}
                        colors="secondary"
                     >
                        <PlusIcon className="w-[22px]" />
                     </Button>
                  </div>
               </div>

               {/* search */}
               <div className="mt-[16px] hidden sm:block">
                  <div className={classes.searchContainer}>
                     <div className="flex items-center">
                        <MagnifyingGlassIcon className="w-[24px]" />
                     </div>
                     <input className={classes.input} placeholder="Search..." type="text" />
                  </div>
               </div>

               <div className="mt-[14px] pt-[14px] border-t sm:hidden"></div>
            </div>

            {/*  conversation list */}
            <div className={classes.conversationList}>
               {[...Array(2).keys()].map((key) => (
                  <Link key={key} to={`/conversation/admin`} className={`hover:bg-[#f3f3f5] p-2 sm:px-4`}>
                     {loading ? (
                        <AccountItem type="loading" />
                     ) : (
                        <>
                           {auth && (
                              <AccountItem active={false} type="default" fullName={auth.fullName} />
                           )}
                        </>
                     )}{" "}
                  </Link>
               ))}
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
