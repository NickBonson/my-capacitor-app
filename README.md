# My Capacitor App

This example demonstrates basic Passkey (FIDO2) usage with Capacitor. The web implementation uses the WebAuthn APIs and the Android implementation relies on the `@joyid/capacitor-native-passkey` plugin.

## Android Testing

1. Install dependencies and build the Android project via Capacitor.
2. Run the application on an Android device or emulator.
3. Use the **Register Passkey** and **Login Passkey** buttons to create and authenticate a passkey using the native FIDO2 capabilities.

The buttons automatically use the native plugin when running on Android and fall back to WebAuthn in a browser.
