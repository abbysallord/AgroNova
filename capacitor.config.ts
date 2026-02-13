import { CapacitorConfig } from '@capacitor/cli';

// IMPORTANT: Replace the URL below with your actual deployed URL (e.g., https://your-app.vercel.app)
// Without this change, the app will just show "Loading..."
const config: CapacitorConfig = {
    appId: 'com.agronova.app',
    appName: 'AgroNova',
    webDir: 'mobile-app',

    server: {
        // Capacitor will act as a native wrapper for this website.
        // Ensure this URL is HTTPS.
        url: 'https://www.agronova.in',
        cleartext: true
    },
    android: {
        allowMixedContent: true
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000, // Show splash screen for 2s while loading
            launchAutoHide: true,
            backgroundColor: "#ffffffff",
            androidSplashResourceName: "splash",
            androidScaleType: "CENTER_CROP",
            showSpinner: true,
            spinnerColor: "#999999"
        }
    }
};

export default config;
