# cordova-android 15.1.0: one Back key press fires `backbutton` twice

Minimal app that counts `backbutton` events per Back press. The page shows each press and the number of events in it.

## Setup

- cordova CLI 12, cordova-android 15.1.0 (`targetSdk` 36 by default), no plugins.
- JDK 21, Android SDK 36, Gradle 8.14.2.
- Emulator: Pixel 9, Android 16 (API 36), gesture navigation.

## Run

```
npm install
cordova platform add android@15.1.0
cordova build android --debug
adb install -r platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## Result (2026-10-08)

| Back input | Events per press |
|---|---|
| `adb shell input keyevent KEYCODE_BACK` | 2, 0.4 ms apart. |
| Edge swipe (gesture back) | 1. |

The key event reaches `CordovaWebViewImpl.onDispatchKeyEvent` two times:
1. Through `OnBackPressedDispatcher`: `ViewRootImpl$NativePreImeInputStage.doOnBackKeyEvent` -> `CoreAndroid` callback -> `dispatchBackKeyEvent()` -> synthetic key -> `backbutton`.
2. As the key itself: `ViewRootImpl$ViewPostImeInputStage` -> `DecorView` -> `SystemWebView.dispatchKeyEvent` -> `backbutton`.

Stacks: `diagnostics/logcat-one-key-press.txt`, made with `diagnostics/log-backbutton-paths.patch`.

Not tested yet: Android 15 and older, a real device.
