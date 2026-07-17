// src/core/GameObject.js

//Счетчик для генерации уникальных ID объектов 
let idCounter = 0;

// Базовый класс для всех игровых объектов.
 Обеспечивает общие свойства и интерфейс.
 
export class GameObject {
  /**
   * param {number} x      - координата X
   * param {number} y      - координата Y
   * param {number} width  - ширина объекта
   * param {number} height - высота объекта
   * param {string} [color='white'] - цвет объекта
   */
  constructor(x, y, width, height, color = 'white') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.id = ++idCounter;        // уникальный идентификатор
    this.isAlive = true;         // объект "жив" по умолчанию
  }

  /*
   * Абстрактный метод рисования объекта на Canvas.
   * Должен быть переопределён в подклассах.
   * Базовая реализация рисует залитый прямоугольник для отладки.
   *{CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    // Отрисовка по умолчанию — цветной прямоугольник
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  /*
   * Абстрактный метод обновления состояния объекта.
   * Должен быть переопределён в подклассах.
   * param {number} deltaTime   - время, прошедшее с предыдущего кадра (мс)
   * param {object} [gameContext] - опциональный контекст например, список всех объектов   */
  update(deltaTime, gameContext) {
    // Базовая реализация ничего не делает (для статичных объектов)
    // Подклассы (Snake, Cobra) переопределят этот метод
  }

  /**
   * Простейшая проверка столкновения двух прямоугольников (AABB).
   * param {GameObject} other - другой объект
   * returns {boolean} true, если объекты пересекаются
   */
  collidesWith(other) {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  /**
   * Устанавливает объект как мёртвый.
   */
  die() {
    this.isAlive = false;
  }
}