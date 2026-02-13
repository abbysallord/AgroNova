# Android Deployment Guide for AgroNova

This guide details how to build and deploy the AgroNova Android app. The project is already configured with Capacitor and a release signing configuration.

## 1. Prerequisites

You need a machine with:
- **Node.js** (Installed)
- **Android Studio** (Required for SDK/JDK)
- **Java 17 or 21** (Recommended for Android builds)

## 2. Important Configuration

**CRITICAL**: Before building, you MUST update the production URL in `capacitor.config.ts`.

1. Open `capacitor.config.ts`.
2. Locate the `server` object.
3. Replace the `url` property with your **actual production URL** (e.g., `https://agronova.vercel.app`).
   ```typescript
   server: {
     url: 'https://YOUR-ACTUAL-DOMAIN.com', // <--- UPDATE THIS
     cleartext: true
   }
   ```
   *Note: If this URL is unreachable, the app will show an error screen.*

## 3. Build Instructions

Since the development environment uses a bleeding-edge Java version (JDK 25) incompatible with current Android build tools, you should run the build on your local machine or CI/CD pipeline.

### Option A: Using Android Studio (Recommended)

1. Open Android Studio.
2. Select **Open an existing Android Studio project**.
3. Navigate to and select the `android` folder inside `AgroNova-Android`.
4. Wait for Gradle sync to complete.
5. Go to **Build > Generate Signed Bundle / APK**.
6. Select **Android App Bundle** -> Next.
7. **Key Store Path**: Select `app/release.keystore` (it is already in the project).
8. **Key Store Password**: `agronova123`
9. **Key Alias**: `agronova`
10. **Key Password**: `agronova123`
11. Select **release** -> Finish.

### Option B: Command Line

1. Ensure `JAVA_HOME` points to JDK 17 or 21.
2. Navigate to the android directory:
   ```bash
   cd android
   ```
3. Run the release bundle command:
   ```bash
   ./gradlew bundleRelease
   ```
4. The signed `.aab` file will be generated at:
   `android/app/build/outputs/bundle/release/app-release.bundle`

## 4. Keystore Information

A release keystore has been generated for you.

- **File**: `android/app/release.keystore`
- **Alias**: `agronova`
- **Store Password**: `agronova123`
- **Key Password**: `agronova123`

**SECURITY WARNING**: For a real commercial production app, you should generate a new keystore with a strong, private password and store it securely. Do not commit the keystore or passwords to public repositories.

## 5. Next Steps

See `PLAY_STORE_CHECKLIST.md` for submission requirements.
