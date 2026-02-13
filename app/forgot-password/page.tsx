"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion } from "motion/react";
import { IconMail, IconArrowLeft } from "@tabler/icons-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");
        setMessage("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage(data.message || "Reset link sent!");
            } else {
                setStatus("error");
                setMessage(data.error || "Something went wrong.");
            }
        } catch (err) {
            setStatus("error");
            setMessage("Failed to send request. Please try again.");
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
                        Forgot Password?
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-2">
                        Enter your email to receive a password reset link
                    </p>
                </div>

                {status === "success" ? (
                    <div className="text-center space-y-4">
                        <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm">
                            {message}
                        </div>
                        <p className="text-sm text-neutral-500">
                            Check your email inbox (and spam folder) for the reset link.
                        </p>
                        <Link href="/login" className="block w-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 py-2 rounded-lg font-medium hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all">
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {status === "error" && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
                                {message}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <IconMail className="absolute left-3 top-3 text-neutral-400 h-4 w-4" />
                                <Input
                                    id="email"
                                    placeholder="farmer@example.com"
                                    type="email"
                                    className="pl-9"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white rounded-lg h-10 font-bold hover:bg-green-700 transition-all disabled:opacity-50"
                        >
                            {loading ? "Sending Link..." : "Send Reset Link"}
                        </button>

                        <div className="text-center mt-4">
                            <Link href="/login" className="flex items-center justify-center text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 gap-2">
                                <IconArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
