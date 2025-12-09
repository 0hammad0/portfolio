"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

interface SkillData {
  name: string;
  level: number; // 0-100
  color?: string;
}

interface SkillRadarProps {
  skills: SkillData[];
  size?: number;
  className?: string;
  showLabels?: boolean;
  animated?: boolean;
}

export function SkillRadar({
  skills,
  size = 300,
  className,
  showLabels = true,
  animated = true,
}: SkillRadarProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const shouldAnimate = animated && !prefersReducedMotion;
  const numSkills = skills.length;
  const angleStep = (2 * Math.PI) / numSkills;
  const center = size / 2;
  const maxRadius = (size / 2) * 0.75;

  // Calculate points for each skill
  const getPoint = (index: number, level: number) => {
    const angle = angleStep * index - Math.PI / 2; // Start from top
    const radius = (level / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  // Create polygon path
  const createPolygonPath = (levelMultiplier: number = 1) => {
    const points = skills.map((skill, index) => {
      const point = getPoint(index, skill.level * levelMultiplier);
      return `${point.x},${point.y}`;
    });
    return points.join(" ");
  };

  // Create level rings
  const levelRings = [20, 40, 60, 80, 100];

  return (
    <div className={cn("relative", className)}>
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Background rings */}
        {levelRings.map((level) => {
          const points = skills.map((_, index) => {
            const point = getPoint(index, level);
            return `${point.x},${point.y}`;
          });
          return (
            <polygon
              key={level}
              points={points.join(" ")}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
              opacity={0.5}
            />
          );
        })}

        {/* Axis lines */}
        {skills.map((_, index) => {
          const point = getPoint(index, 100);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="var(--border)"
              strokeWidth="1"
              opacity={0.3}
            />
          );
        })}

        {/* Skill polygon with animation */}
        <motion.polygon
          points={createPolygonPath(shouldAnimate && isInView ? 1 : 0)}
          fill="var(--accent)"
          fillOpacity={0.2}
          stroke="var(--accent)"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Animated polygon fill */}
        {shouldAnimate && (
          <AnimatedPolygon
            skills={skills}
            getPoint={getPoint}
            isInView={isInView}
          />
        )}

        {/* Skill points */}
        {skills.map((skill, index) => {
          const point = getPoint(index, skill.level);
          const isHovered = hoveredIndex === index;

          return (
            <motion.g key={skill.name}>
              {/* Point */}
              <motion.circle
                cx={shouldAnimate ? (isInView ? point.x : center) : point.x}
                cy={shouldAnimate ? (isInView ? point.y : center) : point.y}
                r={isHovered ? 8 : 5}
                fill={skill.color || "var(--accent)"}
                stroke="var(--background)"
                strokeWidth="2"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                initial={shouldAnimate ? { scale: 0 } : {}}
                animate={isInView ? { scale: 1 } : {}}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                }}
              />

              {/* Glow effect on hover */}
              {isHovered && (
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r={15}
                  fill={skill.color || "var(--accent)"}
                  opacity={0.3}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </motion.g>
          );
        })}

        {/* Labels */}
        {showLabels &&
          skills.map((skill, index) => {
            const labelPoint = getPoint(index, 115);
            const angle = angleStep * index - Math.PI / 2;
            const isRight = Math.cos(angle) > 0.1;
            const isLeft = Math.cos(angle) < -0.1;
            const isHovered = hoveredIndex === index;

            return (
              <motion.g
                key={`label-${skill.name}`}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <text
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor={isRight ? "start" : isLeft ? "end" : "middle"}
                  dominantBaseline="middle"
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isHovered ? "fill-accent" : "fill-foreground-muted"
                  )}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ cursor: "pointer" }}
                >
                  {skill.name}
                </text>
                {isHovered && (
                  <text
                    x={labelPoint.x}
                    y={labelPoint.y + 14}
                    textAnchor={isRight ? "start" : isLeft ? "end" : "middle"}
                    dominantBaseline="middle"
                    className="text-[10px] fill-accent font-mono"
                  >
                    {skill.level}%
                  </text>
                )}
              </motion.g>
            );
          })}
      </svg>
    </div>
  );
}

// Animated polygon component
function AnimatedPolygon({
  skills,
  getPoint,
  isInView,
}: {
  skills: SkillData[];
  getPoint: (index: number, level: number) => { x: number; y: number };
  isInView: boolean;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setProgress(0);
      return;
    }

    let frame: number;
    const duration = 1000;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isInView]);

  const points = skills.map((skill, index) => {
    const point = getPoint(index, skill.level * progress);
    return `${point.x},${point.y}`;
  });

  return (
    <polygon
      points={points.join(" ")}
      fill="var(--accent)"
      fillOpacity={0.15}
      stroke="var(--accent)"
      strokeWidth="2"
    />
  );
}

// Preset skill data for easy use
export const defaultSkills: SkillData[] = [
  { name: "React", level: 95, color: "#61DAFB" },
  { name: "TypeScript", level: 90, color: "#3178C6" },
  { name: "Next.js", level: 90, color: "#ffffff" },
  { name: "Node.js", level: 85, color: "#339933" },
  { name: "CSS", level: 90, color: "#264de4" },
  { name: "PostgreSQL", level: 80, color: "#4169E1" },
];
