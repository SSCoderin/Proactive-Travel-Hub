"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DataBus = ({ path, delay }) => {
  const lanes = [-0.6, 0, 0.6];

  return (
    <svg
      className="absolute inset-0 w-full h-full z-0 overflow-visible"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient id="busGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {lanes.map((offset, i) => (
        <React.Fragment key={i}>
          <path
            d={path}
            transform={`translate(0, ${offset})`}
            stroke="rgba(59, 130, 246, 0.04)"
            strokeWidth="0.15"
            fill="none"
          />

          <motion.path
            d={path}
            transform={`translate(0, ${offset})`}
            stroke="url(#busGradient)"
            strokeWidth="0.3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 0.15, 0.15, 0],
              pathOffset: [0, 1.15],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: Math.random() * 2 + 4,
              repeat: Infinity,
              delay: delay + i * 0.2,
              ease: "easeInOut",
            }}
          />
        </React.Fragment>
      ))}
    </svg>
  );
};

export default function CircuitBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Subtle parallax to create 3D depth
  useEffect(() => {
    const handleMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const busPaths = [
    "M 5,10 L 25,10 L 25,30 L 40,30",
    "M 0,25 L 15,25 L 15,5 L 45,5",

    "M 95,15 L 75,15 L 75,40 L 60,40",
    "M 100,5 L 80,5 L 80,25 L 65,25",

    "M 5,90 L 30,90 L 30,70 L 45,70",
    "M 0,60 L 20,60 L 20,80 L 35,80",

    "M 95,85 L 70,85 L 70,65 L 55,65",
    "M 100,50 L 85,50 L 85,75 L 75,75",

    "M 50,0 L 50,35 L 70,35",
    "M 50,100 L 50,75 L 30,75",
    "M 30,45 L 70,45",
    "M 45,20 L 45,80",

    "M 10,40 L 10,60 L 0,60",
    "M 90,30 L 90,70 L 100,70",
  ];

  return (
    <motion.div
      style={{ x: mousePos.x, y: mousePos.y }}
      className="fixed inset-[-5%] z-0 bg-[#020203] overflow-hidden pointer-events-none"
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] bg-indigo-900/10 blur-[120px] rounded-full" />

      {busPaths.map((p, i) => (
        <DataBus key={i} path={p} delay={i * 0.6} />
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#020203_95%)]" />

      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="absolute w-[1.5px] h-[1.5px] bg-blue-500/20 rounded-full"
          style={{
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
            boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)",
          }}
        />
      ))}
    </motion.div>
  );
}
