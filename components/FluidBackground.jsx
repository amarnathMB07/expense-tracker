"use client";

import React, { useEffect, useRef } from 'react';

export default function FluidBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let fluidInstance = null;
    
    // Import dynamically to avoid SSR issues with canvas
    import('webgl-fluid').then((webGLFluid) => {
      if (canvasRef.current) {
        // webgl-fluid might export the function directly or as default
        const initFluid = webGLFluid.default || webGLFluid;
        
        try {
          initFluid(canvasRef.current, {
            IMMEDIATE: true,
            TRIGGER: 'hover',
            SIM_RESOLUTION: 128,
            DYE_RESOLUTION: 1024,
            CAPTURE_RESOLUTION: 512,
            DENSITY_DISSIPATION: 1,
            VELOCITY_DISSIPATION: 0.2,
            PRESSURE: 0.8,
            PRESSURE_ITERATIONS: 20,
            CURL: 30,
            SPLAT_RADIUS: 0.25,
            SPLAT_FORCE: 6000,
            SHADING: true,
            COLORFUL: true,
            COLOR_UPDATE_SPEED: 10,
            PAUSED: false,
            BACK_COLOR: { r: 0, g: 0, b: 0 },
            TRANSPARENT: true,
            BLOOM: true,
            BLOOM_ITERATIONS: 8,
            BLOOM_RESOLUTION: 256,
            BLOOM_INTENSITY: 0.8,
            BLOOM_THRESHOLD: 0.6,
            BLOOM_SOFT_KNEE: 0.7,
            SUNRAYS: true,
            SUNRAYS_RESOLUTION: 196,
            SUNRAYS_WEIGHT: 1.0,
          });
        } catch (e) {
          console.error("Fluid initialization error:", e);
        }
      }
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-auto z-0"
      style={{ opacity: 0.4 }} // Lower opacity so it doesn't distract too much from the app
    />
  );
}
