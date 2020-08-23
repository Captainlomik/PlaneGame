let Colors = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  pink: 0xF5986E,
  brownDark: 0x23190f,
  blue: 0x68c3c0,
}

let scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container; //сцена

let hemisphereLight, shadowLight; //свет

let sea;
let flag = false;

//STOP button
btn.onclick = function () {
  flag = !flag;
  console.log(flag);
}


function createScene() {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;


  scene = new THREE.Scene();

  scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

  aspectRatio = WIDTH / HEIGHT;
  fieldWiew = 60;
  nearPlane = 1;
  farPlane = 1000;

  camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;

  renderer = new THREE.WebGLRenderer({
    alpha: true, //Прозраность
    antialias: true //сглаживание 
  });

  renderer.setSize(WIDTH, HEIGHT);

  renderer.shadowMap.enabled = true;

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
}

//FOR RESIZE (mobile)
function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}


function createLights() {
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)

  ambientLight = new THREE.AmbientLight(0xdc8874, .2);


  shadowLight = new THREE.DirectionalLight(0xffffff, .9);

  shadowLight.position.set(150, 350, 350);

  shadowLight.castShadow = true;


  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(ambientLight);
}


//CREATE SEA
Sea = function () {

  let geom = new THREE.CylinderGeometry(600, 630, 800, 40, 10);

  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

  geom.mergeVertices();

  let l = geom.vertices.length;

  this.waves = [];

  for (let i = 0; i < l; i++) {
    let v = geom.vertices[i];


    this.waves.push({
      x: v.x,
      y: v.y,
      z: v.z,
      ang: Math.random() * Math.PI * 2,
      amp: 5 + Math.random() * 15,
      speed: 0.016 + Math.random() * 0.032
    });
  };


  let mat = new THREE.MeshPhongMaterial({
    color: Colors.blue,
    transparent: true,
    opacity: .8,
    shading: THREE.FlatShading,
  });

  this.mesh = new THREE.Mesh(geom, mat);

  this.mesh.receiveShadow = true;
}


Sea.prototype.moveWaves = function () {

  let verts = this.mesh.geometry.vertices;
  let l = verts.length;

  for (let i = 0; i < l; i++) {
    let v = verts[i];

    let vprops = this.waves[i];

    v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
    v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;

    vprops.ang += vprops.speed;

    this.mesh.geometry.verticesNeedUpdate = true;

    //sea.mesh.rotation.z += .005;
  }
}

function createSea() {
  sea = new Sea();

  sea.moveWaves();
  sea.mesh.position.y = -600;
  scene.add(sea.mesh);


}

Diamond=function()
{
  this.mesh=new THREE.Object3D();

  let dmnGeom=new THREE.
}

//JUST CLOUD
Cloud = function () {
  this.mesh = new THREE.Object3D();

  let geom = new THREE.CubeGeometry(20, 20, 20);

  let mat = new THREE.MeshPhongMaterial({
    color: Colors.white,

  })

  let nBlocs = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < nBlocs; i++) {
    let m = new THREE.Mesh(geom, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    m.position.x = i * 15;
    m.position.y = Math.random() * 10;
    m.position.z = Math.random() * 10;

    m.rotation.y = Math.random() * Math.PI * 2;
    m.rotation.z = Math.random() * Math.PI * 2;

    let s = .1 + Math.random() * .9;
    m.scale.set(s, s, s);

    this.mesh.add(m);
  }
}

//CREATE SKY+CLOUD
Sky = function () {
  this.mesh = new THREE.Object3D();

  this.nClounds = 20;

  let stepAngle = Math.PI * 2 / this.nClounds;

  //create Clouds
  for (let i = 0; i < this.nClounds; i++) {
    let c = new Cloud();

    let a = stepAngle * i;
    let h = 750 + Math.random() * 200;

    c.mesh.position.y = Math.sin(a) * h;
    c.mesh.position.x = Math.cos(a) * h;

    c.mesh.rotation.z = a + Math.PI / 2;

    c.mesh.position.z = -400 - Math.random() * 400;

    let s = 1 + Math.random() * 2;
    c.mesh.scale.set(s, s, s);

    c.castShadow = true;
    c.receiveShadow = true;

    this.mesh.add(c.mesh);
  }
}

let sky;

function createSky() {

  sky = new Sky();

  sky.mesh.position.y = -600;
  scene.add(sky.mesh);
}

