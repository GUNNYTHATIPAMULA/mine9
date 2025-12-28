# Firebase Setup Guide - Quick Fix for Permission Errors

## IMMEDIATE FIX - Update Firestore Rules

The permission errors you're seeing are because Firestore rules haven't been set yet. Follow these steps:

### Step 1: Go to Firebase Console
1. Open https://console.firebase.google.com/
2. Select your project: **minex-a370e**

### Step 2: Update Firestore Security Rules
1. Click **Firestore Database** in the left sidebar
2. Click the **Rules** tab at the top
3. **DELETE everything** in the rules editor
4. **COPY and PASTE** these rules:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. Click **Publish** button
6. Wait 10-30 seconds for rules to propagate

### Step 3: Enable Authentication Methods
1. Click **Authentication** in the left sidebar
2. Click **Sign-in method** tab
3. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click Save
4. Enable **Google**:
   - Click on "Google"
   - Toggle "Enable" to ON
   - Select a support email from dropdown
   - Click Save

### Step 4: Create Firestore Database (if not created)
1. Go to **Firestore Database**
2. If you see "Create database", click it
3. Choose **Start in test mode** (we'll apply secure rules above)
4. Select your location (any US location is fine)
5. Click **Enable**

### Step 5: Test the App
```bash
npm run dev
```

1. Try signing up with a new email
2. Check your email for verification link
3. Try Google sign-in
4. Test the referral system

---

## Common Errors & Solutions

### Error: "Missing or insufficient permissions"
**Cause:** Firestore rules not updated or not propagated yet
**Fix:** 
- Wait 30 seconds after publishing rules
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check Firebase Console → Firestore → Rules tab to verify rules are published

### Error: "auth/invalid-credential"
**Cause:** Wrong email/password combination
**Fix:** 
- Double-check email and password
- Use "Forgot Password" if needed
- Try creating a new account

### Error: "auth/popup-closed-by-user"
**Cause:** Google sign-in popup was closed
**Fix:** Just try signing in with Google again

### Error: "Failed to load resource: 400"
**Cause:** Firebase API not enabled or quota exceeded
**Fix:**
- Go to Firebase Console
- Click gear icon → Project settings
- Scroll to "Your apps" section
- Verify your app is listed
- Check if "Identity Toolkit API" is enabled in Google Cloud Console

---

## Verify Setup Checklist

- [ ] Firestore Database created
- [ ] Firestore rules updated and published
- [ ] Email/Password authentication enabled
- [ ] Google authentication enabled
- [ ] App runs without console errors
- [ ] Can create account with email
- [ ] Receive verification email
- [ ] Can sign in with Google
- [ ] Referral code works (test with 2 accounts)

---

## Testing the Referral System

1. **Create First Account:**
   - Sign up with email1@test.com
   - Go to Profile → Copy your referral code (e.g., GUN3X4Y)

2. **Create Second Account with Referral:**
   - Logout
   - Sign up with email2@test.com
   - Paste the referral code during signup
   - Check balance: Should show 10 MNX bonus

3. **Verify Referrer Got Bonus:**
   - Logout
   - Login as email1@test.com
   - Check balance: Should show 15 MNX bonus
   - Check Profile: Should show 1 referral

---

## Debug Mode

The app now has extensive logging. Open browser console (F12) to see:
- `[v0] Setting up auth state listener` - App initialized
- `[v0] Starting signup process` - Signup started
- `[v0] Creating Firebase auth user` - Creating account
- `[v0] Creating Firestore user document` - Creating database record
- `[v0] Verification email sent` - Email sent successfully

If you see errors in console, they will show exactly where the problem is.

---

## Need Help?

If you're still having issues after following these steps:

1. Share the exact error message from console
2. Confirm which step you completed
3. Check if Firestore rules show as "published" in Firebase Console
