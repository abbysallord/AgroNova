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

## 6. Alternative: Building an APK (For Direct Install)

If you want to distribute the app yourself (without Google Play), you need an **APK** file, not an AAB.

### Option A: Using Android Studio
1.  Go to **Build > Generate Signed Bundle / APK**.
2.  Select **APK** (instead of Android App Bundle) -> Next.
3.  Use the same keystore credentials as above.
4.  Select **release** -> Finish.
5.  Click the "Locate" link in the notification when done.

### Option B: Command Line
Run this command in the `android` directory:
```bash
./gradlew assembleRelease
```
The signed APK will be at:
`android/app/build/outputs/apk/release/app-release.apk`

## 7. Direct Distribution Options

Once you have the `.apk` file:
1.  **Website Hosting**: Upload it to your website (e.g., `agronova.in/download`) and link to it.
2.  **GitHub Releases**: Attach the APK to a GitHub Release.
3.  **Third-Party Stores**: Upload to Amazon Appstore, Samsung Galaxy Store, or GetJar.

## 8. Update App Name, Icon & Splash Screen

Native assets like the App Icon and Splash Screen are **NOT** updated from the website automatically. You must generate them manually.

### Step 1: Install Asset Tool
```bash
npm install @capacitor/assets --save-dev
```

### Step 2: Prepare Images
Create a folder named `assets` in the root of your project and add:
-   `icon.png` (Must be at least 1024x1024 px)
-   `splash.png` (Must be at least 2732x2732 px)
-   `splash-dark.png` (Optional, for dark mode)

### Step 3: Generate Assets
Run the following command to automatically generate all required Android sizes:
```bash
npx @capacitor/assets generate --android
```

### Step 4: Sync
```bash
npx cap sync
```
Your app icon and splash screen are now updated in the Android project.

### Changing App Name
To change the app name displayed on the phone:
1.  Open `android/app/src/main/res/values/strings.xml`.
2.  Change the value of `app_name`:
    ```xml
    <string name="app_name">AgroNova</string>
    ```
