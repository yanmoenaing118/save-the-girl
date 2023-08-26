import Bullet from "./Bullet";
import Girl from "./Girl";
import KeyControls from "./KeysControl";
import Soldier from "./Soldier";
import Spider from "./Spider";
import math from "./math";
import { clamp, hasCollide, isMobile } from "./utils";
import Heart from "./Heart";
import { APP_STATES, girlH, girlImages, girlW, h, w } from "./constants";
import Sound from "./Sound";
import Score from "./Score";
import GameOver from "./GameOver";
import Background from "./Background";
import Assets from "./Assets";
import Text from "./Text";
import State from "./State";
import Instruction from "./Instruction";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
context.imageSmoothingEnabled = true;

canvas.width = w;
canvas.height = h;
const dpr = window.devicePixelRatio;
const rect = canvas.getBoundingClientRect();
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
context.scale(dpr, dpr);
canvas.style.width = `${rect.width}px`;
canvas.style.height = `${rect.height}px`;

let dt = 1 / 60;
let time = 0; // in millis
let second = 0;
const control = new KeyControls();
const state = new State(APP_STATES.loading);
const touches: any = {};

/** Game stats */
let totalScore = 0;
let noOfLife = 5; // in second
let healthPerHeart = 400;
let totalHealtAmount = noOfLife * healthPerHeart;
let totalBiteSipders = 0; // number of spiders that are biting the Girl
let hasBiteGirl = false; // to flag the Gril has been bitten
let currBittenTime = 0;
let healthRate = 0.01;
let isGameOver = false;
let touched = false;
/**Background */
const bg = new Background();

/**Girl start */
const girls: Girl[] = [];
const girly = h / 3;
(function createGirls() {
  girlImages.forEach((url) => {
    const girl = new Girl(url);
    girl.pos.y = girly;
    girls.push(girl);
  });
})();
// console.log(girls);
let girlIndex = 0;
let girl: Girl = girls[girlIndex];

function updateGirlIndex() {
  // return;
  girlIndex = girls.length - noOfLife;
  if (!girls[girlIndex]) return;
  girl = girls[girlIndex];
}
/** Girl End */

/** Soldier Start */
const soldier = new Soldier();
soldier.pos.x = girl.w;
soldier.pos.y = girl.pos.y;
/** Soldier End */

/** Spiders Start*/
let spiders: Spider[] = [];
let lastSpwanTime = 0;
let spwanRate = isMobile ? 0.01 : 0.06;
function createSpiders() {
  if (isMobile) {
    for (let i = 0; i < 5; i++) {
      const spider = new Spider();

      spiders.push(spider);
    }
  } else {
    const spider = new Spider();

    spiders.push(spider);
  }
}

function renderSpiders() {
  spiders.forEach((spider) => {
    spider.render(context);
  });
}

function updateSpiders(dt: number, t: number) {
  spiders = spiders.filter((spider) => !spider.dead);
  spiders.forEach((spider) => {
    spider.update(dt, t);
  });
}
/** Spiders End */

// Bullet Starts
let lastShotFrame = 0;
let shotRate = 0.086;
let bullets: Bullet[] = [];
function createBullet() {
  const bullet = new Bullet();
  const bullet2 = new Bullet();
  bullet.pos.x = soldier.pos.x + soldier.tileW + 16;
  bullet2.pos.x = soldier.pos.x + soldier.tileW + 16;
  bullet.pos.y = soldier.pos.y + 47;
  bullet2.pos.y = soldier.pos.y;
  bullets.push(bullet);
  bullets.push(bullet2);
  Sound.playSound();
}

function renderBullets() {
  bullets.forEach((bullet) => {
    bullet.render(context);
  });
}

function updateBullets(dt: number, t: number) {
  bullets = bullets.filter((bullet) => !bullet.dead);
  bullets.forEach((bullet) => {
    bullet.update(dt, t);
  });
}
// Bullets end

// Girl Life start
let life: Heart[] = [];
(function createLife() {
  for (let i = 0; i < noOfLife; i++) {
    const heart = new Heart();
    heart.pos.x = i * heart.w + (i * heart.w) / 2;
    life.push(heart);
  }
})();
function updateLife() {
  noOfLife = Math.ceil(totalHealtAmount / healthPerHeart);
  life = life.filter((l) => !l.dead);
}
function renderLife() {
  life.forEach((l) => {
    l.render(context);
  });
}

function checkCollision() {
  bullets.forEach((bullet) => {
    spiders.forEach((spider) => {
      if (hasCollide(bullet, spider)) {
        spider.life--;
        if (spider.life < 0) {
          spider.dead = true;
          totalScore += 1;
        }
      }
    });
  });
}

function checkGirlHit() {
  spiders.forEach((spider) => {
    if (hasCollide(spider, girl, 0)) {
      spider.speed = 0;
    }
    if (spider.pos.x < girl.w + 12 && !spider.bite) {
      spider.pos.y = math.rand(girl.pos.y + 50, girl.pos.y + girl.h);
    }
  });
}

