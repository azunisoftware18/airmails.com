import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCountUsers } from "../redux/slices/authSlice";
import { Link } from "react-router-dom";

export default function AboutPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCountUsers());
  }, [dispatch]);

  const deliveredCount = useSelector((state) => state.auth?.user?.data) ?? 0;
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 my-16">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">About Us</h1>
        <p className="mt-3 text-gray-600">
          We provide businesses with secure email and communication tools —
          fast, reliable, and fully compliant.
        </p>
      </section>

      {/* Mission + Values */}
      <section className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 bg-white rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
          <p className="text-gray-600">
            To make communication simple and secure — so you can stay focused on
            growing your business.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-2">Our Values</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Reliability first</li>
            <li>Customer-centric support</li>
            <li>Privacy & security by design</li>
            <li>Continuous improvement</li>
          </ul>
        </div>
      </section>

      {/* Stats */}
      <section className="grid sm:grid-cols-3 gap-4 mb-12">
        {[
          { k: "99.9% Uptime" },
          { k: "24/7 Support", v: "Human assistance" },
          { k: deliveredCount, v: "Growing fast" },
        ].map((s) => (
          <div
            key={s.k}
            className="p-5 bg-white rounded-2xl shadow text-center"
          >
            <div className="text-2xl font-bold">{s.k}</div>
            <div className="text-gray-600">{s.v}</div>
          </div>
        ))}
      </section>

      {/* Why choose us */}
      <section className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 bg-white rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-2">Why Choose Us</h3>
          <ul className="space-y-2 text-gray-700">
            <li>⚡ Fast, scalable infrastructure</li>
            <li>🔒 End-to-end security features</li>
            <li>🧩 Easy integration (REST/Webhooks)</li>
            <li>📈 Actionable analytics</li>
          </ul>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-2">Our Story</h3>
          <p className="text-gray-600">
            Founded in 2023, today we serve both SMBs and enterprises —
            constantly improving our product with user feedback.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Link
          to="/contact"
          className="inline-block px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
        >
          Get in touch
        </Link>
      </section>
    </div>
  );
}
