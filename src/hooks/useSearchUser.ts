import {
   DOMAttributes,
   Dispatch,
   HTMLAttributes,
   InputHTMLAttributes,
   SetStateAction,
   useEffect,
   useState,
} from "react";
import useDebounce from "./useDebounce";
import usePrivateRequest from "./usePrivateRequest";
import { sleep } from "@/utils/appHelper";

type Props = {
   setResult: Dispatch<SetStateAction<User[]>>;
};
export default function useSearchUser({ setResult }: Props) {
   const [isFetching, setIsFetching] = useState(false);
   const [phoneNumber, setPhoneNumber] = useState("");

   // hooks
   const q = useDebounce(phoneNumber, 800);
   const privateRequest = usePrivateRequest();

   const getUsers = async (controller: AbortController) => {
      try {
         setIsFetching(true);
         if (import.meta.env.DEV) await sleep(500);

         const res = await privateRequest.get(`/users/search?q=${q}`, {
            signal: controller.signal,
         });
         const data = res.data.data as User[];

         if (data) setResult(data);
      } catch (error) {
      } finally {
         setIsFetching(false);
      }
   };

   const handleClear = () => {
      setResult([]);
      setPhoneNumber("");
   };

   // tracking debounce value change
   useEffect(() => {
      const controller = new AbortController();
      if (!q) return;

      getUsers(controller);

      return () => {
         controller.abort();
      };
   }, [q]);

   const inputAttrs: InputHTMLAttributes<HTMLInputElement> = {
      onChange: (e) => setPhoneNumber((e.target as HTMLInputElement).value),
      value: phoneNumber,
   };

   return { isFetching, inputAttrs, phoneNumber, handleClear };
}
