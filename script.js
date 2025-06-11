// ================ 页面加载事件 ================
document.addEventListener('DOMContentLoaded', function() {
  // 初始化Three.js场景
  initPerfumeVisual();       // 香水瓶主视觉
  initSceneVisual();         // 威尼斯场景可视化
  initLabVisual();           // 调香实验室粒子效果
  
  // 初始化页面交互组件
  setupTabs();               // 标签页切换
  setupSliders();            // 滑块控制
  setupButtons();            // 按钮事件
});

// ================ Three.js场景实现 ================

// 香水瓶主视觉
function initPerfumeVisual() {
  const container = document.getElementById('perfume-canvas');
  if (!container) return;
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75, 
    container.clientWidth / container.clientHeight, 
    0.1, 
    1000
  );
  
  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true 
  });
  
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  
  // 添加灯光
  const ambientLight = new THREE.AmbientLight(0x606060);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  // 创建香水瓶
  const perfume = createPerfumeGeometry();
  scene.add(perfume);
  
  // 创建香水液体
  const liquid = createLiquidGeometry();
  liquid.position.y = 0.7;
  scene.add(liquid);
  
  // 添加漂浮粒子
  createFloatingParticles(scene, 50);
  
  // 设置相机位置
  camera.position.z = 5;
  
  // 动画循环
  function animate() {
    requestAnimationFrame(animate);
    
    perfume.rotation.y += 0.005;
    liquid.rotation.y += 0.005;
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  // 响应式调整
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// 创建香水瓶几何体
function createPerfumeGeometry() {
  const bottleGroup = new THREE.Group();
  
  // 瓶身
  const bodyGeometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
  const bodyMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x8A4DFF, 
    transparent: true, 
    opacity: 0.8,
    shininess: 90
  });
  const bottleBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
  bottleGroup.add(bottleBody);
  
  // 瓶颈
  const neckGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32);
  neckGeometry.translate(0, 1.25, 0);
  const bottleNeck = new THREE.Mesh(neckGeometry, bodyMaterial);
  bottleGroup.add(bottleNeck);
  
  // 瓶肩
  const shoulderGeometry = new THREE.ConeGeometry(0.8, 0.5, 32);
  shoulderGeometry.translate(0, 0.95, 0);
  const bottleShoulder = new THREE.Mesh(shoulderGeometry, bodyMaterial);
  bottleGroup.add(bottleShoulder);
  
  // 瓶盖
  const capGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 32);
  capGeometry.translate(0, 1.5, 0);
  const bottleCap = new THREE.Mesh(capGeometry, bodyMaterial);
  bottleGroup.add(bottleCap);
  
  return bottleGroup;
}

// 创建香水液体几何体
function createLiquidGeometry() {
  const liquidGeometry = new THREE.CylinderGeometry(0.78, 0.78, 1, 32);
  const liquidMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x3CEFFF,
    transparent: true,
    opacity: 0.6,
    shininess: 100
  });
  
  return new THREE.Mesh(liquidGeometry, liquidMaterial);
}

// 创建漂浮粒子
function createFloatingParticles(scene, count) {
  const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
  const particleMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffffff,
    transparent: true,
    opacity: 0.7
  });
  
  const particles = new THREE.Group();
  
  for (let i = 0; i < count; i++) {
    const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
    
    // 在瓶内随机位置
    const r = 0.7 * Math.random();
    const theta = Math.random() * Math.PI * 2;
    
    particle.position.set(
      r * Math.cos(theta),
      0.7 + 0.5 * Math.random(), // Y轴位置在液体范围内
      r * Math.sin(theta)
    );
    
    particles.add(particle);
  }
  
  scene.add(particles);
}

