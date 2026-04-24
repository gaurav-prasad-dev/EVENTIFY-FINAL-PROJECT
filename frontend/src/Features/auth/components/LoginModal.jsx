import { useState, useEffect, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { sendOtpApi, verifyOtpApi,googleLoginApi } from "../authApi";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setCredentials } from "../authSlice";


function LoginModal({ isOpen, onClose }) {

  const dispatch = useDispatch();
  
  const [mode, setMode] = useState("email");
  const [step, setStep] = useState("input");
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  

  // 🔥 Timer logic
  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  if (!isOpen) return null;
  // 🔥 Send OTP
  const handleSendOtp = async () => {
    try {
      setLoading(true);

      const data =
        mode === "email"
          ? { email: value }
          : { phone: value };

      await sendOtpApi(data);

      setStep("otp");
      setTimer(30);
    } catch (err) {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Handle OTP input
  const handleOtpChange = (e, index) => {
    const val = e.target.value;

    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // move forward
    if (val && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // 🔥 Backspace support
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // 🔥 Verify OTP
  const handleVerifyOtp = async () => {
    try {
      setLoading(true);

      const finalOtp = otp.join("");

      const data =
        mode === "email"
          ? { email: value, otp: finalOtp }
          : { phone: value, otp: finalOtp };

      const res = await verifyOtpApi(data);

    dispatch(
      setCredentials({
        user: res.user,
        token: res.token,
      })
    );

      onClose(); // ✅ NO RELOAD
    } catch (err) {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Resend OTP
  const handleResend = async () => {
    if (timer > 0) return;

    await handleSendOtp();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white w-[380px] rounded-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-5 text-center">
          {step === "input" ? "Sign In / Create Account" : "Enter OTP"}
        </h2>

        {/* STEP 1 */}
        {step === "input" && (
          <>
            {/* Toggle */}
            <div className="flex bg-gray-100 rounded-full p-1 mb-5">
              <button
                onClick={() => setMode("email")}
                className={`flex-1 py-2 rounded-full ${
                  mode === "email"
                    ? "bg-white shadow text-purple-700"
                    : "text-gray-500"
                }`}
              >
                Email
              </button>

              <button
                onClick={() => setMode("phone")}
                className={`flex-1 py-2 rounded-full ${
                  mode === "phone"
                    ? "bg-white shadow text-purple-700"
                    : "text-gray-500"
                }`}
              >
                Phone
              </button>
            </div>

            <input
              type="text"
              placeholder={
                mode === "email"
                  ? "Enter your email"
                  : "Enter phone number"
              }
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg mb-4"
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded-lg mb-4"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-[1px] bg-gray-300"></div>
              <p className="text-sm text-gray-400">OR</p>
              <div className="flex-1 h-[1px] bg-gray-300"></div>
            </div>

            <GoogleLogin onSuccess={async (credentialsResponse) => {
                try{

                   if (!credentialsResponse?.credential) {
  alert("No credential received");
  return;
}

const token = credentialsResponse.credential;
                    const res = await googleLoginApi({ token });

      dispatch(
        setCredentials({
          user: res.user,
          token: res.token,
        })
      )
      onClose();

                }catch(error){

                      console.log(error);
      alert("Google login failed");

                }
            }}

             onError={() => {
    console.log("Google Login Failed");
  }}
            />

           

          </>
        )}

        {/* STEP 2 OTP */}
        {step === "otp" && (
          <>
            <p className="text-center text-sm text-gray-500 mb-4">
              OTP sent to {value}
            </p>

            {/* OTP Boxes */}
            <div className="flex justify-between mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-10 h-10 border text-center rounded-lg text-lg"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded-lg mb-3"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Resend */}
            <p className="text-center text-sm text-gray-500">
              {timer > 0 ? (
                `Resend OTP in ${timer}s`
              ) : (
                <span
                  onClick={handleResend}
                  className="text-purple-600 cursor-pointer"
                >
                  Resend OTP
                </span>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginModal;