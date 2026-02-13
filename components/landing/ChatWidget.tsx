"use client";
import Script from "next/script";

export const ChatWidget = () => {
    return (
        <Script
            id="voiceflow-widget"
            src="https://cdn.voiceflow.com/widget-next/bundle.mjs"
            strategy="lazyOnload"
            onLoad={() => {
                if ((window as any).voiceflow?.chat) {
                    (window as any).voiceflow.chat.load({
                        verify: { projectID: '698c2b8a3aa107b48677c4c6' },
                        url: 'https://general-runtime.voiceflow.com',
                        versionID: 'production',
                        voice: {
                            url: "https://runtime-api.voiceflow.com"
                        }
                    });
                }
            }}
        />
    );
};
