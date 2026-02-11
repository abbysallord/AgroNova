"use client";
import { useEffect } from "react";

export const ChatWidget = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = function () {
            (window as any).voiceflow.chat.load({
                verify: { projectID: '698c2b8a3aa107b48677c4c6' },
                url: 'https://general-runtime.voiceflow.com',
                versionID: 'production',
                voice: {
                    url: "https://runtime-api.voiceflow.com"
                }
            });
        };
        script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return null; // The script injects the widget, so no UI needed here
};
