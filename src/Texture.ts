export default class Texture {
    img: HTMLImageElement;
    constructor(url: string) {
        this.img = new Image();
        this.img.src = url;
    }

    load() {
        return new Promise<boolean>((resolve, reject) => {
            this.img.addEventListener("load", () => resolve(true))
        })
    }
}

