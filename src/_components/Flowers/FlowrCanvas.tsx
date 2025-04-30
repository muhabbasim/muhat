// src/components/FlowerCanvas/FlowerCanvas.tsx
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import styles from './style.module.css';
import { fragmentShader, vertexShader } from './shaders.ts';

const FlowerCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(true);
  
  // Initialize scene variables with useRef to persist between renders
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const shaderSceneRef = useRef<THREE.Scene | null>(null);
  const mainSceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const renderTargetsRef = useRef<THREE.WebGLRenderTarget[]>([]);
  const shaderMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const basicMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  
  const pointerRef = useRef({
    x: 0.65,
    y: 0.3,
    clicked: true
  });

  const backgroundColor = new THREE.Color(0xffffff);
  const isStartRef = useRef(true);

  const initScene = () => {
    if (!canvasRef.current) return;

    // Initialize renderer
    rendererRef.current = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true
    });
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create scenes
    shaderSceneRef.current = new THREE.Scene();
    mainSceneRef.current = new THREE.Scene();

    // Create camera
    cameraRef.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    clockRef.current = new THREE.Clock();

    // Create render targets
    renderTargetsRef.current = [
      new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
      new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
    ];

    const planeGeometry = new THREE.PlaneGeometry(2, 2);

    // Create shader material
    shaderMaterialRef.current = new THREE.ShaderMaterial({
      uniforms: {
        u_ratio: { value: window.innerWidth / window.innerHeight },
        u_point: { value: new THREE.Vector2(pointerRef.current.x, pointerRef.current.y) },
        u_time: { value: 0 },
        u_stop_time: { value: 0 },
        u_stop_randomizer: { value: new THREE.Vector3(0, 0, 0) },
        u_texture: { value: null },
        u_background_color: { value: backgroundColor }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true
    });

    basicMaterialRef.current = new THREE.MeshBasicMaterial({
      transparent: true
    });
    
    const backgroundColorMaterial = new THREE.MeshBasicMaterial({
      color: backgroundColor,
      transparent: true
    });

    const planeBasic = new THREE.Mesh(planeGeometry, basicMaterialRef.current);
    const planeShader = new THREE.Mesh(planeGeometry, shaderMaterialRef.current);
    const coloredPlane = new THREE.Mesh(planeGeometry, backgroundColorMaterial);
    
    shaderSceneRef.current.add(planeShader);
    mainSceneRef.current?.add(coloredPlane);

    rendererRef.current.setRenderTarget(renderTargetsRef.current[0]);
    rendererRef.current.render(mainSceneRef.current, cameraRef.current);

    mainSceneRef.current?.remove(coloredPlane);
    mainSceneRef.current?.add(planeBasic);
  };

  const updateSize = () => {
    if (!shaderMaterialRef.current || !rendererRef.current) return;
    
    shaderMaterialRef.current.uniforms.u_ratio.value = window.innerWidth / window.innerHeight;
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    
    // Update render targets
    renderTargetsRef.current.forEach(target => {
      target.setSize(window.innerWidth, window.innerHeight);
    });
  };

  const render = () => {
    if (!rendererRef.current || !shaderSceneRef.current || !mainSceneRef.current || 
        !cameraRef.current || !clockRef.current || !shaderMaterialRef.current || 
        !basicMaterialRef.current) return;

    requestAnimationFrame(render);
    const delta = clockRef.current.getDelta();

    if (isRendering) {
      shaderMaterialRef.current.uniforms.u_texture.value = renderTargetsRef.current[0].texture;
      shaderMaterialRef.current.uniforms.u_time.value = clockRef.current.getElapsedTime() + 0.9;

      if (pointerRef.current.clicked) {
        shaderMaterialRef.current.uniforms.u_point.value = new THREE.Vector2(
          pointerRef.current.x,
          1 - pointerRef.current.y
        );
        shaderMaterialRef.current.uniforms.u_stop_randomizer.value = new THREE.Vector3(
          Math.random(),
          Math.random(),
          Math.random()
        );
        if (isStartRef.current) {
          shaderMaterialRef.current.uniforms.u_stop_randomizer.value = new THREE.Vector3(0.5, 1, 1);
          isStartRef.current = false;
        }
        shaderMaterialRef.current.uniforms.u_stop_time.value = 0;
        pointerRef.current.clicked = false;
      }
      shaderMaterialRef.current.uniforms.u_stop_time.value += delta;

      rendererRef.current.setRenderTarget(renderTargetsRef.current[1]);
      rendererRef.current.render(shaderSceneRef.current, cameraRef.current);

      basicMaterialRef.current.map = renderTargetsRef.current[1].texture;

      rendererRef.current.setRenderTarget(null);
      rendererRef.current.render(mainSceneRef.current, cameraRef.current);

      // Swap render targets
      const tmp = renderTargetsRef.current[0];
      renderTargetsRef.current[0] = renderTargetsRef.current[1];
      renderTargetsRef.current[1] = tmp;
    }
  };

  const handleClickOrTouch = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    let clientX, clientY;
    
    if ('touches' in e) {
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    pointerRef.current.x = clientX / window.innerWidth;
    pointerRef.current.y = clientY / window.innerHeight;
    pointerRef.current.clicked = true;
    setIsRendering(true);
  };

  const toggleRendering = () => {
    setIsRendering(prev => !prev);
  };

  useEffect(() => {
    // Initial setup
    initScene();
    updateSize();
    
    // Demo flowers for initial display
    const timer1 = setTimeout(() => {
      pointerRef.current.x = 0.75;
      pointerRef.current.y = 0.5;
      pointerRef.current.clicked = true;
    }, 400);
    
    const timer2 = setTimeout(() => {
      pointerRef.current.x = 0.4;
      pointerRef.current.y = 0.5;
      pointerRef.current.clicked = true;
    }, 700);

    // Start rendering loop
    render();

    // Add event listeners
    window.addEventListener('resize', updateSize);

    // Cleanup
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', updateSize);
      
      // Dispose of Three.js resources
      rendererRef.current?.dispose();
      shaderMaterialRef.current?.dispose();
      basicMaterialRef.current?.dispose();
      renderTargetsRef.current.forEach(target => target.dispose());
    };
  }, []);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} onClick={handleClickOrTouch} onTouchStart={handleClickOrTouch} />
      <div className={styles.name}>
        <div className="flex flex-col items-center justify-center text-center text-[#dddddd]">
          <h1 className="w-full text-3xl md:text-4xl font-bold mb-4 ">
            Coming Soon
          </h1>
          <span>Click To Add Flowers</span>
        </div>
      </div>
      <div className={styles.renderToggle} onClick={toggleRendering}>
        {isRendering ? 'freeze' : 'unfreeze'}
      </div>
    </div>
  );
};

export default FlowerCanvas;