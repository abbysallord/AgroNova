"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
  name: string;
  email: string;
  role: "Admin" | "Farmer" | "User";
  phone?: string;
  location?: string;
  farmSize?: string;
  crops?: string[];
  avatar?: string; // Base64 image
  about?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: "Farmer" | "User") => Promise<boolean>;
  sendOtp: (email: string) => Promise<string>;
  verifyOtp: (email: string, code: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Helper to normalize emails to prevent duplicates via case sensitivity
  const normalize = (email: string) => email.trim().toLowerCase();

  useEffect(() => {
    // 1. Check local storage for existing session
    const storedUser = localStorage.getItem("agronova_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 2. Seed Test User (Investor Demo)
    const demoEmail = "demo@agronova.com";
    const demoKey = `reg_${demoEmail}`;
    if (!localStorage.getItem(demoKey)) {
      console.log("Seeding Demo User...");
      localStorage.setItem(demoKey, JSON.stringify({
        name: "Investor Demo",
        password: "password123",
        location: "Bangalore, KA",
        role: "Farmer"
      }));
    }
  }, []);

  const persistUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("agronova_user", JSON.stringify(userData));
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    persistUser(updatedUser);

    // Update persistent record (so it survives logout/login)
    const cleanEmail = normalize(user.email);
    // Don't update reg for admin special case unless we want to, 
    // but for 'dshenoyh' we used hardcoded check originally.
    // We will now try to save to reg for everyone to ensure persistence.

    const regKey = `reg_${cleanEmail}`;
    const storedReg = localStorage.getItem(regKey);

    if (storedReg) {
      const currentReg = JSON.parse(storedReg);
      // Preserve password, overwrite other fields
      const newReg = { ...currentReg, ...updates };
      // Remove fields that shouldn't be in reg if any (none really)
      localStorage.setItem(regKey, JSON.stringify(newReg));
    } else {
      // If no reg exists (e.g. hardcoded admin), maybe create one?
      // For now, only persist to session is guaranteed if no reg exists.
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalize(email), password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Login failed");
      }

      const user = await res.json();
      persistUser(user);
      return true;
    } catch (error) {
      console.error("Login Error:", error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: "Farmer" | "User"): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: normalize(email), password, role }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Registration failed");
      }

      const user = await res.json();
      persistUser(user);
      return true;
    } catch (error) {
      console.error("Registration Error:", error);
      return false;
    }
  };

  const sendOtp = async (email: string): Promise<string> => {
    const cleanEmail = normalize(email);

    // Removed client-side check. Letting server handle "User not found".

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to send OTP");
      }

      const { hash, expiry } = await res.json();

      // Store Hash + Expiry in LocalStorage for verification step
      localStorage.setItem(`otp_hash_${cleanEmail}`, JSON.stringify({ hash, expiry }));

      return "Code sent to email!"; // Return message instead of code
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const verifyOtp = async (email: string, code: string): Promise<boolean> => {
    const cleanEmail = normalize(email);

    const storedHashData = localStorage.getItem(`otp_hash_${cleanEmail}`);

    if (!storedHashData) {
      throw new Error("OTP session expired. Please request a new code.");
    }

    const { hash, expiry } = JSON.parse(storedHashData);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, otp: code, hash, expiry }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Invalid OTP");
      }

      // Verification Success -> Log user in
      const user = await res.json();
      persistUser(user);
      localStorage.removeItem(`otp_hash_${cleanEmail}`); // Clear OTP hash after success
      return true;

    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("agronova_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        sendOtp,
        verifyOtp,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
