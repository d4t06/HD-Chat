import axios from "axios";
import { AuthResponse, useAuth } from "../stores/AuthContext";

const REFRESH_URL = "http://localhost:8080/auth/refresh";

const useRefreshToken = () => {
   const { setAuth } = useAuth();

   const refresh = async () => {
      try {
         const response = await axios.get(REFRESH_URL, {
            withCredentials: true,
         });

         setAuth(() => {
            const data = response.data.data as AuthResponse;
            return { fullName: data.userInfo.fullName, token: data.token };
         });
         return response.data.token;
      } catch (error) {
         console.log({ message: error });
      }
   };
   return refresh;
};

export default useRefreshToken;
