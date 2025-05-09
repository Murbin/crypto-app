/// <reference types="nativewind/types" />

declare module 'nativewind' {
    import type { ComponentProps } from 'react';
    import type { ViewProps, TextProps, ImageProps, TouchableOpacityProps } from 'react-native';

    export type StyledComponent<T> = T & {
        className?: string;
    };

    export type StyledView = StyledComponent<ViewProps>;
    export type StyledText = StyledComponent<TextProps>;
    export type StyledImage = StyledComponent<ImageProps>;
    export type StyledTouchableOpacity = StyledComponent<TouchableOpacityProps>;
} 