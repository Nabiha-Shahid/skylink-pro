"use client";

import React, { useEffect, useState, useRef } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import * as THREE from "three";

// Flight route data — major global routes with neon-blue palette
const ARCS_DATA = [
  { startLat: 40.7128, startLng: -74.006, endLat: 35.6762, endLng: 139.6503, color: ["#3b82f6", "#60a5fa"] },
  { startLat: 51.5074, startLng: -0.1278, endLat: 25.2048, endLng: 55.2708, color: ["#3b82f6", "#93c5fd"] },
  { startLat: 48.8566, startLng: 2.3522, endLat: 40.7128, endLng: -74.006, color: ["#60a5fa", "#bfdbfe"] },
  { startLat: 34.0522, startLng: -118.2437, endLat: -33.8688, endLng: 151.2093, color: ["#3b82f6", "#3b82f6"] },
  { startLat: 1.3521, startLng: 103.8198, endLat: 51.5074, endLng: -0.1278, color: ["#2563eb", "#60a5fa"] },
  { startLat: 25.2048, startLng: 55.2708, endLat: 35.6762, endLng: 139.6503, color: ["#93c5fd", "#3b82f6"] },
  { startLat: -23.5505, startLng: -46.6333, endLat: 48.8566, endLng: 2.3522, color: ["#60a5fa", "#2563eb"] },
  { startLat: 22.3193, startLng: 114.1694, endLat: 34.0522, endLng: -118.2437, color: ["#3b82f6", "#60a5fa"] },
];

// Rings at destination airports — act as "pulse" landing beacons
const RINGS_DATA = [
  { lat: 35.6762, lng: 139.6503, maxR: 3, propagationSpeed: 2, repeatPeriod: 1200 },
  { lat: 25.2048, lng: 55.2708, maxR: 3, propagationSpeed: 2, repeatPeriod: 1400 },
  { lat: 40.7128, lng: -74.006, maxR: 3, propagationSpeed: 2, repeatPeriod: 1000 },
  { lat: 51.5074, lng: -0.1278, maxR: 3, propagationSpeed: 2, repeatPeriod: 1600 },
  { lat: -33.8688, lng: 151.2093, maxR: 3, propagationSpeed: 2, repeatPeriod: 1300 },
  { lat: 48.8566, lng: 2.3522, maxR: 3, propagationSpeed: 2, repeatPeriod: 1100 },
  { lat: 34.0522, lng: -118.2437, maxR: 3, propagationSpeed: 2, repeatPeriod: 1500 },
  { lat: 1.3521, lng: 103.8198, maxR: 3, propagationSpeed: 2, repeatPeriod: 900 },
];

interface TelemetryData {
  flightId: string;
  latitude: string;
  longitude: string;
  altitude: number;
  yieldPrice: number;
  progress: string;
}

interface GlobeClientProps {
  telemetry: TelemetryData[];
}

export default function GlobeClient({ telemetry }: GlobeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods>(undefined); // Use standard ref
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle dimensions
  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    const update = () => {
      setDimensions({ width: el.clientWidth, height: el.clientHeight });
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Configure globe once it mounts
  useEffect(() => {
    if (globeRef.current && dimensions.width > 0 && dimensions.height > 0) {
      const controls = globeRef.current.controls();

      // Ensure controls exist before setting properties
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.4;
        controls.enableZoom = true;
        controls.minDistance = 150;
        controls.maxDistance = 500;
      }

      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.2 });
    }
  }, [dimensions.width, dimensions.height]); // Re-run if dimensions are set

  // Cleanup WebGL resources on unmount to prevent context loss
  useEffect(() => {
    // Capture the current ref to ensure stability in cleanup
    const globe = globeRef.current;

    return () => {
      if (globe) {
        console.log("Disposing WebGL resources for Globe...");
        const renderer = globe.renderer();
        const scene = globe.scene();

        if (renderer) {
          renderer.dispose();
          renderer.forceContextLoss();
          const gl = renderer.getContext();
          if (gl) {
            const extension = gl.getExtension('WEBGL_lose_context');
            if (extension) extension.loseContext();
          }
        }

        if (scene) {
          scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              if (object.geometry) object.geometry.dispose();
              if (object.material) {
                if (Array.isArray(object.material)) {
                  object.material.forEach((mat: THREE.Material) => mat.dispose());
                } else {
                  object.material.dispose();
                }
              }
            }
          });
          scene.clear();
        }
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Globe
          ref={globeRef} // Pass standard ref here
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          atmosphereColor="#3b82f6"
          atmosphereAltitude={0.18}
          arcsData={ARCS_DATA}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashInitialGap={() => Math.random()}
          arcDashAnimateTime={2500}
          arcAltitude={0.15}
          arcStroke={0.6}
          ringsData={RINGS_DATA}
          ringColor={() => "#3b82f6"}
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          ringAltitude={0.002}
          pointsData={telemetry || []}
          pointLat="latitude"
          pointLng="longitude"
          pointColor={() => "#3b82f6"}
          pointAltitude={0.01}
          pointRadius={0.4}
          pointsMerge={false}
          htmlElementsData={telemetry || []}
          htmlElement={(d: object) => {
            const data = d as TelemetryData;
            const el = document.createElement('div');
            el.innerHTML = `
              <div class="flex flex-col items-center">
                <div class="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] animate-pulse"></div>
                <div class="bg-slate-900/80 border border-white/10 px-2 py-0.5 rounded text-[8px] font-black text-white mt-1 whitespace-nowrap backdrop-blur-sm uppercase tracking-tighter">
                  ${data.flightId}
                </div>
              </div>
            `;
            return el;
          }}
          htmlLat="latitude"
          htmlLng="longitude"
          htmlAltitude={0.015}
        />
      )}
    </div>
  );
}