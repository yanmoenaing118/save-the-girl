import { TextStyle } from "./types";

export default class Text {
  text: string;
  pos = { x: 0, y: 0};
  style: TextStyle;
  constructor(text: string, x?: number, y?: number) {
    this.text = text;
    this.style = {
        font: '16px serif',
        color: 'black'
    }
    this.pos.x = x || 0;
    this.pos.y = y || 0;
  }

  width(context: CanvasRenderingContext2D): number {
    return context.measureText(this.text).width;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.font = this.style.font || "16px airal";
    ctx.fillStyle = this.style.color || "black";
    ctx.translate(this.pos.x, this.pos.y);
    ctx.fillText(this.text,0,0)
    ctx.restore();
  }
}
