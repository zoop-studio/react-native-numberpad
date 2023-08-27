# react-native-numberpad

[![npm version](https://badge.fury.io/js/@zoop.studio%2Freact-native-numberpad.svg)](https://badge.fury.io/js/@zoop.studio%2Freact-native-numberpad)
[![Release](https://github.com/zoop-studio/react-native-numberpad/actions/workflows/release.yaml/badge.svg)](https://github.com/zoop-studio/react-native-numberpad/actions/workflows/release.yaml)

Have you been struggling to implement a `number-pad` for use in React-native, or just want to use the logic without the
UI? If so, install it now! 👊

It's lightweight at just under **2 KB** and will save you some precious time.

You don't need any additional dependency libraries, just the ones installed in your project.

## Install

```bash
yarn add @zoop.studio/react-native-numberpad
```

## Usage

### 1. Wrap `NumberpadProvider`

Wrap it in `NumberpadProvider` wherever you need it, and as many times as you want.

```tsx
import { NumberPadProvider } from '@zoop.studio/react-native-numberpad';

const Example = () => {
    return (
        <NumberPadProvider maxLength={10}>
            {...}
        </NumberPadProvider>
    ) 
}
```

### 2. Use hooks

```diff
import {
    NumberPadProvider,
+    useNumberPadAction,
+    useNumberPadValue
} from '@zoop.studio/react-native-numberpad';

const Example = () => {
+    const {onAppend, onDelete, onClear} = useNumberPadAction();
+    const value = useNumberPadValue();
    return (
        <NumberPadProvider maxLength={10}>
            {...}
        </NumberPadProvider>
    ) 
}
```

## Contribute

<img alt='screenshot' src='https://is1-ssl.mzstatic.com/image/thumb/PurpleSource126/v4/36/71/1f/36711f17-705f-8c40-8c46-dc2450027edf/0a4a1814-a67b-45bf-9fad-c6e7510a87e6_6.5_U1112_U1167_U11bc_2.png/460x0w.webp' width='200' />
<img alt='screenshot' src='https://is1-ssl.mzstatic.com/image/thumb/PurpleSource116/v4/dd/14/0f/dd140f77-84f0-4ade-df18-4e0873b636d7/79f5000b-818f-4370-8a32-20a8a0712d83_6.5_U1112_U1167_U11bc_3.png/460x0w.webp' width='200' />

This library is used in real-world products, and your contributions can help us make great updates to products uploaded
to the App Store and Play Store.

Download [Apple App Store](https://apps.apple.com/kr/app/zoop-%ED%95%B4%EC%99%B8%EC%97%AC%ED%96%89-%EA%B0%80%EA%B3%84%EB%B6%80/id6447391288) or [Google Play Store](https://play.google.com/store/apps/details?id=com.zoop.app),
a budgeting app for international travelers, today.

## License

[MIT licensed.](https://github.com/zoop-studio/react-native-numberpad/blob/main/LICENSE)
