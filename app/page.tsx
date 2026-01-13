/**
 * FaceSort Landing Page
 * Luxury hero section with clear value proposition
 * Mobile-first design
 */

"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export default function LandingPage() {
  const { data: session, status } = useSession()

  // Redirect authenticated users to dashboard
  if (status === "authenticated" && session) {
    redirect("/dashboard/friends")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/30">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">FaceSort</h1>
            <div className="flex gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
          {/* Main Headline */}
          <div className="space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/50">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm text-secondary">Premium photo organization</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-balance leading-tight">
              Sort Your <span className="text-primary">Photos</span> with Friends
            </h2>

            <p className="text-lg text-muted-foreground text-balance leading-relaxed max-w-2xl">
              FaceSort makes it effortless to organize and categorize your photos with friends. Upload your photos,
              select which friends to involve, and let intelligent sorting do the work.
            </p>
          </div>

          {/* Value Propositions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {[
              {
                title: "Smart Sorting",
                description: "Advanced algorithms understand your photos and organize them intelligently",
              },
              {
                title: "Easy Sharing",
                description: "Collaborate seamlessly with friends and share sorted results instantly",
              },
              {
                title: "Privacy First",
                description: "Your data is secure and encrypted. We respect your privacy.",
              },
              {
                title: "Mobile Optimized",
                description: "Beautiful experience on any device, optimized for smartphones",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-card border border-border/50 hover:border-border transition-colors"
              >
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 h-auto"
                size="lg"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full border-border hover:bg-muted py-6 h-auto font-semibold bg-transparent"
                size="lg"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Feature Showcase */}
          <div className="space-y-8 pt-8 border-t border-border/30">
            <h3 className="text-2xl font-semibold text-foreground">How It Works</h3>

            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Add Friends",
                  description:
                    "Create a list of friends with their photos. Connect via Telegram for easy notifications.",
                },
                {
                  step: "2",
                  title: "Upload Photos",
                  description: "Upload a batch of photos you want to sort and organize.",
                },
                {
                  step: "3",
                  title: "Select & Sort",
                  description: "Choose which friends should help organize, then start the intelligent sorting process.",
                },
                {
                  step: "4",
                  title: "Share Results",
                  description: "View organized results and share them instantly with your selected friends.",
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/20 border border-primary/50">
                      <span className="text-sm font-semibold text-primary">{item.step}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">FaceSort © 2026. Crafted for privacy and elegance.</p>
        </div>
      </footer>
    </div>
  )
}
