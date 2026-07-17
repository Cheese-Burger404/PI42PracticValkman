// src/core/utils.js

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

export function distance(x1, y1, x2, y2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Универсальная проверка столкновения.
 * Если у объекта есть радиус — считаем по окружности, иначе AABB.
 */
export function isColliding(obj1, obj2) {
  const r1 = obj1.radius ?? Math.max(obj1.width, obj1.height) / 2;
  const r2 = obj2.radius ?? Math.max(obj2.width, obj2.height) / 2;
  const centersDistance = distance(obj1.x, obj1.y, obj2.x, obj2.y);
  return centersDistance < (r1 + r2);
}

export function getAngle(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}
