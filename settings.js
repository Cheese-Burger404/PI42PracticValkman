export const settings = {
  canvasWidth: 800,
  canvasHeight: 600,

  // Начальное количество
  initialSnakes: 5,
  initialCobras: 2,
  initialApples: 10,

  // Яблоки
  appleSpawnChance: 0.003,
  appleLifespan: 60000,          // 0 = не исчезают
  appleLifespanRandom: 0.5,
  foodPerApple: 20,
  appleRadius: 8,

  // Змеи
  snakeMaxHunger: 1000,
  snakeHungerRate: 0.015,
  snakeSpeed: 60,
  snakeMaxAge: 40000,
  snakeBodyLength: 5,
  snakeFoodValue: 15,
  snakeReproductionThreshold: 0.3,
  snakeReproduceCooldown: 5000,   // минимальный интервал между размножениями (мс)
  snakeViewRadius: 150,

  // Кобры
  cobraMaxHunger: 1500,
  cobraHungerRate: 0.02,
  cobraSpeed: 80,
  cobraMaxAge: 45000,
  cobraBodyLength: 6,
  cobraFoodValue: 60,
  cobraAttackPower: 50,
  cobraReproductionThreshold: 0.3,
  cobraReproduceCooldown: 6000,
  cobraViewRadius: 250,
  cannibalThreshold: 0.7,
  cannibalStopSnakeCount: 4,

  // Миграция
  snakeMigrationThreshold: 3,
  snakeMigrationAmount: 2,
  cobraMigrationThreshold: 2,
  cobraMigrationAmount: 1,

  // Ограничения популяции (доля от maxObjects)
  snakeMaxPercent: 0.3,
  cobraMaxPercent: 0.2,

  maxObjects: 2000,
};