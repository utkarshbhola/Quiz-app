import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTrophy } from "react-icons/fa";
import studyLady from "../assets/undraw_focused_m9bj.svg"; 

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = (): void => {
    navigate("/quiz");
  };

  return (
    <div className="relative flex flex-col h-screen font-sans overflow-hidden">
      {/* Glowing blur lights in background */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-400/40 blur-3xl"></div>
      <div className="absolute top-40 -right-32 w-[500px] h-[500px] rounded-full bg-blue-400/40 blur-3xl"></div>

      {/* Header with logo + trophy */}
      <header className="relative z-10 flex items-center gap-2 p-6">
        <FaTrophy className="text-yellow-400 text-2xl drop-shadow-md" />
        <h1 className="text-2xl font-bold text-gray-900">QUIZ</h1>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col md:flex-row items-center justify-center gap-8 p-6">
        {/* Toon illustration */}
        <motion.img
          src={studyLady}
          alt="Studying lady"
          className="w-64 md:w-80 drop-shadow-lg"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* Text + Button */}
        <motion.div
          className="flex flex-col items-center text-center bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Welcome to the Quiz App 🎉
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-md">
            Test your knowledge with fun trivia questions. Click below to begin!
          </p>
          <motion.button
            onClick={handleStart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Start Quiz
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
