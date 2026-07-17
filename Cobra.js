// src/entities/Cobra.js
import { GameObject } from '../core/GameObject.js';
import { settings } from '../core/settings.js';
import { distance, getAngle, getRandomFloat } from '../core/utils.js';

export class Cobra extends GameObject {
  constructor(x, y, parentId = null) {
    const headRadius = 7;
    super(x, y, headRadius * 2, headRadius * 2, 'purple');
    this.radius = headRadius;
    this.body = [];
    this.direction = getRandomFloat(0, Math.PI * 2);
    this.speed = settings.cobraSpeed;
    this.hunger = 0;
    this.maxHunger = settings.cobraMaxHunger;
    this.hungerRate = settings.cobraHungerRate;
    this.foodValue = settings.cobraFoodValue;
    this.attackPower = settings.cobraAttackPower;
    this.age = 0;
    this.maxAge = settings.cobraMaxAge;
    this.creationTime = performance.now();
    this.parentId = parentId;
    this.isCarnivore = false;

    for (let i = 0; i < settings.cobraBodyLength; i++) {
      this.body.push({ x: this.x, y: this.y });
    }
  }

  update(deltaTime, gameContext) {
    if (!this.isAlive) return;

    this.age += deltaTime;
    if (this.age >= this.maxAge) {
      this.die();
      return;
    }

    this.hunger += this.hungerRate * deltaTime;
    if (this.hunger >= this.maxHunger) {
      this.die();
      return;
    }

    // Определяем поведение
    const snakes = gameContext?.snakes || [];
    const cobras = gameContext?.cobras || [];
    const apples = gameContext?.apples || [];

    const hungerPercent = this.hunger / this.maxHunger;

    // Проверяем, много ли змей вокруг для подавления каннибализма
    const nearbySnakes = snakes.filter(s => s.isAlive && distance(this.x, this.y, s.x, s.y) < 200).length;
    const canBeCannibal = hungerPercent > settings.cannibalThreshold && nearbySnakes < settings.cannibalStopSnakeCount;

    if (snakes.length > 0 && hungerPercent > 0.3) {
      // Ищем змей
      this.huntSnake(snakes);
      this.isCarnivore = true;
    } else if (canBeCannibal && cobras.length > 1) {
      // Каннибализм
      this.huntCobra(cobras);
      this.isCarnivore = true;
    } else if (apples.length > 0 && hungerPercent > 0.2) {
      // Ищем яблоки
      this.lookForFood(apples);
      this.isCarnivore = false;
    } else {
      // Случайное движение
      if (Math.random() < 0.02) {
        this.direction += getRandomFloat(-0.5, 0.5);
      }
      this.isCarnivore = false;
    }

    this.move(deltaTime);

    if (this.canReproduce() && gameContext?.onReproduce) {
      gameContext.onReproduce(this);
    }
  }

  move(deltaTime) {
    this.body.unshift({ x: this.x, y: this.y });
    if (this.body.length > settings.cobraBodyLength) {
      this.body.pop();
    }

    const dx = Math.cos(this.direction) * this.speed * (deltaTime / 1000);
    const dy = Math.sin(this.direction) * this.speed * (deltaTime / 1000);
    this.x += dx;
    this.y += dy;

    const { canvasWidth, canvasHeight } = settings;
    if (this.x < this.radius) { this.x = this.radius; this.direction = Math.PI - this.direction; }
    if (this.x > canvasWidth - this.radius) { this.x = canvasWidth - this.radius; this.direction = Math.PI - this.direction; }
    if (this.y < this.radius) { this.y = this.radius; this.direction = -this.direction; }
    if (this.y > canvasHeight - this.radius) { this.y = canvasHeight - this.radius; this.direction = -this.direction; }
  }

 huntSnake(snakes) {
  let target = null;
  let minDist = Infinity;
  for (const snake of snakes) {
    if (!snake.isAlive) continue;
    const d = distance(this.x, this.y, snake.x, snake.y);
    if (d < settings.cobraViewRadius && d < minDist) {
      minDist = d;
      target = snake;
    }
  }
  if (target) {
    const angle = getAngle(this.x, this.y, target.x, target.y);
    this.direction += (angle - this.direction) * 0.15;
  }
}

  huntCobra(cobras) {
    // Ищем слабую (голодную) кобру, исключая себя
    let target = null;
    let maxHunger = -1;
    for (const cobra of cobras) {
      if (cobra === this || !cobra.isAlive) continue;
      if (cobra.hunger > maxHunger) {
        maxHunger = cobra.hunger;
        target = cobra;
      }
    }
    if (target) {
      const angle = getAngle(this.x, this.y, target.x, target.y);
      this.direction += (angle - this.direction) * 0.15;
    }
  }

  lookForFood(apples) {
    if (!apples || apples.length === 0) return;
    let closest = null;
    let minDist = Infinity;
    for (const apple of apples) {
      if (!apple.isAlive) continue;
      const d = distance(this.x, this.y, apple.x, apple.y);
      if (d < minDist) {
        minDist = d;
        closest = apple;
      }
    }
    if (closest) {
      const angle = getAngle(this.x, this.y, closest.x, closest.y);
      this.direction += (angle - this.direction) * 0.1;
    }
  }

  eat(amount) {
    this.hunger = Math.max(0, this.hunger - amount);
  }

  canReproduce() {
    const satiety = 1 - this.hunger / this.maxHunger;
    return satiety >= settings.cobraReproductionThreshold && this.age > settings.cobraReproduceCooldown;
  }

  reproduce() {
    const angle = getRandomFloat(0, Math.PI * 2);
    const spawnX = this.x + Math.cos(angle) * 25;
    const spawnY = this.y + Math.sin(angle) * 25;
    return new Cobra(spawnX, spawnY, this.id);
  }

  die() {
    super.die();
  }

  draw(ctx) {
    // Тело
    ctx.fillStyle = this.color;
    for (const seg of this.body) {
      ctx.beginPath();
      ctx.arc(seg.x, seg.y, this.radius * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
    // Голова
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.isCarnivore ? 'red' : this.color;
    ctx.fill();
    // Глаза
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.x + 4, this.y - 3, 1.5, 0, Math.PI * 2);
    ctx.arc(this.x - 4, this.y - 3, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}