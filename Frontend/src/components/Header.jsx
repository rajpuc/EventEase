import React from "react";
import Logo from "./frequentlyUsedComponents/Logo";
import { Link, NavLink } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import SearchBar from "./frequentlyUsedComponents/SearchBar";
import useAuthStore from "../store/useAuthStore";

const Header = () => {
  const { logout, loggedInUser } = useAuthStore();
  const logoutHandler = async () => {
    await logout();
  };
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <NavLink
                to={"/home"}
                className={({ isActive }) =>
                  `font-medium ${isActive ? "text-blue-700" : ""}`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/events"
                className={({ isActive }) =>
                  `font-medium ${isActive ? "text-blue-700" : ""}`
                }
              >
                Event Listings
              </NavLink>
            </li>
            <li className="sm:hidden">
              <details>
                <summary className="font-medium">Dashboard</summary>
                <ul className="p-2 relative z-1">
                  <li>
                    <NavLink
                      to={"/dashboard/create"}
                      className={({ isActive }) =>
                        `font-medium whitespace-nowrap ${
                          isActive ? "text-blue-700" : ""
                        }`
                      }
                    >
                      Create Events
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={"/myevents"}
                      className={({ isActive }) =>
                        `font-medium whitespace-nowrap ${
                          isActive ? "text-blue-700" : ""
                        }`
                      }
                    >
                      My Events
                    </NavLink>
                  </li>
                </ul>
              </details>
            </li>
            <li className="sm:hidden">
              <NavLink
                to={"/logout"}
                className={({ isActive }) =>
                  `font-medium ${isActive ? "text-blue-700" : ""}`
                }
              >
                Logout
              </NavLink>
            </li>
            <button
              onClick={() => document.getElementById("my_modal_2").showModal()}
              className="btn btn-ghost btn-circle sm:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />{" "}
              </svg>
            </button>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl ">
          <Logo className="scale-80 -translate-x-5 sm:scale-none sm:-translate-x-0" />
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                `font-bold whitespace-nowrap ${isActive ? "text-blue-700" : ""}`
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to={"/events"}
              className={({ isActive }) =>
                `font-bold whitespace-nowrap ${isActive ? "text-blue-700" : ""}`
              }
            >
              Event Listings
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-end hidden sm:flex">
        <ul className="menu menu-horizontal px-1">
          <button
            onClick={() => document.getElementById("my_modal_2").showModal()}
            className="btn btn-ghost btn-circle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />{" "}
            </svg>
          </button>
          {loggedInUser && (
            <>
              <li>
                <details>
                  <summary className="font-bold">Dashboard</summary>
                  <ul className="p-2 relative z-1">
                    <li>
                      <NavLink
                        to={"/dashboard/create"}
                        className={({ isActive }) =>
                          `font-bold whitespace-nowrap ${
                            isActive ? "text-blue-700" : ""
                          }`
                        }
                      >
                        Create Events
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to={"/myevents"}
                        className={({ isActive }) =>
                          `font-bold whitespace-nowrap ${
                            isActive ? "text-blue-700" : ""
                          }`
                        }
                      >
                        My Events
                      </NavLink>
                    </li>
                  </ul>
                </details>
              </li>
              <li>
                <button onClick={logoutHandler} className="font-bold">
                  Logout
                </button>
              </li>
            </>
          )}
          {!loggedInUser && <li><NavLink className="font-bold" to={'/login'}>Login</NavLink></li>}
        </ul>
      </div>

      <SearchBar />
    </div>
  );
};

export default Header;
