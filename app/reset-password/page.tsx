"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion } from "motion/react";
import { IconLock, IconEye, IconEyeOff } from "@tabler/icons-react";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");
        setMessage("");

        if (password !== confirmPassword) {
            setStatus("error");
            setMessage("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setStatus("error");
            setMessage("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }

        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing token.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage("Password reset successfully! Redirecting...");
                setTimeout(() => router.push("/login"), 3000);
            } else {
                setStatus("error");
                setMessage(data.error || "Failed to reset password.");
            }
        } catch (err) {
            setStatus("error");
            setMessage("Failed to send request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center text-red-500">
                Invalid request. Missing reset token.
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            {status === "error" && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
                    {message}
                </div>
            )}
            {status === "success" && (
                <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg text-center font-medium">
                    {message}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                    <IconLock className="absolute left-3 top-3 text-neutral-400 h-4 w-4" />
                    <Input
                        id="password"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        className="pl-9 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 focus:outline-none"
                    >
                        {showPassword ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                    <IconLock className="absolute left-3 top-3 text-neutral-400 h-4 w-4" />
                    <Input
                        id="confirmPassword"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        className="pl-9"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || status === "success"}
                className="w-full bg-green-600 text-white rounded-lg h-10 font-bold hover:bg-green-700 transition-all disabled:opacity-50"
            >
                {loading ? "Resetting..." : "Reset Password"}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
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
                        Reset Password
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-2">
                        Enter your new password below
                    </p>
                </div>

                <Suspense fallback={<div>Loading...</div>}>
                    <ResetPasswordContent />
                </Suspense>
            </motion.div>
        </div>
    );
}
