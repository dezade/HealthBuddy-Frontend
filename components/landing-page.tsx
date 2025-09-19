"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Brain, Activity, Users, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { LandingTopbar } from "@/components/landing/landing-topbar"

export function LandingPage() {
  const features = [
    {
      icon: Heart,
      title: "Personalized Health Plans",
      description: "AI-generated meal plans, exercise routines, and wellness activities tailored to your unique needs.",
    },
    {
      icon: Brain,
      title: "Mental Wellness Companion",
      description: "Empathetic AI support for stress relief, mood tracking, and positive reinforcement.",
    },
    {
      icon: Activity,
      title: "Smart Symptom Checker",
      description: "Get initial insights on symptoms and recommendations for when to seek professional care.",
    },
    {
      icon: Users,
      title: "Healthcare Professional Integration",
      description: "Share progress reports with your healthcare providers for better coordinated care.",
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "HIPAA-compliant data protection with full control over your health information.",
    },
    {
      icon: Zap,
      title: "Real-time Tracking",
      description: "Monitor calories, exercise, weight, and mental state with intelligent progress insights.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar Navigation */}
      <LandingTopbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50/50 via-background to-blue-50/50 dark:from-emerald-950/10 dark:via-background dark:to-blue-950/10">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Your AI-Powered Health Companion
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Personalized healthcare guidance, meal planning, exercise routines, and mental wellness support - all
              powered by advanced AI technology.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 bg-transparent border-2 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 dark:hover:from-emerald-950/20 dark:hover:to-blue-950/20 transition-all duration-300"
              >
                <Link href="/signin">Sign In</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Everything You Need for Better Health</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              HealthBuddy combines cutting-edge AI with evidence-based healthcare to provide comprehensive support for
              your wellness journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 text-balance">
              Start Your Health Journey Today
            </h2>
            <p className="text-xl text-white/90 mb-8 text-pretty">
              Join thousands of users who are already improving their health with HealthBuddy's AI-powered guidance.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link href="/signup">Create Your Free Account</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
