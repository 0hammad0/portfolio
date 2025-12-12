"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  Upload,
  Trash2,
  Edit,
  X,
  Check,
  Image as ImageIcon,
  Folder,
  Search,
  Grid,
  List,
  Plus,
  ExternalLink,
  Copy,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  createMediaFromUrl,
  updateMedia,
  deleteMedia,
  bulkDeleteMedia,
} from "../actions/media-actions";

interface Media {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl: string | null;
  alt: string | null;
  folder: string;
  width: number | null;
  height: number | null;
  createdAt: Date;
}

interface MediaLibraryProps {
  media: Media[];
}

const FOLDERS = ["general", "projects", "blog", "profile"];

export function MediaLibrary({ media }: MediaLibraryProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // View state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Media | null>(null);

  // Upload form state
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadFilename, setUploadFilename] = useState("");
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadFolder, setUploadFolder] = useState("general");

  // Filter media
  const filteredMedia = media.filter((item) => {
    const matchesFolder = !selectedFolder || item.folder === selectedFolder;
    const matchesSearch =
      !searchQuery ||
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  // Stats per folder
  const folderCounts = FOLDERS.reduce(
    (acc, folder) => {
      acc[folder] = media.filter((m) => m.folder === folder).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const handleUpload = () => {
    if (!uploadUrl.trim()) {
      toast.error("Please enter an image URL");
      return;
    }

    startTransition(async () => {
      const result = await createMediaFromUrl({
        url: uploadUrl.trim(),
        filename: uploadFilename.trim() || undefined,
        alt: uploadAlt.trim() || undefined,
        folder: uploadFolder,
      });

      if (result.success) {
        toast.success("Media added successfully");
        setShowUploadModal(false);
        setUploadUrl("");
        setUploadFilename("");
        setUploadAlt("");
        setUploadFolder("general");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to add media");
      }
    });
  };

  const handleUpdateMedia = (id: string, alt: string) => {
    startTransition(async () => {
      const result = await updateMedia(id, { alt });
      if (result.success) {
        toast.success("Media updated");
        setEditingItem(null);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this media item?")) return;

    startTransition(async () => {
      const result = await deleteMedia(id);
      if (result.success) {
        toast.success("Media deleted");
        setSelectedItems((prev) => prev.filter((i) => i !== id));
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete");
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (
      !confirm(`Delete ${selectedItems.length} selected items?`)
    )
      return;

    startTransition(async () => {
      const result = await bulkDeleteMedia(selectedItems);
      if (result.success) {
        toast.success(`${selectedItems.length} items deleted`);
        setSelectedItems([]);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete");
      }
    });
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "Unknown";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search media..."
              className={cn(
                "pl-10 pr-4 py-2 rounded-lg w-64",
                "bg-background-secondary border border-border",
                "text-foreground placeholder:text-foreground-muted",
                "focus:outline-none focus:ring-2 focus:ring-accent"
              )}
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-accent text-white"
                  : "text-foreground-muted hover:text-foreground hover:bg-background-tertiary"
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list"
                  ? "bg-accent text-white"
                  : "text-foreground-muted hover:text-foreground hover:bg-background-tertiary"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedItems.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isPending}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-red-500 text-white font-medium",
                "hover:bg-red-600 transition-colors",
                "disabled:opacity-50"
              )}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete ({selectedItems.length})</span>
            </button>
          )}
          <button
            onClick={() => setShowUploadModal(true)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-accent text-white font-medium",
              "hover:bg-accent-hover transition-colors"
            )}
          >
            <Plus className="w-5 h-5" />
            <span>Add Media</span>
          </button>
        </div>
      </div>

      {/* Folder Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedFolder(null)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap",
            "text-sm font-medium transition-colors",
            selectedFolder === null
              ? "bg-accent text-white"
              : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
          )}
        >
          <Folder className="w-4 h-4" />
          <span>All</span>
          <span className="text-xs opacity-70">({media.length})</span>
        </button>
        {FOLDERS.map((folder) => (
          <button
            key={folder}
            onClick={() => setSelectedFolder(folder)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap",
              "text-sm font-medium transition-colors capitalize",
              selectedFolder === folder
                ? "bg-accent text-white"
                : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
            )}
          >
            <Folder className="w-4 h-4" />
            <span>{folder}</span>
            <span className="text-xs opacity-70">
              ({folderCounts[folder]})
            </span>
          </button>
        ))}
      </div>

      {/* Media Grid/List */}
      {filteredMedia.length === 0 ? (
        <div className="text-center py-12 bg-background-secondary rounded-xl border border-border">
          <ImageIcon className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
          <p className="text-foreground-muted mb-2">No media found</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="text-accent hover:underline"
          >
            Add your first media
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group relative aspect-square rounded-lg overflow-hidden",
                "bg-background-secondary border border-border",
                "hover:border-accent/50 transition-colors",
                selectedItems.includes(item.id) && "ring-2 ring-accent"
              )}
            >
              {/* Image */}
              {item.mimeType.startsWith("image/") ? (
                <img
                  src={item.url}
                  alt={item.alt || item.filename}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-foreground-muted" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-2 left-2">
                  <button
                    onClick={() => toggleSelect(item.id)}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      selectedItems.includes(item.id)
                        ? "bg-accent text-white"
                        : "bg-white/20 text-white hover:bg-white/30"
                    )}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm truncate mb-2">
                    {item.filename}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyUrl(item.url)}
                      className="p-1.5 rounded bg-white/20 text-white hover:bg-white/30 transition-colors"
                      title="Copy URL"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-white/20 text-white hover:bg-white/30 transition-colors"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-1.5 rounded bg-white/20 text-white hover:bg-white/30 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded bg-white/20 text-white hover:bg-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-background-secondary rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-background-tertiary border-b border-border">
                <th className="w-12 p-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === filteredMedia.length &&
                      filteredMedia.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(filteredMedia.map((m) => m.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="text-left text-sm font-medium text-foreground-muted p-3">
                  File
                </th>
                <th className="text-left text-sm font-medium text-foreground-muted p-3">
                  Folder
                </th>
                <th className="text-left text-sm font-medium text-foreground-muted p-3">
                  Size
                </th>
                <th className="text-left text-sm font-medium text-foreground-muted p-3">
                  Date
                </th>
                <th className="text-right text-sm font-medium text-foreground-muted p-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMedia.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-background-tertiary/50"
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded overflow-hidden bg-background flex-shrink-0">
                        {item.mimeType.startsWith("image/") ? (
                          <img
                            src={item.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-foreground-muted" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                          {item.filename}
                        </p>
                        {item.alt && (
                          <p className="text-xs text-foreground-muted truncate max-w-[200px]">
                            {item.alt}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-foreground-muted capitalize">
                      {item.folder}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-foreground-muted">
                      {formatFileSize(item.size)}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-foreground-muted">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleCopyUrl(item.url)}
                        className="p-1.5 text-foreground-muted hover:text-foreground rounded transition-colors"
                        title="Copy URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-foreground-muted hover:text-foreground rounded transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 text-foreground-muted hover:text-foreground rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-foreground-muted hover:text-red-500 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowUploadModal(false)}
          />
          <div className="relative bg-background-secondary rounded-xl border border-border p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Add Media from URL
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-foreground-muted hover:text-foreground rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent"
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Filename (optional)
                </label>
                <input
                  type="text"
                  value={uploadFilename}
                  onChange={(e) => setUploadFilename(e.target.value)}
                  placeholder="my-image.jpg"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent"
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Alt Text (optional)
                </label>
                <input
                  type="text"
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  placeholder="Description of the image"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground placeholder:text-foreground-muted",
                    "focus:outline-none focus:ring-2 focus:ring-accent"
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Folder
                </label>
                <select
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value)}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg",
                    "bg-background border border-border",
                    "text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-accent"
                  )}
                >
                  {FOLDERS.map((folder) => (
                    <option key={folder} value={folder} className="capitalize">
                      {folder}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              {uploadUrl && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Preview
                  </label>
                  <div className="aspect-video rounded-lg overflow-hidden bg-background border border-border">
                    <img
                      src={uploadUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-background-tertiary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isPending || !uploadUrl.trim()}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg",
                    "bg-accent text-white font-medium",
                    "hover:bg-accent-hover transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>Add Media</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <EditMediaModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(alt) => handleUpdateMedia(editingItem.id, alt)}
          isPending={isPending}
        />
      )}
    </div>
  );
}

function EditMediaModal({
  item,
  onClose,
  onSave,
  isPending,
}: {
  item: Media;
  onClose: () => void;
  onSave: (alt: string) => void;
  isPending: boolean;
}) {
  const [alt, setAlt] = useState(item.alt || "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background-secondary rounded-xl border border-border p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Edit Media</h3>
          <button
            onClick={onClose}
            className="p-1 text-foreground-muted hover:text-foreground rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Preview */}
          <div className="aspect-video rounded-lg overflow-hidden bg-background border border-border">
            <img
              src={item.url}
              alt={item.alt || item.filename}
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Filename
            </label>
            <p className="text-sm text-foreground-muted">{item.filename}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Alt Text
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Description of the image"
              className={cn(
                "w-full px-4 py-2.5 rounded-lg",
                "bg-background border border-border",
                "text-foreground placeholder:text-foreground-muted",
                "focus:outline-none focus:ring-2 focus:ring-accent"
              )}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-background-tertiary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(alt)}
              disabled={isPending}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg",
                "bg-accent text-white font-medium",
                "hover:bg-accent-hover transition-colors",
                "disabled:opacity-50"
              )}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
