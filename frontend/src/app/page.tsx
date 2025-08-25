"use client";

import Link from "next/link";
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
  Zap,
  Globe,
  BarChart3,
  CreditCard,
  Building2,
  DollarSign,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Navigation */}
      <nav className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-inverse font-bold text-lg">S</span>
                </div>
                <span className="ml-2 text-xl font-bold text-primary-text">
                  SiLab
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="#features"
                  className="text-secondary-text hover:text-primary-text px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Features
                </a>
                <a
                  href="#products"
                  className="text-secondary-text hover:text-primary-text px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Products
                </a>
                <a
                  href="#about"
                  className="text-secondary-text hover:text-primary-text px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  About
                </a>
                <Link
                  href="/products"
                  className="bg-primary hover:bg-primary-hover text-inverse px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-primary-bg to-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-text mb-6">
              Financial Products
              <span className="text-primary"> Reimagined</span>
            </h1>
            <p className="text-xl text-secondary-text mb-8 max-w-3xl mx-auto">
              SiLab revolutionizes financial product management with intelligent
              compliance tracking, advanced analytics, and seamless integration
              for modern financial institutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-3 bg-primary hover:bg-primary-hover text-inverse font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                Explore Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center px-8 py-3 border border-neutral-300 text-secondary-text hover:bg-neutral-50 font-semibold rounded-xl transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-text mb-4">
              Why Choose SiLab?
            </h2>
            <p className="text-lg text-secondary-text max-w-2xl mx-auto">
              Built for modern financial institutions that demand excellence,
              compliance, and innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary-text mb-4">
                Compliance First
              </h3>
              <p className="text-secondary-text">
                Real-time compliance monitoring with automated violation
                detection and regulatory reporting across all product lines.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary-text mb-4">
                Advanced Analytics
              </h3>
              <p className="text-secondary-text">
                Deep insights into product performance, customer segments, and
                market trends with predictive analytics and custom dashboards.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary-text mb-4">
                Rapid Deployment
              </h3>
              <p className="text-secondary-text">
                Launch new financial products faster with pre-built templates,
                automated workflows, and seamless integration capabilities.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary-text mb-4">
                Customer-Centric
              </h3>
              <p className="text-secondary-text">
                Persona-based product targeting with advanced segmentation and
                personalized financial solutions for diverse customer needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary-text mb-4">
                Global Scale
              </h3>
              <p className="text-secondary-text">
                Multi-channel distribution across branches, agents, mobile apps,
                and digital platforms with unified management and reporting.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary-text mb-4">
                Growth Focused
              </h3>
              <p className="text-secondary-text">
                Data-driven optimization with A/B testing, performance metrics,
                and continuous improvement for maximum product success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-text mb-4">
              Comprehensive Product Suite
            </h2>
            <p className="text-lg text-secondary-text max-w-2xl mx-auto">
              From credit cards to microfinance, manage your entire financial
              product portfolio in one unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-bg-primary rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-light rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-blue" />
              </div>
              <h3 className="text-lg font-semibold text-primary-text mb-2">
                Credit Cards
              </h3>
              <p className="text-secondary-text text-sm">
                Premium travel cards, student cashback, and family rewards with
                comprehensive risk management.
              </p>
            </div>

            <div className="bg-bg-primary rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-light rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-green" />
              </div>
              <h3 className="text-lg font-semibold text-primary-text mb-2">
                Personal Loans
              </h3>
              <p className="text-secondary-text text-sm">
                Education, home improvement, and debt consolidation loans with
                flexible terms and competitive rates.
              </p>
            </div>

            <div className="bg-bg-primary rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-light rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple" />
              </div>
              <h3 className="text-lg font-semibold text-primary-text mb-2">
                Microfinance
              </h3>
              <p className="text-secondary-text text-sm">
                Women entrepreneurs, agricultural, and urban microenterprise
                loans with community impact focus.
              </p>
            </div>

            <div className="bg-bg-primary rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-primary-text mb-2">
                Savings Accounts
              </h3>
              <p className="text-secondary-text text-sm">
                Youth starter, premium wealth, and family goal savings with
                competitive interest rates and features.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-hover text-inverse font-semibold rounded-lg transition-colors"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">12+</div>
              <div className="text-secondary-text">Financial Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-secondary-text">Compliance Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-secondary-text">Real-time Monitoring</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-secondary-text">Distribution Channels</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-hover">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-inverse mb-4">
            Ready to Transform Your Financial Products?
          </h2>
          <p className="text-xl text-primary-light mb-8 max-w-2xl mx-auto">
            Join leading financial institutions using SiLab to innovate, comply,
            and grow their product portfolios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-3 bg-bg-primary text-primary hover:bg-primary-light font-semibold rounded-lg transition-colors shadow-lg"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a
              href="#about"
              className="inline-flex items-center px-8 py-3 border border-primary-light text-inverse hover:bg-primary font-semibold rounded-lg transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-inverse py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-inverse font-bold text-lg">S</span>
                </div>
                <span className="ml-2 text-xl font-bold">SiLab</span>
              </div>
              <p className="text-neutral-400">
                Revolutionizing financial product management with intelligent
                compliance and advanced analytics.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <a href="#" className="hover:text-inverse transition-colors">
                    Credit Cards
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-inverse transition-colors">
                    Personal Loans
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-inverse transition-colors">
                    Microfinance
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-inverse transition-colors">
                    Savings Accounts
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <a href="#" className="hover:text-inverse transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-inverse transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-inverse transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-inverse transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <a href="#" className="hover:text-inverse transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-inverse transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-inverse transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-inverse transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 SiLab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
