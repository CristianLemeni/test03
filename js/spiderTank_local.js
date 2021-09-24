const width = 1920
const height = 1080

const gameState = {
  robots: [],
  missiles: []
}
let followInt

const spiderTank = {

  preload() {
    this.load.atlas('player', './assets/player.png', './assets/player.json');
    this.load.atlas('enemy', './assets/robot.png', './assets/robot.json');
    this.load.atlas('effects', './assets/effects.png', './assets/effects.json');
    this.load.atlas('background', './assets/background.png', './assets/background.json');
    this.load.image('turret', './assets/turret.png');
    this.load.audio('explosionAudio', ['./assets/explosionCrunch_000.ogg'])
    this.load.audio('bkMusic', ['./assets/Deus Ex Tempus.ogg'])
    this.load.atlas('explosion', './assets/explosion.png', './assets/explosion.json');
    this.load.atlas('menuAssets', './assets/menuAssets.png', './assets/menuAssets.json')
    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
  },


  create() {
    let rootObj = this;
    this.score = 0
    this.difficulty = 0
    this.gamePaused = false
    this.robotGroup = this.add.group()
    this.emitter = new Phaser.Events.EventEmitter();
    this.target = new Phaser.Math.Vector2();
    this.playerContainer = this.add.container()
    rootObj.mainMenu = rootObj.add.container()
    rootObj.endGameMenu = rootObj.add.container()
    this.nextX = getRandomInt(this.playerContainer.width * 2, this.cameras.main.worldView.x + this.cameras.main.width * 0.9)
    this.nextY = getRandomInt(this.playerContainer.height * 2, this.cameras.main.worldView.y + this.cameras.main.height * 0.9)
    const screenCenterX = rootObj.cameras.main.worldView.x + rootObj.cameras.main.width / 2;
    const screenCenterY = rootObj.cameras.main.worldView.y + rootObj.cameras.main.height / 2;
    rootObj.playerContainer.x = screenCenterX
    rootObj.playerContainer.y = screenCenterY
    rootObj.explosionAudio = this.sound.add('explosionAudio');
    gameState.robots = []
    rootObj.horizontalVelocity = 0
    rootObj.verticalVelocity = 0
    rootObj.isDead = false
    rootObj.lastX = 0
    rootObj.lastY = 0
    rootObj.speed = 200
    rootObj.joystickVisible = true
    rootObj.menuOpen = false
    rootObj.soundOn = 1
    rootObj.timer = 0
    rootObj.bkMusic = rootObj.sound.add('bkMusic', { volume: 0.25 });
    rootObj.bkMusic.play({loop: true})


    // KEYS WSAD
    rootObj.keyW = rootObj.input.keyboard.addKey('W');
    rootObj.keyW.on('down', () => {
      rootObj.verticalVelocity--
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer, true)
    })
    rootObj.keyW.on('up', () => {
      if (rootObj.verticalVelocity < 0) {
        rootObj.verticalVelocity++
      }
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer, true)
    })
    rootObj.keyA = rootObj.input.keyboard.addKey('A');
    rootObj.keyA.on('down', () => {
      rootObj.horizontalVelocity--
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer, true)
    })
    rootObj.keyA.on('up', () => {
      if (rootObj.horizontalVelocity < 0) {
        rootObj.horizontalVelocity++
      }
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer.list[0], true)
    })
    rootObj.keyS = rootObj.input.keyboard.addKey('S');
    rootObj.keyS.on('down', () => {
      rootObj.verticalVelocity++
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer, true)
    })
    rootObj.keyS.on('up', () => {
      if (rootObj.verticalVelocity > 0) {
        rootObj.verticalVelocity--
      }
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer, true)
    })
    rootObj.keyD = rootObj.input.keyboard.addKey('D');
    rootObj.keyD.on('down', () => {
      rootObj.horizontalVelocity++
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer, true)
    })
    rootObj.keyD.on('up', () => {
      if (rootObj.horizontalVelocity > 0) {
        rootObj.horizontalVelocity--
      }
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer, true)
    })

    //arrows
    rootObj.keyW = rootObj.input.keyboard.addKey('up');
    rootObj.keyW.on('down', () => {
      rootObj.verticalVelocity--
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer, true)
    })
    rootObj.keyW.on('up', () => {
      rootObj.verticalVelocity++
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer, true)
    })
    rootObj.keyA = rootObj.input.keyboard.addKey('left');
    rootObj.keyA.on('down', () => {
      rootObj.horizontalVelocity--
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer, true)
    })
    rootObj.keyA.on('up', () => {
      rootObj.horizontalVelocity++
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer, true)
    })
    rootObj.keyS = rootObj.input.keyboard.addKey('down');
    rootObj.keyS.on('down', () => {
      rootObj.verticalVelocity++
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer, true)
    })
    rootObj.keyS.on('up', () => {
      rootObj.verticalVelocity--
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer, true)
    })
    rootObj.keyD = rootObj.input.keyboard.addKey('right');
    rootObj.keyD.on('down', () => {
      rootObj.horizontalVelocity++
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer, true)
    })
    rootObj.keyD.on('up', () => {
      rootObj.horizontalVelocity--
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer, true)
    })

    this.emitter.on("ResetGame", () => {
      showEndGameMenu()
    })

    addBackground()
    addPlayer()
    spawnTurrets([{ x: 50, y: 50 }, { x: 1850, y: 50 }, { x: 1850, y: 1000 }, { x: 50, y: 1000 }])
    createMenu()
    addUI()

    rootObj.joyStick = rootObj.plugins.get('rexvirtualjoystickplugin').add(rootObj, {
      x: screenCenterX,
      y: rootObj.cameras.main.worldView.y + rootObj.cameras.main.height * 0.85,
      radius: 50,
      base: rootObj.add.circle(0, 0, 50, 0x888888),
      thumb: rootObj.add.circle(0, 0, 25, 0xcccccc),
    }).on('update', joystickFunction, rootObj);
    rootObj.joyStick.setVisible(false);

    dynamicJoystick()
    addEndGameMenu()

    for (let i = 0; i < 4; i++) {
      shootProjectile(
        this.playerContainer.x + this.playerContainer.list[0].x,
        this.playerContainer.y + this.playerContainer.list[0].y,
        rootObj.turrets[i].x,
        rootObj.turrets[i].y,
        10000)
    }

    followInt = setInterval(() => {
      for (let i = 0; i < gameState.robots.length; i++) {
        let target = { x: this.playerContainer.x + this.playerContainer.list[0].x, y: this.playerContainer.y + this.playerContainer.list[0].y }
        let robot = gameState.robots[i]
        const targetAngle = Phaser.Math.Angle.Between(
          robot.x, robot.y,
          target.x, target.y
        )

        // clamp to -PI to PI for smarter turning
        let diff = Phaser.Math.Angle.Wrap(targetAngle - robot.rotation)

        // set to targetAngle if less than turnDegreesPerFrame
        if (Math.abs(diff) < Phaser.Math.DegToRad(robot.turnDegreesPerFrame)) {
          robot.rotation = targetAngle;
        }
        else {
          let angle = robot.angle
          if (diff > 0) {
            // turn clockwise
            angle += robot.turnDegreesPerFrame
          }
          else {
            // turn counter-clockwise
            angle -= robot.turnDegreesPerFrame
          }

          robot.setAngle(angle)
        }

        // move missile in direction facing
        const vx = Math.cos(robot.rotation) * robot.speed
        const vy = Math.sin(robot.rotation) * robot.speed
        try {
          robot.body.velocity.x = vx
          robot.body.velocity.y = vy
        } catch (error) {

        }
      }
    }, 1)

    this.events.on("spawnWave", () => {
      spawnEnemy(getRandomInt(-100, -50), getRandomInt(0, 1500))
      spawnEnemy(getRandomInt(0, 1800), getRandomInt(-100, -50))
      spawnEnemy(getRandomInt(1500, 2000), getRandomInt(0, 1500))
      spawnEnemy(getRandomInt(0, 1800), getRandomInt(1000, 1500))

      for (let i = 0; i < 4; i++) {
        shootProjectile(
          this.playerContainer.x + this.playerContainer.list[0].x,
          this.playerContainer.y + this.playerContainer.list[0].y,
          rootObj.turrets[i].x,
          rootObj.turrets[i].y,
          10000)
      }
    })

    spawnEnemy(getRandomInt(-100, -50), getRandomInt(0, 1500))
    spawnEnemy(getRandomInt(0, 1800), getRandomInt(-100, -50))
    spawnEnemy(getRandomInt(1500, 2000), getRandomInt(0, 1500))
    spawnEnemy(getRandomInt(0, 1800), getRandomInt(1000, 1500))

    this.children.bringToTop(this.playerContainer);
    this.children.bringToTop(this.robot);
    this.children.bringToTop(this.mainMenu);
    this.children.bringToTop(this.settingsBtn)

    function addBackground() {
      let atlasTexture = rootObj.textures.get('background');
      let frames = atlasTexture.getFrameNames();
      let ground = rootObj.physics.add.sprite(0, 0, 'background', frames[1]);
      ground.setOrigin(0, 0);
      ground.setAlpha(0)
      let x = 0
      let y = 0
      let groundTilesWidth = Math.ceil(width / ground.width)
      let groundTilesHeight = Math.ceil(height / ground.height)
      for (let i = 0; i < groundTilesWidth + 1; i++) {
        for (let j = 0; j < groundTilesHeight + 1; j++) {
          let g = rootObj.physics.add.sprite(x, y, 'background', frames[1]);
          g.setOrigin(0.1, 0.1);
          y += ground.height - g.height / 7
        }
        y = 0
        x += ground.width - ground.width / 7
      }

    }

    function addPlayer() {
      let atlasTexture = rootObj.textures.get('player');
      let frames = atlasTexture.getFrameNames();
      let player = rootObj.physics.add.sprite(0, 0, 'player', frames[0]);
      rootObj.playerContainer.add(player)

      player.body.setSize(Math.ceil(player.width / 3), player.height / 4, true);

      rootObj.physics.add.overlap(rootObj.playerContainer.list[0], rootObj.robotGroup, endGame, null, this);
      player.body.collideWorldBounds = true;
    }

    function shootProjectile(destX, destY, startX, startY, speed) {
      let atlasTexture = rootObj.textures.get('effects');
      let frames = atlasTexture.getFrameNames();
      let missile = rootObj.physics.add.sprite(startX, startY, 'effects', frames[2])
      missile.body.setSize(missile.width / 2, missile.height / 2, true);
      rootObj.tweens.add({
        targets: missile,
        rotation: { value: 6.28319, duration: 1000 },
        loop: -1
      })

      rootObj.tweens.add({
        targets: missile,
        x: { value: destX, duration: speed },
        y: { value: destY, duration: speed },
        onComplete: () => {
          missile.destroy()
        }
      })
      rootObj.physics.add.overlap(rootObj.playerContainer.list[0], missile, endGame, null, this);
      rootObj.physics.add.overlap(rootObj.robotGroup, missile, (evt) => {
        missile.destroy()
        evt.destroy()
      }, null, this);
      gameState.missiles.push(missile)
      rootObj.children.bringToTop(rootObj.settingsBtn)
    }

    function spawnEnemy(x, y) {
      let atlasTexture = rootObj.textures.get('enemy');
      let frames = atlasTexture.getFrameNames();
      let robot = rootObj.physics.add.sprite(x, y, 'enemy', frames[0])
      robot.setScale(0.25)
      robot.body.setSize(robot.width / 2, robot.height / 2, true);
      robot.frame.x = 200
      robot.frame.y = 200
      const tx = rootObj.playerContainer.list[0].x
      const ty = rootObj.playerContainer.list[0].y

      robot.target = new Phaser.Math.Vector2(tx, ty)

      robot.turnDegreesPerFrame = 1.25
      robot.speed = 100
      rootObj.robotGroup.add(robot)
      gameState.robots.push(robot)
    }

    function spawnTurrets(turretPos) {
      rootObj.turrets = []
      let turret1 = rootObj.physics.add.sprite(turretPos[0].x, turretPos[0].y, 'turret')
      turret1.setScale(0.25)
      rootObj.turrets.push(turret1)

      let turret2 = rootObj.physics.add.sprite(turretPos[1].x, turretPos[1].y, 'turret')
      turret2.setScale(0.25)
      rootObj.turrets.push(turret2)

      let turret3 = rootObj.physics.add.sprite(turretPos[2].x, turretPos[2].y, 'turret')
      turret3.setScale(0.25)
      rootObj.turrets.push(turret3)

      let turret4 = rootObj.physics.add.sprite(turretPos[3].x, turretPos[3].y, 'turret')
      turret4.setScale(0.25)
      rootObj.turrets.push(turret4)
    }

    function endGame() {
      if (!rootObj.isDead) {
        explode(rootObj.playerContainer.list[0].x, rootObj.playerContainer.list[0].y, rootObj.playerContainer)
        rootObj.isDead = true
        rootObj.time.delayedCall(150, () => {
          rootObj.playerContainer.visible = false
        })
      }
      clearInterval(followInt)
      showEndGameMenu()
    }

    function setPlayerVelocity(x, y, playerContainer, key = false) {
      if (key) {
        rootObj.target.x = playerContainer.x + x
        rootObj.target.y = playerContainer.y + y
      }
      else {
        rootObj.target.x += x
        rootObj.target.y += y
      }
      playerContainer.list[0].setVelocity(x * rootObj.speed, y * rootObj.speed)
    }

    function explode(x, y, container) {
      rootObj.explosionAudio.play();
      rootObj.anims.create({ key: 'explode', frames: rootObj.anims.generateFrameNames('explosion'), frameRate: 30 });
      let atlasTexture = rootObj.textures.get('explosion');
      let frames = atlasTexture.getFrameNames();
      let exp = rootObj.add.sprite(x, y, 'explosion', frames[14])
      container.add(exp)
      exp.play('explode')
    }

    function joystickFunction() {
      rootObj.target.x = rootObj.playerContainer.x
      rootObj.target.y = rootObj.playerContainer.y
      let cursorKeys = rootObj.joyStick.createCursorKeys();

      let s = ''
      for (var name in cursorKeys) {
        if (cursorKeys[name].isDown) {
          s += name;
        }
      }
      switch (s) {
        case "down":
          setPlayerVelocity(0, 1, rootObj.playerContainer)
          break;
        case "up":
          setPlayerVelocity(0, -1, rootObj.playerContainer)
          break;
        case "left":
          setPlayerVelocity(-1, 0, rootObj.playerContainer)
          break;
        case "right":
          setPlayerVelocity(1, 0, rootObj.playerContainer)
          break;
        case "downright":
          setPlayerVelocity(1, 1, rootObj.playerContainer)
          break;
        case "upright":
          setPlayerVelocity(1, -1, rootObj.playerContainer)
          break;
        case "downleft":
          setPlayerVelocity(-1, 1, rootObj.playerContainer)
          break;
        case "upleft":
          setPlayerVelocity(-1, -1, rootObj.playerContainer)
          break;
        default:
          rootObj.playerContainer.list[0].body.stop()
      }
    }

    function dynamicJoystick() {
      rootObj.input.on('pointerdown', (pointer) => {
        if (!rootObj.menuOpen) {
          rootObj.joyStick.setVisible(true);
          rootObj.joyStick.x = pointer.x
          rootObj.joyStick.y = pointer.y
        }
      })
      rootObj.input.on('pointerup', (pointer) => {
        if (!rootObj.menuOpen) {
          rootObj.joyStick.setVisible(false);
        }
      })
    }

    function addUI() {
      let atlasTexture = rootObj.textures.get('menuAssets');
      let frames = atlasTexture.getFrameNames();
      rootObj.settingsBtn = rootObj.physics.add.sprite(0, 0, 'menuAssets', frames[2]);
      rootObj.settingsBtn.x = rootObj.cameras.main.worldView.width - rootObj.settingsBtn.width - 10
      rootObj.settingsBtn.y = rootObj.settingsBtn.height + 10
      rootObj.settingsBtn.setInteractive({ useHandCursor: true })
      rootObj.settingsBtn.on('pointerdown', () => {
        if (!rootObj.menuOpen) {
          openMenu()
          rootObj.menuOpen = true
        }
        else {
          closeMenu()
          rootObj.menuOpen = false
        }
      })
    }

    function createMenu() {
      let atlasTexture = rootObj.textures.get('menuAssets');
      let frames = atlasTexture.getFrameNames();
      let menuWindow = rootObj.physics.add.sprite(screenCenterX, screenCenterY, 'menuAssets', frames[0]);
      menuWindow.setScale(1.5)
      rootObj.mainMenu.add(menuWindow)

      let soundBtnAct = rootObj.physics.add.sprite(screenCenterX - 50, screenCenterY - 100, 'menuAssets', frames[1]);
      let soundText = rootObj.add.text(screenCenterX - 100, screenCenterY - 115, 'Sound', { font: "34px" })
      let soundSwitchOn = rootObj.physics.add.sprite(screenCenterX + 75, screenCenterY - 100, 'menuAssets', frames[3]);
      soundSwitchOn.setInteractive({ useHandCursor: true })
      soundSwitchOn.visible = rootObj.soundOn
      soundSwitchOn.on('pointerdown', () => {
        soundSwitchOff.visible = true
        soundSwitchOn.visible = false
        stopSound()
      })
      rootObj.mainMenu.add(soundBtnAct)
      rootObj.mainMenu.add(soundText)
      rootObj.mainMenu.add(soundSwitchOn)

      let soundSwitchOff = rootObj.physics.add.sprite(screenCenterX + 75, screenCenterY - 100, 'menuAssets', frames[4]);
      soundSwitchOff.setInteractive({ useHandCursor: true })
      soundSwitchOff.visible = !rootObj.soundOn
      soundSwitchOff.on('pointerdown', () => {
        soundSwitchOn.visible = true
        soundSwitchOff.visible = false
        playSound()
      })
      rootObj.mainMenu.add(soundSwitchOff)

      let scoreBtn = rootObj.physics.add.sprite(screenCenterX, screenCenterY, 'menuAssets', frames[1]);
      let scoreText = rootObj.add.text(screenCenterX - 50, screenCenterY - 15, 'Score', { font: "34px" });
      rootObj.score = rootObj.add.text(screenCenterX, screenCenterY + 25, '0', { font: "40px" });
      rootObj.score.x -= rootObj.score.width / 2
      rootObj.mainMenu.add(scoreBtn)
      rootObj.mainMenu.add(scoreText)
      rootObj.mainMenu.add(rootObj.score)

      rootObj.mainMenu.visible = false
    }

    function closeMenu() {
      resumeGame()
      rootObj.mainMenu.visible = false
    }

    function openMenu() {
      pauseGame()
      rootObj.children.bringToTop(rootObj.mainMenu)
      rootObj.mainMenu.visible = true
    }

    function stopSound() {
      rootObj.soundOn = 0
      rootObj.explosionAudio.setMute(true)
      rootObj.bkMusic.setMute(true)
    }

    function playSound() {
      rootObj.soundOn = 1
      rootObj.explosionAudio.setMute(false)
      rootObj.bkMusic.setMute(false)
    }

    function addEndGameMenu() {
      let atlasTexture = rootObj.textures.get('menuAssets');
      let frames = atlasTexture.getFrameNames();
      let menuWindow = rootObj.physics.add.sprite(screenCenterX, screenCenterY, 'menuAssets', frames[0]);
      menuWindow.setScale(1.5)
      rootObj.endGameMenu.add(menuWindow)

      let scoreBtn = rootObj.physics.add.sprite(screenCenterX, screenCenterY - 100, 'menuAssets', frames[1]);
      let scoreText = rootObj.add.text(screenCenterX - 50, screenCenterY - 115, 'Score', { font: "34px" });
      let score = rootObj.add.text(screenCenterX, screenCenterY - 75, 'test', { font: "40px" });
      score.text = rootObj.score.text
      score.x -= score.width / 2

      rootObj.endGameMenu.add(scoreBtn)
      rootObj.endGameMenu.add(scoreText)
      rootObj.endGameMenu.add(score)

      let restartBtn = rootObj.physics.add.sprite(screenCenterX, screenCenterY + 150, 'menuAssets', frames[5]);
      restartBtn.setInteractive({ useHandCursor: true })
      restartBtn.on('pointerdown', () => {
        resetGame()
      })
      rootObj.endGameMenu.add(restartBtn)

      rootObj.endGameMenu.visible = false
    }

    function showEndGameMenu() {
      rootObj.children.bringToTop(rootObj.endGameMenu)
      rootObj.endGameMenu.visible = true
      rootObj.settingsBtn.visible = false
      rootObj.physics.world.isPaused = true;
      rootObj.tweens.killAll();
    }

    function pauseGame() {
      rootObj.gamePaused = true
      rootObj.physics.world.isPaused = true;
      rootObj.tweens.pauseAll();
    }

    function resumeGame() {
      rootObj.gamePaused = false
      rootObj.physics.world.isPaused = false;
      rootObj.tweens.resumeAll();
    }

    function resetGame() {
      rootObj.registry.destroy(); // destroy registry
      rootObj.events.off(); // disable all active events
      rootObj.scene.restart(); // restart current scene
      rootObj.sound.removeAll();
    }
  },

  update() {
    if (this.timer >= 1000) {
      this.events.emit("spawnWave")
      this.timer = 0
    }
    else if (!this.gamePaused) {
      this.timer++
    }
    if (this.playerContainer) {
      const target = { x: this.playerContainer.x + this.playerContainer.list[0].x, y: this.playerContainer.y + this.playerContainer.list[0].y }

      const tx = target.x
      const ty = target.y

      let x1 = this.turrets[0].x
      let y1 = this.turrets[0].y

      let rotation1 = Phaser.Math.Angle.Between(x1, y1, tx, ty)
      this.turrets[0].setRotation(rotation1)

      let x2 = this.turrets[1].x
      let y2 = this.turrets[1].y

      let rotation2 = Phaser.Math.Angle.Between(x2, y2, tx, ty)
      this.turrets[1].setRotation(rotation2)

      let x3 = this.turrets[2].x
      let y3 = this.turrets[2].y

      let rotation3 = Phaser.Math.Angle.Between(x3, y3, tx, ty)
      this.turrets[2].setRotation(rotation3)

      let x4 = this.turrets[3].x
      let y4 = this.turrets[3].y

      let rotation4 = Phaser.Math.Angle.Between(x4, y4, tx, ty)
      this.turrets[3].setRotation(rotation4)

      if (this.playerContainer.list[0].body) {
        let distance = Phaser.Math.Distance.Between(this.playerContainer.list[0].x, this.playerContainer.list[0].y, this.target.x, this.target.y);
        if (this.playerContainer.list[0].body.speed > 0) {
          if (distance < 1) {
            this.playerContainer.list[0].body.stop()
          }
        }
      }

    }
  },

}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



const gameConf = {
  type: Phaser.AUTO,
  width: width,
  height: height,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: spiderTank,
  scale: {
    mode: Phaser.Scale.FIT
  }
};


let game = new Phaser.Game(gameConf);
