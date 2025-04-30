import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import styles from './styles.module.css';
import { fragmentShader, vertexShader } from './shaders';

const FlowerCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  // Scene references
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

  // Track window size changes
  const trackWindowSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  const initScene = () => {
    if (!canvasRef.current) return;

    // Initialize renderer
    rendererRef.current = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true
    });
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current.setSize(windowSize.width, windowSize.height);

    // Create scenes
    shaderSceneRef.current = new THREE.Scene();
    mainSceneRef.current = new THREE.Scene();

    // Create camera
    cameraRef.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    clockRef.current = new THREE.Clock();

    // Create render targets
    renderTargetsRef.current = [
      new THREE.WebGLRenderTarget(windowSize.width, windowSize.height),
      new THREE.WebGLRenderTarget(windowSize.width, windowSize.height),
    ];

    const planeGeometry = new THREE.PlaneGeometry(2, 2);

    // Create shader material
    shaderMaterialRef.current = new THREE.ShaderMaterial({
      uniforms: {
        u_ratio: { value: windowSize.width / windowSize.height },
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

  // const updateSceneOnResize = () => {
  //   if (!rendererRef.current || !shaderMaterialRef.current) return;

  //   // Store current texture to preserve the scene
  //   const currentTexture = basicMaterialRef.current?.map;
    
  //   // Update renderer size
  //   rendererRef.current.setSize(windowSize.width, windowSize.height);
    
  //   // Update shader uniform
  //   shaderMaterialRef.current.uniforms.u_ratio.value = windowSize.width / windowSize.height;
    
  //   // Resize render targets
  //   renderTargetsRef.current.forEach(target => {
  //     target.setSize(windowSize.width, windowSize.height);
  //   });
    
  //   // Restore the texture if it exists
  //   if (basicMaterialRef.current && currentTexture) {
  //     basicMaterialRef.current.map = currentTexture;
  //   }
  // };

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

    pointerRef.current.x = clientX / windowSize.width;
    pointerRef.current.y = clientY / windowSize.height;
    pointerRef.current.clicked = true;
    setIsRendering(true);
  };

  useEffect(() => {
    // Set up window resize listener
    window.addEventListener('resize', trackWindowSize);
    
    return () => {
      window.removeEventListener('resize', trackWindowSize);
    };
  }, []);

  useEffect(() => {
    // Initial setup
    initScene();
    
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

    // Cleanup
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      
      // Dispose of Three.js resources
      rendererRef.current?.dispose();
      shaderMaterialRef.current?.dispose();
      basicMaterialRef.current?.dispose();
      renderTargetsRef.current.forEach(target => target.dispose());
    };
  }, []);

  // This effect handles responsive updates when window size changes
  useEffect(() => {
    // updateSceneOnResize();
  }, [windowSize]);

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

    </div>
  );
};

export default FlowerCanvas;