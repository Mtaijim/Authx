import { motion } from "framer-motion";
import { Lock, Mail } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Alert, AlertTitle } from "../components/ui/alert";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import { useState } from "react";
import type { LoginData } from "../models/LoginData.ts";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Spinner } from "@/components/ui/spinner.tsx";
import useAuthStore from "@/auth/store.ts";
import toast from "react-hot-toast";
import OAuthButtons from "@/components/OAuthButtons.tsx";

const Login = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const login = useAuthStore((state) => state.login);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    setLoginData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    if (!loginData.email || !loginData.password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
    try {
      // console.log("Sending:", loginData);
      const response = await login(loginData);
      if (response.mfaRequired && response.mfaToken) {
        navigate("/mfa/verify", { state: { mfaToken: response.mfaToken } });
        return;
      }

      if (response.requiresVerification) {
        navigate("/auth/verify-risk", { state: { email: loginData.email } });
        return;
      }

      toast.success("Login successfull !");

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error logging in:", error);
      const status = error.response?.status;
      if (status === 401) {
        setError("Invalid email or password.");

        return;
      }

      if (status === 429) {
        setError(
          "Too many login attempts. Please wait 15 minutes before trying again.",
        );
        return;
      }

      if (status === 403) {
        setError("Your account is locked. please verify your email ");
        return;
      }

      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log(loginData);
  }, [loginData]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card/70 backdrop-blur-xl border-border shadow-2xl rounded-2xl p-6">
          <CardContent>
            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-center"
            >
              Welcome Back
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-muted-foreground mt-2"
            >
              Login to access your authentication app
            </motion.p>

            {/* error section */}
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}

            {/* Form */}
            <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    name="email"
                    value={loginData.email}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    name="password"
                    value={loginData.password}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer rounded-2xl text-lg"
              >
                {loading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Logging in..." : "Login"}
              </Button>
              {/* Divider */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-[1px] bg-border"></div>
                <span className="text-muted-foreground text-sm">OR</span>
                <div className="flex-1 h-[1px] bg-border"></div>
              </div>
              {/* OAuth Buttons */}
              <OAuthButtons />
              {/* forget password  */}
              <div className="flex justify-start">
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-primary cursor-pointer hover:underline"
                >
                  Forgot password?
                </span>
              </div>{" "}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