// 场景视觉初始化
function initSceneVisual() {
  const container = document.getElementById('scene-canvas');
  if (!container) return;
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  
  const renderer = new THREE.WebGLRenderer({ 
    canvas: container,
    alpha: true
  });
  
  renderer.setSize(container.clientWidth, container.clientHeight);
  
  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0x555555);
  scene.add(ambientLight);
  
  // 创建水表面
  const waterGeometry = new THREE.PlaneGeometry(20, 20, 10, 10);
  const waterMaterial = new THREE.MeshPhongMaterial({
    color: 0x3CEFFF,
    transparent: true,
    opacity: 0.5,
    wireframe: true
  });
  const water = new THREE.Mesh(waterGeometry, waterMaterial);
  water.rotation.x = -Math.PI / 2;
  scene.add(water);
  
  // 创建建筑
  const buildingGeometry = new THREE.BoxGeometry(0.8, 1, 0.8);
  const buildingMaterial = new THREE.MeshPhongMaterial({
    color: 0xD4C8FF
  });
  
  for (let i = -4; i <= 4; i++) {
    if (Math.random() > 0.3) {
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set(i, 0.5, Math.random() * 4 - 2);
      
      // 随机高度
      building.scale.y = 0.5 + Math.random() * 1.5;
      scene.add(building);
    }
  }
  
  // 添加雾效果
  scene.fog = new THREE.FogExp2(0x8A4DFF, 0.05);
  
  // 设置相机
  camera.position.set(0, 2, 5);
  camera.lookAt(0, 0, 0);
  
  // 动画循环
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  
  animate();
}

// 调香实验室粒子系统
function initLabVisual() {
  const container = document.getElementById('visual-particles');
  if (!container) return;
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  
  const renderer = new THREE.WebGLRenderer({ 
    canvas: container,
    alpha: true
  });
  
  renderer.setSize(container.clientWidth, container.clientHeight);
  
  // 创建实验室粒子
  createLabParticles(scene);
  
  // 设置相机
  camera.position.z = 2;
  
  // 动画循环
  function animate() {
    requestAnimationFrame(animate);
    
    // 旋转粒子系统
    scene.children.forEach(child => {
      if (child instanceof THREE.Points) {
        child.rotation.y += 0.001;
        child.rotation.x += 0.0005;
      }
    });
    
    renderer.render(scene, camera);
  }
  
  animate();
}

// 创建实验室粒子
function createLabParticles(scene) {
  // 海洋气息粒子 - 蓝色
  createParticleGroup(scene, 100, 0x3CEFFF, 1.0);
  
  // 木质书卷粒子 - 琥珀色
  createParticleGroup(scene, 80, 0xFFB74D, 0.9);
  
  // 琥珀余韵粒子 - 淡金色
  createParticleGroup(scene, 70, 0xFFD54F, 0.8);
}

function createParticleGroup(scene, count, color, radius) {
  // 创建几何体和属性
  const geometry = new THREE.BufferGeometry();
  
  // 生成随机位置
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  // 提取RGB值
  const r = ((color >> 16) & 255) / 255;
  const g = ((color >> 8) & 255) / 255;
  const b = (color & 255) / 255;
  
  for (let i = 0; i < count * 3; i += 3) {
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.acos(2 * Math.random() - 1);
    
    // 球面坐标转换为笛卡尔坐标
    positions[i] = radius * Math.sin(theta) * Math.cos(phi);
    positions[i + 1] = radius * Math.sin(theta) * Math.sin(phi);
    positions[i + 2] = radius * Math.cos(theta);
    
    // 颜色值
    colors[i] = r;
    colors[i + 1] = g;
    colors[i + 2] = b;
  }
  
  // 设置几何体属性
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // 创建材质和点云
  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });
  
  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

// ================ UI 交互组件 ================

// 设置标签页切换
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 移除所有活动状态
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      
      // 添加当前活动状态
      tab.classList.add('active');
      const tabId = tab.dataset.tab;
      document.getElementById(`${tabId}-content`).classList.add('active');
      
      // 根据标签更新视觉效果
      if (tabId === 'lab') {
        updateLabVisual();
      }
    });
  });
}

