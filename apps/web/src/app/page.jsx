import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Lock,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Star,
} from "lucide-react";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      const scrollTop = window.pageYOffset;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
          const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
          if (activeLink) {
            document
              .querySelectorAll(".nav-link")
              .forEach((link) => link.classList.remove("text-blue-600"));
            activeLink.classList.add("text-blue-600");
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                TrustBase
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#problem"
                className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Problem
              </a>
              <a
                href="#about"
                className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                About TrustBase
              </a>
              <a
                href="#testimonials"
                className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Testimonials
              </a>
              <motion.a
                href="/account/signin"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
              >
                Get Started
              </motion.a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
            >
              <div className="py-4 space-y-4">
                <a
                  href="#problem"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                >
                  Problem
                </a>
                <a
                  href="#about"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                >
                  About TrustBase
                </a>
                <a
                  href="#testimonials"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                >
                  Testimonials
                </a>
                <div className="px-4">
                  <a
                    href="/account/signin"
                    className="block w-full text-center px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Take Control of Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Data Privacy
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Understand how organizations use your personal data. Monitor
              permissions, track access, and make informed decisions about your
              digital footprint.
            </p>
            <motion.a
              href="/account/signin"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-xl"
            >
              <span>Start Your Privacy Journey</span>
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <img
                src="https://res.cloudinary.com/denaqakxw/image/upload/v1762724911/landing_page_qna4fu.png"
                alt="Team of Nigerian professionals working on data privacy solutions"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section
        id="problem"
        className="py-20 px-4 md:px-6 lg:px-8 bg-white dark:bg-gray-900"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              The Data Privacy Crisis in Nigeria
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Every day, your personal information is collected, shared, and
              used without your clear understanding or consent.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8 text-red-500" />,
                title: "200M+ Data Points Collected Daily",
                description:
                  "Nigerian organizations collect millions of personal data points without clear transparency about usage.",
              },
              {
                icon: <Lock className="w-8 h-8 text-orange-500" />,
                title: "Limited Visibility",
                description:
                  "Citizens have no clear way to see which organizations have access to their personal information.",
              },
              {
                icon: <Shield className="w-8 h-8 text-blue-500" />,
                title: "Weak Data Protection",
                description:
                  "Many organizations lack proper data protection measures, putting your privacy at risk.",
              },
            ].map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-center mb-4">{problem.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {problem.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {problem.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About TrustBase Section */}
      <section
        id="about"
        className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                About TrustBase
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                TrustBase is Nigeria's first comprehensive data transparency
                platform. We empower citizens to understand, monitor, and
                control how their personal information is used by organizations.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: <CheckCircle className="w-6 h-6 text-green-500" />,
                    title: "Real-time Monitoring",
                    description:
                      "Track which organizations have access to your data in real-time",
                  },
                  {
                    icon: <CheckCircle className="w-6 h-6 text-green-500" />,
                    title: "AI-Powered Insights",
                    description:
                      "Get personalized recommendations from our TrustBase GPT assistant",
                  },
                  {
                    icon: <CheckCircle className="w-6 h-6 text-green-500" />,
                    title: "Complete Control",
                    description:
                      "Grant or revoke data access permissions with a simple toggle",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    {feature.icon}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://res.cloudinary.com/denaqakxw/image/upload/v1762725499/l2_jnunjp.png"
                  alt="Nigerian professionals discussing data privacy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-12 h-12 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 px-4 md:px-6 lg:px-8 bg-white dark:bg-gray-900"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Trusted by Nigerians
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how TrustBase has helped thousands of Nigerians take control
              of their data privacy.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Adunni Okafor",
                role: "Small Business Owner, Lagos",
                image:
                  "https://res.cloudinary.com/denaqakxw/image/upload/v1762725635/adunni_p623rg.png",
                quote:
                  "TrustBase opened my eyes to how many organizations had access to my personal data. Now I feel in control of my digital privacy.",
              },
              {
                name: "Chukwu Emmanuel",
                role: "Tech Professional, Abuja",
                image:
                  "https://res.cloudinary.com/denaqakxw/image/upload/v1762726143/tech_bro_uvyitj.png",
                quote:
                  "The AI assistant helped me understand complex privacy policies in simple terms. It's like having a personal data protection advisor.",
              },
              {
                name: "Fatima Abdullahi",
                role: "University Student, Kano",
                image:
                  "https://res.cloudinary.com/denaqakxw/image/upload/v1762726143/fatima_loeh91.png",
                quote:
                  "I can finally see which apps and services are using my data and for what purpose. TrustBase gives me peace of mind.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Take Control?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of Nigerians who have already secured their data
              privacy with TrustBase.
            </p>
            <motion.a
              href="/account/signin"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-xl"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">TrustBase</span>
            </div>
            <p className="text-gray-400">
              © 2025 TrustBase. Empowering Nigerian data privacy. Built by Dave.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


