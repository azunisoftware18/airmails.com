import { useState } from "react";
import { useDispatch } from "react-redux";
import { submitTestimonial } from "../../redux/slices/homeSlice";
import { X } from "lucide-react";

export default function TestimonialForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    company: "",
    review: "",
    rating: 5,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitTestimonial(formData));
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto bg-white p-6 rounded-xl shadow-md space-y-4 absolute w-full max-w-lg"
    >
      <h2 className="text-xl font-bold">Submit Your Testimonial</h2>

      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
        aria-label="Close"
      >
        <X className="w-5 h-5 text-gray-700" />
      </button>

      {/* Rating */}
      <div>
        <label className="block font-medium">Rating</label>
        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Stars
            </option>
          ))}
        </select>
      </div>

      {/* Review */}
      <div>
        <label className="block font-medium">Review</label>
        <textarea
          name="review"
          value={formData.review}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          rows={3}
          placeholder="Write your feedback..."
          required
        />
      </div>

      {/* Name */}
      <div>
        <label className="block font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Your full name"
          required
        />
      </div>

      {/* Designation */}
      <div>
        <label className="block font-medium">Designation</label>
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="CEO, Manager, etc."
          required
        />
      </div>

      {/* Company */}
      <div>
        <label className="block font-medium">Company</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Your company name"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
      >
        Submit Testimonial
      </button>
    </form>
  );
}
