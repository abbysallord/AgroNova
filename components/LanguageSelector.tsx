
"use client";

import * as React from "react";
import { IconWorld, IconChevronDown, IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "ur", name: "Urdu", nativeName: "اردو" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "de", name: "German", nativeName: "Deutsch" },
    { code: "it", name: "Italian", nativeName: "Italiano" },
    { code: "pt", name: "Portuguese", nativeName: "Português" },
    { code: "zh-CN", name: "Chinese (Simplified)", nativeName: "简体中文" },
    { code: "ja", name: "Japanese", nativeName: "日本語" },
    { code: "ru", name: "Russian", nativeName: "Русский" },
    { code: "ar", name: "Arabic", nativeName: "العربية" },
];

export function LanguageSelector() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [currentLang, setCurrentLang] = React.useState("en");

    React.useEffect(() => {
        // Check cookie for current language
        const match = document.cookie.match(/googtrans=\/en\/([a-z]{2}(?:-[A-Z]{2})?)/);
        if (match && match[1]) {
            setCurrentLang(match[1]);
        }
    }, []);

    const handleLanguageChange = (langCode: string) => {
        // Set cookie and reload
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
        document.cookie = `googtrans=/en/${langCode}; path=/;`; // Fallback for localhost
        window.location.reload();
    };

    const currentLanguage = languages.find((l) => l.code === currentLang) || languages[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
                <IconWorld className="size-4 text-neutral-600 dark:text-neutral-400" />
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 hidden md:block">
                    {currentLanguage.nativeName}
                </span>
                <IconChevronDown className={cn("size-4 text-neutral-500 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-64 max-h-96 overflow-y-auto rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-xl z-50 p-1">
                        <div className="px-2 py-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            Select Language
                        </div>
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors",
                                    currentLang === lang.code
                                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                                        : "text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                )}
                            >
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">{lang.nativeName}</span>
                                    <span className="text-xs text-neutral-500 dark:text-neutral-400">{lang.name}</span>
                                </div>
                                {currentLang === lang.code && <IconCheck className="size-4" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
