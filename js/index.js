// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
let swatches, options;
let model;
let activeOption = "head";

const mixers = [];
const clock = new THREE.Clock();

const colors = [
  { color: "ffffff" },
  {
    texture:
      "https://marketplace.canva.com/MADesDd8HdY/1/thumbnail_large/canva-shiny-silver-gray-foil-texture-for-background-MADesDd8HdY.jpg",
    size: [1, 1, 1],
    shininess: 60
  },
  {
    texture:
      "https://previews.123rf.com/images/baron777/baron7771310/baron777131000004/22949713-black-snake-skin-texture-background.jpg",
    size: [1, 1, 1],
    shiniess: 60
  },
  {
    texture:
      "https://i.pinimg.com/originals/a1/09/f3/a109f314d4ca2cbec0b38d9b71c7d714.jpg",
    size: [1, 1, 1],
    shiniess: 60
  },
  { color: "000000" },
  {
    texture:
      "https://images.freecreatives.com/wp-content/uploads/2016/01/High-Quality-Shiny-Brushed-Gold-Metallic-Texture.jpg",
    size: [1, 1, 1],
    shiniess: 60
  },

  { color: "fffd8a" },
  {
    texture:
      "https://previews.123rf.com/images/ohmega1982/ohmega19821201/ohmega1982120100147/11881971-yellow-python-snake-skin-texture-background-.jpg",
    size: [1, 1, 1],
    shiniess: 60
  },
  { color: "fffb00" },

  { color: "ff731c" },
  {
    texture:
      "http://www.imageafter.com/dbase/textures/metals/b14galenslater005.jpg",
    size: [1, 1, 1],
    shiniess: 60
  },
  { color: "ffca8a" },
  {
    texture:
      " https://www.photohdx.com/images/2015/10/red-leather-texture-background.jpg",
    size: [1, 1, 1],
    shiniess: 60
  },
  { color: "ff0000" },
  { color: "ff8d7a" },
  {
    texture:
      "  https://i.pinimg.com/originals/dc/99/f0/dc99f03d9b1fa72685a12426494c6480.jpg",
    size: [1, 1, 1],
    shiniess: 60
  },

  { color: "ff005d" },
  { color: "ffbfe6" },
  {
    texture: "https://ak7.picdn.net/shutterstock/videos/1024427117/thumb/1.jpg",
    size: [1, 1, 1],
    shininess: 60
  },
  { color: "a300a8" },
  {
    texture:
      " https://marketplace.canva.com/MADaprpGyEQ/1/thumbnail_large-1/canva-blue-texture-of-old-leather-upholstery-in-the-cracks-MADaprpGyEQ.jpg",
    size: [1, 1, 1],
    shininess: 60
  },
  {
    texture:
      "https://i.pinimg.com/600x315/7c/ed/90/7ced901912e3bcb9aaa9d46e1263b76d.jpg",
    size: [1, 1, 1],
    shininess: 60
  },
  { color: "1c00a8" },

  { color: "bfd2ff" },
  {
    texture:
      "https://i.pinimg.com/originals/7a/a0/7e/7aa07ec4ffe55a3f8eea8bcc684a3012.jpg",
    size: [1, 1, 1],
    shininess: 60
  },
  { color: "00a894" },
  { color: "85ffda" },
  {
    texture:
      "https://naldzgraphics.net/wp-content/uploads/2011/06/5-Flood-Texture-by-Goblin-stock.jpg",
    size: [1, 1, 1],
    shininess: 60
  },
  { color: "1eff00" },
  {
    texture:
      "https://previews.123rf.com/images/domnicky/domnicky1702/domnicky170200105/70976725-green-snake-skin-background.jpg",
    size: [1, 1, 1],
    shininess: 60
  },
  { color: "0a5200" },
  {
    texture: "http://freestock.ca/brown_grunge_texture_sjpg4030.jpg,",
    size: [2, 2, 2],
    shininess: 60
  },
  { color: "452100" },
  { color: "916f50" },
  {
    texture:
      "https://st2.depositphotos.com/1332421/12059/i/950/depositphotos_120591220-stock-photo-brown-snake-skin-texture-useful.jpg",
    size: [2, 2, 2],
    shininess: 60
  }
];

// let material = new THREE.MeshPhongMaterial({
//           color: 0xff0000,
//           emissive: 0x191818,
//           shininess: 150
//         });
//         o.material = material;
//         console.log(o);

const INITIAL_MATERIAL = new THREE.MeshPhongMaterial({
  color: 0x363636,
  shininess: 10,
  //emissive: 0xa8008c,
  specular: 0x2bff00
  // wireframe: true
});

const INITIAL_MAP = [
  { childID: "tail", material: INITIAL_MATERIAL },
  { childID: "eyes_whisks", material: INITIAL_MATERIAL },
  { childID: "head", material: INITIAL_MATERIAL },
  { childID: "wings_front", material: INITIAL_MATERIAL },
  { childID: "wings_back", material: INITIAL_MATERIAL },
  { childID: "legs", material: INITIAL_MATERIAL },
  { childID: "body", material: INITIAL_MATERIAL }
];

function init() {
  container = document.querySelector("#scene-container");

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb0b0b0);

  let floorGeometry = new THREE.PlaneGeometry(5000, 60, 1, 1);
  let floorMaterial = new THREE.MeshPhongMaterial({
    color: 0xb0b0b0,
    shininess: 100
  });
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -0.5 * Math.PI;
  floor.receiveShadow = true;
  floor.position.y = -3;
  floor.position.z = 10;
  scene.add(floor);

  createCamera();
  createControls();
  createLights();
  loadModels();
  createRenderer();
  buildColors(colors);

  renderer.setAnimationLoop(() => {
    controls.update();
    update();
    render();
  });
}

