import Texture from "./Texture";
import { h, textures, w } from "./constants";

export default class Background {
    bg: Texture;
    constructor() {
        this.bg = textures.bg;
    }

    render(context: CanvasRenderingContext2D){
        context.save();
        context.scale(1, 2)
        context.drawImage(this.bg.img, 0, 0, w, h);
        context.restore();
    }
}