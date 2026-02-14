# Play Store Submission Checklist 🚀

Use this checklist to ensure **AgroNova** is polished and ready for the Google Play Store.

## 1. App Content & Store Listing 📝

- [ ] **App Name**: AgroNova
- [ ] **Short Description**: (Max 80 chars) e.g., "Advanced AI-powered agriculture assistant for smarter farming."
- [ ] **Full Description**: describe key features (Soil Analysis, Pest Detection, Market Prices, Community).
- [ ] **Graphics**:
    - [ ] **App Icon**: 512x512 PNG (High Res).
    - [ ] **Feature Graphic**: 1024x500 PNG (For store banner).
    - [ ] **Phone Screenshots**: Min 2, Max 8 per device type (7-inch & 10-inch tablets recommended).
    - [ ] **Video**: Optional YouTube video demonstrating the app.

## 2. Privacy & Policy 🔒

- [ ] **Privacy Policy URL**: You **MUST** host a privacy policy (e.g., on your website) and link it in the Play Console.
- [ ] **Data Safety Form**:
    - [ ] **Camera**: Used for taking crop photos/scanning soil reports.
    - [ ] **Storage**: Used for saving locally cached data or reports.
    - [ ] **Location**: Used for hyper-local weather.
    - [ ] **Internet**: Used for fetching API data.

## 3. Technical Requirements ⚙️

- [ ] **App Bundle (.aab)**: Upload the signed `app-release.bundle` (Not APK).
- [ ] **Target API Level**: Must target API 34+ (Android 14). Capacitor 8 handles this by default.
- [ ] **64-bit Requirement**: Ensure native libraries are 64-bit compliant (Standard Capacitor apps are).

## 4. Testing 🧪

- [ ] **Internal Testing**: Release to internal testers first (1-2 weeks recommended).
- [ ] **Production URL**: Verify `capacitor.config.ts` points to the **PRODUCTION** URL, not `localhost`.
- [ ] **Offline Handling**: Verify app behavior when offline (it should show a network error or splash screen, not crash).
- [ ] **Login Flows**: Test Google Login/Email Login extensively on real devices.

## 5. Post-Release 📈

- [ ] **Monitor Crashyltics**: Check for any native crashes in Firebase or Google Play Console.
- [ ] **User Feedback**: Monitor reviews and respond promptly.
- [ ] **Updates**: Plan for regular updates every 2-4 weeks.
