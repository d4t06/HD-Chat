import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { FormEvent, useEffect, useRef, useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { classes } from "./Login";
import { publicRequest } from "../utils/request";
import { sleep } from "../utils/appHelper";

const REGISTER_URL = "/auth/register";

// const USER_REGEX = /^(?=.{4,20}$)[a-zA-Z].*/;
const PWD_REGEX = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

export default function RegisterPage() {
   const inputRef = useRef<HTMLInputElement>(null);
   const prevUser = useRef("");

   const [isFetching, setIsFetching] = useState(false);
   const [phoneNumber, setPhoneNumber] = useState("");
   const [validPhoneNumber, setValidPhoneNumber] = useState(false);

   const [fullName, setFullName] = useState("");
   const [isBlurFullName, setIsBlurredFullName] = useState(false);
   const [validFullName, setValidFullName] = useState(false);

   const [password, setPassword] = useState("");
   const [validPassword, setValidPassword] = useState(false);

   const [confirmPassword, setConfirmPassword] = useState("");
   const [validConfirmPassword, setValidConfirmPassword] = useState(false);

   const [errMsg, setErrorMsg] = useState("");

   // hooks
   const navigate = useNavigate();

   const ableToSubmit =
      validPhoneNumber && validPassword && validConfirmPassword && prevUser.current !== phoneNumber;

   const checkPhoneNumber = () => {
      if (phoneNumber.charAt(0) !== "0" || phoneNumber.length !== 10) return false;
      return true;
   };

   const handleSubmit = async (e: FormEvent) => {
      try {
         e.preventDefault();
         setIsFetching(true);
         setErrorMsg("")

         if (import.meta.env.DEV) await sleep(1000);
         await publicRequest.post(REGISTER_URL, {
            fullName,
            password,
            phoneNumber,
         });

         navigate("/login");
      } catch (error: any) {
         if (!error?.response) {
            setErrorMsg("No server response");
         } else if (error?.response.status === 409) {
            setErrorMsg("This phone number already used, please use another instead");
         } else {
            setErrorMsg("Register fail");
         }
      } finally {
         setIsFetching(false);
      }
   };

   useEffect(() => {
      inputRef.current?.focus();
   }, []);

   // validate full name
   useEffect(() => {
      if (!fullName) return setValidFullName(false);
      else return setValidFullName(true);
   }, [fullName]);

   // validate phone number
   useEffect(() => {
      const result = checkPhoneNumber();
      setValidPhoneNumber(result);
   }, [phoneNumber]);

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
                     <label className={classes.label} htmlFor="fullName">
                        Display name
                     </label>

                     {isBlurFullName && (
                        <span>
                           {validFullName ? (
                              <CheckIcon className={_classes.checkIcon} />
                           ) : (
                              <XMarkIcon className={_classes.xIcon} />
                           )}
                        </span>
                     )}
                  </div>

                  <input
                     ref={inputRef}
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                     className={classes.input}
                     onBlur={() => setIsBlurredFullName(true)}
                     id="fullName"
                     type="text"
                  />
               </div>
               <div className={classes.inputGroup}>
                  <div className={_classes.labelGroup}>
                     <label className={classes.label} htmlFor="username">
                        Phone number
                     </label>
                     {phoneNumber && (
                        <span>
                           {validPhoneNumber ? (
                              <CheckIcon className={_classes.checkIcon} />
                           ) : (
                              <XMarkIcon className={_classes.xIcon} />
                           )}
                        </span>
                     )}
                  </div>

                  <input
                     value={phoneNumber}
                     onChange={(e) => setPhoneNumber(e.target.value)}
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
                              <CheckIcon className={_classes.checkIcon} />
                           ) : (
                              <XMarkIcon className={_classes.xIcon} />
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
                              <CheckIcon className={_classes.checkIcon} />
                           ) : (
                              <XMarkIcon className={_classes.xIcon} />
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
                     disabled={!ableToSubmit}
                     isLoading={isFetching}
                     variant="push"
                     size="clear"
                     className="h-[36px] w-full md:w-[100px] mt-[20px]"
                     type="submit"
                  >
                     Sign up
                  </Button>
                  <p className="mt-[20px]">
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
