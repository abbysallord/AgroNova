"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"Farmer" | "User">("Farmer");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const fullName = `${firstName} ${lastName}`;
      const success = await register(fullName, email, password, role);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto rounded-2xl p-8 shadow-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800"
      >
        <div className="text-center mb-8">
          <h2 className="font-bold text-3xl text-neutral-800 dark:text-neutral-200">
            Join AgroNova
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-2">
            Start your smart farming journey today
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstname">First name</Label>
              <Input
                id="firstname"
                placeholder="Ramesh"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Last name</Label>
              <Input
                id="lastname"
                placeholder="Kumar"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="farmer@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 focus:outline-none"
              >
                {showPassword ? (
                  <IconEyeOff className="h-4 w-4" />
                ) : (
                  <IconEye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>I am a...</Label>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setRole("Farmer")}
                className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${role === "Farmer" ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-neutral-200 dark:border-neutral-800 hover:border-green-200"}`}
              >
                <span className="text-2xl mb-2">🌾</span>
                <span className={`font-semibold ${role === "Farmer" ? "text-green-700 dark:text-green-400" : "text-neutral-600 dark:text-neutral-400"}`}>Farmer</span>
              </div>
              <div
                onClick={() => setRole("User")}
                className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${role === "User" ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-neutral-200 dark:border-neutral-800 hover:border-green-200"}`}
              >
                <span className="text-2xl mb-2">🛒</span>
                <span className={`font-semibold ${role === "User" ? "text-green-700 dark:text-green-400" : "text-neutral-600 dark:text-neutral-400"}`}>Consumer</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg h-10 font-medium hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-green-500/20"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
            Already have an account?{" "}
            <Link href="/login" className="text-green-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-center">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
