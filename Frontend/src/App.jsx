import React, { lazy, Suspense, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute';
import Loader from './components/frequentlyUsedComponents/Loader';
import useAuthStore from './store/useAuthStore';
import MyEventsPage from './pages/MyEventsPage';
import SearchPage from './pages/SearchPage';


// Lazy imports for pages
const HomePage = lazy(() => import("./pages/HomePage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateEvent = lazy(() => import("./pages/CreateEvent"));
const EditEvent = lazy(() => import("./pages/EditEvent"));

const App = () => {
  const {loggedInUser, isCheckingAuth, checkAuth} = useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[loggedInUser])

  if(isCheckingAuth && !loggedInUser) return <>
    <Loader/>
  </>

  return (
    <div>
      <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/search/:category" element={<SearchPage />} />
          <Route path="/search/:category/:location" element={<SearchPage />} />
          <Route path="/search-location/:location" element={<SearchPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/create" element={<CreateEvent />} />
            <Route path="/dashboard/edit/:id" element={<EditEvent />} />
            <Route path="/myevents" element={<MyEventsPage />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
    </div>
  )
}

export default App

