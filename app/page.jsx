"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  LinkIcon, 
  CheckCircle2, 
  Zap, 
  Shield, 
  Users,
  Star,
  TrendingUp,
  Globe,
  Sparkles
} from "lucide-react";
import TestimonialsCarousel from "@/components/testimonials";
import Link from "next/link";

const features = [
  {
    icon: Calendar,
    title: "Smart Event Creation",
    description: "Create unlimited event types with custom durations, buffers, and scheduling rules tailored to your workflow",
  },
  {
    icon: Clock,
    title: "Intelligent Availability",
    description: "Set recurring schedules, time zones, and date overrides. Our smart system prevents double-bookings automatically",
  },
  {
    icon: LinkIcon,
    title: "Branded Links",
    description: "Share beautiful, customizable booking pages that reflect your brand and professional identity",
  },
  {
    icon: Zap,
    title: "Instant Notifications",
    description: "Get real-time email and SMS confirmations for new bookings, cancellations, and schedule changes",
  },
  {
    icon: Shield,
    title: "Calendar Sync",
    description: "Two-way sync with Google Calendar, Outlook, and Apple Calendar keeps everything in perfect harmony",
  },
  {
    icon: Users,
    title: "Team Scheduling",
    description: "Round-robin assignments, collective availability, and team member coordination made effortless",
  },
];

const howItWorks = [
  { 
    step: "Sign Up", 
    description: "Create your free Schedulrr account in under 60 seconds",
    time: "30 sec"
  },
  {
    step: "Set Availability",
    description: "Define your working hours and connect your calendar",
    time: "2 min"
  },
  {
    step: "Share Your Link",
    description: "Send your custom scheduling link via email, website, or socials",
    time: "1 min"
  },
  {
    step: "Get Booked",
    description: "Sit back as appointments flow in automatically",
    time: "Done!"
  },
];

const benefits = [
  "Eliminate scheduling back-and-forth",
  "Reduce no-shows with automated reminders",
  "Save 10+ hours per week on coordination",
  "Integrate with your existing tools",
  "Professional branded booking experience",
  "Mobile-friendly for on-the-go scheduling",
];

const stats = [
  { value: "15k+", label: "Active Users", color: "text-blue-400" },
  { value: "100k+", label: "Bookings Monthly", color: "text-green-400" },
  { value: "99.9%", label: "Uptime", color: "text-purple-400" },
  { value: "4.9★", label: "User Rating", color: "text-yellow-400" },
];

const trustedBy = [
  "Google", "Microsoft", "Salesforce", "HubSpot", "Stripe", "Shopify"
];

const Home = () => {
  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700 text-sm font-semibold rounded-full shadow-sm hover:shadow-md transition-shadow">
              <Sparkles className="w-4 h-4" />
              Join 15,000+ professionals
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Scheduling Made{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-400 bg-clip-text text-transparent animate-gradient">
                Effortless
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Stop the endless email chains. Let clients book time with you instantly while you focus on what truly matters—growing your business.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white gap-2 px-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 gap-2 px-8 transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm3.5 10.5l-4 3a.5.5 0 0 1-.8-.4v-6a.5.5 0 0 1 .8-.4l4 3a.5.5 0 0 1 0 .8z"/>
                </svg>
                Watch Demo
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>No credit card needed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>5-minute setup</span>
              </div>
            </div>
          </div>

          {/* Right Image/Mockup */}
          <div className="relative animate-fade-in-up animation-delay-200">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur-3xl opacity-20 -z-10 animate-pulse-slow"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <Image
                src="/hero.jpg"
                alt="Scheduling dashboard preview"
                width={600}
                height={600}
                className="w-full h-auto rounded-lg"
              />
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold flex items-center gap-2 animate-bounce-slow">
                <CheckCircle2 className="w-4 h-4" />
                Booking Confirmed!
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold flex items-center gap-2 animate-bounce-slow animation-delay-1000">
                <TrendingUp className="w-4 h-4" />
                +127% efficiency
              </div>
            </div>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="mt-20 text-center animate-fade-in-up animation-delay-400">
          <p className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-8">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
            {trustedBy.map((company, index) => (
              <div key={index} className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group cursor-default">
                <p className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform`}>
                  {stat.value}
                </p>
                <p className="text-blue-100 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose Schedulrr?
              </h2>
              <p className="text-xl text-gray-600">
                The smartest way to manage your time
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-4 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full">
                Features
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Schedule Smarter
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Packed with powerful features designed to save you time and delight your clients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="group animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 h-full transform hover:-translate-y-2">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-purple-100 text-purple-600 text-sm font-semibold rounded-full">
                How It Works
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Up and Running in Minutes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From signup to your first booking—it's that simple
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, index) => (
                <div key={index} className="relative">
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-20 -right-8 w-16">
                      <div className="border-t-2 border-dashed border-blue-300 relative">
                        <ArrowRight className="absolute -top-2 -right-3 w-5 h-5 text-blue-500" />
                      </div>
                    </div>
                  )}
                  <div className="text-center group">
                    <div className="relative inline-block mb-6">
                      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl w-16 h-16 flex items-center justify-center mx-auto font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {step.time}
                      </div>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-3">
                      {step.step}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white gap-2 px-10 shadow-lg hover:shadow-xl transition-all"
              >
                Start Your Free Trial <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by Professionals Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it—hear from our happy users
            </p>
          </div>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[length:20px_20px]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
              <Globe className="w-4 h-4" />
              Join 15,000+ professionals worldwide
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Reclaim Your Time?
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Stop juggling calendars. Start scheduling smarter. Join thousands who've transformed how they manage appointments.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100 gap-2 px-10 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                >
                  Start Free Trial <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm gap-2 px-10 text-lg transition-all"
              >
                View Pricing
              </Button>
            </div>
            <p className="text-blue-100 text-sm">
              ✨ Free forever • No credit card required • Setup in 5 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Schedulrr. Built with ❤️ for busy professionals.
          </p>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .bg-grid-white\/10 {
          background-image: linear-gradient(white 1px, transparent 1px),
            linear-gradient(90deg, white 1px, transparent 1px);
        }
      `}</style>
    </main>
  );
};

export default Home;