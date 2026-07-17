// src/core/game.js
import { settings } from './settings.js';
import { initCanvas, clearCanvas } from './canvas.js';
import { Apple } from '../entities/Apple.js';
import { Snake } from '../entities/Snake.js';
import { Cobra } from '../entities/Cobra.js';
import { isColliding, getRandomInt } from './utils.js';

export class GameEngine {
  constructor(canvasElement, onStateChange) {
    const { canvas, ctx } = initCanvas(canvasElement.id, settings.canvasWidth, settings.canvasHeight);
    this.canvas = canvas;
    this.ctx = ctx;
    this.onStateChange = onStateChange;
    this.gameObjects = [];
    this.isPaused = false;
    this.isRunning = false;
    this.lastTime = 0;
    this.frameCount = 0;
    this.init();
  }

  // Единственный метод draw (фон и объекты)
  draw() {
    this.ctx.fillStyle = '#d2b48c';  // легко-коричневый фон
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for (const obj of this.gameObjects) {
      if (obj.isAlive) obj.draw(this.ctx);
    }
  }

  updateSettings(newSettings) {
    Object.assign(settings, newSettings);
  }

  init() {
    this.gameObjects = [];

    // Создаём яблоки
    for (let i = 0; i < settings.initialApples; i++) {
      this.spawnApple();
    }

    // Змеи
    for (let i = 0; i < settings.initialSnakes; i++) {
      const snake = new Snake(
        getRandomInt(50, settings.canvasWidth - 50),
        getRandomInt(50, settings.canvasHeight - 50)
      );
      this.gameObjects.push(snake);
    }

    // Кобры
    for (let i = 0; i < settings.initialCobras; i++) {
      const cobra = new Cobra(
        getRandomInt(50, settings.canvasWidth - 50),
        getRandomInt(50, settings.canvasHeight - 50)
      );
      this.gameObjects.push(cobra);
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  stop() {
    this.isRunning = false;
  }

  pause() {
    this.isPaused = true;
    this.onStateChange?.({ paused: true });
  }

  resume() {
    this.isPaused = false;
    this.onStateChange?.({ paused: false });
  }

  restart() {
    this.stop();
    this.init();
    this.start();
  }

  gameLoop(currentTime) {
    if (!this.isRunning) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    if (!this.isPaused) {
      this.update(deltaTime);
    }

    this.draw();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  update(deltaTime) {
    // Собираем контекст для объектов
    const gameContext = {
      apples: this.gameObjects.filter(o => o instanceof Apple && o.isAlive),
      snakes: this.gameObjects.filter(o => o instanceof Snake && o.isAlive),
      cobras: this.gameObjects.filter(o => o instanceof Cobra && o.isAlive),
      onReproduce: (parent) => this.handleReproduction(parent)
    };

    // Обновление всех объектов
    for (const obj of this.gameObjects) {
      if (obj.isAlive) {
        obj.update(deltaTime, gameContext);
      }
    }

    // Обработка столкновений
    this.handleCollisions();

    // Удаление мёртвых объектов
    this.gameObjects = this.gameObjects.filter(obj => obj.isAlive);

    // Спавн яблок
    if (Math.random() < settings.appleSpawnChance) {
      this.spawnApple();
    }

    // Миграция
    const snakes = this.gameObjects.filter(o => o instanceof Snake && o.isAlive);
    const cobras = this.gameObjects.filter(o => o instanceof Cobra && o.isAlive);

    if (snakes.length < settings.snakeMigrationThreshold) {
      for (let i = 0; i < settings.snakeMigrationAmount; i++) {
        this.spawnSnake();
      }
    }
    if (cobras.length < settings.cobraMigrationThreshold) {
      for (let i = 0; i < settings.cobraMigrationAmount; i++) {
        this.spawnCobra();
      }
    }

    // Статистика для UI
    if (this.onStateChange) {
      this.onStateChange({
        snakes: snakes.length,
        cobras: cobras.length,
        apples: this.gameObjects.filter(o => o instanceof Apple && o.isAlive).length,
        paused: this.isPaused
      });
    }
  }

  handleCollisions() {
    const objects = this.gameObjects.filter(o => o.isAlive);
    const len = objects.length;

    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const a = objects[i];
        const b = objects[j];
        if (!isColliding(a, b)) continue;

        // Яблоко + змея
        if (a instanceof Apple && b instanceof Snake) {
          this.eatApple(a, b);
        } else if (b instanceof Apple && a instanceof Snake) {
          this.eatApple(b, a);
        }
        // Яблоко + кобра
        else if (a instanceof Apple && b instanceof Cobra) {
          this.eatApple(a, b);
        } else if (b instanceof Apple && a instanceof Cobra) {
          this.eatApple(b, a);
        }
        // Кобра + змея
        else if (a instanceof Cobra && b instanceof Snake) {
          this.cobraAttack(a, b);
        } else if (b instanceof Cobra && a instanceof Snake) {
          this.cobraAttack(b, a);
        }
        // Кобра + кобра (каннибализм)
        else if (a instanceof Cobra && b instanceof Cobra) {
          this.cobraCannibal(a, b);
        }
      }
    }
  }

  eatApple(apple, eater) {
    if (!apple.isAlive || !eater.isAlive) return;
    eater.eat(apple.foodValue);
    apple.die();
  }

  cobraAttack(cobra, snake) {
    if (!cobra.isAlive || !snake.isAlive) return;
    snake.die();
    cobra.eat(snake.foodValue);
  }

  cobraCannibal(cobra1, cobra2) {
    if (!cobra1.isAlive || !cobra2.isAlive) return;
    if (cobra1.hunger > cobra2.hunger) {
      cobra2.die();
      cobra1.eat(cobra2.foodValue);
    } else {
      cobra1.die();
      cobra2.eat(cobra1.foodValue);
    }
  }

  handleReproduction(parent) {
    const snakes = this.gameObjects.filter(o => o instanceof Snake && o.isAlive);
    const cobras = this.gameObjects.filter(o => o instanceof Cobra && o.isAlive);

    if (this.gameObjects.length >= settings.maxObjects) return;
    if (parent instanceof Snake && snakes.length >= settings.maxObjects * settings.snakeMaxPercent) return;
    if (parent instanceof Cobra && cobras.length >= settings.maxObjects * settings.cobraMaxPercent) return;

    const child = parent.reproduce();
    if (child) {
      this.gameObjects.push(child);
    }
  }

  spawnApple() {
    const x = getRandomInt(20, settings.canvasWidth - 20);
    const y = getRandomInt(20, settings.canvasHeight - 20);
    this.gameObjects.push(new Apple(x, y));
  }

  spawnSnake() {   // исправлено имя метода
    const x = getRandomInt(20, settings.canvasWidth - 20);
    const y = getRandomInt(20, settings.canvasHeight - 20);
    this.gameObjects.push(new Snake(x, y));
  }

  spawnCobra() {
    const x = getRandomInt(20, settings.canvasWidth - 20);
    const y = getRandomInt(20, settings.canvasHeight - 20);
    this.gameObjects.push(new Cobra(x, y));
  }
}