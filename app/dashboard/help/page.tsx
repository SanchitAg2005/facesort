"use client"

/**
 * Help & Support Page
 * - Explains what FaceSort is
 * - Shows developer identity (SEO + trust)
 * - Links GitHub & LinkedIn
 * - Working Formspree contact form
 */

import { Card } from "@/components/ui/card"

export default function HelpPage() {
  return (
    <div className="p-4 space-y-6 max-w-3xl">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Help & Support</h1>
        <p className="text-muted-foreground">
          Information about FaceSort, the developer, and how to get support
        </p>
      </div>

      {/* ABOUT */}
      <Card className="p-6 space-y-3">
        <h2 className="text-lg font-semibold">About FaceSort</h2>

        <p className="text-sm text-muted-foreground">
          FaceSort is an AI-powered photo sorting platform that automatically
          detects people in images and delivers matched photos privately using
          secure messaging. The system is built around a job-based processing
          pipeline to ensure scalability, accuracy, and user privacy.
        </p>

        <p className="text-sm text-muted-foreground">
          Modern face recognition models and computer vision techniques are used.
          Sensitive implementation details such as mathematical thresholds and
          internal scoring logic are intentionally not disclosed to prevent
          misuse.
        </p>
      </Card>

      {/* DEVELOPER */}
      <Card className="p-6 space-y-3">
        <h2 className="text-lg font-semibold">Developer</h2>

        <p className="text-sm text-muted-foreground">
          FaceSort is designed and developed as a real-world project combining
          AI, backend engineering, and cloud automation.
        </p>

        <div className="text-sm">
          <span className="font-medium">Name:</span>{" "}
          <a
            href="https://www.linkedin.com/in/sanchit-agarwal-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Sanchit Agarwal
          </a>
        </div>

        <div className="text-sm">
          <span className="font-medium">GitHub:</span>{" "}
          <a
            href="https://github.com/SanchitAg2005"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            https://github.com/SanchitAg2005
          </a>
        </div>
      </Card>

      {/* DOCUMENTATION */}
      <Card className="p-6 space-y-3">
        <h2 className="text-lg font-semibold">Project Documentation</h2>

        <p className="text-sm text-muted-foreground">
          The public GitHub repository explains the system architecture, workflow,
          and design decisions behind FaceSort without exposing sensitive
          internals.
        </p>

        <a
          href="https://github.com/SanchitAg2005"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline text-sm"
        >
          View FaceSort on GitHub
        </a>
      </Card>

      {/* CONTACT FORM */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Report an Issue / Send Feedback</h2>

        <p className="text-sm text-muted-foreground">
          Found a bug or have feedback? Send a message directly to the developer.
        </p>

        <form
          action="https://formspree.io/f/xojjqpyw"
          method="POST"
          className="space-y-4"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Your email"
            className="w-full rounded-md border p-2 text-sm"
          />

          <textarea
            name="message"
            required
            placeholder="Describe your issue or feedback"
            className="w-full rounded-md border p-2 text-sm min-h-[120px]"
          />

          <button
            type="submit"
            className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm hover:bg-primary/90"
          >
            Send Message
          </button>
        </form>
      </Card>

      {/* FOOTER / SEO */}
      <div className="text-xs text-muted-foreground text-center pt-4">
        Built by{" "}
        <a
          href="https://www.linkedin.com/in/sanchit-agarwal-dev"
          target="_blank"
          className="underline"
        >
          Sanchit Agarwal
        </a>{" "}
        ·{" "}
        <a
          href="https://github.com/SanchitAg2005"
          target="_blank"
          className="underline"
        >
          GitHub
        </a>
      </div>
    </div>
  )
}
