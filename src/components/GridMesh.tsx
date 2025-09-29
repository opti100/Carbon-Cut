// "use client"
// import React, { useRef, useEffect, useState } from 'react';
// import * as THREE from 'three';

// const GridMesh = ({ 
//   width = 4000, 
//   height = 2000, 
//   widthSegments = 128, 
//   heightSegments = 64,
//   color = "#00FF40",
//   wireframe = true,
//   className = ""
// }) => {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const gridRef = useRef(null);
//   const animationRef = useRef(null);
  
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

//   // Simple noise function to replace SimplexNoise
//   const noise2D = (x, y) => {
//     const n = Math.sin(x * 12.9898 + y * 78.233) * 1;
//     return (n - Math.floor(n)) * 2 - 1;
//   };

//   useEffect(() => {
//     if (!mountRef.current) return;

//     // Scene setup
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;

//     const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
//     renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
//     renderer.setClearColor(0x000000, 0);
//     mountRef.current.appendChild(renderer.domElement);
//     rendererRef.current = renderer;

//     const camera = new THREE.PerspectiveCamera(
//       60, 
//       mountRef.current.clientWidth / mountRef.current.clientHeight, 
//       0.1, 
//       10000
//     );
//     camera.position.set(0, 0, 800);
//     cameraRef.current = camera;

//     // Grid geometry
//     const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
//     const material = new THREE.MeshLambertMaterial({
//       color: new THREE.Color(color),
//       wireframe: wireframe,
//       transparent: false,
//       depthTest: true,
//     });

//     const grid = new THREE.Mesh(geometry, material);
//     grid.rotation.x = -Math.PI / 6; // Similar to the original look rotation
//     scene.add(grid);
//     gridRef.current = grid;

//     // Lighting
//     const light = new THREE.PointLight(0xffffff, 1, 1000);
//     light.position.set(0, 200, 500);
//     scene.add(light);

//     const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
//     scene.add(ambientLight);

//     // Animation loop
//     let cycle = 0;
//     const factor = 300;
//     const scale = 30;
//     const speed = 0.00001;

//     const animate = () => {
//       animationRef.current = requestAnimationFrame(animate);

//       // Apply noise to vertices
//       if (gridRef.current && gridRef.current.geometry.attributes.position) {
//         const vertices = gridRef.current.geometry.attributes.position.array;
        
//         for (let i = 0; i < vertices.length; i += 3) {
//           const x = vertices[i];
//           const y = vertices[i + 1];
//           const xoff = x / factor;
//           const yoff = y / factor + cycle;
//           const rand = noise2D(xoff, yoff) * scale;
//           vertices[i + 2] = rand;
//         }
        
//         gridRef.current.geometry.attributes.position.needsUpdate = true;
//         gridRef.current.geometry.computeVertexNormals();
//         cycle += speed;
//       }

//       // Mouse interaction
//       if (gridRef.current) {
//         const ease = 12;
//         const targetRotationZ = mousePosition.x * 0.0004;
//         const targetPositionX = mousePosition.x * 0.04;
        
//         gridRef.current.rotation.z += (targetRotationZ - gridRef.current.rotation.z) / ease;
//         gridRef.current.position.x += (targetPositionX - gridRef.current.position.x) / ease;
//       }

//       if (rendererRef.current && cameraRef.current) {
//         rendererRef.current.render(scene, cameraRef.current);
//       }
//     };

//     animate();

//     // Handle resize
//     const handleResize = () => {
//       if (mountRef.current && cameraRef.current && rendererRef.current) {
//         cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
//         cameraRef.current.updateProjectionMatrix();
//         rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
//       }
//     };

//     window.addEventListener('resize', handleResize);

//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//       if (mountRef.current && rendererRef.current?.domElement) {
//         mountRef.current.removeChild(rendererRef.current.domElement);
//       }
//       if (rendererRef.current) {
//         rendererRef.current.dispose();
//       }
//       if (gridRef.current?.geometry) {
//         gridRef.current.geometry.dispose();
//       }
//       if (gridRef.current?.material) {
//         gridRef.current.material.dispose();
//       }
//     };
//   }, [color, wireframe, width, height, widthSegments, heightSegments]);

//   // Mouse movement handler
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (!mountRef.current) return;
//       const rect = mountRef.current.getBoundingClientRect();
//       const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
//       const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
//       setMousePosition({ x, y });
//     };

//     const currentMount = mountRef.current;
//     if (currentMount) {
//       currentMount.addEventListener('mousemove', handleMouseMove);
//     }

//     return () => {
//       if (currentMount) {
//         currentMount.removeEventListener('mousemove', handleMouseMove);
//       }
//     };
//   }, []);

//   return (
//     <div className={`w-full h-full ${className}`}>
//       <div 
//         ref={mountRef} 
//         className="w-full h-full cursor-move"
//         style={{ background: 'transparent' }}
//       />
//     </div>
//   );
// };

// // Demo component to show the GridMesh in action
// const GridMeshDemo = () => {
//   return (
//     <div className="w-full h-screen bg-black flex flex-col">
//       <div className="p-4 bg-gray-900 text-white">
//         <h1 className="text-2xl font-bold">Interactive Grid Mesh</h1>
//         <p className="text-gray-300">Move your mouse over the grid to interact with it</p>
//       </div>
//       <div className="flex-1">
//         <GridMesh 
//           width={4000}
//           height={2000}
//           widthSegments={100}
//           heightSegments={50}
//           color="#00ff88"
//           wireframe={true}
//           className="w-full h-full"
//         />
//       </div>
//     </div>
//   );
// };

// export default GridMeshDemo;