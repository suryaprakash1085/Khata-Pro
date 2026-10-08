// Web media picker — plain <input type="file">, no extra package needed.
import type { PickKind, PickedMedia } from './pickMedia';

export type { PickKind, PickedMedia };

export function pickMedia(kind: PickKind): Promise<PickedMedia | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = kind === 'photo' ? 'image/*' : 'video/*';

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      resolve({
        kind,
        uri: URL.createObjectURL(file),
        name: file.name,
        mimeType: file.type || (kind === 'photo' ? 'image/jpeg' : 'video/mp4'),
        size: file.size,
        file,
      });
    };
    input.addEventListener('cancel', () => resolve(null));

    input.click();
  });
}