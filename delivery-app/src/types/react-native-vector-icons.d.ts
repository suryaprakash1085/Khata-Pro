// Lightweight shim so imports from 'react-native-vector-icons/*' keep working
// without pulling in the outdated @types/react-native-vector-icons package
// (which conflicts with React Native 0.81's own bundled types).
declare module 'react-native-vector-icons/Ionicons' {
  import { Component } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  export default class Icon extends Component<IconProps> {}
}