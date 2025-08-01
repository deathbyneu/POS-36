import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
interface LoginPageProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginPage({ setIsLoggedIn }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "https://fe-api-training.ssit.company/api/auth/login",
        {
          email: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = response.data;
      const { accessToken, refreshToken } = responseData.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("login_timestamp", Date.now().toString());
      setIsLoggedIn(true);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-row overflow-hidden">
      <div className="h-screen relative w-full flex-[60%] bg-black">
        <div className="w-full h-full absolute top-0 bg-black/70">
          <blockquote className=" h-full w-full flex justify-end flex-col text-white text-9xl p-8 pb-20"> "36 aura vl" <p className="text-amber-500 text-5xl">-may con ga biet gi</p></blockquote>
        </div>
        <img
          src="https://pendecor.vn/uploads/files/2022/04/18/thiet-ke-cua-hang-tien-loi-1.jpg"
          alt="anh dep moi ngay"
          className="w-full h-full object-fill"
        />
      </div>
      <div className="h-screen flex-[40%] flex flex-col justify-center items-center bg-[#1a1a1a]">
        <form
          onSubmit={handleLogin}
          className="bg-[#1a1a1a] text-white p-6 rounded-lg shadwow-md w-full  "
        >
          <h2 className="text-2xl text-white font-bold mb-4 text-center pb-20">
            Login to POS giet nguoi
          </h2>
          <div className="flex flex-col items-center ">
            <input
              type="text"
              placeholder="Username"
              className="text-[] bg-[#1f1f1f] w-[85%] p-3 mb-4"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Password"
              className="bg-[#1f1f1f] w-[85%] p-3 mb-6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-500 mb-2 pl-14">{error}</div>}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-amber-500 text-white w-[85%] p-2 rounded hover:bg-amber-600 "
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
