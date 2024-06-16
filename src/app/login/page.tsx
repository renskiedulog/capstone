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

      const validRegex = /^[a-zA-Z0-9]{3,30}$/;
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

      if (res?.error) {
        setError("Invalid Username Or Wrong Password.");
        return;
      }
    },
    [userInputs]
  );

  return (
    <div className="flex h-screen w-full items-center justify-center">
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
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Name</Label>
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
            <div className="grid w-full items-center gap-4">
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
              <a href="#" className="opacity-70 text-sm hover:opacity-100">
                Forgot password?
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
