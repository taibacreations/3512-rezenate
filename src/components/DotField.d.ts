declare module '*/DotField' {
  import { HTMLAttributes } from 'react';

  interface DotFieldProps extends HTMLAttributes<HTMLDivElement> {
    dotRadius?: number;
    dotSpacing?: number;
    cursorRadius?: number;
    cursorForce?: number;
    bulgeOnly?: boolean;
    bulgeStrength?: number;
    glowRadius?: number;
    sparkle?: boolean;
    waveAmplitude?: number;
    gradientFrom?: string;
    gradientTo?: string;
    glowColor?: string;
  }

  const DotField: React.FC<DotFieldProps>;
  export default DotField;
}