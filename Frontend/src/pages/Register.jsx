import React, { useState } from 'react'
import Logo from '../components/frequentlyUsedComponents/Logo'
import { Eye, EyeClosed } from "lucide-react";
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
const Register = () => {
    const navigate=useNavigate();
    const { signup, isSigningUp } = useAuthStore();
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const updateFormData = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFormData = async (e) => {
        e.preventDefault();
        const validationResult = validateForm();
        if (validationResult) {
            const response = await signup(formData);
            if (response.status === "success") {
                toast.success(response.message);
                navigate('/login');
            } else toast.error(response.message);
        }
    };

    const addError = (errors, field, message) => {
        if (!errors[field]) {
            errors[field] = message;
        } else {
            errors[field] += `, ${message}`;
        }
    };

    const validateForm = () => {
        const name = formData.name;
        const email = formData.email;
        const password = formData.password;
        const confirmPassword = formData.confirmPassword;

        const errors = {};

        //Full Name validation
        if (!name.trim()) {
            addError(errors, "name", "Name is Required");
        } else if (name.length <= 3) {
            addError(errors, "name", "Name must be greater than 3 characters");
        }

        //Email validation
        if (!email.trim()) {
            addError(errors, "email", "Email is required");
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            addError(errors, "email", "Invalid email format");
        }

        // Password Validation
        if (!password.trim()) {
            addError(errors, "password", "Password is required");
        } else {
            const missing = [];

            if (password.length < 8) {
                addError(errors, "password", "Min 8 chars required");
            }
            if (!/[A-Z]/.test(password)) {
                missing.push("1 uppercase letter");
            }
            if (!/[0-9]/.test(password)) {
                missing.push("1 number");
            }
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                missing.push("1 special character");
            }

            // Add the combined message if any condition is missing
            if (missing.length > 0) {
                addError(
                    errors,
                    "password",
                    `Must contain at least ${missing.join(", ")}`
                );
            }
        }

        // Confirm Password Validation
        if (!confirmPassword.trim()) {
            addError(errors, "confirmPassword", "Confirm Password is required");
        } else if (confirmPassword !== password) {
            addError(errors, "confirmPassword", "Passwords do not match");
        }


        setErrors(errors);

        // Return validation status
        return Object.keys(errors).length === 0;
    };

    return (
        <main className='w-full min-h-screen  flex items-center justify-center'>
            <div className='max-w-[500px] w-full mx-6'>
                <Logo className="mx-auto w-fit mb-6" />
                <div className='text-center mb-6'>
                    <h4 className='font-medium text-xl'>Register</h4>
                    <p className="text-lg">Get your EventEase account now.</p>
                </div>
                <form onSubmit={handleFormData} className='flex flex-col gap-3 '>
                    <div className='fullName'>
                        <label className="input  w-full">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </g>
                            </svg>
                            <input
                                value={formData.name}
                                onChange={updateFormData}
                                name='name'
                                type="text"
                                placeholder="Full Name"
                            />
                        </label>
                        {errors.name && (
                            <div className="validator-hint text-red-600">{errors.name}</div>
                        )}
                    </div>
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
                                name='email'
                                type="email"
                                placeholder="mail@site.com"
                            />
                        </label>
                        {errors.email && (
                            <div className="validator-hint text-red-600">{errors.email}</div>
                        )}
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
                                value={formData.password}
                                onChange={updateFormData}
                                name='password'
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
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
                        {errors.password && (
                            <div className="validator-hint text-red-600">{errors.password}</div>
                        )}
                    </div>
                    <div className="confirmPassword">
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
                                value={formData.confirmPassword}
                                onChange={updateFormData}
                                name='confirmPassword'
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                placeholder="Confirm Password"
                            />
                            <button
                                type='button'
                                className="absolute bottom-2 right-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowConfirmPassword((prev) => !prev);
                                }}
                            >
                                {showConfirmPassword ? (
                                    <EyeClosed size={17} />
                                ) : (
                                    <Eye size={17} />
                                )}
                            </button>
                        </label>
                        {errors.confirmPassword && (
                            <div className="validator-hint text-red-600">{errors.confirmPassword}</div>
                        )}
                    </div>
                    <div className="submitButton mt-6">
                        <button type="submit" className="btn btn-neutral w-full flex items-center"><span>Register</span> {isSigningUp && <span className="loading loading-infinity text-white w-7"></span>}</button>
                    </div>
                    <div>
                        <p className='text-center'>By registering you agree to the <span className='text-blue-700'>EventEase Terms of Use</span></p>
                    </div>
                </form>
                <div className='flex flex-col items-center gap-2 mt-6'>
                    <p className='text-center'>Already have an account ? <Link to="/login" className='text-blue-700'>Sign In</Link></p>

                    <p className='text-center'>© 2025 EventEase. Crafted with ❤️ by <a target='_blank' href="https://my-personal-portfolio-dh7s.vercel.app/" className='font-bold underline text-blue-700'>Rajesh</a></p>
                </div>
            </div>
        </main>
    )
}

export default Register
