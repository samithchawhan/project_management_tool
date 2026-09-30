import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f5f7fb",
      }}
    >
      {/* Left Side */}
      <div
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px",
        }}
      >
        <h1 style={{ fontSize: "52px", marginBottom: "20px" }}>
          TaskFlow
        </h1>

        <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>
          Manage projects.
          <br />
          Get things done.
        </h2>

        <p
          style={{
            fontSize: "18px",
            lineHeight: "1.7",
            maxWidth: "500px",
            opacity: 0.9,
          }}
        >
          Organize your projects, manage tasks and collaborate
          with your team — all in one simple workspace.
        </p>
      </div>

      {/* Right Side */}
      <div
        style={{
          width: "480px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "380px",
            background: "white",
            padding: "40px",
            borderRadius: "16px",
            boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: "30px",
              marginBottom: "8px",
            }}
          >
            Welcome back 👋
          </h2>

          <p
            style={{
              color: "#6b7280",
              marginBottom: "30px",
            }}
          >
            Sign in to your TaskFlow account
          </p>

          <form onSubmit={handleLogin}>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: "100%",
                padding: "13px",
                marginTop: "8px",
                marginBottom: "20px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
              }}
            />

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: "100%",
                padding: "13px",
                marginTop: "8px",
                marginBottom: "25px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                outline: "none",
              }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                background: "#4f46e5",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Sign In
            </button>
          </form>

          {message && (
            <p
              style={{
                marginTop: "15px",
                color: "#dc2626",
                textAlign: "center",
              }}
            >
              {message}
            </p>
          )}

          <p
            style={{
              marginTop: "25px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#4f46e5",
                fontWeight: "600",
              }}
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;