"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { Terminal as TerminalIcon, X, Minus, Square, GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/lib/constants/siteConfig";

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HistoryItem {
  command: string;
  output: string | React.ReactNode;
  isError?: boolean;
}

const COMMANDS: Record<string, { description: string; action: () => string | React.ReactNode }> = {
  help: {
    description: "Show available commands",
    action: () => `
Available commands:
  help          - Show this help message
  whoami        - Display information about me
  skills        - List my technical skills
  projects      - Show featured projects
  contact       - Get contact information
  social        - Display social links
  clear         - Clear the terminal
  date          - Show current date and time
  echo [text]   - Echo back text
  history       - Show command history
  neofetch      - System information (fun)
  matrix        - Enter the matrix

Tip: Use Tab for autocomplete, ↑↓ for history
    `.trim(),
  },
  whoami: {
    description: "Display information about me",
    action: () => `
╭─────────────────────────────────────────╮
│           ${siteConfig.author.name}
│─────────────────────────────────────────│
│  Role: ${siteConfig.author.role}
│
│  ${siteConfig.author.bio}
│
│  Location: Based remotely
│  Status: Available for work ✓
╰─────────────────────────────────────────╯
    `.trim(),
  },
  skills: {
    description: "List my technical skills",
    action: () => `
┌─ Frontend ──────────────────────────────┐
│ React      ████████████████████░░░░ 95% │
│ Next.js    ██████████████████░░░░░░ 90% │
│ TypeScript ██████████████████░░░░░░ 90% │
│ Tailwind   ████████████████████░░░░ 95% │
└─────────────────────────────────────────┘

┌─ Backend ───────────────────────────────┐
│ Node.js    █████████████████░░░░░░░ 85% │
│ PostgreSQL ████████████████░░░░░░░░ 80% │
│ Prisma     █████████████████░░░░░░░ 85% │
│ REST APIs  ██████████████████░░░░░░ 90% │
└─────────────────────────────────────────┘

┌─ Tools ─────────────────────────────────┐
│ Git        ██████████████████░░░░░░ 90% │
│ Docker     ███████████████░░░░░░░░░ 75% │
│ AWS        ██████████████░░░░░░░░░░ 70% │
└─────────────────────────────────────────┘
    `.trim(),
  },
  projects: {
    description: "Show featured projects",
    action: () => `
Featured Projects:
──────────────────

[1] Portfolio Website
    Tech: Next.js, TypeScript, Tailwind, Prisma
    A modern animated portfolio with GSAP & Framer Motion

[2] E-Commerce Platform
    Tech: React, Node.js, PostgreSQL
    Full-stack e-commerce solution

[3] Task Management App
    Tech: Next.js, Prisma, tRPC
    Real-time collaborative task manager

→ Visit #projects section for more details
    `.trim(),
  },
  contact: {
    description: "Get contact information",
    action: () => `
╭─ Contact Information ─╮
│                       │
│  📧 Email:            │
│     hello@example.com
│                       │
│  💼 Open to:          │
│     • Full-time roles │
│     • Contract work   │
│     • Collaborations  │
│                       │
│  📍 Response time:    │
│     Usually < 24hrs   │
│                       │
╰───────────────────────╯

→ Or visit #contact section
    `.trim(),
  },
  social: {
    description: "Display social links",
    action: () => `
Social Links:
─────────────

  GitHub    → github.com/username
  LinkedIn  → linkedin.com/in/username
  Twitter   → twitter.com/username
    `.trim(),
  },
  date: {
    description: "Show current date and time",
    action: () => new Date().toLocaleString(),
  },
  neofetch: {
    description: "System information (fun)",
    action: () => `
        ⠀⠀⠀⠀⠀⠀⣀⣤⣴⣶⣶⣶⣶⣦⣤⣀⠀⠀⠀⠀⠀⠀     ${siteConfig.author.name}@portfolio
     ⠀⠀⠀⣠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣄⠀⠀⠀     ──────────────────────
     ⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀     OS: Portfolio v2.0
     ⣴⣿⣿⣿⣿⣿⡿⠛⠉⠉⠉⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣦     Kernel: Next.js 16
     ⣿⣿⣿⣿⣿⠏⠀⢀⣤⣤⡀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿     Shell: TypeScript 5
     ⣿⣿⣿⣿⡏⠀⠀⣿⣿⣿⣿⠀⠀⠀⢹⣿⣿⣿⣿⣿⣿⣿     Theme: Cyan Dark
     ⣿⣿⣿⣿⣧⠀⠀⠻⠿⠿⠃⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿     Animation: GSAP + Framer
     ⠻⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⡿⠟     DB: PostgreSQL + Prisma
     ⠀⠙⢿⣿⣿⣿⣿⣿⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀     Uptime: Always improving
     ⠀⠀⠀⠙⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠋⠀⠀⠀⠀
     ⠀⠀⠀⠀⠀⠀⠈⠉⠛⠛⠛⠛⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀     ████████████████████
    `.trim(),
  },
  matrix: {
    description: "Enter the matrix",
    action: () => `
Wake up, Neo...
The Matrix has you...
Follow the white rabbit.

Knock, knock, Neo.

█▀▀▀▀▀█ ▄▄▄▄▄ █▀▀▀▀▀█
█ ███ █ █▀▀▀█ █ ███ █
█ ▀▀▀ █ ▀▄▄▄▀ █ ▀▀▀ █
▀▀▀▀▀▀▀ ▀ ▀ ▀ ▀▀▀▀▀▀▀
▀▄▀▄▀ ▀▀▀▄▄▄▄▀▀▄▄ ▄▀▄
█▄▄█▄▀▀▄█▀██▄ ▀▄█▄▄ █
▀▀▀▀▀▀▀ █▄▄▄  ▄ ▀▄  █
█▀▀▀▀▀█ ▀▄▀██▀▀▀  ▄ █
█ ███ █ ▀█▀ ▄▄█▄█▄▀▄▀
█ ▀▀▀ █ █▀▀▀▄██ ▄▄█▄█
▀▀▀▀▀▀▀ ▀▀  ▀▀ ▀▀▀▀▀▀
    `.trim(),
  },
};

