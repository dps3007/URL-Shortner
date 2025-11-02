import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  // Add firstName and lastName fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // send all required fields to backend
      await axiosInstance.post("/user/signup", {
        firstName,
        lastName,
        email,
        password,
      });

      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-6 rounded w-96 flex flex-col gap-3"
      >
        <h2 className="text-2xl font-semibold mb-3">Sign Up</h2>

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />

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

        <button
          type="submit"
          className="bg-sky-600 text-white rounded py-2 hover:bg-sky-700 transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-gray-500 mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
