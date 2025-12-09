import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/utils/validators";

// In-memory storage for demo (in production, use database)
const submissions: Array<{
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: Date;
}> = [];

// Simple rate limiting (in production, use a proper rate limiter)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (record.count >= RATE_LIMIT) {
    return true;
  }

  record.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    // Create submission (in production, save to database)
    const submission = {
      id: crypto.randomUUID(),
      name,
      email,
      subject,
      message,
      read: false,
      createdAt: new Date(),
    };

    submissions.push(submission);

    // In production, you would:
    // 1. Save to database using Prisma
    // 2. Send email notification using Resend/SendGrid
    // 3. Maybe send Slack/Discord notification

    console.log("New contact submission:", submission);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message! I'll get back to you soon."
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to process your message. Please try again." },
      { status: 500 }
    );
  }
}