// 设置滑块控制
function setupSliders() {
  const sliders = document.querySelectorAll('.slider');
  
  sliders.forEach(slider => {
    // 初始化显示
    const valueDisplay = slider.parentElement.querySelector('.slider-label span:last-child');
    if (valueDisplay) {
      valueDisplay.textContent = `${slider.value}%`;
    }
    
    // 添加输入事件
    slider.addEventListener('input', () => {
      if (valueDisplay) {
        valueDisplay.textContent = `${slider.value}%`;
      }
      
      // 更新实验室视觉效果
      updateLabVisual();
    });
  });
}

// 更新实验室视觉效果
function updateLabVisual() {
  // 这里可以添加根据滑块值改变粒子系统的逻辑
  console.log('Lab visuals updated with slider values');
}

// 设置按钮交互
function setupButtons() {
  // 播放/停止按钮
  const playButtons = document.querySelectorAll('.btn-primary');
  playButtons.forEach(btn => {
    if (btn.querySelector('.fa-play')) {
      btn.addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-pause"></i> 暂停声音';
        playWindSound();
      });
    }
  });
  
  // 收藏按钮
  const likeButtons = document.querySelectorAll('.btn-secondary');
  likeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      if (this.classList.contains('liked')) {
        this.innerHTML = '<i class="fas fa-heart"></i> 收藏记忆';
        this.classList.remove('liked');
      } else {
        this.innerHTML = '<i class="fas fa-heart"></i> 已收藏';
        this.classList.add('liked');
      }
    });
  });
  
  // 添加香调按钮
  const addScentBtn = document.getElementById('add-scent-btn');
  if (addScentBtn) {
    addScentBtn.addEventListener('click', addNewScentControl);
  }
  
  // 保存配方按钮
  const saveBtn = document.getElementById('save-blend-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveScentBlend);
  }
}

// 添加新的香调控制
function addNewScentControl() {
  const mixerControls = document.querySelector('.mixer-controls');
  if (!mixerControls) return;
  
  const noteNames = ["柑橘", "花香", "木质", "香料", "海洋", "琥珀"];
  const noteName = noteNames[Math.floor(Math.random() * noteNames.length)];
  
  const newControl = document.createElement('div');
  newControl.className = 'slider-container';
  newControl.innerHTML = `
    <div class="slider-label">
      <span>${noteName}</span>
      <span>30%</span>
    </div>
    <input type="range" min="0" max="100" value="30" class="slider" data-note="${noteName.toLowerCase()}">
  `;
  
  mixerControls.appendChild(newControl);
  
  // 添加事件监听器
  const slider = newControl.querySelector('.slider');
  const valueDisplay = newControl.querySelector('.slider-label span:last-child');
  
  slider.addEventListener('input', () => {
    if (valueDisplay) {
      valueDisplay.textContent = `${slider.value}%`;
    }
    updateLabVisual();
  });
}

// 保存当前香调配方
function saveScentBlend() {
  const sliders = document.querySelectorAll('.slider-container .slider');
  const blend = [];
  
  sliders.forEach(slider => {
    const name = slider.parentElement.querySelector('.slider-label span:first-child').textContent;
    blend.push({
      name,
      value: slider.value
    });
  });
  
  console.log('Saving scent blend:', blend);
  alert(`配方已保存！包含${blend.length}种香调`);
  
  // 添加到历史记录
  saveToBlendHistory(blend);
}

// 保存到历史记录
function saveToBlendHistory(blend) {
  // 使用localStorage保存
  const history = JSON.parse(localStorage.getItem('scentBlends') || '[]');
  history.push({
    date: new Date().toISOString(),
    blend
  });
  
  localStorage.setItem('scentBlends', JSON.stringify(history));
}

// 播放风声效果
function playWindSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 2);
  } catch (e) {
    console.log("Audio API error:", e);
  }
}