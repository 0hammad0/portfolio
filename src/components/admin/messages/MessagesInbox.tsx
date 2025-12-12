"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  Mail,
  MailOpen,
  Reply,
  Archive,
  Trash2,
  AlertTriangle,
  CheckCircle,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import {
  updateMessageStatus,
  deleteMessage,
} from "../actions/message-actions";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  repliedAt: Date | null;
  notes: string | null;
  createdAt: Date;
}

interface MessagesInboxProps {
  messages: Message[];
}

export function MessagesInbox({ messages }: MessagesInboxProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string | null>(
    messages[0]?.id || null
  );
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const selectedMessage = messages.find((m) => m.id === selectedId);

  const filteredMessages = messages.filter((m) => {
    if (filter === "all") return true;
    return m.status === filter;
  });

  const handleStatusChange = async (id: string, status: string) => {
    startTransition(async () => {
      const result = await updateMessageStatus(id, status);
      if (result.success) {
        toast.success(`Message marked as ${status.toLowerCase()}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update message");
      }
    });
    setOpenMenuId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    startTransition(async () => {
      const result = await deleteMessage(id);
      if (result.success) {
        toast.success("Message deleted");
        if (selectedId === id) {
          setSelectedId(messages.find((m) => m.id !== id)?.id || null);
        }
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete message");
      }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "UNREAD":
        return <Mail className="w-4 h-4" />;
      case "READ":
        return <MailOpen className="w-4 h-4" />;
      case "REPLIED":
        return <Reply className="w-4 h-4" />;
      case "ARCHIVED":
        return <Archive className="w-4 h-4" />;
      case "SPAM":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNREAD":
        return "bg-blue-500/10 text-blue-500";
      case "READ":
        return "bg-gray-500/10 text-gray-500";
      case "REPLIED":
        return "bg-green-500/10 text-green-500";
      case "ARCHIVED":
        return "bg-yellow-500/10 text-yellow-500";
      case "SPAM":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const statusCounts = {
    all: messages.length,
    UNREAD: messages.filter((m) => m.status === "UNREAD").length,
    READ: messages.filter((m) => m.status === "READ").length,
    REPLIED: messages.filter((m) => m.status === "REPLIED").length,
    ARCHIVED: messages.filter((m) => m.status === "ARCHIVED").length,
    SPAM: messages.filter((m) => m.status === "SPAM").length,
  };

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
        <p className="text-foreground-muted">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Sidebar - Message List */}
      <div className="lg:col-span-1 flex flex-col bg-background-secondary rounded-xl border border-border overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All" },
              { key: "UNREAD", label: "Unread" },
              { key: "REPLIED", label: "Replied" },
              { key: "ARCHIVED", label: "Archived" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  filter === f.key
                    ? "bg-accent text-white"
                    : "text-foreground-muted hover:text-foreground hover:bg-background-tertiary"
                )}
              >
                {f.label}
                <span className="ml-1 text-xs opacity-70">
                  ({statusCounts[f.key as keyof typeof statusCounts]})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="p-4 text-center text-foreground-muted">
              No messages found
            </div>
          ) : (
            filteredMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => {
                  setSelectedId(message.id);
                  if (message.status === "UNREAD") {
                    handleStatusChange(message.id, "READ");
                  }
                }}
                className={cn(
                  "w-full p-4 text-left border-b border-border transition-colors",
                  selectedId === message.id
                    ? "bg-accent/10"
                    : "hover:bg-background-tertiary",
                  message.status === "UNREAD" && "bg-blue-500/5"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {message.status === "UNREAD" && (
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                      <p
                        className={cn(
                          "font-medium truncate",
                          message.status === "UNREAD"
                            ? "text-foreground"
                            : "text-foreground-muted"
                        )}
                      >
                        {message.name}
                      </p>
                    </div>
                    <p className="text-sm text-foreground-muted truncate mt-0.5">
                      {message.subject || "No subject"}
                    </p>
                    <p className="text-xs text-foreground-muted mt-1 line-clamp-2">
                      {message.message}
                    </p>
                  </div>
                  <span className="text-xs text-foreground-muted whitespace-nowrap">
                    {formatDistanceToNow(new Date(message.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content - Message Detail */}
      <div className="lg:col-span-2 bg-background-secondary rounded-xl border border-border overflow-hidden flex flex-col">
        {selectedMessage ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {selectedMessage.name}
                  </h2>
                  <p className="text-sm text-foreground-muted mt-1">
                    {selectedMessage.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                        getStatusColor(selectedMessage.status)
                      )}
                    >
                      {getStatusIcon(selectedMessage.status)}
                      {selectedMessage.status.toLowerCase()}
                    </span>
                    <span className="text-xs text-foreground-muted">
                      {formatDistanceToNow(
                        new Date(selectedMessage.createdAt),
                        { addSuffix: true }
                      )}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${
                      selectedMessage.subject || "Your message"
                    }`}
                    onClick={() =>
                      handleStatusChange(selectedMessage.id, "REPLIED")
                    }
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg",
                      "bg-accent text-white font-medium",
                      "hover:bg-accent-hover transition-colors"
                    )}
                  >
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
                  </a>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === selectedMessage.id
                            ? null
                            : selectedMessage.id
                        )
                      }
                      className="p-2 text-foreground-muted hover:text-foreground hover:bg-background-tertiary rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {openMenuId === selectedMessage.id && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 w-40 py-1 bg-background-secondary border border-border rounded-lg shadow-lg z-50">
                          {selectedMessage.status !== "ARCHIVED" && (
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  selectedMessage.id,
                                  "ARCHIVED"
                                )
                              }
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-background-tertiary transition-colors"
                            >
                              <Archive className="w-4 h-4" />
                              <span>Archive</span>
                            </button>
                          )}
                          {selectedMessage.status !== "SPAM" && (
                            <button
                              onClick={() =>
                                handleStatusChange(selectedMessage.id, "SPAM")
                              }
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-background-tertiary transition-colors"
                            >
                              <AlertTriangle className="w-4 h-4" />
                              <span>Mark as Spam</span>
                            </button>
                          )}
                          {selectedMessage.status === "ARCHIVED" && (
                            <button
                              onClick={() =>
                                handleStatusChange(selectedMessage.id, "READ")
                              }
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-background-tertiary transition-colors"
                            >
                              <MailOpen className="w-4 h-4" />
                              <span>Unarchive</span>
                            </button>
                          )}
                          <hr className="my-1 border-border" />
                          <button
                            onClick={() => handleDelete(selectedMessage.id)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-background-tertiary transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Subject */}
            {selectedMessage.subject && (
              <div className="px-6 py-4 border-b border-border">
                <p className="text-sm text-foreground-muted">Subject</p>
                <p className="text-foreground font-medium mt-1">
                  {selectedMessage.subject}
                </p>
              </div>
            )}

            {/* Message Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>

            {/* Notes */}
            {selectedMessage.notes && (
              <div className="px-6 py-4 border-t border-border bg-background-tertiary/50">
                <p className="text-sm text-foreground-muted mb-2">Admin Notes</p>
                <p className="text-sm text-foreground">
                  {selectedMessage.notes}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-foreground-muted">Select a message to view</p>
          </div>
        )}
      </div>
    </div>
  );
}
