import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import InputField from "../components/ui/InputField";
import ButtonField from "../components/ui/ButtonField";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../redux/slices/authSlice";
import { toast } from "react-toastify";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    termsAndConditions: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;

    if (name === "name") {
      // Allow spaces in name, just trim leading/trailing spaces
      newValue = newValue.replace(/[^A-Za-z\s]/g, ""); // only letters + spaces
    } else if (name === "email") {
      // Remove all spaces from email
      newValue = newValue.replace(/\s+/g, "");
    } else if (name === "phone") {
      // Numbers only, max 10 digits
      newValue = newValue.replace(/\D/g, "").slice(0, 10);
    } else if (name === "password") {
      // Allow only alphanumeric characters, max 20 characters
      newValue = newValue.replace(/[^A-Za-z0-9@#$%&₹]+$/g, "").slice(0, 20);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = "Enter a valid phone number.";
    }
    if (!formData.termsAndConditions) {
      newErrors.termsAndConditions =
        "You must agree to the Terms & Conditions.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await dispatch(register(formData));
      if (result.status === 200) {
        toast.success("Check your email to verify your account.");
      }
    } finally {
      setLoading(false);
      navigate("/");
    }
  };

  return (
    <main className="flex items-center justify-center sm:my-36 my-20 h-fit px-4 sm:px-0">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl text-gray-900 font-semibold text-start sm:text-center mb-8">
            Start with your free account today.
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <InputField
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your Name"
              label="Name"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <InputField
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              label="Email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <InputField
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              label="Password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <InputField
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              label="Phone Number"
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start">
            <input
              type="checkbox"
              name="termsAndConditions"
              id="terms"
              checked={formData.termsAndConditions}
              onChange={handleInputChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label
              htmlFor="terms"
              className="ml-2 -mt-0.5 text-sm text-gray-600"
            >
              I agree to the{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Privacy Policy
              </button>
              .
            </label>
          </div>
          {errors.termsAndConditions && (
            <p className="text-red-500 text-sm">{errors.termsAndConditions}</p>
          )}

          {/* Submit */}
          <ButtonField type="submit" submitLabel="Sign Up" loading={loading} />
        </form>
      </div>
    </main>
  );
}
