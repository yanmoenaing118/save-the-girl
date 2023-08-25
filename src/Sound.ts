export default class Sound {
  private static sounds: HTMLAudioElement[] = [];

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

    if (soundFound && idx) {
      sound = Sound.sounds[idx];
      sound.setAttribute("src", "./assets/gun-sound-1.wav");
      sound.loop = false;
      sound.volume = 0.1;
      sound.play();
    } else {
      sound = document.createElement("audio");
      sound.setAttribute("src", "./assets/gun-sound-1.wav");
      sound.volume = 0.1;
      sound.play();
      Sound.sounds.push(sound);
    }
  }
}
