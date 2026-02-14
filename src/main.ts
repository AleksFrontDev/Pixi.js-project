import * as PIXI from 'pixi.js'

async function initGames() {
  const app = new PIXI.Application()
  await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0x1a1a1a
  })
  document.body.appendChild(app.canvas)

  function getRandomPositionFarFrom(
    avoidSprite1?: PIXI.Sprite,
    avoidSprite2?: PIXI.Sprite,
    minDistance: number = 80
  ) {
    let x, y
    const maxAttempts = 200

    for(let i = 0; i < maxAttempts; i++) {
      x = Math.random() * 780
      y = Math.random() * 580

      let valid = true

      if(avoidSprite1) {
        const dist1 = Math.hypot(x - avoidSprite1.x, y - avoidSprite1.y)
        if(dist1 < minDistance) valid = false
      }

      if(avoidSprite2 && valid) {
        const dist2 = Math.hypot(x - avoidSprite2.x, y - avoidSprite2.y)
        if(dist2 < minDistance) valid = false
      }

      if(valid) return { x, y }
    }

    return { x, y }
  }

  function restartGame() {
    score = 0;
    scoreText.text = `Score: 0`;

    player.x = 100;
    player.y = 150;

    const coinPos = getRandomPositionFarFrom(enemy, undefined, 60);
    coin.x = coinPos.x;
    coin.y = coinPos.y;

    const enemyPos = getRandomPositionFarFrom(player, coin, 120);
    enemy.x = enemyPos.x;
    enemy.y = enemyPos.y;

    enemyMoveTimer = 0;
    enemyDirX = (Math.random() - 0.5) * 2;
    enemyDirY = (Math.random() - 0.5) * 2;

    app.ticker.start();
  }

  const keys: Record<string, boolean> = {};

  window.addEventListener('keydown', (e) => (keys[e.key] = true));
  window.addEventListener('keyup', (e) => (keys[e.key] = false));

  // Player
  const texture = await PIXI.Assets.load('player.png');
  const player = new PIXI.Sprite(texture);
  player.x = 100;
  player.y = 150;
  player.scale.set(0.1, 0.1);
  player.anchor.set(0.5, 0.5);
  app.stage.addChild(player);

  //Coin
  const coin = new PIXI.Sprite(PIXI.Texture.WHITE);
  coin.tint = 0xffaa00;
  coin.width = 20;
  coin.height = 20;

  const startCoinPos = getRandomPositionFarFrom(player, undefined, 100);
  coin.x = startCoinPos.x;
  coin.y = startCoinPos.y;
  app.stage.addChild(coin);

  //Enemy
  const enemyTexture = await PIXI.Assets.load('enemy.png');
  const enemy = new PIXI.Sprite(enemyTexture);

  const startEnemyPos = getRandomPositionFarFrom(player, coin, 120);
  enemy.x = startEnemyPos.x;
  enemy.y = startEnemyPos.y;

  enemy.scale.set(0.1, 0.1);
  enemy.anchor.set(0.5, 0.5);
  app.stage.addChild(enemy);

  //Score
  let score = 0;
  const scoreText = new PIXI.Text(`Score: ${score}`, {
    fill: 0xffffff,
    fontSize: 24,
  });
  scoreText.x = 10;
  scoreText.y = 10;
  app.stage.addChild(scoreText);

  let enemyMoveTimer = 0;
  let enemySpeed = 2;
  let enemyDirX = (Math.random() - 0.5) * 2;
  let enemyDirY = (Math.random() - 0.5) * 2;

  app.ticker.add(() => {
    if (keys['ArrowUp']) player.y -= 5;
    if (keys['ArrowDown']) player.y += 5;
    if (keys['ArrowLeft']) player.x -= 5;
    if (keys['ArrowRight']) player.x += 5;

    const halfWidth = player.width / 2;
    const halfHeight = player.height / 2;

    if (player.x - halfWidth < 0) player.x = halfWidth;
    if (player.x + halfWidth > 800) player.x = 800 - halfWidth;
    if (player.y - halfHeight < 0) player.y = halfHeight;
    if (player.y + halfHeight > 600) player.y = 600 - halfHeight;

    enemyMoveTimer += 1;

    if (enemyMoveTimer >= 120) {
      enemyDirX = (Math.random() - 0.5) * 2;
      enemyDirY = (Math.random() - 0.5) * 2;
      enemyMoveTimer = 0;
    }

    enemy.x += enemyDirX * enemySpeed;
    enemy.y += enemyDirY * enemySpeed;

    const enemyHalfW = enemy.width / 2;
    const enemyHalfH = enemy.height / 2;

    if (enemy.x - enemyHalfW < 0) {
      enemy.x = enemyHalfW;
      enemyDirX *= -1;
    }
    if (enemy.x + enemyHalfW > 800) {
      enemy.x = 800 - enemyHalfW;
      enemyDirX *= -1;
    }
    if (enemy.y - enemyHalfH < 0) {
      enemy.y = enemyHalfH;
      enemyDirY *= -1;
    }
    if (enemy.y + enemyHalfH > 600) {
      enemy.y = 600 - enemyHalfH;
      enemyDirY *= -1;
    }

    if (Math.hypot(player.x - coin.x, player.y - coin.y) < 30) {
      if (score >= 5) {
        alert('Congratulations! You`re winner!');
        app.ticker.stop();
        restartGame();
        return;
      }
      score++;
      scoreText.text = `Score: ${score}`;

      const newCoinPos = getRandomPositionFarFrom(enemy, undefined, 60);
      coin.x = newCoinPos.x;
      coin.y = newCoinPos.y;
    }

    if (Math.hypot(player.x - enemy.x, player.y - enemy.y) < 30) {
      alert('Game Over! You touched the enemy!');
      app.ticker.stop();
      restartGame();
      return;
    }
  });

  window.addEventListener('keydown', (e) => {
    console.log('key:', e.key)
    console.log('code:', e.code)
  })
}

initGames().catch(console.error)
