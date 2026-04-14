import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import axios from 'axios'

const Login = () => {

    const { setShowUserLogin, fetchUser } = useAppContext()

    const [state, setState] = useState("login")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        if (loading) return
        setLoading(true)

        try {
            const { data } = await axios.post(
                `http://localhost:4000/api/user/${state}`,
                {
                    name,
                    email,
                    password
                },
                {
                    withCredentials: true   // 🔥 cookie ke liye
                }
            )

            if (data.success) {

                await fetchUser()   // 🔥 backend se fresh user

                setShowUserLogin(false)

                toast.success(
                    state === "login"
                        ? "Login Successful 🎉"
                        : "Account Created 🎉"
                )

                // 🔥 FINAL FIX
                window.location.reload()

            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">

            <form onSubmit={onSubmitHandler} className="relative w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-5">

                {/* Close Button */}
                <button
                    type="button"
                    onClick={() => setShowUserLogin(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
                >
                    ✕
                </button>

                {/* Heading */}
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    {state === "login" ? "Welcome Back 👋" : "Create Account 🚀"}
                </h2>

                {/* Name */}
                {state === "register" && (
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        className="border p-3 rounded-lg outline-none focus:border-green-500"
                        required
                    />
                )}

                {/* Email */}
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    type="email"
                    className="border p-3 rounded-lg outline-none focus:border-green-500"
                    required
                />

                {/* Password */}
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                    className="border p-3 rounded-lg outline-none focus:border-green-500"
                    required
                />

                {/* Toggle */}
                <p className="text-sm text-gray-600 text-center">
                    {state === "login" ? (
                        <>
                            Don’t have an account?{" "}
                            <span
                                onClick={() => setState("register")}
                                className="text-green-600 cursor-pointer"
                            >
                                Sign Up
                            </span>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <span
                                onClick={() => setState("login")}
                                className="text-green-600 cursor-pointer"
                            >
                                Login
                            </span>
                        </>
                    )}
                </p>

                {/* Button */}
                <button
                    disabled={loading}
                    className={`py-3 rounded-lg text-white font-semibold transition-all ${
                        loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                    {loading
                        ? "Please wait..."
                        : state === "login"
                        ? "Login"
                        : "Create Account"}
                </button>

            </form>
        </div>
    )
}

export default Login