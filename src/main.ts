import * as PIXI from 'pixi.js'

async function initGames() {
  const app = new PIXI.Application()
  await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0x1a1a1a
  })

  document.body.appendChild(app.canvas)

  const keys: Record<string, boolean> = {}

  window.addEventListener('keydown', (e) => keys[e.key] = true)
  window.addEventListener('keyup', (e) => keys[e.key] = false)

  const texture = await PIXI.Assets.load('player.png')

  const player = new PIXI.Sprite(texture)
  player.x = 100
  player.y = 150
  player.scale.set(0.1, 0.1)
  player.anchor.set(0.5, 0.5)
  app.stage.addChild(player)

  const coin = new PIXI.Sprite(PIXI.Texture.WHITE)
  coin.tint = 0xffaa00
  coin.width = 20
  coin.height = 20
  coin.x = Math.random() * 780
  coin.y = Math.random() * 580
  app.stage.addChild(coin)

  let score = 0
  const scoreText = new PIXI.Text(`Score: ${score}`,{
    fill: 0xffffff,
    fontSize: 24
  })
  scoreText.x = 10
  scoreText.y = 10
  app.stage.addChild(scoreText)


  app.ticker.add(() => {
  if (keys['ArrowUp'])    player.y -= 5
  if (keys['ArrowDown'])  player.y += 5
  if (keys['ArrowLeft'])  player.x -= 5
  if (keys['ArrowRight']) player.x += 5

  const halfWidth = player.width / 2
  const halfHeight = player.height / 2

  if (player.x - halfWidth < 0) player.x = halfWidth
  if (player.x + halfWidth > 800) player.x = 800 - halfWidth
  if (player.y - halfHeight < 0) player.y = halfHeight
  if (player.y + halfHeight > 600) player.y = 600 - halfHeight

  if(Math.hypot(player.x - coin.x, player.y - coin.y) < 30) {
    score ++
    scoreText.text = `Score: ${score}`
    coin.x = Math.random() * 780
    coin.y = Math.random() * 580
  }
})

  window.addEventListener('keydown', (e) => {
    console.log('key:', e.key)
    console.log('code:', e.code)
  })
}

initGames().catch(console.error)
