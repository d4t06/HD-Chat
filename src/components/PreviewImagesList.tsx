import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Empty from "./ui/Empty";
import { useDispatch, useSelector } from "react-redux";
import {
   selectCurrentConversation,
   storingTempImages,
} from "@/stores/CurrentConversationSlice";

export default function PreviewImageList() {
   const dispatch = useDispatch();

   const { tempImages } = useSelector(selectCurrentConversation);

   const handleRemoveImage = (index: number) => {
      const newTempImages = [...tempImages];
      const deleteImages = newTempImages.splice(index, 1);

      for (const image of deleteImages) {
         URL.revokeObjectURL(image.image_url);
      }

      dispatch(storingTempImages({ tempImages: newTempImages }));
   };

   return (
      <>
         {!!tempImages.length && (
            <div className="flex mx-[-8px] py-[20px]">
               <>
                  {tempImages.map((i, index) => (
                     <div key={index} className="w-1/6 px-[8px]">
                        <Empty>
                           <img
                              className="object-cover object-center h-full rounded-[14px]"
                              src={i.image_url}
                              alt=""
                           />
                           <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute right-0 top-0 translate-x-[30%] translate-y-[-30%] flex items-center justify-center p-[4px] bg-[#fff] border border-black/15 rounded-[99px]"
                           >
                              <XMarkIcon className="w-[20px]" />
                           </button>
                        </Empty>
                     </div>
                  ))}
               </>

               <div className="w-1/6 px-[8px]">
                  <Empty className="bg-white overflow-hidden hover:opacity-80">
                     <label
                        htmlFor="image-choose"
                        className="cursor-pointer w-full h-full flex items-center justify-center"
                     >
                        <PlusIcon className="w-[22px]" />
                     </label>
                  </Empty>
               </div>
            </div>
         )}
      </>
   );
}
