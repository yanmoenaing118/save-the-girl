export default class Sound {
  private static sounds: HTMLAudioElement[] = [];

  public static load(): Promise<boolean> {
    const sound = document.createElement("audio");
    sound.setAttribute("src", "./assets/gun-sound-1.wav");
    return new Promise((resolve, reject) => {
      sound.addEventListener("canplay", () => resolve(true));
    });
  }

  public static playSound() {
    let soundFound = false;
    let idx: number | undefined;
    let sound: HTMLAudioElement;

    Sound.sounds.forEach((el, i) => {
      if (el.ended) {
        soundFound = true;
        idx = i;
        return;
      }
    });

    try {
      if (soundFound && idx) {
        sound = Sound.sounds[idx];
        sound.setAttribute("src", "./assets/gun-sound-1.wav");
        sound.loop = false;
        sound.volume = 0.1;
      } else {
        sound = document.createElement("audio");
        sound.setAttribute("src", "./assets/gun-sound-1.wav");
        sound.volume = 0.1;
        Sound.sounds.push(sound);
      }

      try {
        sound.play();
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
