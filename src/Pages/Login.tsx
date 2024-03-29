import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { FormEvent, useEffect, useRef, useState } from "react";

export const classes = {
   container:
      "rounded-[24px] w-[90vw] md:flex-grow md:w-auto mx-auto my-auto md:mx-[100px] bg-white p-[20px] md:px-[30px] md:pt-[calc(40px+30px+10px)]",
   form: "flex flex-col md:flex-row justify-between",
   myChat: "text-[26px] leading-[40px] font-[500]",
   right: "space-y-[16px] mt-[20px] md:mt-0",
   inputGroup: "flex flex-col space-y-[2px]",
   label: "text-[14px] text-[#1f1f1f]",
   input: "py-[4px] rounded-[6px] border border-black/15 outline-none px-[10px]",
   errorMessage: "bg-red-500/30 text-red-500 p-[6px] rounded-[6px] inline-block",
};

export default function LoginPage() {
   const userInputRef = useRef<HTMLInputElement>(null);

   const [isFetching, setIsFetching] = useState(false);
   const [userName, setUserName] = useState("");
   const [password, setPassword] = useState("");
   const [errMsg, setErrorMsg] = useState("");

   const ableToSubmit = userName && password;

   const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      console.log("submit");
   };

   useEffect(() => {
      userInputRef.current?.focus();
   }, []);

   return (
      <div className={classes.container}>
         <form
            onSubmit={handleSubmit}
            className={`${classes.form} ${false ? "opacity-60 pointer-events-none" : ""}`}
         >
            <div className="mt-0 md:mt-[-50px] text-center md:text-left">
               <h1 className={classes.myChat}>
                  My <span className="text-[#cd1818]">Chat</span>
               </h1>
               <h1 className="text-[26px] mt-[10px] text-[#1f1f1f]">Sign in</h1>
               {errMsg && <p className={classes.errorMessage}>{errMsg}</p>}
            </div>
            <div className={classes.right}>
               <div className={`${classes.inputGroup} pt-[8px]`}>
                  <label className={classes.label} htmlFor="username">
                     Username
                  </label>
                  <input
                     ref={userInputRef}
                     className={classes.input}
                     value={userName}
                     onChange={(e) => setUserName(e.target.value)}
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
               <div className="">
                  <input type="checkbox" id="persist" />
                  <label className="ml-[8px] text-[14px]" htmlFor="persist">
                     Trust this device :v ?
                  </label>
               </div>

               <div className="md:text-right">
                  <Button
                     disabled={!ableToSubmit}
                     variant="push"
                     className="leading-[26px] w-full md:w-auto mt-[20px]"
                     type="submit"
                  >
                     Sign in
                  </Button>
                  <p className="text-[14px] mt-[20px]">
                     Don't have an account jet ?,
                     <Link className="text-[#cd1818] hover:underline ml-[4px]" to="/register">
                        Sign up
                     </Link>
                  </p>
               </div>
            </div>
         </form>
      </div>
   );
}
