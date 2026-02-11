import Head from 'next/head';

export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "AgroNova",
        "url": "https://www.agronova.in",
        "logo": "https://www.agronova.in/logo.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-9876543210",
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": ["en", "hi"]
        },
        "sameAs": [
            "https://twitter.com/agronova",
            "https://www.facebook.com/agronova",
            "https://www.instagram.com/agronova"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
