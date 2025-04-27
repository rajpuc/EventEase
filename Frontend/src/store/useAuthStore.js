import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useAuthStore = create((set, get) => (
    {
        isSigningUp: false,
        isSigningIn: false,
        loggedInUser: null,
        isCheckingAuth:true,
        checkIsCheckAuthCallingFrquently:false,

        checkAuth: async () => {
            const { checkIsCheckAuthCallingFrquently } = get(); 
        
            if (checkIsCheckAuthCallingFrquently) return;
        
            set({ checkIsCheckAuthCallingFrquently: true, isCheckingAuth: true });
        
            try {
                const res = await axiosInstance.get("/check-auth");
                set({ loggedInUser: res.data.data });
            } catch (error) {
                console.log("Error in checkAuth: ", error.message);
                set({ loggedInUser: null });
            } finally {
                set({ isCheckingAuth: false, checkIsCheckAuthCallingFrquently: false });
            }
        },
        

        signup: async (data) => {
            set({ isSigningUp: true });
            let result;
            try {
                const response = await axiosInstance.post("/register", data);
                result = {
                    status: response.data.status,
                    message: response.data.message,
                    data: response.data.data
                }
            } catch (error) {
                if (error.response.data) {
                    result = {
                        status: error.response.data.status,
                        message: error.response.data.message,
                        error: error.response.data.error,
                    }
                } else {
                    result = {
                        status: "failed",
                        message: error.message,
                    }
                }
            }
            set({ isSigningUp: false });
            return result;
        },

        signin: async (data) => {
            set({ isSigningIn: true })
            let result;
            try {
                const response = await axiosInstance.post("/login", data);
                set({ loggedInUser: response.data.data });

                result = {
                    status: response.data.status,
                    message: response.data.message,
                    data: response.data.data
                }

            } catch (error) {
                if (error.response.data) {
                    result = {
                        status: error.response.data.status,
                        message: error.response.data.message,
                        error: error.response.data.error,
                    }
                } else {
                    result = {
                        status: "failed",
                        message: error.message,
                    }
                }
            }

            set({ isSigningIn: false })
            return result;
        },

        logout: async () => {
            try {
              const response=await axiosInstance.get("/logout");
              set({ loggedInUser: null });
              toast.success(response.data.message);
              get().disconnectSocket();
            } catch (error) {
              toast.error(error.response.data.message);
            }
        },
    }
));

export default useAuthStore;