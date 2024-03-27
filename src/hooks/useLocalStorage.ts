import { useEffect, useState } from "react";

function useLocalStorage (key: string, initialValue: any) {
   const [value, setValue] = useState(JSON.parse(localStorage.getItem(key) || initialValue));


   useEffect(() => {
         localStorage.setItem(key, JSON.stringify(value))
   }, [value])

   return [value, setValue];
}

export default useLocalStorage;