import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { auth } from "@/firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "@/firebase/auth";
import Loader from "@/components/Loader";
import { useRouter } from "next/router";
const initialData = { name: "", email: "", password: "" };

const RegisterForm = () => {
  const [user, setUser] = useState(initialData);
  const { authUser, isLoading, setAuthUser } = useAuth();
  const provider = new GoogleAuthProvider();
  const router = useRouter();
  console.log(authUser, isLoading);

  useEffect(() => {
    if (authUser && !isLoading) {
      router.push("/");
    }
  }, [authUser, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.email) return;
    try {
      const data = await createUserWithEmailAndPassword(auth, user.email, user.password);
      await updateProfile(auth.currentUser, {
        displayName: user.name,
      });
      setAuthUser({
        uid: data.user.uid,
        email: data.user.email,
        username: data.user.name,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    setUser(initialData);
  };

  const handleGoogleSign = async () => {
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
  //   console.log(user);
  return isLoading || (authUser && !isLoading) ? (
    <Loader />
  ) : (
    <main className="flex lg:h-[100vh]">
      <div className="w-full lg:w-[60%] p-8 md:p-14 flex items-center justify-center lg:justify-start">
        <div className="p-8 w-[600px]">
          <h1 className="text-6xl font-semibold">Sign Up</h1>
          <p className="mt-6 ml-1">
            Already have an account ?{" "}
            <Link href="/login" className="underline hover:text-blue-400 cursor-pointer">
              Login
            </Link>
          </p>

          <div
            className="bg-black/[0.05] text-white w-full py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90 flex justify-center items-center gap-4 cursor-pointer group"
            onClick={handleGoogleSign}
          >
            <FcGoogle size={22} />
            <span className="font-medium text-black group-hover:text-white">Login with Google</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-10 pl-1 flex flex-col">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={user.name}
                className="font-medium border-b border-black p-4 outline-0 focus-within:border-blue-400"
                onChange={handleChange}
                required
              />
            </div>
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
              Sign Up
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

export default RegisterForm;