function createCamera() {
  camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    1,
    100
  );
  camera.position.set(0, 10, 20);
}

function createControls() {
  controls = new THREE.OrbitControls(camera, container);
  //controls.maxPolarAngle = Math.PI / 2;
  //controls.minPolarAngle = Math.PI / 3;
  controls.enableDamping = true;
  controls.enablePan = false;
  //controls.dampingFactor = 0.1;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.1;
}

function createLights() {
  var ambientLight = new THREE.AmbientLight(0xcccccc);
  scene.add(ambientLight);

  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(-5, 5, 0);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  // Add directional Light to scene
  scene.add(directionalLight);
}

function loadModels() {
  const loader = new THREE.GLTFLoader();

  // A reusable function to set up the models. We're passing in a position parameter
  // so that they can be individually placed around the scene
  const onLoad = (gltf, position) => {
    model = gltf.scene;

    model.position.copy(position);

    model.traverse(o => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    for (let object of INITIAL_MAP) {
      initColor(model, object.childID, object.material);
    }
    model.rotation.y = Math.PI / 2.8;
    scene.add(model);
  };

  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = errorMessage => {
    console.log(errorMessage);
  };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  const position = new THREE.Vector3(0, -3, 0);
  loader.load(
    "/models/dragonfly.glb",
    gltf => onLoad(gltf, position),
    onProgress,
    onError
  );
}

function initColor(parent, type, material) {
  parent.traverse(o => {
    if (o.isMesh) {
      if (o.name.includes(type) || o.parent.name.includes(type)) {
        o.material = material;
        o.nameID = type;
        o.position = o.position;
      }
    }
  });
}

const TRAY = document.getElementById("tray_slide");

function buildColors(colors) {
  for (let [i, color] of colors.entries()) {
    let swatch = document.createElement("div");
    swatch.classList.add("tray_swatch");
    if (color.texture) {
      swatch.style.backgroundImage = "url(" + color.texture + ")";
      swatch.style.backgroundSize = "150px";
    } else {
      swatch.style.background = "#" + color.color;
    }
    swatch.setAttribute("data-key", i);
    TRAY.append(swatch);
  }

  options = document.querySelectorAll(".option");
  for (const option of options) {
    option.addEventListener("click", selectOption);
  }

  swatches = document.querySelectorAll(".tray_swatch");
  for (const swatch of swatches) {
    swatch.addEventListener("click", selectSwatch);
  }
}

function selectSwatch(event) {
  let color = colors[parseInt(event.target.dataset.key)];
  let material;
  if (color.texture) {
    let textureLoader = new THREE.TextureLoader();
    let txt = textureLoader.load(color.texture);

    txt.repeat.set(color.size[0], color.size[1], color.size[2]);
    txt.wrapS = THREE.RepeatWrapping;
    txt.wrapT = THREE.RepeatWrapping;

    material = new THREE.MeshPhongMaterial({
      map: txt,
      shininess: color.shininess ? color.shininess : 10
    });
  } else {
    material = new THREE.MeshPhongMaterial({
      color: parseInt("0x" + color.color),
      shininess: color.shininess ? color.shininess : 10
    });
  }

  setMaterial(model, activeOption, material);
}

function selectOption(event) {
  let option = event.target;
  activeOption = event.target.dataset.option;
  for (const otherOption of options) {
    otherOption.classList.remove("--is-active");
  }
  option.classList.add("--is-active");
  console.log(activeOption);
}

function setMaterial(parent, type, material) {
  parent.traverse(o => {
    if (o.isMesh && o.nameID != null) {
      if (o.nameID == type) {
        o.material = material;
      }
    }
  });
}

function createRenderer() {
  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  renderer.physicallyCorrectLights = true;

  renderer.shadowMap.enabled = true;

  container.appendChild(renderer.domElement);
}

function update() {
  const delta = clock.getDelta();

  for (const mixer of mixers) {
    mixer.update(delta);
  }
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);

var slider = document.getElementById("tray"),
  sliderItems = document.getElementById("tray_slide"),
  difference;

function slide(wrapper, items) {
  var posX1 = 0,
    posX2 = 0,
    posInitial,
    threshold = 20,
    posFinal,
    slides = items.getElementsByClassName("tray_swatch");

  // Mouse events
  items.onmousedown = dragStart;

  // Touch events
  items.addEventListener("touchstart", dragStart);
  items.addEventListener("touchend", dragEnd);
  items.addEventListener("touchmove", dragAction);

  function dragStart(e) {
    e = e || window.event;
    posInitial = items.offsetLeft;
    difference = sliderItems.offsetWidth - slider.offsetWidth;
    difference = difference * -1;

    if (e.type == "touchstart") {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  function dragAction(e) {
    e = e || window.event;

    if (e.type == "touchmove") {
      posX2 = posX1 - e.touches[0].clientX;
      posX1 = e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;
    }

    if (
      items.offsetLeft - posX2 <= 0 &&
      items.offsetLeft - posX2 >= difference
    ) {
      items.style.left = items.offsetLeft - posX2 + "px";
    }
  }

  function dragEnd(e) {
    posFinal = items.offsetLeft;
    if (posFinal - posInitial < -threshold) {
    } else if (posFinal - posInitial > threshold) {
    } else {
      items.style.left = posInitial + "px";
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }
}

slide(slider, sliderItems);
init();
