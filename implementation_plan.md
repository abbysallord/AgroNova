# Forgot Password Implementation Plan

## 1. Database Schema Update
- [x] Modify `prisma/schema.prisma` to add `resetToken` (String?) and `resetTokenExpiry` (DateTime?) to the `User` model.
- [x] Push schema changes to the database.

## 2. Email Service Update
- [x] Update `lib/email-templates.ts` to include a `ResetPassword` email template.
- [x] Update `lib/email.ts` to export `sendPasswordResetEmail` function utilizing the template.

## 3. Backend Implementation
- [x] Create `app/api/auth/forgot-password/route.ts` to handle password reset requests.
    - Generate a secure token.
    - Save token and expiry (e.g., 1 hour) to the user record.
    - Send email containing the reset link.
- [x] Create `app/api/auth/reset-password/route.ts` to handle the actual password reset.
    - Validate token.
    - Check token expiration.
    - Hash the new password.
    - Update user record (password, clear token fields).

## 4. Frontend Implementation
- [x] Update `app/login/page.tsx` to add a "Forgot Password?" link.
- [x] Create `app/forgot-password/page.tsx` for users to submit their email.
- [x] Create `app/reset-password/page.tsx` for users to enter their new password.

## 5. Verification
- [ ] Test the "Forgot Password" flow from the login page.
- [ ] Verify email delivery.
- [ ] Verify token validation and expiration.
- [ ] Verify successful password reset and subsequent login.
