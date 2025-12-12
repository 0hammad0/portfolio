import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { MessagesInbox } from "@/components/admin/messages/MessagesInbox";

async function getMessages() {
  const messages = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return messages;
}

function MessagesSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-background-secondary rounded-lg mb-4" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 bg-background-secondary rounded-lg mb-2" />
      ))}
    </div>
  );
}

async function MessagesContent() {
  const messages = await getMessages();

  return <MessagesInbox messages={messages} />;
}

export default function AdminMessagesPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-foreground-muted mt-1">
          Manage contact form submissions
        </p>
      </div>

      {/* Content */}
      <Suspense fallback={<MessagesSkeleton />}>
        <MessagesContent />
      </Suspense>
    </div>
  );
}
