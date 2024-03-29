import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useEffect, useRef, useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { classes } from "./Login";

const USER_REGEX = /^(?=.{4,20}$)[a-zA-Z].*/;
const PWD_REGEX = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

export default function RegisterPage() {
   const userInputRef = useRef<HTMLInputElement>(null);
   const prevUser = useRef("");

   const [isFetching, setIsFetching] = useState(false);
   const [userName, setUserName] = useState("");
   const [validName, setValidName] = useState(false);

   const [password, setPassword] = useState("");
   const [validPassword, setValidPassword] = useState(false);

   const [confirmPassword, setConfirmPassword] = useState("");
   const [validConfirmPassword, setValidConfirmPassword] = useState(false);

   const [errMsg, setErrorMsg] = useState("");

   // hooks
   const navigate = useNavigate();

   const ableToSubmit = () =>
      validName && validPassword && validConfirmPassword && prevUser.current !== userName;

   const handleClear = () => {
      setUserName("");
      setPassword("");
   };

   const handleSubmit = async () => {};

   useEffect(() => {
      userInputRef.current?.focus();
   }, []);

   // validate phone number
   useEffect(() => {
      const result = USER_REGEX.test(userName);

      setValidName(result);
   }, [userName]);
   1;

   // validate password
   useEffect(() => {
      const result = PWD_REGEX.test(password);
      setValidPassword(result);
      let match = password === confirmPassword;

      if (!password) match = false;
      setValidConfirmPassword(match);
   }, [password, confirmPassword]);

   const _classes = {
      labelGroup: "flex items-center space-x-[4px]",
      checkIcon: "w-[24px] text-emerald-500",
      xIcon: "w-[24px] text-red-500",
      input: "py-[4px] rounded-[6px] border border-black/15 outline-none px-[10px]",
   };

   return (
      <div className={classes.container}>
         <form
            onSubmit={handleSubmit}
            className={`${classes.form} ${isFetching ? "opacity-60 pointer-events-none" : ""}`}
         >
            <div className="mt-0 md:mt-[-50px] text-center md:text-left space-y-[10px]">
               <h1 className="text-[26px] font-[500]">
                  My <span className="text-[#cd1818]">Chat</span>
               </h1>
               <h2 className="text-[22px]">Sign in</h2>
               {errMsg && <p className={classes.errorMessage}>{errMsg}</p>}
            </div>
            <div className={classes.right}>
               <div className={classes.inputGroup}>
                  <div className={_classes.labelGroup}>
                     <label className={classes.label} htmlFor="username">
                        Phone number
                     </label>
                     {userName && (
                        <span>
                           {validName ? (
                              <CheckIcon v-if="validName" className={_classes.checkIcon} />
                           ) : (
                              <XMarkIcon v-else className={_classes.xIcon} />
                           )}
                        </span>
                     )}
                  </div>

                  <input
                     ref={userInputRef}
                     value={userName}
                     onChange={(e) => setUserName(e.target.value)}
                     className={classes.input}
                     id="username"
                     type="text"
                  />
               </div>
               <div className={classes.inputGroup}>
                  <div className={_classes.labelGroup}>
                     <label className={classes.label} htmlFor="password">
                        Password
                     </label>
                     {password && (
                        <span>
                           {validPassword ? (
                              <CheckIcon v-if="validName" className={_classes.checkIcon} />
                           ) : (
                              <XMarkIcon v-else className={_classes.xIcon} />
                           )}
                        </span>
                     )}
                  </div>
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

               <div className={classes.inputGroup}>
                  <div className={_classes.labelGroup}>
                     <label className={classes.label} htmlFor="confirm">
                        Confirm password
                     </label>
                     {confirmPassword && (
                        <span>
                           {validConfirmPassword && validPassword ? (
                              <CheckIcon v-if="validName" className={_classes.checkIcon} />
                           ) : (
                              <XMarkIcon v-else className={_classes.xIcon} />
                           )}
                        </span>
                     )}
                  </div>
                  <input
                     className={classes.input}
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     type="text"
                     id="confirm"
                     required
                  />
               </div>

               <div className="md:text-right ">
                  <Button
                     disabled={true}
                     variant="push"
                     className="leading-[26px] w-full md:w-auto mt-[20px]"
                     type="submit"
                  >
                     Sign up
                  </Button>
                  <p className="text-[14px] mt-[20px]">
                     Already have an account ?,
                     <Link className="text-[#cd1818] hover:underline ml-[4px]" to="/login">
                        Sign in
                     </Link>
                  </p>
               </div>
            </div>
         </form>
      </div>
   );
}
