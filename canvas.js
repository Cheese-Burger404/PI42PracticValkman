// src/core/canvas.js

// Возвращает объект canvas и его контекст по id.
 
export function initCanvas(canvasId, width, height) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) throw new Error(`Canvas with id "${canvasId}" not found`);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  return { canvas, ctx };
}

export function clearCanvas(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

export function drawRect(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

export function drawCircle(ctx, x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawText(ctx, text, x, y, color = 'white', font = '16px Arial') {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.fillText(text, x, y);
}