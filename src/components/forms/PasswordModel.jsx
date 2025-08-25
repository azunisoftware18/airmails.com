import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

function PasswordModel({ onSubmit }) {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState([]);

  const handleInputChange = (field, value) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = passwords;
    const errors = [];

    if (!currentPassword) errors.push("Current password is required");
    if (!newPassword || newPassword.length < 8)
      errors.push("Password must be at least 8 characters long");
    if (newPassword && !/(?=.*[a-z])/.test(newPassword))
      errors.push("Password must contain at least one lowercase letter");
    if (newPassword && !/(?=.*[A-Z])/.test(newPassword))
      errors.push("Password must contain at least one uppercase letter");
    if (newPassword && !/(?=.*\d)/.test(newPassword))
      errors.push("Password must contain at least one number");
    if (newPassword && !/(?=.*[@$!%*?&])/.test(newPassword))
      errors.push("Password must contain at least one special character");
    if (newPassword && confirmPassword && newPassword !== confirmPassword)
      errors.push("Passwords do not match");

    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "bg-gray-200" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    const map = {
      0: { label: "Very Weak", color: "bg-red-500" },
      1: { label: "Weak", color: "bg-red-400" },
      2: { label: "Fair", color: "bg-yellow-400" },
      3: { label: "Good", color: "bg-blue-400" },
      4: { label: "Strong", color: "bg-green-400" },
      5: { label: "Very Strong", color: "bg-green-500" },
    };
    return { strength: score, ...map[score] };
  };

  const passwordStrength = getPasswordStrength(passwords.newPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatePassword()) onSubmit(passwords);
  };

  const baseInput =
    "w-full rounded-2xl border-2 bg-white/70 px-4 py-3 pr-12 outline-none transition-all duration-200";
  const focusOk =
    "border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20";
  const focusErr =
    "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20";

  const hasErr = (field) =>
    passwordErrors.length > 0 &&
    ((field === "current" && !passwords.currentPassword) ||
      (field === "new" &&
        (!passwords.newPassword || passwordStrength.strength < 2)) ||
      (field === "confirm" &&
        passwords.newPassword !== passwords.confirmPassword));

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto space-y-6">
      {/* Card wrapper (glass) */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-6 sm:p-8">
        <div className="mb-2">
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Update Password
          </h3>
          <p className="text-sm text-gray-600">
            Choose a strong, unique password for your account.
          </p>
        </div>

        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              value={passwords.currentPassword}
              onChange={(e) =>
                handleInputChange("currentPassword", e.target.value)
              }
              className={`${baseInput} ${
                hasErr("current") ? focusErr : focusOk
              }`}
              placeholder="Enter current password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Toggle current password visibility"
            >
              {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              value={passwords.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              className={`${baseInput} ${hasErr("new") ? focusErr : focusOk}`}
              placeholder="Enter new password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Toggle new password visibility"
            >
              {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Strength meter */}
          {passwords.newPassword && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{
                      width: `${(passwordStrength.strength / 5) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  {passwordStrength.label}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Use 8+ chars with a mix of uppercase, lowercase, number, and
                symbol.
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              value={passwords.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className={`${baseInput} ${
                hasErr("confirm") ? focusErr : focusOk
              }`}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Toggle confirm password visibility"
            >
              {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Errors */}
        {passwordErrors.length > 0 && (
          <div className="mt-2 p-4 rounded-2xl bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={20}
                className="text-red-600 mt-0.5 flex-shrink-0"
              />
              <div>
                <h4 className="text-red-800 font-semibold mb-2">
                  Please fix the following issues:
                </h4>
                <ul className="text-red-700 text-sm space-y-1">
                  {passwordErrors.map((err, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="group relative w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 transition shadow-lg hover:shadow-2xl"
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 blur opacity-40 group-hover:opacity-60 transition-opacity" />
            <span className="relative">Update Password</span>
          </button>
        </div>
      </div>
    </form>
  );
}

export default PasswordModel;
