# Play Store Submission Checklist

Use this checklist to ensure AgroNova is ready for the Google Play Store.

## 1. App Content & Store Listing

- [ ] **App Name**: AgroNova
- [ ] **Short Description**: (Max 80 chars) e.g., "Advanced AI-powered agriculture assistant."
- [ ] **Full Description**: describe features (Soil Analysis, Pest Detection, etc.).
- [ ] **Graphics**:
    - [ ] App Icon (512x512 PNG)
    - [ ] Feature Graphic (1024x500 PNG)
    - [ ] Phone Screenshots (Min 2, Max 8 per device type)
    - [ ] Tablet Screenshots (Optional but recommended)

## 2. Privacy & Policy

- [ ] **Privacy Policy URL**: You MUST host a privacy policy (e.g., on your website) and link it in the Play Console.
- [ ] **Data Safety Form**:
    - Disclose usage of **Camera** (Taking photos for analysis).
    - Disclose usage of **Storage** (Saving reports).
    - Disclose usage of **Internet** (API communication).

## 3. Technical Requirements

- [ ] **App Bundle (.aab)**: Upload the signed `app-release.bundle`.
- [ ] **Target API Level**: Must target API 34+ (Android 14) (Capacitor handles this default).
- [ ] **64-bit Requirement**: Ensure native libraries are 64-bit compliant (Capacitor is compliant).

## 4. Testing

- [ ] **Internal Testing**: Release to internal testers first.
- [ ] **Production URL**: Verify `capacitor.config.ts` points to the PRODUCTION URL, not localhost.
- [ ] **Offline Handling**: Verify app behavior when offline (it should show a network error or splash screen, not crash).

## 5. Post-Release

- [ ] **Monitor Crashyltics**: Check for any native crashes.
- [ ] **User Feedback**: Monitor reviews.
