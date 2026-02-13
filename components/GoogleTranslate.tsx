"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

export const GoogleTranslate = () => {

    useEffect(() => {
        window.googleTranslateElementInit = () => {
            if (window.google?.translate?.TranslateElement) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "en",
                        autoDisplay: false,
                    },
                    "google_translate_element"
                );
            }
        };
    }, []);

    return (
        <>
            <div id="google_translate_element" style={{ display: "none" }}></div>
            <Script
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="lazyOnload"
            />
        </>
    );
};
