import Texture from "./Texture";

export const w =  window.innerWidth;
export const h = window.innerHeight;
export const oneLifeTime = 60; // in seconds
export const girlW = 100;
export const girlH = 194;
export const girlImages = [
  "./assets/girl41.png",
  "./assets/girl41.png",
  "./assets/girl41.png",
  "./assets/girl41.png",
  "./assets/girl41.png",
];


export const textures = {
  bg: new Texture("./assets/bg1.png"),
  girl: new Texture("./assets/girl41.png"),
  spider: new Texture("./assets/spider.png"),
  soldier: new Texture("./assets/shooter.png"),
  heart: new Texture("./assets/heart.png")
}
