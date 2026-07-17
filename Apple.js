import { GameObject } from '../core/GameObject.js';
import { drawCircle } from '../core/canvas.js';
import { settings } from '../core/settings.js';
import { getRandomFloat } from '../core/utils.js';

export class Apple extends GameObject {
  constructor(x, y) {
    super(x, y, settings.appleRadius * 2, settings.appleRadius * 2, '#ff3333'); // ярко-красный
    this.radius = settings.appleRadius;
    this.foodValue = settings.foodPerApple;
    const lifespan = settings.appleLifespan;
    this.maxAge = lifespan > 0 ? lifespan + getRandomFloat(0, lifespan * settings.appleLifespanRandom) : Infinity;
    this.age = 0;
  }

  update(deltaTime) {
    if (this.maxAge === Infinity) return;
    this.age += deltaTime;
    if (this.age >= this.maxAge) {
      this.die();
    }
  }

  draw(ctx) {
    drawCircle(ctx, this.x, this.y, this.radius, this.color);
  }
}