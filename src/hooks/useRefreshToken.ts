import axios from "axios";
import { AuthResponse, useAuth } from "../stores/AuthContext";

const REFRESH_URL = "http://localhost:8080/auth/refresh";

const useRefreshToken = () => {
   const { setAuth } = useAuth();

   const refresh = async () => {
      try {
         console.log(">>> api refresh token");
         const response = await axios.get(REFRESH_URL, {
            withCredentials: true,
         });

         const data = response.data.data as AuthResponse;

         setAuth({
            fullName: data.userInfo.fullName,
            id: data.userInfo.id,
            token: data.token,
            last_seen: "",
         });

         return data.token;
      } catch (error) {
         console.log({ message: error });
      }
   };
   return refresh;
};

export default useRefreshToken;
