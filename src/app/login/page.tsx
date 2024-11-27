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

  const handleInputChange = useCallback((e: any) => {
    const { name, value } = e.target;
    setUserInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  }, []);

  const handleLoginSubmit = useCallback(
    async (e: any) => {
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

      if (res?.error) {
        setError("Invalid Username Or Wrong Password.");
        return;
      }
    },
    [userInputs]
  );

  return (
    <div className="flex h-[70dvh] sm:h-[100dvh] w-full items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your username and password.</CardDescription>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardDescription className="text-red-400">
                  {error}
                </CardDescription>
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3" onSubmit={handleLoginSubmit}>
            <div className="w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
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
            </div>
            <div className="w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  required
                  placeholder="Enter your password"
                  value={userInputs.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="submit"
                disabled={loading}
                className={`${loading ? "bg-primary/60" : "bg-primary"} w-1/3`}
              >
                {loading ? (
                  <svg
                    className="-ml-1 h-5 w-5 animate-spin text-white"
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
                  <p>Login</p>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => signIn("google", { callbackUrl: "/login" })}
                className="flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="24x"
                  height="24x"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                Google
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
