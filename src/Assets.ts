import Texture from "./Texture";
import { textures } from "./constants";

export default class Assets {
  public static load() {
    return new Promise((resolve, reject) => {
      const promises: Promise<boolean>[] = [];
      Object.entries(textures).forEach(([_, texture]) => {
        promises.push(texture.load());
      });
      Promise.all(promises)
        .then(() => resolve(true))
        .catch(() => reject(false));
    });
  }
}
