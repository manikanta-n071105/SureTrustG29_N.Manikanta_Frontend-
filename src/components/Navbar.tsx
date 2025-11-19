import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  console.log(isLoginPage);

  const [openPopup, setOpenPopup] = useState(false);

  return (
    <>
      <nav className="w-full h-20 bg-white border-b flex items-center justify-between px-4">
        <Link to="/">
          {/* <img src="/logo.png" alt="Logo" className="h-10" /> */}
          <h1 className="font-bold text-black">SMA</h1>
        </Link>

        {isLoginPage ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setOpenPopup(true)}
          >
            Login
          </button>
        ) : (
          <>
            <div className="flex items-center gap-5">
              <input
                type="text"
                placeholder="Search Friends..."
                className="border rounded px-3 w-45"
              />

              <Link to="/notification">🔔</Link>
              <Link to="/profile">👤</Link>
            </div>
          </>
        )}
      </nav>
      {
        openPopup && (
          <LoginPopup onClose={() => setOpenPopup(false)} />
        )
      }
    </>
  );
};

export default Navbar;

const LoginPopup = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-96 shadow-lg">
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab("login")}
            className={`w-1/2 py-2 text-center ${
              activeTab === "login"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setActiveTab("signup")}
            className={`w-1/2 py-2 text-center ${
              activeTab === "signup"
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* -------------------- LOGIN FORM -------------------- */}
        {activeTab === "login" && (
          <div>
            <input
              type="email"
              placeholder="email"
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="password"
              placeholder="password"
              className="w-full border p-2 rounded mb-3"
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded mb-3">
              Login
            </button>

            <p className="text-sm text-gray-600 text-center">
              don’t have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setActiveTab("signup")}
              >
                Register
              </span>
            </p>
<Link to="/resetpassword">
            <p className="text-sm text-blue-600 text-center mt-2 cursor-pointer"
            onClick={onClose}
            >
              FORGOT PASSWORD? CLICK HERE
            </p>
            </Link>
          </div>
        )}

        {/* -------------------- SIGNUP FORM -------------------- */}
        {activeTab === "signup" && (
          <div>
            <input
              type="text"
              placeholder="name"
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="email"
              placeholder="email"
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="password"
              placeholder="password"
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="password"
              placeholder="c-password"
              className="w-full border p-2 rounded mb-3"
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded mb-3">
              Sign Up
            </button>

            <p className="text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setActiveTab("login")}
              >
                Login
              </span>
            </p>
          </div>
        )}

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-600 underline"
        >
          Close
        </button>
      </div>
    </div>
  );
};
