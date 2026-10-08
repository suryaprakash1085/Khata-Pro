// Native (Android / iOS) media picker. Web uses pickMedia.web.ts automatically.
// Requires:  npx expo install expo-image-picker
import * as ImagePicker from 'expo-image-picker';

export type PickKind = 'photo' | 'video';

export type PickedMedia = {
  kind: PickKind;
  uri: string;
  name: string;
  mimeType: string;
  size?: number;
  file?: any; // web only (File object)
};

export async function pickMedia(kind: PickKind): Promise<PickedMedia | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    throw new Error('Please allow gallery access to attach a photo or video.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: kind === 'photo' ? ['images'] : ['videos'],
    quality: 0.7,
    videoMaxDuration: 60,
    allowsMultipleSelection: false,
  } as any);

  if (result.canceled || !result.assets?.length) return null;

  const a: any = result.assets[0];
  return {
    kind,
    uri: a.uri,
    name: a.fileName ?? `${kind}-${Date.now()}.${kind === 'photo' ? 'jpg' : 'mp4'}`,
    mimeType: a.mimeType ?? (kind === 'photo' ? 'image/jpeg' : 'video/mp4'),
    size: a.fileSize,
  };
}