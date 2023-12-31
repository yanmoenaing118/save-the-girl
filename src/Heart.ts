import Sprite from "./Sprite";
import { textures } from "./constants";

export default class Heart extends Sprite {
  constructor() {
    super(textures.heart);
    this.w = 16;
    this.h = 16;
    this.dead = false;
  }

  render(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.scale(0.85, 0.85);
    context.drawImage(this.texture.img, 0, 0);
    context.restore();
  }
}
