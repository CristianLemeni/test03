const width = window.innerWidth
const height = window.innerHeight

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
    this.load.image('fullscreenBtn', './assets/Button08.png')
    this.load.audio('explosionAudio', ['./assets/explosionCrunch_000.ogg'])
    this.load.audio('bkMusic', ['./assets/bkMusic.ogg'])
    this.load.atlas('smoke', './assets/smoke.png', './assets/smoke.json');
    this.load.atlas('fire', './assets/fire.png', './assets/fire.json');
    this.load.atlas('menuAssets', './assets/menuAssets.png', './assets/menuAssets.json')
    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
  },


  create() {
    let rootObj = this;
    this.score = 0
    this.gamePaused = false
    this.robotGroup = this.add.group()
    this.emitter = new Phaser.Events.EventEmitter();
    this.target = new Phaser.Math.Vector2();
    this.playerContainer = this.add.container()
    rootObj.mainMenu = rootObj.add.container()
    rootObj.endGameMenu = rootObj.add.container()
    const screenCenterX = rootObj.cameras.main.worldView.x + rootObj.cameras.main.width / 2;
    const screenCenterY = rootObj.cameras.main.worldView.y + rootObj.cameras.main.height / 2;
    rootObj.playerContainer.x = screenCenterX
    rootObj.playerContainer.y = screenCenterY
    rootObj.explosionAudio = this.sound.add('explosionAudio');
    gameState.robots = []
    rootObj.horizontalVelocity = 0
    rootObj.verticalVelocity = 0
    rootObj.isDead = false
    rootObj.speed = 200
    rootObj.robotSpeed = 25
    rootObj.joystickVisible = true
    rootObj.menuOpen = false
    rootObj.soundOn = 1
    rootObj.timer = 0
    rootObj.bkMusic = rootObj.sound.add('bkMusic', { volume: 0.25 });
    // rootObj.bkMusic.play({loop: true})
    rootObj.aGrid = new AlignGrid({ scene: rootObj, rows: 7, cols: 13 })
    rootObj.gameOver = false


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
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer, true)
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
    spawnTurrets([0, 12, 78, 90])
    createMenu()
    addUI()
    addScoreCounter()
    rootObj.aGrid.showNumbers()


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
        screenCenterX,
        screenCenterY,
        rootObj.turrets[i].x,
        rootObj.turrets[i].y,
        10000 - rootObj.robotSpeed)
      rootObj.children.bringToTop(rootObj.turrets[i])
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

    rootObj.events.on("spawnWave", () => {
      rootObj.scoreCounter.text = (parseInt(rootObj.scoreCounter.text) + 1).toString()
      if (rootObj.robotSpeed < 100) {
        rootObj.robotSpeed += 5
      }
      spawnEnemy(6)
      spawnEnemy(39)
      spawnEnemy(51)
      spawnEnemy(84)

      for (let i = 0; i < 4; i++) {
        shootProjectile(
          screenCenterX,
          screenCenterY,
          rootObj.turrets[i].x,
          rootObj.turrets[i].y,
          10000 - rootObj.robotSpeed)
        rootObj.children.bringToTop(rootObj.turrets[i])
      }
    })

    spawnEnemy(6)
    spawnEnemy(39)
    spawnEnemy(51)
    spawnEnemy(84)

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
      player.frame.y -= 10
      rootObj.playerContainer.add(player)
      Align.scaleToGameW(player, 0.1)
      player.body.setSize(Math.ceil(player.width / 3), player.height / 4, true);

      rootObj.physics.add.overlap(rootObj.playerContainer.list[0], rootObj.robotGroup, endGame, null, this);
      player.body.collideWorldBounds = true;
    }

    function shootProjectile(destX, destY, startX, startY, duration) {
      let atlasTexture = rootObj.textures.get('effects');
      let frames = atlasTexture.getFrameNames();
      let missile = rootObj.physics.add.sprite(startX, startY, 'effects', frames[2])
      Align.scaleToGameW(missile, 0.075)
      missile.body.setSize(missile.width / 2, missile.height / 2, true);
      rootObj.tweens.add({
        targets: missile,
        rotation: { value: 6.28319, duration: 1000 },
        loop: -1
      })

      rootObj.tweens.add({
        targets: missile,
        x: { value: destX, duration: duration },
        y: { value: destY, duration: duration },
        onComplete: () => {
          missile.destroy()
        }
      })
      rootObj.physics.add.overlap(rootObj.playerContainer.list[0], missile, endGame, null, this);
      rootObj.physics.add.overlap(rootObj.robotGroup, missile, (evt) => {
        evt.destroy()
        explode(evt.x, evt.y)
      }, null, this);
      gameState.missiles.push(missile)
      rootObj.children.bringToTop(rootObj.settingsBtn)
    }

    function spawnEnemy(pos) {
      let atlasTexture = rootObj.textures.get('enemy');
      let frames = atlasTexture.getFrameNames();
      let robot = rootObj.physics.add.sprite(0, 0, 'enemy', frames[0])
      rootObj.aGrid.placeAtIndex(pos, robot)
      Align.scaleToGameW(robot, 0.15)
      robot.body.setSize(robot.width / 3, robot.height / 3, true);
      robot.frame.x = 200
      robot.frame.y = 200
      smoke(robot.x, robot.y)
      const tx = rootObj.playerContainer.list[0].x
      const ty = rootObj.playerContainer.list[0].y

      robot.target = new Phaser.Math.Vector2(tx, ty)
      robot.speed = Math.floor(Math.pow(rootObj.robotSpeed, 1.2) + 2)
      robot.turnDegreesPerFrame = 1.25
      rootObj.robotGroup.add(robot)
      gameState.robots.push(robot)
    }

    function spawnTurrets(turretPos) {
      rootObj.turrets = []
      let turret1 = rootObj.physics.add.sprite(0, 0, 'turret')
      turret1.setRotation(0.785398)
      rootObj.aGrid.placeAtIndex(turretPos[0], turret1)
      Align.scaleToGameW(turret1, 0.075)
      rootObj.turrets.push(turret1)

      let turret2 = rootObj.physics.add.sprite(0, 0, 'turret')
      turret2.setRotation(-3.92699)
      rootObj.aGrid.placeAtIndex(turretPos[1], turret2)
      Align.scaleToGameW(turret2, 0.075)
      rootObj.turrets.push(turret2)

      let turret3 = rootObj.physics.add.sprite(0, 0, 'turret')
      turret3.setRotation(-0.785398)
      rootObj.aGrid.placeAtIndex(turretPos[2], turret3)
      Align.scaleToGameW(turret3, 0.075)
      rootObj.turrets.push(turret3)

      let turret4 = rootObj.physics.add.sprite(0, 0, 'turret')
      turret4.setRotation(3.92699)
      rootObj.aGrid.placeAtIndex(turretPos[3], turret4)
      Align.scaleToGameW(turret4, 0.075)
      rootObj.turrets.push(turret4)
    }

    function endGame() {
      if (!rootObj.isDead) {
        explode(rootObj.playerContainer.list[0].x, rootObj.playerContainer.list[0].y, rootObj.playerContainer)
        rootObj.isDead = true
        rootObj.time.delayedCall(500, () => {
          rootObj.playerContainer.visible = false
        })
      }
      clearInterval(followInt)
      rootObj.gameOver = true
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
      const vx = x * rootObj.speed
      const vy = y * rootObj.speed
      playerContainer.list[0].setVelocity(vx, vy)
    }

    function explode(x, y, container) {
      rootObj.explosionAudio.play();
      rootObj.anims.create({ key: 'fire', frames: rootObj.anims.generateFrameNames('fire'), frameRate: 5 });
      let atlasTexture = rootObj.textures.get('fire');
      let frames = atlasTexture.getFrameNames();
      let exp = rootObj.add.sprite(x, y, 'fire', frames[0])
      if (container) {
        container.add(exp)
      }
      exp.play('fire', false)
      exp.once('animationcomplete', () => {
        rootObj.tweens.add({
          targets: exp,
          alpha: { value: 0, duration: 500 },
          onComplete: () => {
            exp.destroy()
          }
        })
      });
    }

    function smoke(x, y) {
      rootObj.anims.create({ key: 'smoke', frames: rootObj.anims.generateFrameNames('smoke'), frameRate: 5 });
      let atlasTexture = rootObj.textures.get('smoke');
      let frames = atlasTexture.getFrameNames();
      let smk = rootObj.add.sprite(0, 0, 'smoke', frames[0])
      let container = rootObj.add.container()
      container.add(smk)
      container.setPosition(x, y)
      rootObj.tweens.add({
        targets: container,
        alpha: { value: 0, duration: 1000 }
      })
      smk.play('smoke')
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
      rootObj.aGrid.placeAtIndex(11, rootObj.settingsBtn)
      Align.scaleToGameW(rootObj.settingsBtn, 0.05)
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

      let fullScreen = rootObj.physics.add.sprite(0, 0, 'fullscreenBtn');
      rootObj.aGrid.placeAtIndex(9, fullScreen)
      Align.scaleToGameW(fullScreen, 0.05)
      fullScreen.setInteractive({ useHandCursor: true })
      fullScreen.on('pointerdown', () => {
        if (!rootObj.menuOpen) {
          if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
          } else if (document.body.webkitRequestFullscreen) { /* Safari */
            document.body.webkitRequestFullscreen();
          } else if (document.body.msRequestFullscreen) { /* IE11 */
            document.body.msRequestFullscreen();
          }
          rootObj.menuOpen = true
        }
      })

      fullScreen.on('pointerdown', () => {
        rootObj.menuOpen = false
      })
    }

    function createMenu() {
      let atlasTexture = rootObj.textures.get('menuAssets');
      let frames = atlasTexture.getFrameNames();
      let menuWindow = rootObj.physics.add.sprite(0, 0, 'menuAssets', frames[0]);
      rootObj.aGrid.placeAtIndex(45, menuWindow)
      Align.scaleToGameW(menuWindow, 0.5)

      rootObj.mainMenu.add(menuWindow)

      let soundBtnAct = rootObj.physics.add.sprite(0, 0, 'menuAssets', frames[1]);
      rootObj.aGrid.placeAtIndex(31, soundBtnAct)
      Align.scaleToGameW(soundBtnAct, 0.2)

      let soundText = rootObj.add.text(0, 0, 'Sound', { font: "34px" })
      rootObj.aGrid.placeAtIndex(31, soundText)
      Align.scaleToGameW(soundText, 0.175)
      soundText.setOrigin(0.5)

      let soundSwitchOn = rootObj.physics.add.sprite(0, 0, 'menuAssets', frames[3]);
      rootObj.aGrid.placeAtIndex(33, soundSwitchOn)
      Align.scaleToGameW(soundSwitchOn, 0.075)

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

      let soundSwitchOff = rootObj.physics.add.sprite(0, 0, 'menuAssets', frames[4]);
      rootObj.aGrid.placeAtIndex(33, soundSwitchOff)
      Align.scaleToGameW(soundSwitchOff, 0.075)

      soundSwitchOff.setInteractive({ useHandCursor: true })
      soundSwitchOff.visible = !rootObj.soundOn
      soundSwitchOff.on('pointerdown', () => {
        soundSwitchOn.visible = true
        soundSwitchOff.visible = false
        playSound()
      })
      rootObj.mainMenu.add(soundSwitchOff)

      let scoreBtn = rootObj.physics.add.sprite(0, 0, 'menuAssets', frames[1]);
      rootObj.aGrid.placeAtIndex(45, scoreBtn)
      Align.scaleToGameW(scoreBtn, 0.2)

      let scoreText = rootObj.add.text(0, 0, 'Score', { font: "34px" });
      rootObj.aGrid.placeAtIndex(45, scoreText)
      Align.scaleToGameW(scoreText, 0.175)
      scoreText.setOrigin(0.5)

      rootObj.score = rootObj.add.text(0, 0, '0', { font: "40px" });
      rootObj.score.setOrigin(0.5)
      rootObj.aGrid.placeAtIndex(58, rootObj.score)
      Align.scaleToGameW(rootObj.score, 0.035 * rootObj.score.text.length)


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
      let menuWindow = rootObj.physics.add.sprite(0, 0, 'menuAssets', frames[0]);
      rootObj.aGrid.placeAtIndex(45, menuWindow)
      Align.scaleToGameW(menuWindow, 0.5)
      rootObj.endGameMenu.add(menuWindow)

      let scoreBtn = rootObj.physics.add.sprite(0, 0, 'menuAssets', frames[1]);
      rootObj.aGrid.placeAtIndex(45, scoreBtn)
      Align.scaleToGameW(scoreBtn, 0.2)

      let scoreText = rootObj.add.text(0, 0, 'Score', { font: "34px" });
      scoreText.setOrigin(0.5)
      rootObj.aGrid.placeAtIndex(45, scoreText)
      Align.scaleToGameW(scoreText, 0.175)
      Align.center(scoreText)

      let score = rootObj.add.text(0, 0, 'test', { font: "40px" });
      score.text = rootObj.score.text
      score.setOrigin(0.5)
      rootObj.aGrid.placeAtIndex(58, score)
      Align.scaleToGameW(score, 0.035 * score.text.length)

      rootObj.endGameMenu.add(scoreBtn)
      rootObj.endGameMenu.add(scoreText)
      rootObj.endGameMenu.add(score)

      let restartBtn = rootObj.physics.add.sprite(0, 0, 'menuAssets', frames[5]);
      rootObj.aGrid.placeAtIndex(71, restartBtn)
      Align.scaleToGameW(restartBtn, 0.075)
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
      rootObj.events.removeListener("spawnWave"); // remove all active events
      rootObj.scene.restart(); // restart current scene
      rootObj.sound.removeAll();
    }

    function addScoreCounter() {
      rootObj.scoreCounter = rootObj.add.text(0, 0, '0', {
        dropShadowAngle: 1.1,
        dropShadowBlur: 5,
        dropShadowDistance: 3,
        fill: "white",
        fontFamily: "Helvetica",
        fontSize: 75,
        letterSpacing: 1,
        lineHeight: 1,
        lineJoin: "round",
        miterLimit: 1,
        padding: 1,
        strokeThickness: 1,
        leading: 1
      })
      rootObj.scoreCounter.setOrigin(0.5)
      rootObj.aGrid.placeAtIndex(1, rootObj.scoreCounter)
      Align.scaleToGameW(rootObj.scoreCounter, 0.025)
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
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};


let game = new Phaser.Game(gameConf);
