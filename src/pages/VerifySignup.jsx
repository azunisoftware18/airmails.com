import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifysignup } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";

export default function VerifySignup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  const dispatch = useDispatch();
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      toast.error("Invalid or missing verification token.");
      return;
    }
    dispatch(verifysignup(token));
    navigate("/login");
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="flex justify-center items-center min-h-screen text-center px-4">
      {status === "verifying" && (
        <div>
          {/* <Loader /> or simple text */}
          <p className="text-lg mt-4">Verifying your email...</p>
        </div>
      )}

      {status === "success" && (
        <div>
          <h2 className="text-green-600 text-2xl font-semibold">
            ✅ Email Verified!
          </h2>
          <p className="mt-2 text-gray-600">Redirecting to login...</p>
        </div>
      )}

      {status === "error" && (
        <div>
          <h2 className="text-red-600 text-2xl font-semibold">
            ❌ Verification Failed
          </h2>
          <p className="mt-2 text-gray-600">
            The link is invalid or has expired. Please register again.
          </p>
        </div>
      )}
    </div>
  );
}
