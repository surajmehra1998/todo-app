import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { auth } from "@/firebase/firebase";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/firebase/auth";
import Loader from "@/components/Loader";
const initialData = { email: "", password: "" };

const LoginForm = () => {
  const [user, setUser] = useState(initialData);
  const { authUser, isLoading } = useAuth();
  console.log(authUser, isLoading);
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!user.email || !user.email) return;
    try {
      const loginUser = await signInWithEmailAndPassword(auth, user.email, user.password);
      console.log(loginUser);
    } catch (err) {
      console.error(err);
    }
  };
  // if we logged in then we go to the home page
  useEffect(() => {
    if (!isLoading && authUser) {
      router.push("/");
    }
  }, [authUser, isLoading, router]);

  const handleLoginGoogle = async () => {
    try {
      const user = await signInWithPopup(auth, provider);
      console.log(user);
    } catch (err) {
      console.error(err);
    }
  };
  const handleChange = (e) => {
    setUser(() => ({ ...user, [e.target.name]: e.target.value }));
  };

  return isLoading || (!isLoading && authUser) ? (
    <Loader />
  ) : (
    <main className="flex lg:h-[100vh]">
      <div className="w-full lg:w-[60%] p-8 md:p-14 flex items-center justify-center lg:justify-start">
        <div className="p-8 w-[600px]">
          <h1 className="text-6xl font-semibold">Login</h1>
          <p className="mt-6 ml-1">
            Don't have an account ?{" "}
            <Link href="/register" className="underline hover:text-blue-400 cursor-pointer">
              Sign Up
            </Link>
          </p>

          <div
            className="bg-black/[0.05] text-white w-full py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90 flex justify-center items-center gap-4 cursor-pointer group"
            onClick={handleLoginGoogle}
          >
            <FcGoogle size={22} />
            <span className="font-medium text-black group-hover:text-white">Login with Google</span>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mt-10 pl-1 flex flex-col">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-10 pl-1 flex flex-col">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={user.password}
                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
                onChange={handleChange}
                required
              />
            </div>
            <button className="bg-black text-white w-44 py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90">
              Log in
            </button>
          </form>
        </div>
      </div>
      <div
        className="w-[40%] bg-slate-400 bg-cover bg-right-top hidden lg:block"
        style={{
          backgroundImage: "url('/login-banner.jpg')",
        }}
      ></div>
    </main>
  );
};

export default LoginForm;
