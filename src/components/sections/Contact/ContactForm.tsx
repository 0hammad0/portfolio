"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { contactFormSchema, type ContactFormInput } from "@/lib/utils/validators";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { useSound } from "@/providers/SoundProvider";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const { playSound } = useSound();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
  });

  const messageValue = watch("message", "");

  const onSubmit = async (data: ContactFormInput) => {
    setStatus("submitting");
    setServerMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      setStatus("success");
      setServerMessage(result.message);
      reset();
      playSound("success");

      // Reset to idle after showing success message
      setTimeout(() => {
        setStatus("idle");
        setServerMessage("");
      }, 5000);
    } catch (error) {
      setStatus("error");
      setServerMessage(
        error instanceof Error ? error.message : "Failed to send message"
      );
      playSound("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <Input
          label="Name"
          placeholder="Your name"
          error={errors.name?.message}
          {...register("name")}
          disabled={status === "submitting"}
        />
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          {...register("email")}
          disabled={status === "submitting"}
        />
      </div>

      <Input
        label="Subject (Optional)"
        placeholder="What's this about?"
        error={errors.subject?.message}
        {...register("subject")}
        disabled={status === "submitting"}
      />

      <Textarea
        label="Message"
        placeholder="Tell me about your project..."
        error={errors.message?.message}
        showCount
        maxLength={5000}
        currentValue={messageValue}
        {...register("message")}
        disabled={status === "submitting"}
        className="min-h-[150px]"
      />

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {(status === "success" || status === "error") && serverMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-2 p-4 rounded-lg ${
              status === "success"
                ? "bg-success/10 text-success"
                : "bg-error/10 text-error"
            }`}
          >
            {status === "success" ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <span>{serverMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto"
        isLoading={status === "submitting"}
        leftIcon={<Send className="h-5 w-5" />}
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
