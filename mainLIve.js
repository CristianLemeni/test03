export default class threeScene {
    constructor() {
    }
    init(container, GLTFLoader, ambientLightIntensity, spotlightIntensity) {
        this.scene = new THREE.Scene();
        this.container = container
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.width / this.height,
            0.1,
            1000000
        );

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMapSoft = true;
        container.appendChild(this.renderer.domElement);

        this.camera.forwardRotationScalar = 0
        this.camera.sideRotationScalar = 0

        this.camera.position.set(0, 20, 100);
        //resize
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.width, this.height);

            this.renderer.render(this.scene, this.camera)
        });

        this.currentTimelinePos = 0
        this.movementTimeline = gsap.timeline()

        this.raycaster = new THREE.Raycaster();

        this.index = 0
        this.spinAnim
        this.rotateCoords = { x: 0, y: 0, z: 0 }
        this.sceneAssets = [
            'https://raw.githubusercontent.com/HanSpringett/DearRider_Webflow_embedtest/main/assets/Building.gltf',
            'https://raw.githubusercontent.com/HanSpringett/DearRider_Webflow_embedtest/main/assets/Cubes.gltf',
            'https://raw.githubusercontent.com/HanSpringett/DearRider_Webflow_embedtest/main/assets/1979.gltf',
            'https://raw.githubusercontent.com/HanSpringett/DearRider_Webflow_embedtest/main/assets/1983.gltf',
            'https://raw.githubusercontent.com/HanSpringett/DearRider_Webflow_embedtest/main/assets/1986.gltf',
            'https://raw.githubusercontent.com/HanSpringett/DearRider_Webflow_embedtest/main/assets/1989.gltf',
            'https://raw.githubusercontent.com/HanSpringett/DearRider/main/assets/1993.gltf',
            'https://raw.githubusercontent.com/HanSpringett/DearRider/main/assets/1996.gltf',
            'https://raw.githubusercontent.com/HanSpringett/DearRider_Webflow_embedtest/main/assets/1996_dolphin.gltf',
            'https://raw.githubusercontent.com/HanSpringett/DearRider_Webflow_embedtest/main/assets/2002.gltf',
            'https://raw.githubusercontent.com/HanSpringett/DearRider_Webflow_embedtest/main/assets/2013.gltf',
            'https://raw.githubusercontent.com/HanSpringett/DearRider_Webflow_embedtest/main/assets/2020.gltf',
            'https://raw.githubusercontent.com/HanSpringett/DearRider_Webflow_embedtest/main/assets/2021.gltf',
            'https://raw.githubusercontent.com/HanSpringett/DearRider_Webflow_embedtest/main/assets/DearRiderOutro1.gltf',
            'https://raw.githubusercontent.com/HanSpringett/DearRider_Webflow_embedtest/main/assets/DearRiderOutro2.gltf'
        ];

        this.loadedItems = {};
        this.mouse = new THREE.Vector2();

        this.timelineObj = [
            {
                id: 0,
                position: { x: -201.961180449289, y: 200, z: -900 },
                rotation: { x: 3.096496824068951, y: -0.03892926785276455, z: 3.1398363604390074 },
                obj: false,
            },
            {
                id: 1,
                position: { x: 500, y: 150, z: -350 },
                rotation: { x: 3.096496824068951, y: -0.03892926785276455, z: 3.1398363604390074 },
                obj: false,
            },
            {
                id: 2,
                position: { x: 100, y: 150, z: -350 },
                rotation: { x: 3.096496824068951, y: -0.03892926785276455, z: 3.1398363604390074 },
                obj: false,
            },
            {
                id: 3,
                position: { x: -400, y: 150, z: -350 },
                rotation: { x: 3.096496824068951, y: -0.03892926785276455, z: 3.1398363604390074 },
                obj: false,
            },
            {
                id: 4,
                position: { x: -900, y: 150, z: -350 },
                rotation: { x: 3.096496824068951, y: -0.03892926785276455, z: 3.1398363604390074 },
                obj: false,
            },
            {
                id: 5,
                position: { x: -600, y: 150, z: 85 },
                rotation: { x: 3.096496824068951, y: -0.03892926785276455, z: 3.1398363604390074 },
                obj: false,
            },
            {
                id: 6,
                position: { x: -200, y: 150, z: 85 },
                rotation: { x: 3.096496824068951, y: -0.03892926785276455, z: 3.1398363604390074 },
                obj: false,
            },
            {
                id: 7,
                position: { x: 300, y: 150, z: 85 },
                rotation: { x: 3.096496824068951, y: -0.03892926785276455, z: 3.1398363604390074 },
                obj: false,
            },
            {
                id: 8,
                position: { x: 500, y: 150, z: 500 },
                rotation: { x: 3.096496824068951, y: -0.03892926785276455, z: 3.1398363604390074 },
                obj: false,
            },
            {
                id: 9,
                position: { x: 100, y: 150, z: 500 },
                rotation: { x: 3.096496824068951, y: -0.03892926785276455, z: 3.1398363604390074 },
                obj: false,
            },
            {
                id: 10,
                position: { x: -400, y: 150, z: 500 },
                rotation: { x: 3.096496824068951, y: -0.03892926785276455, z: 3.1398363604390074 },
                obj: false,
            },
            {
                id: 11,
                position: { x: -900, y: 150, z: 500 },
                rotation: { x: 3.096496824068951, y: -0.03892926785276455, z: 3.1398363604390074 },
                obj: false,
            },
            {
                id: 12,
                position: { x: -500, y: 150, z: 952 },
                rotation: { x: 3.096496824068951, y: -0.03892926785276455, z: 3.1398363604390074 },
                obj: false,
            },
            {
                id: 13,
                position: { x: 100, y: 150, z: 1400 },
                rotation: { x: 3.096496824068951, y: -0.03892926785276455, z: 3.1398363604390074 },
                obj: false,
            }
        ]

        this.currentCameraCoords = {
            x: 0,
            y: 0,
            z: 0
        }

        const light = new THREE.AmbientLight(0x404040, ambientLightIntensity); // soft white light
        this.scene.add(light);

        this.scroll = false
        this.spotlightIntensity = spotlightIntensity
        this.movementTimeline = gsap.timeline()
        this.gltfLoader = GLTFLoader
    }
    loadModels() {
        this.manager = new THREE.LoadingManager();
        this.manager.onStart = function (url, itemsLoaded, itemsTotal) {
            // console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        };
        this.manager.onLoad = () => {
            console.log('Loading complete!');
            this.setUpScene()
        };
        this.manager.onProgress = function (url, itemsLoaded, itemsTotal) {
            // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        };
        this.manager.onError = function (url) {
            // console.log('There was an error loading ' + url);
        };

        //Loading of assets
        const loader = new this.gltfLoader(this.manager);
        const self = this
        // Load a glTF resource
        for (let i = 0; i < self.sceneAssets.length; i++) {
            loader.load(
                // resource URL
                self.sceneAssets[i],
                // called when the resource is loaded
                (gltf) => {
                    this.scene.add(gltf.scene);
                    self.loadedItems[i] = gltf.scene
                }
            );
        }
        const textureLoader = new THREE.TextureLoader()
        // this.scene.background = textureLoader.load("assets/cube/mountains-covered-with-snow-2-Ab.jpg")
        const geometry = new THREE.PlaneGeometry(15000, 8000);
        const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: textureLoader.load("https://raw.githubusercontent.com/HanSpringett/DearRider/main/assets/cube/mountains-covered-with-snow-2-Ab.jpg") });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.set(1000, -1000, 3000)
        this.bg = plane

        const plane2 = new THREE.Mesh(geometry, material);
        plane2.position.set(10000, -1000, -4000)
        plane2.rotateOnAxis(new THREE.Vector3(0, 1, 0), 20)
        this.scene.add(plane2);

        this.scene.add(this.bg);

    }
    //maps the loaded models to the timeline and places them in the scene at their positions
    setUpScene() {
        const self = this
        //building
        self.loadedItems[0].position.set(-1000, 0, 0)
        //cubes
        self.loadedItems[1].position.set(-200, 140, -550)
        self.loadedItems[1].scale.set(2, 2, -2)
        this.addLight(-200, 500, -2000, self.loadedItems[1])
        //1979 board
        self.loadedItems[2].position.set(510, 70, -125)
        self.loadedItems[2].rotateOnAxis(new THREE.Vector3(0, 1, 0), 3.2)
        self.loadedItems[2].children[0].children[0].material.side = THREE.FrontSide
        self.loadedItems[2].children[0].children[1].material.side = THREE.FrontSide
        self.loadedItems[2].children[0].children[2].material.side = THREE.FrontSide
        self.timelineObj[1].obj = self.loadedItems[2]
        this.addLight(510, 250, -250, self.loadedItems[2])
        //1983 board
        self.loadedItems[3].position.set(110, 70, -120)
        self.loadedItems[3].rotateOnAxis(new THREE.Vector3(0, 1, 0), 3.2)
        self.timelineObj[2].obj = self.loadedItems[3]
        this.addLight(110, 500, -300, self.loadedItems[3])
        //1986 board
        self.loadedItems[4].position.set(-390, 70, -100)
        self.loadedItems[4].rotateOnAxis(new THREE.Vector3(0, 1, 0), 3.2)
        self.loadedItems[4].children[0].children[0].material.side = THREE.FrontSide
        self.loadedItems[4].children[0].children[1].material.side = THREE.FrontSide
        self.loadedItems[4].children[0].children[2].material.side = THREE.FrontSide
        self.loadedItems[4].children[0].children[3].material.side = THREE.FrontSide
        self.timelineObj[3].obj = self.loadedItems[4]
        this.addLight(-390, 500, -300, self.loadedItems[4])
        //1989 board
        self.loadedItems[5].position.set(-890, 70, -100)
        self.loadedItems[5].rotateOnAxis(new THREE.Vector3(0, 1, 0), 3.2)
        self.loadedItems[5].children[0].children[0].material.side = THREE.FrontSide
        self.loadedItems[5].children[0].children[1].material.side = THREE.FrontSide
        self.loadedItems[5].children[0].children[2].material.side = THREE.FrontSide
        self.timelineObj[4].obj = self.loadedItems[5]
        this.addLight(-890, 500, -300, self.loadedItems[5])
        //1996_dolphin board
        self.loadedItems[6].position.set(310, 70, 300)
        self.loadedItems[6].rotateOnAxis(new THREE.Vector3(0, 1, 0), 3.2)
        self.loadedItems[6].children[0].children[0].children[0].material.side = THREE.FrontSide
        self.loadedItems[6].children[0].children[0].children[1].material.side = THREE.FrontSide
        self.loadedItems[6].children[0].children[0].children[2].material.side = THREE.FrontSide
        self.timelineObj[5].obj = self.loadedItems[8]
        this.addLight(310, 500, 125, self.loadedItems[6])
        //1996 board
        self.loadedItems[7].position.set(-190, 70, 300)
        self.loadedItems[7].rotateOnAxis(new THREE.Vector3(0, 1, 0), 3.2)
        self.loadedItems[7].children[0].children[0].material.side = THREE.FrontSide
        self.loadedItems[7].children[0].children[1].material.side = THREE.FrontSide
        self.loadedItems[7].children[0].children[2].material.side = THREE.FrontSide
        self.timelineObj[6].obj = self.loadedItems[7]
        this.addLight(-219000, 500, 125, self.loadedItems[7])
        //1993 board
        self.loadedItems[8].position.set(-590, 70, 300)
        // self.loadedItems[8].rotateOnAxis(new THREE.Vector3(0, 1, 0), 3)
        self.loadedItems[8].scale.set(1, 1, -1)
        self.loadedItems[8].children[0].children[0].children[0].material.side = THREE.FrontSide
        self.loadedItems[8].children[0].children[0].children[1].material.side = THREE.FrontSide
        self.loadedItems[8].children[0].children[0].children[2].material.side = THREE.FrontSide
        self.timelineObj[7].obj = self.loadedItems[6]
        this.addLight(-590, 500, 125, self.loadedItems[8])
        //2002 board
        self.loadedItems[9].position.set(510, 70, 700)
        self.loadedItems[9].rotateOnAxis(new THREE.Vector3(0, 1, 0), 3.2)
        self.loadedItems[9].children[0].children[0].material.side = THREE.FrontSide
        self.loadedItems[9].children[0].children[1].material.side = THREE.FrontSide
        self.loadedItems[9].children[0].children[2].material.side = THREE.FrontSide
        self.timelineObj[8].obj = self.loadedItems[9]
        this.addLight(510, 500, 525, self.loadedItems[9])
        //2013 board
        self.loadedItems[10].position.set(110, 70, 700)
        self.loadedItems[10].rotateOnAxis(new THREE.Vector3(0, 1, 0), 3.2)
        self.loadedItems[10].children[0].children[0].material.side = THREE.FrontSide
        self.loadedItems[10].children[0].children[1].material.side = THREE.FrontSide
        self.loadedItems[10].children[0].children[2].material.side = THREE.FrontSide
        self.timelineObj[9].obj = self.loadedItems[10]
        this.addLight(110, 500, 525, self.loadedItems[10])
        //2020 board
        self.loadedItems[11].position.set(-390, 70, 700)
        self.loadedItems[11].rotateOnAxis(new THREE.Vector3(0, 1, 0), 3.2)
        self.loadedItems[11].children[0].children[0].material.side = THREE.FrontSide
        self.loadedItems[11].children[0].children[1].material.side = THREE.FrontSide
        self.loadedItems[11].children[0].children[2].material.side = THREE.FrontSide
        self.timelineObj[10].obj = self.loadedItems[11]
        this.addLight(-390, 500, 525, self.loadedItems[11])
        //2021 board
        self.loadedItems[12].position.set(-890, 70, 700)
        self.loadedItems[12].rotateOnAxis(new THREE.Vector3(0, 1, 0), 3.2)
        self.loadedItems[12].children[0].children[0].material.side = THREE.FrontSide
        self.loadedItems[12].children[0].children[1].material.side = THREE.FrontSide
        self.loadedItems[12].children[0].children[2].material.side = THREE.FrontSide
        self.timelineObj[11].obj = self.loadedItems[12]
        this.addLight(-890, 500, 525, self.loadedItems[12])

        //placeholder1
        self.loadedItems[13].position.set(-500, 175, 1050)
        self.loadedItems[13].rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.04)
        this.placeholder1 = self.loadedItems[13]
        this.placeholder1.visible = false
        //placeholder2
        self.loadedItems[14].position.set(100, 175, 1500)
        self.loadedItems[14].rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.04)
        this.placeholder2 = self.loadedItems[14]
        this.placeholder2.visible = false

        //event for mouse wheel
        window.addEventListener("wheel", (evt) => {
            if (evt.deltaY > 0 && this.scroll) {
                this.fowards()
            }
            else if (evt.deltaY < 0 && this.scroll) {
                this.backwards()
            }
        })

        this.touchDown = false
        this.initPoint = 0
        //events for touch drag
        window.addEventListener("touchstart", (event) => {
            this.touchDown = true
            this.initPoint = event.touches[0].clientY
        })
        window.addEventListener("touchmove", (event) => {
            if (event.targetTouches.length === 1 && this.touchDown) {
                if (event.touches[0].clientY < this.initPoint && this.scroll) {
                    this.fowards()
                }
                else if (event.touches[0].clientY > this.initPoint && this.scroll) {
                    this.backwards()
                }
                event.preventDefault()
            }
        })
        window.addEventListener("touchend", () => {
            this.touchDown = false
        })

        window.addEventListener("pointerdown", (event) => {
            self.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            self.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
            this.raycaster.setFromCamera(self.mouse, this.camera);

            // calculate objects intersecting the picking ray
            const intersects = this.raycaster.intersectObjects(this.scene.children);
            if (intersects[0].object.name == "explore") {

                window.dispatchEvent(new CustomEvent("openExplore", { detail: this.index }))
                console.log("Index", this.index)
            }
        })

        //move the camera at the event.detail where event.detail is the index of the timelineObj
        window.addEventListener("moveCameraTimeline", (evt) => {
            this.goTo(self.timelineObj[evt.detail])
        })
        /*
        //@index is 
        this.goTo(self.timelineObj[index])
        
        */

        this.camera.position.set(-1302, 492, -983)
        this.camera.rotation.set(3.096496824068951, -0.635938533090549, 3.1398363604390074)

        this.currentCameraCoords.x = -1302
        this.currentCameraCoords.y = 492
        this.currentCameraCoords.z = -983

        //events for camera zoom in on mobile
        this.setCameraPinch()
        // this.cameraMovementEvents()

        //start animation function
        // this.startAnim()


        this.circle = this.addRing()
        this.circle.scale.set(3, 3, 3)
        this.circle.visible = false
        this.scene.add(this.circle)

        //add camera movement on pan
        let initX
        let initY
        window.addEventListener("pointermove", (evt) => {
            this.onMouseMove(evt)
            gsap.delayedCall(0.5, () => {
                initX = evt.x
                initY = evt.y
            })
            if (evt.x < initX && this.camera.position.x < this.currentCameraCoords.x + 2) {
                this.camera.position.x += 0.1
            }
            if (evt.y < initY && this.camera.position.y < this.currentCameraCoords.y + 2) {
                this.camera.position.y += 0.1
            }
            if (evt.x > initX && this.camera.position.x > this.currentCameraCoords.x - 2) {
                this.camera.position.x -= 0.1
            }
            if (evt.y > initY && this.camera.position.y > this.currentCameraCoords.y - 2) {
                this.camera.position.y -= 0.1
            }
        })


    }
    //move camera backwards on the timeline
    backwards() {
        if (this.index > 0) {
            this.index--
            this.moveCamera(this.index, this.index + 1)
        }
    }
    //move camera forwards on the timeline
    fowards() {
        if (this.index < this.timelineObj.length - 1) {
            this.index++
            this.moveCamera(this.index, this.index - 1)
        }
    }
    //initial animation that moves the camera from the corner to the cubes
    startAnim() {
        this.moveCamera(0, false)
    }
    //adds a spotlight at the specific coords and looks at the target
    addLight(x, y, z, target) {
        const spotLight = new THREE.SpotLight(0xffffff, this.spotlightIntensity);
        spotLight.position.set(x, y, z);
        spotLight.target = target;
        spotLight.penumbra = 1
        spotLight.angle = 0.75
        spotLight.castShadow = true;

        this.scene.add(spotLight);
    }
    moveCamera(index, oldIndex) {
        this.scroll = false
        const self = this
        if (oldIndex) {
            this.endSpinBoard(oldIndex)
            this.circle.visible = false
        }
        gsap.to(this.camera.position, {
            x: self.timelineObj[index].position.x,
            y: self.timelineObj[index].position.y,
            z: self.timelineObj[index].position.z,
            duration: 2,
            onComplete: () => {
                self.startSpinBoard(index)
                this.scroll = true
                if (index <= 11) {
                    this.circle.position.set(self.timelineObj[index].position.x + 10, self.timelineObj[index].position.y / 2, self.timelineObj[index].position.z - 150)
                    this.circle.visible = true
                    this.placeholder2.visible = false
                    this.placeholder1.visible = false

                }
                else if (index == 12) {
                    this.placeholder1.visible = true
                    this.placeholder2.visible = false
                }
                else if (index == 13) {
                    this.placeholder2.visible = true
                    this.placeholder1.visible = false
                }
            }
        })
        gsap.to(this.camera.rotation, {
            x: self.timelineObj[index].rotation.x,
            y: self.timelineObj[index].rotation.y,
            z: self.timelineObj[index].rotation.z,
            duration: 2,
        })
        this.currentCameraCoords.x = self.timelineObj[index].position.x
        this.currentCameraCoords.y = self.timelineObj[index].position.y
        this.currentCameraCoords.z = self.timelineObj[index].position.z

        if (index > 0) {
            gsap.to(this.bg.position, { z: 3550, duration: 2 })
        }
        if (index > 4) {
            gsap.to(this.bg.position, { z: 3185, duration: 2 })
        }
        if (index > 7) {
            gsap.to(this.bg.position, { z: 3600, duration: 2 })
        }
        if (index > 11) {
            gsap.to(this.bg.position, { z: 4052, duration: 2 })
        }
        if (index > 12) {
            gsap.to(this.bg.position, { z: 4500, duration: 2 })
        }
    }
    startSpinBoard(index) {
        const self = this
        if (self.timelineObj[index].obj) {
            this.rotateCoords = {
                x: self.timelineObj[index].obj.rotation.x,
                y: self.timelineObj[index].obj.rotation.y,
                z: self.timelineObj[index].obj.rotation.z
            }
            this.spinAnim = gsap.timeline({ repeat: -1, duration: 0.01 })
            this.spinAnim.add(() => {
                self.timelineObj[index].obj.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.01)
            })
        }
    }
    endSpinBoard(index) {
        const self = this
        if (self.timelineObj[index].obj) {
            self.timelineObj[index].obj.rotation.set(this.rotateCoords.x, this.rotateCoords.y, this.rotateCoords.z)
            try {
                this.spinAnim.kill()
            } catch (e) { }
            this.spinAnim = null;
        }
    }
    //function that cleans and disposes the scene
    dispose() {
        // stop sounds
        const cleanMaterial = material => {
            // dispose material
            material.dispose()
            // dispose textures
            for (const key of Object.keys(material)) {
                const value = material[key]
                if (value && typeof value === 'object' && 'minFilter' in value) {
                    value.dispose()
                }
            }
        }
        this.scene.traverse(object => {
            if (!object.isMesh) return

            // dispose geometry
            object.geometry.dispose()

            if (object.material.isMaterial) {
                cleanMaterial(object.material)
            } else {
                // an array of materials
                for (const material of object.material) cleanMaterial(material)
            }
        })

        //kill all tweens
        gsap.globalTimeline.clear()

        this.scene = null
        this.camera = null
        this.renderer && this.renderer.renderLists.dispose()
        this.renderer = null

        cancelAnimationFrame(this.animFrame)
    }
    animate() {
        const animate = () => {
            if (this.circle) {
                this.raycaster.setFromCamera(this.mouse, this.camera);
                const intersects = this.raycaster.intersectObjects(this.scene.children);
                if (intersects[0].object.name == "explore") {
                    gsap.to([this.circle.children[2].material], { opacity: 1, duration: 1 })
                    gsap.to([this.circle.children[3].material], { opacity: 0.3, duration: 1 })
                    gsap.to(this.circle.children[3].scale, {
                        x: 1.15,
                        y: 1.15,
                        z: 1.15,
                        duration: 2
                    })
                }
                else {
                    gsap.to([this.circle.children[2].material, this.circle.children[3].material], { opacity: 0, duration: 1 })
                    gsap.to(this.circle.children[3].scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: 2
                    })
                }
            }

            this.renderer.render(this.scene, this.camera);
            this.animFrame = requestAnimationFrame(animate);
        }
        animate()
    }
    setCameraPinch() {
        let value = 0
        const self = this
        window.addEventListener("touchstart", (evt) => {
            value = evt.touches[0].clientY

        })
        window.addEventListener("touchmove", (evt) => {
            if (evt.touches.length > 1 && self.index == 0) {
                let f = (evt.touches[0].clientY - value) / 10
                this.camera.fov = Math.min(Math.max(this.camera.fov + f, 20), 125);
                this.camera.updateProjectionMatrix()
            }
        })
    }
    cameraMovementEvents() {
        let thisPoint, lastPoint
        let pointerDown = false
        this.initAngle = 0
        window.addEventListener("pointerdown", (event) => {
            lastPoint = new THREE.Vector2(event.clientX, event.clientY)
            pointerDown = true
        })

        document.addEventListener("pointermove", (event) => {
            if (pointerDown) {
                thisPoint = new THREE.Vector2(event.clientX, event.clientY)
                this.camera.forwardRotationScalar = (thisPoint.x - lastPoint.x);
                this.camera.sideRotationScalar = (thisPoint.y - lastPoint.y);
                lastPoint = new THREE.Vector2(event.clientX, event.clientY)
            }
        })
        window.addEventListener("touchmove", (evt) => {
            let value1 = (evt.touches[0].x + evt.touches[1].x) - initPointX
            let value2 = (evt.touches[0].y + evt.touches[1].y) - initPointY
            this.camera.fov = Math.min(Math.max(this.camera.fov + (value1 + value2), 20), 65);
            this.camera.updateProjectionMatrix()
        })

        window.addEventListener("pointerup", () => {
            this.camera.forwardRotationScalar = 0;
            this.camera.sideRotationScalar = 0;
            pointerDown = false
        })
        window.addEventListener("touchend", () => {
            this.camera.forwardRotationScalar = 0;
            this.camera.sideRotationScalar = 0;
            pointerDown = false
        })
    }
    rotateVertical() {
        const v1 = new THREE.Vector3(0, 1, 0)
        const v2 = new THREE.Vector3()
        this.camera.getWorldDirection(v2)

        const v3 = new THREE.Vector3((v1.y * v2.z) - (v1.z * v2.y), (v1.z * v2.x) - (v1.x * v2.z), (v1.x * v2.y) - (v1.y * v2.x))
        console.log(this.initAngle)
        this.initAngle += this.camera.sideRotationScalar
        if (this.checkCameraRotationMouse(this.initAngle) === false) {
            this.camera.rotateOnWorldAxis(v3, this.camera.sideRotationScalar)
        } else {
            this.initAngle -= this.camera.sideRotationScalar
        }
        // this.camera.rotation.z = 0
    }
    rotate() {
        this.camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), (-this.camera.forwardRotationScalar / 300))
        // this.camera.rotation.z = 0
    }
    checkCameraRotationMouse(y) {
        if (y < 0.8 && y > -0.8) {
            return false
        }
        return true
    }
    //add button
    addRing() {
        const circleGroup = new THREE.Group()

        const ring1Geom = new THREE.RingGeometry(9.9, 10, 80);
        const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xe0e0e0, side: THREE.DoubleSide, transparent: true });
        const mesh1 = new THREE.Mesh(ring1Geom, ring1Mat);
        mesh1.position.set(0, 20, 100)
        circleGroup.add(mesh1);

        const ring2Geom = new THREE.RingGeometry(11.9, 12, 80);
        const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xe0e0e0, side: THREE.DoubleSide, transparent: true });
        const mesh2 = new THREE.Mesh(ring2Geom, ring2Mat);
        mesh2.position.set(0, 20, 100)
        circleGroup.add(mesh2);

        const circleGeometry = new THREE.CircleGeometry(10, 32);
        const circleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide });
        const circle = new THREE.Mesh(circleGeometry, circleMat);
        circle.position.set(0, 20, 100.1)
        circle.name = "explore"
        circleGroup.add(circle);

        const circleGeometry2 = new THREE.CircleGeometry(12, 32);
        const circleMat2 = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide });
        const circle2 = new THREE.Mesh(circleGeometry2, circleMat2);
        circle2.position.set(0, 20, 100.2)
        circleGroup.add(circle2);

        const text = this.loadText("Explore", 125)
        text.position.set(0, 20, 100)
        text.scale.set(-1, 1, -1)
        circleGroup.add(text)
        text.name = "explore"

        return circleGroup
    }
    loadText(text, fontSize) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // 2d duty
        context.font = fontSize + "px HelveticaNowText";

        let metrics = context.measureText(text);

        let textWidth = this.roundUp(metrics.width + 20.0, 2);
        let textHeight = this.roundUp(fontSize + 10.0, 2);

        canvas.width = textWidth;
        canvas.height = textHeight;

        context.font = "bold " + fontSize + "px HelveticaNowText";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#ffffff";
        context.fillText(text, textWidth / 2, textHeight / 2);

        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
            //color: 0xffffff,
            //useScreenCoordinates: false
        });

        console.log("textw: " + textWidth, "texth: " + textHeight);



        let mesh = new THREE.Mesh(new THREE.PlaneGeometry(textWidth / 60, textHeight / 60, 10, 10), material);

        mesh.position.y = 5;
        mesh.position.z = 5;
        mesh.position.x = 0;

        return mesh;

    }
    //move the camera through the timeline to the target
    goTo(target) {
        this.endSpinBoard(target.id)
        const self = this
        this.movementTimeline.kill()
        this.movementTimeline = gsap.timeline({
            onComplete: () => {
                this.startSpinBoard(target.id)
                this.scroll = true
                if (target.id <= 11) {
                    this.circle.position.set(target.position.x + 10, target.position.y / 2, target.position.z - 150)
                    this.circle.visible = true
                    this.placeholder2.visible = false
                    this.placeholder1.visible = false

                }
                else if (target.id == 12) {
                    this.placeholder1.visible = true
                    this.placeholder2.visible = false
                }
                else if (target.id == 13) {
                    this.placeholder2.visible = true
                    this.placeholder1.visible = false
                }
                this.index = target.id

                this.currentCameraCoords.x = self.timelineObj[this.index].position.x
                this.currentCameraCoords.y = self.timelineObj[this.index].position.y
                this.currentCameraCoords.z = self.timelineObj[this.index].position.z

            }
        })
        if (target.id > this.currentTimelinePos) {
            for (let i = this.currentTimelinePos; i <= target.id; i++) {
                this.movementTimeline.to(this.camera.position, {
                    x: self.timelineObj[i].position.x,
                    y: self.timelineObj[i].position.y,
                    z: self.timelineObj[i].position.z,
                    duration: 1,
                }, i.toString())
                if (i == 1) {
                    this.movementTimeline.to(this.bg.position, { z: 3550, duration: 1 }, i.toString())
                }
                if (i == 5) {
                    this.movementTimeline.to(this.bg.position, { z: 3185, duration: 1 }, i.toString())
                }
                if (i == 8) {
                    this.movementTimeline.to(this.bg.position, { z: 3600, duration: 1 }, i.toString())
                }
                if (i == 12) {
                    this.movementTimeline.to(this.bg.position, { z: 4052, duration: 1 }, i.toString())
                }
                if (i == 13) {
                    this.movementTimeline.to(this.bg.position, { z: 4500, duration: 1 }, i.toString())
                }
            }
            this.movementTimeline.play()
            this.currentTimelinePos = target.id
        }
        else {
            for (let i = this.currentTimelinePos; i >= target.id; i--) {
                this.movementTimeline.to(this.camera.position, {
                    x: self.timelineObj[i].position.x,
                    y: self.timelineObj[i].position.y,
                    z: self.timelineObj[i].position.z,
                    duration: 1,
                }, i.toString())
                if (i == 1) {
                    this.movementTimeline.to(this.bg.position, { z: 3550, duration: 1 }, i.toString())
                }
                if (i == 5) {
                    this.movementTimeline.to(this.bg.position, { z: 3185, duration: 1 }, i.toString())
                }
                if (i == 8) {
                    this.movementTimeline.to(this.bg.position, { z: 3600, duration: 1 }, i.toString())
                }
                if (i == 12) {
                    this.movementTimeline.to(this.bg.position, { z: 4052, duration: 1 }, i.toString())
                }
                if (i == 13) {
                    this.movementTimeline.to(this.bg.position, { z: 4500, duration: 1 }, i.toString())
                }
            }
            this.movementTimeline.play()
            this.currentTimelinePos = target.id
        }
    }
    roundUp(numToRound, multiple) {
        let value = multiple;
        while (value < numToRound) {
            value = value * multiple;
        }
        return value;
    }
    hideExploreButton() {
        gsap.to([this.circle.children[0].material, this.circle.children[1].material, this.circle.children[2].material], { opacity: 0, duration: 1 })
    }
    showExploreButton() {
        gsap.to([this.circle.children[0].material, this.circle.children[1].material, this.circle.children[2].material], { opacity: 1, duration: 1 })
    }
    onMouseMove(event) {

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    }
}