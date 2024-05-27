const { ArtifactStore } = require('dop-wallet-old');
import localforage from 'localforage';

export const createArtifactStore = () => {
  return new ArtifactStore(
    async (path: string) => {
      return localforage.getItem(path);
    },
    async (dir: string, path: string, item: string | Buffer) => {
      await localforage.setItem(path, item);
    },
    async (path: string) => (await localforage.getItem(path)) != null,
  );
}