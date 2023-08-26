import Sound from "./Sound";
import { textures } from "./constants";

export default class Assets {
  public static load() {
    return new Promise((resolve, reject) => {
      const promises: Promise<boolean>[] = [];
      promises.push(Sound.load());
      Object.entries(textures).forEach(([_, texture]) => {
        promises.push(texture.load());
      });
      Promise.all(promises)
        .then(() => resolve(true))
        .catch(() => reject(false));
    });
  }
}
