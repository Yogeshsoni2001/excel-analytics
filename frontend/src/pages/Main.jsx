import React from "react";
import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

const Main = () => {
  return (
    <div className="relative min-h-screen bg-white text-black flex flex-col items-center overflow-hidden">
      {/* Header */}
      <header className="w-full flex flex-col sm:flex-row justify-between items-center px-6 sm:px-10 py-6 space-y-4 sm:space-y-0">
        <img src="/logo.png" alt="grapiq Logo" className="h-10 w-auto" />


        <div className="flex gap-3">
          <Link to="/login">
            <button className="w-28 h-11 bg-white cursor-pointer rounded-3xl border-2 border-[#3B82F6] shadow-[inset_0px_-2px_0px_1px_#3B82F6] group hover:bg-[#3B82F6] transition duration-300 ease-in-out">
              <span className="font-medium text-[#333] group-hover:text-white">Login</span>
            </button>
          </Link> 


          <Link to="/register">
            <button className="cursor-pointer transition-all 
    bg-gray-700 text-white px-6 py-2 rounded-lg
    border-blue-400
    border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
    active:border-b-[2px] active:brightness-90 active:translate-y-[2px] 
    hover:shadow-xl hover:shadow-blue-300 shadow-blue-300 active:shadow-none">
              Sign Up
            </button>
          </Link>
        </div>

      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full flex flex-col items-center justify-center text-center px-6 sm:px-10 mt-10 mb-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight sm:leading-snug">
          Where your <span className="text-blue-600">data</span> turns into <span className="text-blue-600">software</span> with a click
        </h2>
        <p className="text-md sm:text-lg text-gray-600 max-w-2xl mb-8">
          "Drag, drop, and visualize—turn rows and columns into powerful dashboards that make your Excel data easier to explore and present."
        </p>
        <a
          href="/register"
          className="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-blue-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
        >
          <FaPlay className="text-sm text-gray-800 group-hover:text-gray-50 transition duration-300" />
          Get Started
          <svg
            className="w-8 h-8 group-hover:rotate-90 group-hover:bg-gray-50 text-gray-800 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
            viewBox="0 0 16 19"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
              className="fill-gray-800 group-hover:fill-gray-800"
            ></path>
          </svg>
        </a>

      </main>

      {/* Floating icons (left side) */}
      <div className="hidden sm:flex flex-col absolute top-1/4 left-56 transform -translate-y-3/4 space-y-6">
        <img src="/icons/excel.jpg" className="w-12 h-12 rounded-lg shadow-lg" alt="excel" />
      </div>

      <div className="hidden sm:flex flex-col absolute top-64 left-10 transform -translate-y-1/2 space-y-6">
        <img src="/icons/area.jpg" className="w-12 h-12 rounded-lg shadow-lg" alt="area" />
      </div>

      <div className="hidden sm:flex flex-col absolute top-96 left-72 transform -translate-y-1/4 space-y-6">
        <img src="/icons/donut.png" className="w-13 h-12  rounded-lg shadow-lg" alt="donut" />
      </div>


      {/* Floating icons (right side) */}
      <div className="hidden sm:flex flex-col absolute top-1/4 right-56 transform -translate-y-3/4 space-y-6">
        <img src="/icons/pie.jpg" className="w-12 h-12 rounded-lg shadow-lg" alt="area" />
      </div>

      <div className="hidden sm:flex flex-col absolute top-64 right-10 transform -translate-y-1/2 space-y-6">
        <img src="/icons/bar.jpg" className="w-12 h-12 rounded-lg shadow-lg" alt="area" />
      </div>

      <div className="hidden sm:flex flex-col absolute top-96 right-72 transform -translate-y-1/4 space-y-6">
        <img src="/icons/graph.jpg" className="w-13 h-12  rounded-lg shadow-lg" alt="area" />
      </div>

      {/* Footer gradient blur */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-r from-blue-400 via-yellow-200 to-blue-400 opacity-80 blur-2xl pointer-events-none" />
    </div>
  );
};

export default Main;
