"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useCallback } from "react";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import socket from "@/socket";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  let session;
  try {
    session = useSession();
  } catch (error) {
    console.log(error);
  }
  if (session?.status === "authenticated") redirect("/dashboard");

  const [userInputs, setUserInputs] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = useCallback((e: any) => {
    const { name, value } = e.target;
    setUserInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  }, []);

  const handleLoginSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const validRegex = /^.{3,30}$/;
    const { username, password } = userInputs;

    if (!username || !password || !username.trim() || !password.trim()) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (!validRegex.test(username) || !validRegex.test(password)) {
      setError("Invalid Input. Please Try Again.");
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);
    socket.emit("tellerRefresh", { info: "Refresh Teller Data" });

    console.log(res);

    if (res?.error) {
      setError("Invalid Username Or Wrong Password.");
      return;
    }
  };

  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-blue-50/50 absolute top-0 left-0">
      <Card className="w-full max-w-md bg-white/95">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <div className="w-24 h-24">
              <Image
                src="/images/logo.png"
                width={1440}
                height={1440}
                alt="quenique-logo"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-center">
            Please enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-6"
            >
              <CardDescription className="text-red-500">
                {error}
              </CardDescription>
            </motion.div>
          )}
        </AnimatePresence>
        <CardContent>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                required
                placeholder="Enter your username"
                value={userInputs.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={userInputs.password}
                  onChange={handleInputChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              {/* <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <Button variant="link" className="px-0 text-sm">
                Forgot password?
              </Button> */}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className={`${loading ? "bg-blue-600/60" : "bg-blue-600"} w-full text-white`}
            >
              {loading ? (
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Log in"
              )}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => signIn("google", { callbackUrl: "/login" })}
              className="w-full"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Log in with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
