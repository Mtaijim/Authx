import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, User, Loader2 } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { useState } from "react";
import { toast as Toast } from "react-hot-toast";
import type { FormData as RegisterFormData } from "../models/FormData.ts";
import { registerUser } from "../services/Authservice.ts";
import { useNavigate } from "react-router";
import OAuthButtons from "@/components/OAuthButtons.tsx";

export default function SignUp() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    const updatedFormData = {
      ...formData,
      [id]: value,
    };

    setFormData(updatedFormData);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields.");
      Toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      Toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    try {
      const response = await registerUser(formData);
      console.log("User registered successfully:", response);
      Toast.success("User registered successfully!");
      setFormData({ name: "", email: "", password: "" });
      navigate("/check-email", { state: { email: formData.email } });
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "An error occurred during registration.";

      setError(message);
      Toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.15),transparent_40%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-border bg-card/70 backdrop-blur-xl shadow-2xl">
          <CardContent className="p-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
            </div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold tracking-tight">
                Create Your AuthX Account
              </h1>

              <p className="mt-3 text-muted-foreground">
                Secure authentication for modern applications. Sign up with
                email or continue with your preferred provider.
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="mt-8 space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-10"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  {/* Email Input Field */}
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
              {/* Error Message */}
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="h-px flex-1 bg-border" />

                <span className="text-xs font-medium tracking-wider text-muted-foreground">
                  OR CONTINUE WITH
                </span>

                <div className="h-px flex-1 bg-border" />
              </div>

              {/* OAuth */}
              <OAuthButtons />

              {/* Login Link */}
              <p className="pt-4 text-center  text-sm text-muted-foreground">
                Already have an account?
                <span
                  onClick={() =>
                    navigate("/check-email", {
                      state: { email: formData.email },
                    })
                  }
                  className="ml-1 cursor-pointer font-medium text-primary hover:underline"
                >
                  Sign in
                </span>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
