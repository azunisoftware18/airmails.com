import { useState } from "react";
import { submitContact } from "../redux/slices/homeSlice";
import { useDispatch, useSelector } from "react-redux";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const dispatch = useDispatch();

  let res = useSelector((state) => state.home);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    setLoading(true);
    try {
      dispatch(submitContact(form));

      if (!res.success) throw new Error("Failed");
      setStatus({
        type: "success",
        msg: "Thanks! We’ll get back to you soon.",
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setStatus({
        type: "error",
        msg: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 my-16">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Queries ya demo chahiye? Form submit karo — hum jaldi reply karenge.
      </p>

      {status.msg && (
        <div
          className={`mb-6 rounded-lg p-3 text-sm ${
            status.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {status.msg}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-2xl shadow"
      >
        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input
            required
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-200 bg-white p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your name"
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            required
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-200 bg-white p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-200 bg-white p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+91 xxxxxxxxx"
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1">Subject *</label>
          <input
            required
            name="subject"
            value={form.subject}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-200 bg-white p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="I want a demo"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Message *</label>
          <textarea
            required
            name="message"
            rows={5}
            value={form.message}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-200 bg-white p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your message…"
          />
        </div>

        <div className="md:col-span-2">
          <button
            disabled={loading}
            type="submit"
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
}
