import searchEmpty from "@/assets/search-empty.png"

export default function SearchNotFound  () {

   return (
      <div className="text-center">
         <img src={searchEmpty} className="w-[100px] mx-auto" alt="" />
         <p className="mt-[10px]">No result found, meow</p>
      </div>
   )
}