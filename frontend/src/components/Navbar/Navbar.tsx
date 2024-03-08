import React from "react";
import { FaBell } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";

export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <nav id="nav">
      <div className="container relative y-6 flex justify-end items-center py-8 px-10">
        {/* Navbar icons container */}

        <div className="flex items-center space-x-5">
          {/* <IoIosSettings className="text-3xl text-textColor" />
          <FaBell className="text-3xl text-textColor" />
          <img className="w-14 rounded-full" src="/imgs/face.jpg" alt="face" /> */}
          <button onClick={logout} className="text-xl">
            Wyloguj
          </button>
        </div>
      </div>
    </nav>
  );
}
