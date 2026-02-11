"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { IconMail, IconLock, IconShieldCheck, IconEye, IconEyeOff } from "@tabler/icons-react";

export default function LoginPage() {
    const router = useRouter();
    const { login, sendOtp, verifyOtp } = useAuth();

    const [mode, setMode] = useState<"otp" | "password">("otp");
    const [step, setStep] = useState<"email" | "verify">("email");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState("");

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const code = await sendOtp(email);
            alert(`Verification Code: ${code}`); // Demo only
            setStep("verify");
        } catch (err: any) {
            setError(err.message || "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const success = await verifyOtp(email, otp);
            if (success) {
                router.push("/dashboard");
            } else {
                setError("Invalid OTP. Please check the code.");
            }
        } catch (err) {
            setError("Verification failed.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const success = await login(email, password);
            if (success) {
                router.push("/dashboard");
            } else {
                setError("Invalid email or password.");
            }
        } catch (err) {
            setError("Login failed.");
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
                        Welcome Back
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-2">
                        Login to access your AgroNova dashboard
                    </p>
                </div>

                {/* Mode Switcher */}
                <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg mb-6">
                    <button
                        onClick={() => { setMode("otp"); setStep("email"); setError(""); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === "otp" ? "bg-white dark:bg-neutral-700 shadow-sm text-green-700 dark:text-green-400" : "text-neutral-500"}`}
                    >
                        Login via OTP
                    </button>
                    <button
                        onClick={() => { setMode("password"); setError(""); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === "password" ? "bg-white dark:bg-neutral-700 shadow-sm text-green-700 dark:text-green-400" : "text-neutral-500"}`}
                    >
                        Login via Password
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
                        {error}
                    </div>
                )}

                {mode === "otp" ? (
                    step === "email" ? (
                        <form className="space-y-4" onSubmit={handleSendOtp}>
                            <div className="space-y-2">
                                <Label htmlFor="email-otp">Email Address</Label>
                                <div className="relative">
                                    <IconMail className="absolute left-3 top-3 text-neutral-400 h-4 w-4" />
                                    <Input
                                        id="email-otp"
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
                                {loading ? "Sending..." : "Send Verification Code"}
                            </button>
                        </form>
                    ) : (
                        <form className="space-y-4" onSubmit={handleVerifyOtp}>
                            <div className="space-y-2">
                                <Label htmlFor="otp">Enter OTP</Label>
                                <div className="relative">
                                    <IconShieldCheck className="absolute left-3 top-3 text-neutral-400 h-4 w-4" />
                                    <Input
                                        id="otp"
                                        placeholder="123456"
                                        type="text"
                                        className="pl-9 tracking-widest"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="text-xs text-neutral-500 text-right cursor-pointer hover:text-green-600" onClick={() => setStep("email")}>Change Email</p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 text-white rounded-lg h-10 font-bold hover:bg-green-700 transition-all disabled:opacity-50"
                            >
                                {loading ? "Verifying..." : "Verify & Login"}
                            </button>
                        </form>
                    )
                ) : (
                    <form className="space-y-4" onSubmit={handlePasswordLogin}>
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
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white rounded-lg h-10 font-bold hover:bg-green-700 transition-all disabled:opacity-50"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                )}


                <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 text-center">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-green-600 hover:underline">
                            Sign up
                        </Link>
                    </p>
                    <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300">
                        ← Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
