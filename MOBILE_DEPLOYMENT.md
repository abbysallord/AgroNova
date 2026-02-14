# Android Deployment Guide for AgroNova 🚀

This guide details how to build and deploy the AgroNova Android app. The project is fully configured with **Capacitor 8**.

## 1. Prerequisites 📋

You need a machine with:
- **Node.js** (Installed)
- **Android Studio** (Required for SDK/JDK management and building)
- **Java 17 or 21** (Recommended for Android builds)

## 2. Important Configuration ⚙️

**CRITICAL**: Before building a release version, you **MUST** update the production URL in `capacitor.config.ts`.

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

## 3. Build Instructions 🏗️

You can build the app using Android Studio or the command line.

### Option A: Using Android Studio (Recommended)

1. Open Android Studio.
2. Select **Open** and choose the `android` folder inside `AgroNova`.
3. Wait for Gradle sync to complete.
4. Go to **Build > Generate Signed Bundle / APK**.
5. Select **Android App Bundle** (for Play Store) or **APK** (for direct install) -> Next.
6. **Key Store Path**: Select `app/release.keystore`.
7. **Key Store Password**: `agronova123`
8. **Key Alias**: `agronova`
9. **Key Password**: `agronova123`
10. Select **release** -> Finish.

### Option B: Command Line

1. Navigate to the android directory:
   ```bash
   cd android
   ```

2. **For Play Store (AAB):**
   ```bash
   ./gradlew bundleRelease
   ```
   Output: `android/app/build/outputs/bundle/release/app-release.bundle`

3. **For Direct Install (APK):**
   ```bash
   ./gradlew assembleRelease
   ```
   Output: `android/app/build/outputs/apk/release/app-release.apk`

## 4. Keystore Information 🔐

A release keystore has been generated for you (for development/demo purposes).

- **File**: `android/app/release.keystore`
- **Alias**: `agronova`
- **Store Password**: `agronova123`
- **Key Password**: `agronova123`

**SECURITY WARNING**: For a real commercial production app, generate a new private keystore and do not commit it to the repository.

## 5. Next Steps 📝

See [PLAY_STORE_CHECKLIST.md](./PLAY_STORE_CHECKLIST.md) for submission requirements.

## 6. Update App Name, Icon & Splash Screen 🎨

Native assets like the App Icon and Splash Screen must be generated manually if you change them.

### Step 1: Install Asset Tool
```bash
npm install @capacitor/assets --save-dev
```

### Step 2: Prepare Images
Create a folder named `assets` in the root of your project and add:
-   `icon.png` (1024x1024 px)
-   `splash.png` (2732x2732 px)
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

### Changing App Name
To change the app name displayed on the phone:
1.  Open `android/app/src/main/res/values/strings.xml`.
2.  Change the value of `app_name`:
    ```xml
    <string name="app_name">AgroNova</string>
    ```
