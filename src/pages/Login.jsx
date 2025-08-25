import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import InputField from "../components/ui/InputField";
import ButtonField from "../components/ui/ButtonField";
import { login } from "../redux/slices/authSlice";

export default function Login() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "emailOrPhone") {
      newValue = newValue.replace(/\s+/g, "");
    } else if (name === "password") {
      newValue = newValue.replace(/[^A-Za-z0-9@#$%&₹]+$/g, "").slice(0, 20);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.emailOrPhone.trim())
      newErrors.emailOrPhone = "Email or phone is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const resultAction = await dispatch(login(formData));
      const user = resultAction.data;

      switch (user.role.toUpperCase()) {
        case "SUPER_ADMIN":
          navigate("/superadmin/dashboard");
          break;
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "USER":
          navigate("/u/inbox");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center sm:my-56 my-20 h-fit px-4 sm:px-0">
      <div className="max-w-md w-full -py-32">
        <div className="bg-white rounded-2xl p-10 space-y-6">
          {/* Logo & Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 text-sm">
              Sign in to your Airmails account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleInputChange}
              placeholder="Email or mobile number"
              autoComplete="username"
              error={errors.emailOrPhone}
            />
            <InputField
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              autoComplete="current-password"
              error={errors.password}
            />
            <ButtonField
              type="submit"
              submitLabel="Login"
              loading={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            />
          </form>

          {/* Sign up link */}
          <div className="text-center text-gray-600 text-sm pt-4">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign up now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
