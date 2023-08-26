import TileSprite from "./TileSprite";
import { h, textures, w } from "./constants";
import math from "./math";
import { FRAME_SPIDERS } from "./sprite-frames";
import { isMobile } from "./utils";
export default class Spider extends TileSprite {
  padding: number = 4;
  speed: number;
  bite: boolean = false;
  life = 5;
  constructor() {
    super(textures.spider);
    this.w = 64 - this.padding;
    this.h = 64 - this.padding;
    this.pos.x = w - 64;
    if (isMobile) {
      this.pos.y = math.rand(0, h - this.h - 32);
    } else {
      this.pos.y = math.rand(h / 3.5, h - this.h - 32);
    }
    this.tileH = 64;
    this.tileW = 64;
    this.frame.y = 3;
    this.speed = math.rand(200, 400);
    if(isMobile) {
      this.life = 20;
    }
  }

  update(dt: number, t: number) {
    if (this.speed != 0) {
      this.speed += t * 0.2;
    }

    if (this.speed == 0) {
      if (!this.bite) {
        this.pos.x -= math.randf(80);
        // this.pos.y += 180;
        this.bite = true;
      } else {
        this.pos.x = this.pos.x;
      }
    } else {
      this.pos.x -= this.speed * dt;
    }
    const frameRate = this.speed == 0 ? 0.1 : (10 / this.speed) * 2.5;
    this.frame.x = Math.floor(t / frameRate) % FRAME_SPIDERS;
  }

  render(context: CanvasRenderingContext2D) {
    context.restore();
    context.save();
    context.fillStyle = "red";
    context.translate(this.pos.x, this.pos.y);
    context.scale(this.scale.x, this.scale.y);
    context.drawImage(
      this.texture.img,
      this.tileH * this.frame.x,
      this.tileH * this.frame.y,
      this.tileW,
      this.tileH,
      0,
      0,
      this.tileW,
      this.tileH
    );
    context.restore();

    context.save();
    context.fillStyle = "red";
    context.translate(this.pos.x + 12, this.pos.y + 12);
    context.fillRect(0, 0, this.life * 4, 3);
    context.restore();
  }
}
