//src/entities/Snake.js
import { GameObject } from '../core/GameObject.js';
import { settings } from '../core/settings.js';
import { distance, getAngle, getRandomFloat } from '../core/utils.js';

export class Snake extends GameObject {
  constructor(x, y, parentId = null) {
    // Размер змеи-радиус головы
    const headRadius = 6;
    super(x, y, headRadius * 2, headRadius * 2, 'green');
    this.radius = headRadius;
    this.body = [];          // массив точек {x, y} предыдущих позиций головы
    this.direction = getRandomFloat(0, Math.PI * 2); // случайный угол
    this.speed = settings.snakeSpeed;
    this.hunger = 0;
    this.maxHunger = settings.snakeMaxHunger;
    this.hungerRate = settings.snakeHungerRate;
    this.foodValue = settings.snakeFoodValue;
    this.age = 0;
    this.maxAge = settings.snakeMaxAge;
    this.creationTime = performance.now();
    this.parentId = parentId;
    this.isHungry = false;
    this.lastReproduceTime = 0;

    // Заполняем тело начальными позициями-позади головы
    for (let i = 0; i < settings.snakeBodyLength; i++) {
      this.body.push({ x: this.x, y: this.y });
    }
  }

  update(deltaTime, gameContext) {
    if (!this.isAlive) return;

    // Возраст
    this.age += deltaTime;
    if (this.age >= this.maxAge) {
      this.die();
      return;
    }

    // Голод
    this.hunger += this.hungerRate * deltaTime;
    this.isHungry = this.hunger > this.maxHunger * 0.5;
    if (this.hunger >= this.maxHunger) {
      this.die();
      return;
    }

    // Ищем еду или двигаемся случайно
    this.lookForFood(gameContext?.apples || []);

    // Движение
    this.move(deltaTime);

    // Проверка на размножение
    if (this.canReproduce() && gameContext?.onReproduce) {
  const now = performance.now();
  if (now - this.lastReproduceTime > settings.snakeReproduceCooldown) {
    gameContext.onReproduce(this);
    this.lastReproduceTime = now;
  }
}
}
  move(deltaTime) {
    // Сохранить текущую позицию головы в начало тела
    this.body.unshift({ x: this.x, y: this.y });
    // Удаляем последний сегмент сохраняя длину
    if (this.body.length > settings.snakeBodyLength) {
      this.body.pop();
    }

    // Двигаем голову
    const dx = Math.cos(this.direction) * this.speed * (deltaTime / 1000);
    const dy = Math.sin(this.direction) * this.speed * (deltaTime / 1000);
    this.x += dx;
    this.y += dy;

    // Ограничение границами заворачиваем или отскакиваем
    const { canvasWidth, canvasHeight } = settings;
    if (this.x < this.radius) { this.x = this.radius; this.direction = Math.PI - this.direction; }
    if (this.x > canvasWidth - this.radius) { this.x = canvasWidth - this.radius; this.direction = Math.PI - this.direction; }
    if (this.y < this.radius) { this.y = this.radius; this.direction = -this.direction; }
    if (this.y > canvasHeight - this.radius) { this.y = canvasHeight - this.radius; this.direction = -this.direction; }
  }

  lookForFood(apples) {
  if (!apples || apples.length === 0) {
    if (Math.random() < 0.02) this.direction += getRandomFloat(-0.5, 0.5);
    return;
  }

  let closest = null;
  let minDist = Infinity;
  for (const apple of apples) {
    if (!apple.isAlive) continue;
    const d = distance(this.x, this.y, apple.x, apple.y);
    if (d < minDist && d < settings.snakeViewRadius) {
      minDist = d;
      closest = apple;
    }
  }

  if (closest) {
    const angle = getAngle(this.x, this.y, closest.x, closest.y);
    this.direction += (angle - this.direction) * 0.1;
  } else {
    // ничего не видно, движение случайное
    if (Math.random() < 0.02) this.direction += getRandomFloat(-0.5, 0.5);
  }
}

  eat(amount) {
    this.hunger = Math.max(0, this.hunger - amount);
  }

  canReproduce() {
    const satiety = 1 - this.hunger / this.maxHunger;
    return satiety >= (settings.snakeReproductionThreshold) &&( this.age > 2000); // взрослая
  }

  reproduce() {
    // Создаём потомка рядом
    const angle = getRandomFloat(0, Math.PI * 2);
    const spawnX = this.x + Math.cos(angle) * 20;
    const spawnY = this.y + Math.sin(angle) * 20;
    return new Snake(spawnX, spawnY, this.id);
  }

  die() {
    super.die();
  }

  draw(ctx) {
    // Рисуем тело
    ctx.fillStyle = this.color;
    for (const seg of this.body) {
      ctx.beginPath();
      ctx.arc(seg.x, seg.y, this.radius * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
    // Голова
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.isHungry ? 'orange' : this.color;
    ctx.fill();
    // Глаза (маленькие чёрные точки)
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.x + 3, this.y - 3, 1.5, 0, Math.PI * 2);
    ctx.arc(this.x - 3, this.y - 3, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}