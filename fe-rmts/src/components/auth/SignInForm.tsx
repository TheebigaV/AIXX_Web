"use client";

import React, {useState, useEffect} from "react";
import Link from "next/link";
import {useAuth} from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";
import Button from "@/components/ui/button/Button";
import {EyeCloseIcon, EyeIcon} from "@/icons";
import {toast} from "react-toastify";
import {useRouter, useSearchParams} from "next/navigation";

export default function SignInForm() {
    const {login} = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/admin";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [generalError, setGeneralError] = useState("");

    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockEndTime, setLockEndTime] = useState<number | null>(null);
    const [countdown, setCountdown] = useState(0);

    // Load lock state from localStorage
    useEffect(() => {
        const lockInfo = localStorage.getItem("login-lock");
        if (lockInfo) {
            const {failed, lockUntil} = JSON.parse(lockInfo);
            setFailedAttempts(failed);

            if (lockUntil && Date.now() < lockUntil) {
                setIsLocked(true);
                setLockEndTime(lockUntil);
            }
        }
    }, []);

    // Countdown timer
    useEffect(() => {
        if (!isLocked || !lockEndTime) return;

        const interval = setInterval(() => {
            const secondsLeft = Math.max(0, Math.floor((lockEndTime - Date.now()) / 1000));
            setCountdown(secondsLeft);

            if (secondsLeft <= 0) {
                setIsLocked(false);
                setFailedAttempts(0);
                localStorage.removeItem("login-lock");
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isLocked, lockEndTime]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLocked) return;

        const newErrors: { email?: string; password?: string } = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) newErrors.email = "Email is required";
        else if (!emailRegex.test(email)) newErrors.email = "Invalid email format";

        if (!password) newErrors.password = "Password is required";

        setErrors(newErrors);
        setGeneralError("");

        if (Object.keys(newErrors).length > 0) return;

        setLoading(true);
        try {
            await login(email, password);
            router.push(redirectTo);
            setFailedAttempts(0);
            localStorage.removeItem("login-lock");
        } catch (error: any) {
            const updatedFails = failedAttempts + 1;

            if (updatedFails >= 5) {
                const lockUntil = Date.now() + 30 * 1000; // 30s lock
                localStorage.setItem("login-lock", JSON.stringify({failed: updatedFails, lockUntil}));
                setIsLocked(true);
                setLockEndTime(lockUntil);
                setCountdown(30);
            } else {
                localStorage.setItem("login-lock", JSON.stringify({failed: updatedFails}));
                setFailedAttempts(updatedFails);
            }

            setGeneralError(error.message || "Incorrect email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center dark:bg-gray-950 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-10 bg-white dark:bg-gray-900 rounded-xl shadow-md p-10">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Sign In to Your Account
                    </h1>
                </div>

                {generalError && (
                    <p className="text-sm text-red-600 dark:text-red-400 text-center">{generalError}</p>
                )}

                {isLocked && (
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center">
                        Too many failed attempts. Please wait {countdown}s before trying again.
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <Label>
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="info@gmail.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!errors.email}
                            hint={errors.email}
                            disabled={isLocked}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <Label>
                            Password <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!errors.password}
                                hint={errors.password}
                                disabled={isLocked}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                            >
                {showPassword ? <EyeIcon/> : <EyeCloseIcon/>}
              </span>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Checkbox checked={isChecked} onChange={setIsChecked}/>
                            <span className="block text-gray-700 text-sm dark:text-gray-400">
                Keep me logged in
              </span>
                        </div>
                        <Link
                            href="/reset-password"
                            className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit */}
                    <div>
                        <Button className="w-full" size="sm" type="submit" disabled={loading || isLocked}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
}
