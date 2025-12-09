"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SkillItem {
  id: string;
  name: string;
  icon: string;
  level: number;
  color: string;
}

interface DraggableSkillCardsProps {
  initialSkills?: SkillItem[];
  onReorder?: (skills: SkillItem[]) => void;
}

const defaultSkills: SkillItem[] = [
  { id: "1", name: "React", icon: "R", level: 95, color: "#61DAFB" },
  { id: "2", name: "TypeScript", icon: "TS", level: 90, color: "#3178C6" },
  { id: "3", name: "Next.js", icon: "N", level: 90, color: "#000000" },
  { id: "4", name: "Node.js", icon: "N", level: 85, color: "#339933" },
  { id: "5", name: "Tailwind", icon: "TW", level: 95, color: "#06B6D4" },
  { id: "6", name: "PostgreSQL", icon: "PG", level: 80, color: "#4169E1" },
  { id: "7", name: "Prisma", icon: "P", level: 85, color: "#5A67D8" },
  { id: "8", name: "Git", icon: "G", level: 90, color: "#F05032" },
];

function SortableSkillCard({ skill, isDragging }: { skill: SkillItem; isDragging?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "z-50"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={cn(
          "relative flex items-center gap-3 p-3 sm:p-4 rounded-xl",
          "bg-background-secondary border border-border",
          "hover:border-accent/30 transition-all duration-300",
          "cursor-grab active:cursor-grabbing",
          isSortableDragging && "shadow-xl shadow-accent/20"
        )}
        {...attributes}
        {...listeners}
      >
        {/* Drag handle */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground-muted">
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Icon */}
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-lg"
          style={{ backgroundColor: skill.color }}
        >
          {skill.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-foreground text-sm sm:text-base truncate">
              {skill.name}
            </span>
            <span className="text-xs sm:text-sm text-foreground-muted tabular-nums ml-2">
              {skill.level}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-background-tertiary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: skill.color }}
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SkillCardOverlay({ skill }: { skill: SkillItem }) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 p-3 sm:p-4 rounded-xl",
        "bg-background-secondary border border-accent",
        "shadow-xl shadow-accent/30",
        "cursor-grabbing"
      )}
    >
      <div className="text-foreground-muted">
        <GripVertical className="h-4 w-4" />
      </div>

      <div
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-lg"
        style={{ backgroundColor: skill.color }}
      >
        {skill.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-foreground text-sm sm:text-base truncate">
            {skill.name}
          </span>
          <span className="text-xs sm:text-sm text-foreground-muted tabular-nums ml-2">
            {skill.level}%
          </span>
        </div>

        <div className="h-1.5 bg-background-tertiary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ backgroundColor: skill.color, width: `${skill.level}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function DraggableSkillCards({
  initialSkills = defaultSkills,
  onReorder,
}: DraggableSkillCardsProps) {
  const [skills, setSkills] = useState(initialSkills);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (over && active.id !== over.id) {
        setSkills((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          const newItems = arrayMove(items, oldIndex, newIndex);

          // Save to localStorage
          localStorage.setItem("skillOrder", JSON.stringify(newItems.map((s) => s.id)));

          onReorder?.(newItems);
          return newItems;
        });
      }
    },
    [onReorder]
  );

  const activeSkill = activeId ? skills.find((s) => s.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="mb-4 text-center">
        <p className="text-xs text-foreground-muted">
          Drag and drop to reorder skills
        </p>
      </div>

      <SortableContext items={skills.map((s) => s.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {skills.map((skill) => (
            <SortableSkillCard
              key={skill.id}
              skill={skill}
              isDragging={skill.id === activeId}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeSkill ? <SkillCardOverlay skill={activeSkill} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
