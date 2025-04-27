import React, { useState } from 'react'
import Logo from '../components/frequentlyUsedComponents/Logo'
import useAuthStore from '../store/useAuthStore';
import { Eye, EyeClosed} from "lucide-react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate=useNavigate();
    const { isSigningIn, signin } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const updateFormData = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleFormData = async (e) => {
        e.preventDefault();
        const response = await signin(formData);

        if (response.status === "success") {
            toast.success(response.message);
            navigate('/');
        }
        else toast.error(response.message);
    };

    return (
        <main className='w-full min-h-screen  flex items-center justify-center'>
            <div className='max-w-[500px] w-full mx-6'>
                <Logo className="mx-auto w-fit mb-6" />
                <div className='text-center mb-6'>
                    <h4 className='font-medium text-xl'>Sign in</h4>
                    <p className="text-lg">Sign in to continue to EventEase.</p>
                </div>
                <form onSubmit={handleFormData} className='flex flex-col gap-3 '>

                    <div className="email">
                        <label className="input w-full">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </g>
                            </svg>
                            <input
                                value={formData.email}
                                onChange={updateFormData}
                                type="email"
                                placeholder="mail@site.com"
                                name='email'
                            />
                        </label>

                    </div>
                    <div className="password">
                        <label className="input w-full">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                    ></path>
                                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                </g>
                            </svg>
                            <input
                                required
                                placeholder="Password"
                                value={formData.password}
                                onChange={updateFormData}
                                type={showPassword ? "text" : "password"}
                                name="password"
                            />
                            <button
                                className="absolute bottom-2 right-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowPassword((prev) => !prev);
                                }}
                            >
                                {showPassword ? <EyeClosed size={17} /> : <Eye size={17} />}
                            </button>
                        </label>
                    </div>

                    <div className="submitButton mt-6">
                        <button type="submit" className="btn btn-neutral w-full flex items-center"><span>Register</span> {isSigningIn && <span className="loading loading-infinity text-white w-7"></span>}</button>
                    </div>

                    <div>
                        <p className='text-center'>By registering you agree to the <span className='text-blue-700'>EventEase Terms of Use</span></p>
                    </div>
                </form>
                <div className='flex flex-col items-center gap-2 mt-6'>
                    <p className='text-center'>Don't have an account ? <Link className='text-blue-700' to="/register">Signup Now</Link> </p>

                    <p className='text-center'>© 2025 EventEase. Crafted with ❤️ by <a target='_blank' href="https://my-personal-portfolio-dh7s.vercel.app/" className='font-bold underline text-blue-700'>Rajesh</a></p>
                </div>
            </div>
        </main>
    )
}

export default Login
