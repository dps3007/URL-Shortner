import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { saveToken } from "../utils/auth";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/user/login", { email, password });
      saveToken(res.data.token);
      toast.success("Login successful");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-6 rounded w-96 flex flex-col gap-3"
      >
        <h2 className="text-2xl font-semibold mb-3">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <button className="bg-sky-600 text-white rounded py-2">Login</button>
        <p className="text-sm text-gray-500 mt-2">
          Don’t have an account? <Link to="/signup" className="text-sky-600">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;