function getNoOfBiteSpiders(): number {
  return spiders.filter((spider) => spider.bite).length;
}

/**
 *
 * @param time in seconds
 */
function updateGirlHealth(time: number) {
  currBittenTime += dt;
  if (currBittenTime >= healthRate) {
    const damage = healthRate + totalBiteSipders * 0.1;
    totalHealtAmount -= damage;
    const heartIndex = Math.ceil(totalHealtAmount / healthPerHeart);
    if (life[heartIndex]) {
      life[heartIndex].dead = true;
    }
    currBittenTime = 0;
  }
}

// score text
const score = new Score("Total Kill: 0");

function renderGameOver() {
  if (noOfLife <= 0) {
    new GameOver(score).render(context);
    isGameOver = true;
  }
}

const loadingText = new Text("Loading assets...", w / 2 - 100, h / 2);
loadingText.style.font = "28px monospace";
loadingText.style.color = "white";
function SHOW_LOADING() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  loadingText.render(context);
}

const instr = new Instruction(w / 2 - 200, h / 2 - 50);
function SHOW_INSTRUCTION() {
  instr.render(context);
  if (state.ellapsedTime > 5) {
    state.set(APP_STATES.play);
    console.log(state.ellapsedTime);
  }
}

function shoot() {
  createBullet();
  lastShotFrame = 0;
  soldier.frame.x = 1;
}

function PLAY_GAME() {
  if (control.y && !isGameOver) {
    const dy = soldier.pos.y + soldier.speed * dt * control.y;
    soldier.pos.y = Math.max(0, Math.min(h - soldier.h, dy));
  }

  if (control.x && !isGameOver) {
    const dx = soldier.pos.x + soldier.speed * dt * control.x;
    soldier.pos.x = Math.max(girl.w, Math.min(h - 128, dx));
  }

  lastShotFrame += dt;
  if (
    lastShotFrame > shotRate &&
    control.action &&
    !isGameOver &&
    state.is(APP_STATES.play)
  ) {
    shoot();
  }

  if (
    isMobile &&
    state.is(APP_STATES.play) &&
    !control.action &&
    touched &&
    lastShotFrame > shotRate &&
    !isGameOver
  ) {
    shoot();
    // soldier.update(dt, second);
  }
  lastSpwanTime += dt;
  if (lastSpwanTime > spwanRate) {
    if(state.ellapsedTime > 3) {
      createSpiders();
      lastSpwanTime = 0;
      const rate = Math.random() * 0.5;
      spwanRate = rate > 0.15 ? 0.15 : rate;
    }
    
    // spwanRate = 1;
  }

  // drawSpider();
  checkCollision();
  checkGirlHit();
  score.text = `Total Kill: ${totalScore}`;

  totalBiteSipders = getNoOfBiteSpiders();
  hasBiteGirl = totalBiteSipders > 0;

  /**
   * update entities by self
   */
  if (hasBiteGirl) {
    updateGirlHealth(second);
  }
  if (control.action || isMobile) {
    soldier.update(dt, second);
  } else {
    soldier.frame.x = 0;
  }
  updateSpiders(dt, second);
  updateBullets(dt, second);
  updateLife();
  updateGirlIndex();

  /**
   * render entites
   */
  context.clearRect(0, 0, canvas.width, canvas.height);
  bg.render(context);

  soldier.render(context);
  girl.render(context);
  if (!isGameOver) {
    renderSpiders();
    renderBullets();
  }
  score.render(context);
  renderLife();
  renderGameOver();
}

// LOAD all game assets
Assets.load().then((loaded) => {
  console.log("loaded", loaded);
  state.set(APP_STATES.loaded);
});

document.addEventListener("DOMContentLoaded", () => {
  const loading = document.querySelector(".loading") as HTMLElement;
  loading.style.display = "none";
  requestAnimationFrame(run);
});

canvas.addEventListener("touchstart", (e: TouchEvent) => {
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.targetTouches[i];
    soldier.pos.y = touch.pageY;
    soldier.pos.y = clamp(soldier.pos.y, 0, h - soldier.h);
  }
  touched = true;
});
canvas.addEventListener("touchmove", (e: TouchEvent) => {
  e.preventDefault();
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.targetTouches[i];
    soldier.pos.y = touch.pageY;
    soldier.pos.y = clamp(soldier.pos.y, 0, h - soldier.h);
  }
});

/** GAME LOOP starts here */
function run(ellapsedTime: number) {
  dt = (ellapsedTime - time) * 0.001;
  time = ellapsedTime; // to seconds
  second = time * 0.001;

  switch (state.get()) {
    case APP_STATES.loading:
      SHOW_LOADING();
      break;
    case APP_STATES.loaded:
      SHOW_INSTRUCTION();
      break;
    case APP_STATES.play:
      PLAY_GAME();
      break;
    default:
      console.log("i");
  }

  state.update(dt);

  requestAnimationFrame(run);
}