//CREATE PLANE
let AirPlane = function () {

  this.mesh = new THREE.Object3D();

  //COCKPIT
  let geomCockpit = new THREE.BoxGeometry(80, 50, 50, 1, 1, 1);
  let matCockpit = new THREE.MeshPhongMaterial({
    color: Colors.red,
    shading: THREE.FlatShading
  });
  geomCockpit.vertices[4].y -= 5;
  geomCockpit.vertices[4].z += 15;
  geomCockpit.vertices[5].y -= 5;
  geomCockpit.vertices[5].z -= 15;
  geomCockpit.vertices[6].y += 20;
  geomCockpit.vertices[6].z += 10;
  geomCockpit.vertices[7].y += 20;
  geomCockpit.vertices[7].z -= 10;
  let cockpit = new THREE.Mesh(geomCockpit, matCockpit);
  cockpit.castShadow = true;
  cockpit.receiveShadow = true;
  this.mesh.add(cockpit);


  //ENGINE
  let geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
  let matEngine = new THREE.MeshPhongMaterial({
    color: Colors.white,
    shading: THREE.FlatShading
  })
  let engine = new THREE.Mesh(geomEngine, matEngine);
  engine.position.x = 40;
  engine.castShadow = true;
  engine.receiveShadow = true;
  this.mesh.add(engine);

  let geomTail = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
  let matTeil = new THREE.MeshPhongMaterial({
    color: Colors.red,
    shading: THREE.FlatShading
  })
  let tailPlane = new THREE.Mesh(geomTail, matTeil);
  tailPlane.position.set(-35, 25, 0);
  tailPlane.castShadow = true;
  tailPlane.receiveShadow = true;
  this.mesh.add(tailPlane);


  //PROPELLER
  let geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
  let matPropeller = new THREE.MeshPhongMaterial({
    color: Colors.brown,
    shading: THREE.FlatShading
  })
  this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
  this.propeller.castShadow = true;
  this.propeller.receiveShadow = true;

  let geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
  let matBlade = new THREE.MeshPhongMaterial({
    color: Colors.brownDark,
    shading: THREE.FlatShading
  })

  let blade = new THREE.Mesh(geomBlade, matBlade);
  blade.position.set(8, 0, 0);
  blade.castShadow = true;
  blade.receiveShadow = true;
  this.propeller.add(blade);
  this.propeller.position.set(50, 0, 0);
  this.mesh.add(this.propeller);


  //WINGS
  var geomSideWing = new THREE.BoxGeometry(30, 5, 120, 1, 1, 1);
  var matSideWing = new THREE.MeshPhongMaterial({
    color: Colors.red,
    shading: THREE.FlatShading
  });
  var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
  sideWing.position.set(0, 15, 0);
  sideWing.castShadow = true;
  sideWing.receiveShadow = true;
  this.mesh.add(sideWing);

  var geomWindshield = new THREE.BoxGeometry(3, 15, 20, 1, 1, 1);
  var matWindshield = new THREE.MeshPhongMaterial({
    color: Colors.white,
    transparent: true,
    opacity: .3,
    shading: THREE.FlatShading
  });;
  var windshield = new THREE.Mesh(geomWindshield, matWindshield);
  windshield.position.set(5, 27, 0);

  windshield.castShadow = true;
  windshield.receiveShadow = true;

  this.mesh.add(windshield);
}



var airplane;

function createPlane() {
  airplane = new AirPlane();
  airplane.mesh.scale.set(.25, .25, .25);
  airplane.mesh.position.y = 100;
  scene.add(airplane.mesh);
}

let mousePos = {
  x: 0,
  y: 0
}


//Follow mouse
function handleMouseMove(event) {
  let tx = -1 + (event.clientX / WIDTH) * 2;
  let ty = 1 - (event.clientY / HEIGHT) * 2;
  mousePos = {
    x: tx,
    y: ty
  }
}


function updatePlane() {
  /*let targetX = normalize(mousePos.x, -1, 1, -100, 100);
  let targetY = normalize(mousePos.y, -1, 1, 25, 175);

  airplane.mesh.position.y = targetY;
  airplane.mesh.position.x = targetX;
  airplane.propeller.rotation.x += 0.3;*/

  var targetY = normalize(mousePos.y, -.75, .75, 25, 175);
  var targetX = normalize(mousePos.x, -.75, .75, -100, 100);

  airplane.mesh.position.y += (targetY - airplane.mesh.position.y) * 0.1;
  airplane.mesh.position.x += (targetX - airplane.mesh.position.x) * 0.1;



  airplane.mesh.rotation.z = (targetY - airplane.mesh.position.y) * 0.0128;
  airplane.mesh.rotation.x = (airplane.mesh.position.y - targetY) * 0.0064;

  airplane.propeller.rotation.x += 0.3;
}

function normalize(v, vmin, vmax, tmin, tmax) {
  let nv = Math.max(Math.min(v, vmax), vmin);
  let dv = vmax - vmin;
  let pc = (nv - vmin) / dv;
  let dt = tmax - tmin;
  let tv = tmin + (pc * dt);
  return tv;
}

//ANIMATION
function loop() {
  if (flag == false) {
    sea.mesh.rotation.z += .005;
    sky.mesh.rotation.z += .01;
  } else
    stop();

  updatePlane();

  renderer.render(scene, camera);
  requestAnimationFrame(loop);

}

//STOP ANIMATION SKY, SEA
function stop() {
  sea.mesh.rotation.z = 0;
  sky.mesh.rotation.z = 0;
}


function init() {
  createScene();

  createLights();

  createPlane();
  createSea();
  createSky();

  document.addEventListener('mousemove', handleMouseMove, false);

  loop();
}



window.addEventListener('load', init, false);