export function Terminal({ isOpen, onClose }: TerminalProps) {
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: "",
      output: `Welcome to ${siteConfig.author.name}'s Terminal v1.0.0
Type 'help' for available commands.
`,
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll to bottom on new output
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Keyboard shortcut to open terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" && !isOpen) {
        e.preventDefault();
        // This should be handled by parent
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmedCmd = cmd.trim().toLowerCase();
      const [command, ...args] = trimmedCmd.split(" ");

      let output: string | React.ReactNode = "";
      let isError = false;

      if (!trimmedCmd) {
        return;
      }

      // Add to command history
      setCommandHistory((prev) => [...prev, trimmedCmd]);
      setHistoryIndex(-1);

      // Handle special commands
      if (command === "clear") {
        setHistory([]);
        return;
      }

      if (command === "history") {
        output = commandHistory.length
          ? commandHistory.map((c, i) => `  ${i + 1}  ${c}`).join("\n")
          : "No commands in history";
      } else if (command === "echo") {
        output = args.join(" ") || "";
      } else if (COMMANDS[command]) {
        output = COMMANDS[command].action();
      } else {
        output = `Command not found: ${command}. Type 'help' for available commands.`;
        isError = true;
      }

      setHistory((prev) => [...prev, { command: cmd, output, isError }]);
    },
    [commandHistory]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Navigate history with arrow keys
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex < commandHistory.length - 1
            ? historyIndex + 1
            : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      // Autocomplete
      e.preventDefault();
      const matches = Object.keys(COMMANDS).filter((cmd) =>
        cmd.startsWith(input.toLowerCase())
      );
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        setHistory((prev) => [
          ...prev,
          { command: "", output: matches.join("  ") },
        ]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Drag constraints - full viewport */}
          <div
            ref={constraintsRef}
            className="fixed inset-0 pointer-events-none z-[89]"
          />
          <motion.div
            drag
            dragControls={dragControls}
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            dragMomentum={false}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={cn(
              "fixed bottom-4 right-4 z-[90]",
              isExpanded
                ? "w-[95vw] max-w-5xl"
                : "w-[95vw] max-w-2xl"
            )}
          >
          <div
            className={cn(
              "rounded-xl overflow-hidden flex flex-col",
              "bg-[#1e1e1e] border border-[#3d3d3d]",
              "shadow-2xl shadow-black/50"
            )}
          >
            {/* Title bar - drag handle */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#3d3d3d] cursor-grab active:cursor-grabbing select-none"
            >
              <div className="flex items-center gap-2">
                <GripHorizontal className="h-4 w-4 text-gray-600" />
                <TerminalIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-400 font-mono">
                  terminal@portfolio
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="p-1 rounded hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-300"
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Restore" : "Minimize"}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <button
                  className="p-1 rounded hover:bg-white/10 transition-colors text-gray-500 hover:text-gray-300"
                  onClick={() => {
                    setIsExpanded(!isExpanded);
                    setIsMinimized(false);
                  }}
                  title={isExpanded ? "Restore" : "Maximize"}
                >
                  <Square className="h-3 w-3" />
                </button>
                <button
                  className="p-1 rounded hover:bg-red-500/20 transition-colors text-gray-500 hover:text-red-400"
                  onClick={onClose}
                  title="Close"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Terminal content */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  ref={terminalRef}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: isExpanded ? "60vh" : 320,
                    opacity: 1
                  }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 overflow-y-auto font-mono text-sm"
                  onClick={() => inputRef.current?.focus()}
                >
              {history.map((item, index) => (
                <div key={index} className="mb-2">
                  {item.command && (
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">❯</span>
                      <span className="text-gray-300">{item.command}</span>
                    </div>
                  )}
                  <pre
                    className={cn(
                      "whitespace-pre-wrap mt-1",
                      item.isError ? "text-red-400" : "text-gray-400"
                    )}
                  >
                    {item.output}
                  </pre>
                </div>
              ))}

              {/* Input line */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <span className="text-green-500">❯</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-gray-300 outline-none caret-green-500"
                  spellCheck={false}
                  autoComplete="off"
                />
              </form>
            </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Floating terminal toggle button - positioned on left side
export function TerminalToggle({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-[50]",
        "w-11 h-11 sm:w-12 sm:h-12 rounded-full",
        "bg-background-secondary border border-border",
        "flex items-center justify-center",
        "hover:border-green-500/50 hover:bg-green-500/10",
        "transition-colors cursor-pointer",
        "shadow-lg"
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title="Open Terminal (`)"
      aria-label="Open terminal"
    >
      <TerminalIcon className="h-5 w-5 text-green-500" />
    </motion.button>
  );
}
