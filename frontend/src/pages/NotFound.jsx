import { Link } from "react-router-dom";
import { FaHome, FaArrowLeft } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-900 px-6">
      <div className="text-center max-w-xl">
        <p className="text-8xl font-extrabold text-white drop-shadow-lg">404</p>
        <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-2 text-lg text-gray-200">
          Sorry, we couldn’t find the page you’re looking for.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 text-sm font-semibold rounded-md shadow-md bg-white text-blue-700 hover:bg-gray-100 transition"
          >
            <FaHome className="mr-2" />
            Go back home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 text-sm font-semibold rounded-md shadow-md border border-white text-white hover:bg-white/10 transition"
          >
            <FaArrowLeft className="mr-2" />
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
