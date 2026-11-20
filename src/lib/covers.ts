// 劇本封面：src/assets/covers/<劇本 id>.(jpg|jpeg|png|webp)
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/covers/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true });

const byId = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) {
  const id = path.split('/').pop()!.replace(/\.[^.]+$/, '');
  byId.set(id, mod.default);
}

export const coverFor = (id: string): ImageMetadata | undefined => byId.get(id);
