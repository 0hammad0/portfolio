"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Save,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../actions/skill-actions";

interface SkillCategory {
  id: string;
  name: string;
  icon: string | null;
  order: number;
  visible: boolean;
}

interface Skill {
  id: string;
  name: string;
  proficiency: number;
  icon: string | null;
  categoryId: string;
  order: number;
  visible: boolean;
}

interface SkillsManagerProps {
  categories: SkillCategory[];
  skills: Skill[];
}

export function SkillsManager({ categories, skills }: SkillsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Category state
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map((c) => c.id)
  );

  // Skill state
  const [newSkillData, setNewSkillData] = useState<{
    categoryId: string;
    name: string;
    proficiency: number;
  } | null>(null);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingSkillData, setEditingSkillData] = useState<{
    name: string;
    proficiency: number;
  }>({ name: "", proficiency: 50 });

  const getSkillsForCategory = (categoryId: string) =>
    skills.filter((s) => s.categoryId === categoryId);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Category handlers
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;

    startTransition(async () => {
      const result = await createSkillCategory({ name: newCategoryName.trim() });
      if (result.success) {
        toast.success("Category created");
        setNewCategoryName("");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create category");
      }
    });
  };

  const handleUpdateCategory = (id: string) => {
    if (!editingCategoryName.trim()) return;

    startTransition(async () => {
      const result = await updateSkillCategory(id, {
        name: editingCategoryName.trim(),
      });
      if (result.success) {
        toast.success("Category updated");
        setEditingCategoryId(null);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update category");
      }
    });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}" and all its skills?`
      )
    )
      return;

    startTransition(async () => {
      const result = await deleteSkillCategory(id);
      if (result.success) {
        toast.success("Category deleted");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete category");
      }
    });
  };

  // Skill handlers
  const handleCreateSkill = () => {
    if (!newSkillData || !newSkillData.name.trim()) return;

    startTransition(async () => {
      const result = await createSkill({
        name: newSkillData.name.trim(),
        proficiency: newSkillData.proficiency,
        categoryId: newSkillData.categoryId,
      });
      if (result.success) {
        toast.success("Skill created");
        setNewSkillData(null);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create skill");
      }
    });
  };

  const handleUpdateSkill = (id: string) => {
    if (!editingSkillData.name.trim()) return;

    startTransition(async () => {
      const result = await updateSkill(id, {
        name: editingSkillData.name.trim(),
        proficiency: editingSkillData.proficiency,
      });
      if (result.success) {
        toast.success("Skill updated");
        setEditingSkillId(null);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update skill");
      }
    });
  };

  const handleDeleteSkill = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    startTransition(async () => {
      const result = await deleteSkill(id);
      if (result.success) {
        toast.success("Skill deleted");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete skill");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Add New Category */}
      <div className="bg-background-secondary rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Add New Category
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name (e.g., Frontend)"
            className={cn(
              "flex-1 px-4 py-2.5 rounded-lg",
              "bg-background border border-border",
              "text-foreground placeholder:text-foreground-muted",
              "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            )}
            onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
          />
          <button
            onClick={handleCreateCategory}
            disabled={isPending || !newCategoryName.trim()}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg",
              "bg-accent text-white font-medium",
              "hover:bg-accent-hover transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Plus className="w-5 h-5" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="text-center py-12 bg-background-secondary rounded-xl border border-border">
          <p className="text-foreground-muted">No skill categories yet</p>
        </div>
      ) : (
        categories.map((category) => (
          <div
            key={category.id}
            className="bg-background-secondary rounded-xl border border-border overflow-hidden"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-background-tertiary/50">
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-foreground-muted cursor-grab" />

                {editingCategoryId === category.id ? (
                  <input
                    type="text"
                    value={editingCategoryName}
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg",
                      "bg-background border border-border",
                      "text-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    )}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdateCategory(category.id);
                      if (e.key === "Escape") setEditingCategoryId(null);
                    }}
                    autoFocus
                  />
                ) : (
                  <h3 className="text-lg font-semibold text-foreground">
                    {category.name}
                  </h3>
                )}

                <span className="text-sm text-foreground-muted">
                  ({getSkillsForCategory(category.id).length} skills)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {editingCategoryId === category.id ? (
                  <>
                    <button
                      onClick={() => handleUpdateCategory(category.id)}
                      disabled={isPending}
                      className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingCategoryId(null)}
                      className="p-2 text-foreground-muted hover:text-foreground hover:bg-background-tertiary rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingCategoryId(category.id);
                        setEditingCategoryName(category.name);
                      }}
                      className="p-2 text-foreground-muted hover:text-foreground hover:bg-background-tertiary rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteCategory(category.id, category.name)
                      }
                      className="p-2 text-foreground-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="p-2 text-foreground-muted hover:text-foreground hover:bg-background-tertiary rounded-lg transition-colors"
                    >
                      {expandedCategories.includes(category.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Skills List */}
            {expandedCategories.includes(category.id) && (
              <div className="p-4 space-y-3">
                {getSkillsForCategory(category.id).map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-background hover:bg-background-tertiary/50 transition-colors"
                  >
                    <GripVertical className="w-4 h-4 text-foreground-muted cursor-grab" />

                    {editingSkillId === skill.id ? (
                      <>
                        <input
                          type="text"
                          value={editingSkillData.name}
                          onChange={(e) =>
                            setEditingSkillData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className={cn(
                            "flex-1 px-3 py-1.5 rounded-lg",
                            "bg-background-secondary border border-border",
                            "text-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-accent"
                          )}
                        />
                        <div className="flex items-center gap-2 w-40">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={editingSkillData.proficiency}
                            onChange={(e) =>
                              setEditingSkillData((prev) => ({
                                ...prev,
                                proficiency: parseInt(e.target.value),
                              }))
                            }
                            className="flex-1"
                          />
                          <span className="text-sm text-foreground w-10 text-right">
                            {editingSkillData.proficiency}%
                          </span>
                        </div>
                        <button
                          onClick={() => handleUpdateSkill(skill.id)}
                          className="p-1.5 text-green-500 hover:bg-green-500/10 rounded transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingSkillId(null)}
                          className="p-1.5 text-foreground-muted hover:text-foreground rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-foreground font-medium">
                          {skill.name}
                        </span>
                        <div className="w-32 h-2 bg-background-tertiary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <span className="text-sm text-foreground-muted w-10 text-right">
                          {skill.proficiency}%
                        </span>
                        <button
                          onClick={() => {
                            setEditingSkillId(skill.id);
                            setEditingSkillData({
                              name: skill.name,
                              proficiency: skill.proficiency,
                            });
                          }}
                          className="p-1.5 text-foreground-muted hover:text-foreground rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill.id, skill.name)}
                          className="p-1.5 text-foreground-muted hover:text-red-500 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                ))}

                {/* Add New Skill */}
                {newSkillData?.categoryId === category.id ? (
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-background border border-dashed border-border">
                    <input
                      type="text"
                      value={newSkillData.name}
                      onChange={(e) =>
                        setNewSkillData((prev) =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                      placeholder="Skill name"
                      className={cn(
                        "flex-1 px-3 py-1.5 rounded-lg",
                        "bg-background-secondary border border-border",
                        "text-foreground placeholder:text-foreground-muted",
                        "focus:outline-none focus:ring-2 focus:ring-accent"
                      )}
                      autoFocus
                    />
                    <div className="flex items-center gap-2 w-40">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={newSkillData.proficiency}
                        onChange={(e) =>
                          setNewSkillData((prev) =>
                            prev
                              ? { ...prev, proficiency: parseInt(e.target.value) }
                              : null
                          )
                        }
                        className="flex-1"
                      />
                      <span className="text-sm text-foreground w-10 text-right">
                        {newSkillData.proficiency}%
                      </span>
                    </div>
                    <button
                      onClick={handleCreateSkill}
                      disabled={isPending || !newSkillData.name.trim()}
                      className="p-1.5 text-green-500 hover:bg-green-500/10 rounded transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setNewSkillData(null)}
                      className="p-1.5 text-foreground-muted hover:text-foreground rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      setNewSkillData({
                        categoryId: category.id,
                        name: "",
                        proficiency: 50,
                      })
                    }
                    className="flex items-center gap-2 w-full p-3 rounded-lg border border-dashed border-border text-foreground-muted hover:text-foreground hover:border-accent transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
