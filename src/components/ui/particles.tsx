// Particles.tsx
"use client";

import Antigravity from "@/components/Antigravity";

const Particles = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Antigravity
        count={1000}
        magnetRadius={50}
        ringRadius={50}
        waveSpeed={0.4}
        waveAmplitude={2}
        particleSize={2}
        lerpSpeed={0.1}
        color="#9564F4"
        autoAnimate={true}
        particleVariance={2}
        rotationSpeed={0}
        depthFactor={3}
        pulseSpeed={3}
        particleShape="capsule"
        fieldStrength={10}
      />
    </div>
  );
};

export default Particles;