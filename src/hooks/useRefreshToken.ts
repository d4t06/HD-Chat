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

         const data = response.data.data as AuthResponse;


         console.log('use refresh set auth');
         
         setAuth({
            fullName: data.userInfo.fullName,
            id: data.userInfo.id,
            token: data.token,
         });
         return response.data.token;
      } catch (error) {
         console.log({ message: error });
      }
   };
   return refresh;
};

export default useRefreshToken;
