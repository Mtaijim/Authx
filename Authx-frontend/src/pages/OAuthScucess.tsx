import useAuthStore from "@/auth/store";
import { refreshToken } from "@/services/Authservice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const OAuthScucess = () => {
  const [isRefreshing, SetisRefreshing] = useState<boolean>(false);
  const ChangeLocalLoginData = useAuthStore((s) => s.changeLocalLoginData);
  const navigate = useNavigate();

  useEffect(() => {
    async function getAccessToken() {
      if (!isRefreshing) {
        SetisRefreshing(true);
        try {
          const responseLoginData = await refreshToken();
          ChangeLocalLoginData(
            responseLoginData.accessToken,
            responseLoginData.user,
            true,
          );
          toast.success("login success !!");
          navigate("/dashboard");
        } catch (error) {
          toast.error("Error while login!!");
        } finally {
          SetisRefreshing(false);
        }
      }
    }

    getAccessToken();
  }, []);

  return <div>OAuthScucess</div>;
};

export default OAuthScucess;
