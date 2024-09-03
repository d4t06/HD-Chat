import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AuthResponse, useAuth } from "../stores/AuthContext";
import { sleep } from "../utils/appHelper";

export const classes = {
   container:
      "rounded-[24px] w-[90vw] md:flex-grow md:w-auto mx-auto my-auto md:mx-[100px] bg-white p-[20px] md:px-[30px] md:pt-[calc(40px+30px+10px)]",
   form: "flex flex-col md:flex-row justify-between",
   myChat: "text-[26px] leading-[40px] font-[500]",
   right: "space-y-[16px] mt-[20px] md:mt-0",
   inputGroup: "flex flex-col space-y-[2px]",
   label: "text-[#1f1f1f]",
   input: "py-[4px] rounded-[6px] border border-black/15 outline-none px-[10px]",
   errorMessage:
      "bg-red-500/30 text-red-500 font-[500] md:mr-[14px] p-[6px] mt-[20px] rounded-[6px] inline-block",
};

const LOGIN_URL = `${import.meta.env.VITE_API_ENDPOINT || "https://chat-app-backend-latest.onrender.com"}/auth/login`;

export default function LoginPage() {
   const inputRef = useRef<HTMLInputElement>(null);

   const [isFetching, setIsFetching] = useState(false);
   const [phoneNumber, setPhoneNumber] = useState("");
   const [password, setPassword] = useState("");
   const [errMsg, setErrorMsg] = useState("");

   // hooks
   const { setAuth } = useAuth();
   const navigate = useNavigate();

   const ableToSubmit = phoneNumber && password;

   const handleSubmit = async (e: FormEvent) => {
      try {
         e.preventDefault();

         setIsFetching(true);
         setErrorMsg("");
         if (import.meta.env.DEV) await sleep(500);

         // use request with credential to make server set new cookie
         const response = await axios.post(
            LOGIN_URL,
            {
               phoneNumber,
               password,
            },
            {
               withCredentials: true,
            }
         );
         const data = response.data.data as AuthResponse;

         setAuth({
            fullName: data.userInfo.fullName,
            token: data.token,
            id: data.userInfo.id,
            last_seen: "",
         });

         return navigate("/");
      } catch (error: any) {
         console.log({ message: error });

         if (!error?.response) return setErrorMsg("No server response");
         setErrorMsg("Phone number or password invalid");
      } finally {
         setIsFetching(false);
      }
   };

   useEffect(() => {
      inputRef.current?.focus();
   }, []);

   return (
      <div className={classes.container}>
         <form
            onSubmit={handleSubmit}
            className={`${classes.form} ${
               isFetching ? "opacity-60 pointer-events-none" : ""
            }`}
         >
            <div className="mt-0 md:mt-[-50px] text-center md:text-left">
               <h1 className={classes.myChat}>
                  HD <span className="text-[#cd1818]">Chat</span>
               </h1>
               <h1 className="text-[26px] mt-[10px] text-[#1f1f1f]">Sign in</h1>
               {errMsg && <p className={classes.errorMessage}>{errMsg}</p>}
            </div>
            <div className={classes.right}>
               <div className={`${classes.inputGroup} pt-[8px]`}>
                  <label className={classes.label} htmlFor="username">
                     Phone number
                  </label>
                  <input
                     ref={inputRef}
                     className={classes.input}
                     value={phoneNumber}
                     onChange={(e) => setPhoneNumber(e.target.value)}
                     id="username"
                     type="text"
                  />
               </div>
               <div className={classes.inputGroup}>
                  <label className={classes.label} htmlFor="password">
                     Password
                  </label>
                  <input
                     className={classes.input}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     type="text"
                     id="password"
                     autoComplete="off"
                     required
                  />
               </div>

               <div className="md:text-right">
                  <Button
                     disabled={!ableToSubmit}
                     isLoading={isFetching}
                     variant="push"
                     size="clear"
                     className="h-[36px] w-full md:w-[100px] mt-[20px]"
                     type="submit"
                  >
                     Sign in
                  </Button>
                  <p className="mt-[20px]">
                     Don't have an account jet ?,
                     <Link
                        className="text-[#cd1818] hover:underline ml-[4px]"
                        to="/register"
                     >
                        Sign up
                     </Link>
                  </p>
               </div>
            </div>
         </form>
      </div>
   );
}
