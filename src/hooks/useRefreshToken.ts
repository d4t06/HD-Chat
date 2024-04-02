import { AuthResponse, useAuth } from "../stores/AuthContext";
import { publicRequest } from "../utils/request";

const useRefreshToken = () => {
   const { setAuth } = useAuth();

   const refresh = async () => {
      try {
         const response = await publicRequest.get("/auth/refresh");

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
