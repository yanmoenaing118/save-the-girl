import Text from "./Text";
import { h, w } from "./constants";
import { isMobile } from "./utils";

export default class Instruction {
  pos = { x: 0, y: 0 };
  instructions: Text[];
  constructor(x: number, y: number) {
    this.pos.x = x;
    this.pos.y = y;

    this.instructions = [
      new Text("(-.-) Use A W S D keys to move around."),
      new Text("(-.-) Use Space bar to shoot"),
      new Text("(:-:) Keep ur girl alive as long as possible..."),
    ];

    if (isMobile) {
      this.instructions = [
        new Text("(-.-) Tilt the screen"),
        new Text("(-_-) Drag vertically to move up and down."),
      ];
    }

    this.instructions.forEach((text, i) => {
      text.pos.y = i * 32;
      text.style.color = "white";
      text.style.font = "18px monospace";
    });
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(0, 0);
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    for (let i = 0; i < this.instructions.length; i++) {
      this.instructions[i].render(ctx);
    }
    ctx.restore();
  }
}
