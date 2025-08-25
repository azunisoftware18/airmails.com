import React, { useEffect } from "react";
import {
  Mail,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Check,
  Star,
  Globe,
  Clock,
  Award,
  Plus,
  X,
} from "lucide-react";
import { PricingSection } from "../PricingSection";
import { useDispatch, useSelector } from "react-redux";
import { getAllCountUsers } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import TestimonialForm from "../../components/forms/TestimonialForm";
import { allTestimonials } from "../../redux/slices/homeSlice";

const LandingPage = () => {
  const [isShowTestimonial, setIsShowTestimonial] = React.useState(false);
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Enterprise Security",
      description:
        "Bank-level encryption and advanced threat protection to keep your communications secure and private.",
    },
    {
      icon: <Zap className="w-8 h-8 text-green-600" />,
      title: "Lightning Fast",
      description:
        "Instant email delivery with 99.9% uptime guarantee powered by our global infrastructure.",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Team Collaboration",
      description:
        "Seamless team features with shared inboxes, real-time collaboration, and smart organization.",
    },
    {
      icon: <Globe className="w-8 h-8 text-orange-600" />,
      title: "Global Reach",
      description:
        "Connect with anyone, anywhere. Support for 50+ languages and international domains.",
    },
    {
      icon: <Clock className="w-8 h-8 text-red-600" />,
      title: "Smart Scheduling",
      description:
        "AI-powered email scheduling and automated follow-ups to maximize your productivity.",
    },
    {
      icon: <Award className="w-8 h-8 text-indigo-600" />,
      title: "Premium Support",
      description:
        "24/7 expert support with dedicated account managers for enterprise customers.",
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allTestimonials());
  }, [dispatch]);

  const { data: testimonials } = useSelector((state) => state.home) || [];

  const transformedTestimonials = testimonials?.map((t) => ({
    rating: t.rating,
    content: t.review,
    name: t.name,
    role: t.designation,
    avatar: t.name?.charAt(0)?.toUpperCase(),
  }));

  useEffect(() => {
    dispatch(getAllCountUsers());
  }, [dispatch]);

  const deliveredCount = useSelector((state) => state.auth?.user?.data) ?? 0;

  const stats = [
    { number: deliveredCount, label: "Emails Delivered" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "24/7", label: "Expert Support" },
  ];

  const navigate = useNavigate();

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-8">
            <Zap className="w-4 h-4 mr-2" />
            Now with AI-powered smart sorting
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight">
            Professional Email
            <br />
            <span className="text-blue-600">Made Simple</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your email experience with our secure, fast, and
            intelligent platform designed for modern professionals and teams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={() => navigate("/login")}
              className="group bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 flex items-center shadow-lg"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
              Watch Demo
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-600">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-600 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-600 mr-2" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-600 mr-2" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <PricingSection />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Why Choose Airmails?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for the modern world with features that adapt to your
              workflow and scale with your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers say about their Airmails experience
            </p>
          </div>

          <div>
            <div
              className="group w-fit relative cursor-pointer"
              onClick={() => setIsShowTestimonial(true)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") setIsShowTestimonial(true);
              }}
            >
              <Plus className="w-8 h-8 text-blue-600 mb-4 hover:text-blue-800" />
              <span className="hidden group-hover:block absolute bg-white text-sm px-2 py-1 rounded shadow">
                Add Testimonial
              </span>
            </div>
            {isShowTestimonial && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                {/* Form content */}
                <TestimonialForm onClose={() => setIsShowTestimonial(false)} />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {transformedTestimonials?.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">
                    {testimonial.content}
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Email Experience?
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Join thousands of satisfied customers who've made the switch to
            Airmails. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-300">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
