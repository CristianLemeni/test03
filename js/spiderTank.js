const width = 1920
const height = 1080

const gameState = {
  robots: [],
  missiles: []
}
let robotInt
let followInt
let missileInt
const spiderTank = {

  preload() {
    this.load.atlas('player', './assets/player.png', './assets/player.json');
    this.load.atlas('enemy', './assets/robot.png', './assets/robot.json');
    this.load.atlas('effects', './assets/effects.png', './assets/effects.json');
    this.load.atlas('background', './assets/background.png', './assets/background.json');
    this.load.image('turret', './assets/turret.png');
    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
    this.load.audio('explosionAudio', ['./assets/explosionCrunch_000.ogg'])
    this.load.atlas('explosion', './assets/explosion.png', './assets/explosion.json');

  },


  create() {
    let rootObj = this;
    this.score = 0
    this.difficulty = 0
    this.gamePaused = false
    this.textStyle = {
      "dropShadow": true,
      "dropShadowAngle": 1.1,
      "dropShadowBlur": 5,
      "dropShadowDistance": 3,
      "fill": "#0c6dd4",
      "fontFamily": "Courier New",
      "fontSize": 55,
      "letterSpacing": 1,
      "lineHeight": 1,
      "lineJoin": "round",
      "miterLimit": 1,
      "padding": 1,
      "stroke": "white",
      "strokeThickness": 8,
      "trim": true,
      "leading": 1
    }
    this.robotGroup = this.add.group()
    this.emitter = new Phaser.Events.EventEmitter();
    this.target = new Phaser.Math.Vector2();
    this.playerContainer = this.add.container()
    rootObj.mainMenu = rootObj.add.container()
    this.nextX = getRandomInt(this.playerContainer.width * 2, this.cameras.main.worldView.x + this.cameras.main.width * 0.9)
    this.nextY = getRandomInt(this.playerContainer.height * 2, this.cameras.main.worldView.y + this.cameras.main.height * 0.9)
    const screenCenterX = rootObj.cameras.main.worldView.x + rootObj.cameras.main.width / 2;
    const screenCenterY = rootObj.cameras.main.worldView.y + rootObj.cameras.main.height / 2;
    rootObj.playerContainer.x = screenCenterX
    rootObj.playerContainer.y = screenCenterY
    rootObj.explosionAudio = this.sound.add('explosionAudio');
    let x = 0
    let y = 0
    gameState.robots = []
    rootObj.horizontalVelocity = 0
    rootObj.verticalVelocity = 0
    rootObj.isDead = false
    rootObj.lastX = 0
    rootObj.lastY = 0
    rootObj.speed = 200

    let textStyle = {
      "dropShadow": true,
      "dropShadowAngle": 1.1,
      "dropShadowBlur": 5,
      "dropShadowDistance": 3,
      "fill": "#0c6dd4",
      "fontFamily": "Courier New",
      "fontSize": 55,
      "letterSpacing": 1,
      "lineHeight": 1,
      "lineJoin": "round",
      "miterLimit": 1,
      "padding": 1,
      "stroke": "white",
      "strokeThickness": 8,
      "trim": true,
      "leading": 1
    }

    // KEYS WSAD
    rootObj.keyW = rootObj.input.keyboard.addKey('W');
    rootObj.keyW.on('down', () => {
      rootObj.verticalVelocity--
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer.list[0], true)
    })
    rootObj.keyW.on('up', () => {
      if (rootObj.verticalVelocity < 0) {
        rootObj.verticalVelocity++
      }
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer.list[0], true)
    })
    rootObj.keyA = rootObj.input.keyboard.addKey('A');
    rootObj.keyA.on('down', () => {
      rootObj.horizontalVelocity--
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer.list[0], true)
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
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer.list[0], true)
    })
    rootObj.keyS.on('up', () => {
      if (rootObj.verticalVelocity > 0) {
        rootObj.verticalVelocity--
      }
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer.list[0], true)
    })
    rootObj.keyD = rootObj.input.keyboard.addKey('D');
    rootObj.keyD.on('down', () => {
      rootObj.horizontalVelocity++
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer.list[0], true)
    })
    rootObj.keyD.on('up', () => {
      if (rootObj.horizontalVelocity > 0) {
        rootObj.horizontalVelocity--
      }
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer.list[0], true)
    })

    //arrows
    rootObj.keyW = rootObj.input.keyboard.addKey('up');
    rootObj.keyW.on('down', () => {
      rootObj.verticalVelocity--
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer.list[0], true)
    })
    rootObj.keyW.on('up', () => {
      rootObj.verticalVelocity++
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer.list[0], true)
    })
    rootObj.keyA = rootObj.input.keyboard.addKey('left');
    rootObj.keyA.on('down', () => {
      rootObj.horizontalVelocity--
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer.list[0], true)
    })
    rootObj.keyA.on('up', () => {
      rootObj.horizontalVelocity++
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer.list[0], true)
    })
    rootObj.keyS = rootObj.input.keyboard.addKey('down');
    rootObj.keyS.on('down', () => {
      rootObj.verticalVelocity++
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer.list[0], true)
    })
    rootObj.keyS.on('up', () => {
      rootObj.verticalVelocity--
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer.list[0], true)
    })
    rootObj.keyD = rootObj.input.keyboard.addKey('right');
    rootObj.keyD.on('down', () => {
      rootObj.horizontalVelocity++
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer.list[0], true)
    })
    rootObj.keyD.on('up', () => {
      rootObj.horizontalVelocity--
      setPlayerVelocity(rootObj.horizontalVelocity, rootObj.verticalVelocity, rootObj.playerContainer.list[0], true)
    })

    this.emitter.on("ResetGame", () => {
      endGameMenu()
    })

    addBackground()
    addPlayer()
    spawnTurrets([{ x: 50, y: 50 }, { x: 1850, y: 50 }, { x: 1850, y: 850 }, { x: 50, y: 850 }])
    // rootObj.joyStick = rootObj.plugins.get('rexvirtualjoystickplugin').add(rootObj, {
    //   x: screenCenterX,
    //   y: rootObj.cameras.main.worldView.y + rootObj.cameras.main.height * 0.85,
    //   radius: 50,
    //   base: rootObj.add.circle(0, 0, 50, 0x888888),
    //   thumb: rootObj.add.circle(0, 0, 25, 0xcccccc),
    // }).on('update', joystickFunction, rootObj);

    dynamicJoystick()

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

    // spawnEnemy(getRandomInt(-100, -50), getRandomInt(0, 1500))
    // spawnEnemy(getRandomInt(0, 1800), getRandomInt(-100, -50))
    // spawnEnemy(getRandomInt(1500, 2000), getRandomInt(0, 1500))
    // spawnEnemy(getRandomInt(0, 1800), getRandomInt(1000, 1500))

    robotInt = setInterval(() => {
      spawnEnemy(getRandomInt(-100, -50), getRandomInt(0, 1500))
      spawnEnemy(getRandomInt(0, 1800), getRandomInt(-100, -50))
      spawnEnemy(getRandomInt(1500, 2000), getRandomInt(0, 1500))
      spawnEnemy(getRandomInt(0, 1800), getRandomInt(1000, 1500))
    }, 10000)

    missileInt = setInterval(() => {
      for (let i = 0; i < 4; i++) {
        shootProjectile(
          this.playerContainer.x + this.playerContainer.list[0].x,
          this.playerContainer.y + this.playerContainer.list[0].y,
          rootObj.turrets[i].x,
          rootObj.turrets[i].y,
          10000)
      }
    }, 10000)
    this.children.bringToTop(this.playerContainer);
    this.children.bringToTop(this.robot);
    this.children.bringToTop(this.mainMenu);



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
      player.setInteractive({ cursor: 'pointer' });
      rootObj.input.setDraggable(player);

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
      }
      clearInterval(robotInt)
      clearInterval(followInt)
      clearInterval(missileInt)
      rootObj.time.delayedCall(1000, () => {
        rootObj.registry.destroy(); // destroy registry
        rootObj.events.off(); // disable all active events
        rootObj.scene.restart(); // restart current scene
      })
    }

    function joystickFunction() {
      rootObj.target.x = rootObj.playerContainer.list[0].x
      rootObj.target.y = rootObj.playerContainer.list[0].y
      let cursorKeys = rootObj.joyStick.createCursorKeys();
      // rootObj.playerContainer

      let s = ''
      for (var name in cursorKeys) {
        if (cursorKeys[name].isDown) {
          s += name;
        }
      }
      switch (s) {
        case "down":
          setPlayerVelocity(0, 1, rootObj.playerContainer.list[0])
          break;
        case "up":
          setPlayerVelocity(0, -1, rootObj.playerContainer.list[0])
          break;
        case "left":
          setPlayerVelocity(-1, 0, rootObj.playerContainer.list[0])
          break;
        case "right":
          setPlayerVelocity(1, 0, rootObj.playerContainer.list[0])
          break;
        case "downright":
          setPlayerVelocity(1, 1, rootObj.playerContainer.list[0])
          break;
        case "upright":
          setPlayerVelocity(1, -1, rootObj.playerContainer.list[0])
          break;
        case "downleft":
          setPlayerVelocity(-1, 1, rootObj.playerContainer.list[0])
          break;
        case "upleft":
          setPlayerVelocity(-1, -1, rootObj.playerContainer.list[0])
          break;
        default:
          rootObj.playerContainer.list[0].body.stop()
      }
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
      rootObj.physics.moveToObject(playerContainer, rootObj.target, 200);
    }

    function explode(x, y, container) {
      // rootObj.explosionAudio.play();
      rootObj.anims.create({ key: 'explode', frames: rootObj.anims.generateFrameNames('explosion'), frameRate: 30 });
      let atlasTexture = rootObj.textures.get('explosion');
      let frames = atlasTexture.getFrameNames();
      let exp = rootObj.add.sprite(x, y, 'explosion', frames[14])
      container.add(exp)
      exp.play('explode')
    }

    function dynamicJoystick() {
      rootObj.joystick = nipplejs.create({
        zone: document.getElementById('gameContainer'),
        mode: 'dynamic',
        color: 'gray'
      });

      rootObj.joystick.on("move", (evt, data) => {
        if (data.angle.degree) {
          if (data.angle.degree >= 0) {
            rootObj.lastX = rootObj.speed
            rootObj.lastY = 0
          }
          if (data.angle.degree >= 25) {
            rootObj.lastX = rootObj.speed
            rootObj.lastY = -rootObj.speed
          }
          if (data.angle.degree >= 65) {
            rootObj.lastX = 0
            rootObj.lastY = -rootObj.speed
          }
          if (data.angle.degree >= 115) {
            rootObj.lastX = -rootObj.speed
            rootObj.lastY = -rootObj.speed
          }
          if (data.angle.degree >= 155) {
            rootObj.lastX = -rootObj.speed
            rootObj.lastY = 0
          }
          if (data.angle.degree >= 205) {
            rootObj.lastX = -rootObj.speed
            rootObj.lastY = rootObj.speed
          }
          if (data.angle.degree >= 215) {
            rootObj.lastX = 0
            rootObj.lastY = rootObj.speed
          }
          if (data.angle.degree >= 265) {
            rootObj.lastX = rootObj.speed
            rootObj.lastY = rootObj.speed
          }
          if (data.angle.degree >= 335) {
            rootObj.lastX = rootObj.speed
            rootObj.lastY = 0
          }
          console.log(data)
        }
        rootObj.playerContainer.list[0].setVelocity(rootObj.lastX, rootObj.lastY)
      })

      rootObj.joystick.on("start", () => {
        rootObj.mouseDown = true
      })

      rootObj.joystick.on("end", () => {
        rootObj.mouseDown = false
        rootObj.lastX = 0
        rootObj.lastY = 0
        rootObj.playerContainer.list[0].body.stop()
      })

      // let moveTimeline = new TimelineMax({repeat: -1})

      //   moveTimeline.add(() => {
      //       if(rootObj.mouseDown){
      //           move(rootObj.speed * 300 * rootObj.lastX, rootObj.speed * -300 * rootObj.lastY)
      //       }
      //   }, 0)
    }

    function move(x, y) {
      let initX = this.shipContainer.x
      let initY = this.shipContainer.y
      initX += x
      initY += y
      let timeline = new TimelineLite()
      if (0 < initX && window.innerWidth > initX) {
        timeline.to(this.shipContainer.position, { x: initX, duration: this.speed, ease: "none" }, 0)
      }
      if (0 < initY && window.innerHeight > initY) {
        timeline.to(this.shipContainer.position, { y: initY, duration: this.speed, ease: "none" }, 0)
      }

      return timeline
    }
  },

  update() {
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
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};


let game = new Phaser.Game(gameConf);

