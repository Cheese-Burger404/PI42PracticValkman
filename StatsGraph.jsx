// StatsGraph.jsx
import { useRef, useEffect } from 'react';

const GRAPH_WIDTH = 800;
const GRAPH_HEIGHT = 150;
const MIN_UNITS_PER_PX = 10;
const MAX_UNITS_PER_PX = 50;

function StatsGraph({ history }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, GRAPH_WIDTH, GRAPH_HEIGHT);

    if (!history || history.length === 0) return;

    let maxValue = 0;
    for (const point of history) {
      maxValue = Math.max(
        maxValue,
        point.snakes ?? 0,
        point.cobras ?? 0,
        point.apples ?? 0
      );
    }

    // Защита от деления на ноль и слишком маленького масштаба
    let unitsPerPixel = maxValue > 0 ? maxValue / GRAPH_HEIGHT : 1;
    unitsPerPixel = Math.max(unitsPerPixel, MIN_UNITS_PER_PX);
    unitsPerPixel = Math.min(unitsPerPixel, MAX_UNITS_PER_PX);

    const stepX = history.length > 1 ? GRAPH_WIDTH / (history.length - 1) : GRAPH_WIDTH;

    const yPos = (value) => GRAPH_HEIGHT - (value / unitsPerPixel);

    const drawLine = (dataKey, color) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      history.forEach((point, i) => {
        const x = i * stepX;
        const y = yPos(point[dataKey] ?? 0);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    drawLine('snakes', '#4caf50');
    drawLine('cobras', '#9c27b0');
    drawLine('apples', '#f44336');

    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.fillText(`Масштаб: 1px = ${unitsPerPixel.toFixed(1)} ед.`, 10, 15);
  }, [history]);

  return (
    <canvas
      ref={canvasRef}
      width={GRAPH_WIDTH}
      height={GRAPH_HEIGHT}
      style={{background: 'white', border: '1px solid #ccc', display: 'block' }}
    />
  );
}

export default StatsGraph;
