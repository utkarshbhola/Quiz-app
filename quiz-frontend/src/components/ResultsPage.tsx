import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTrophy } from "react-icons/fa";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [highScore, setHighScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true); // ✅ Loading state

  useEffect(() => {
    if (!location.state) navigate("/");

    // Simulate brief loading before showing results
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  useEffect(() => {
    if (!location.state) return;
    const { score } = location.state as {
      score: number;
      total: number;
      answers: (string | null)[];
      questions: Question[];
    };
    const saved = localStorage.getItem("highScore");
    const prevHigh = saved ? parseInt(saved) : 0;

    if (score > prevHigh) {
      localStorage.setItem("highScore", score.toString());
      setHighScore(score);
    } else {
      setHighScore(prevHigh);
    }
  }, [location.state]);

  if (!location.state) return null;

  const { score, total, answers, questions } = location.state as {
    score: number;
    total: number;
    answers: (string | null)[];
    questions: Question[];
  };

  return (
    <div className="relative flex flex-col min-h-screen font-sans overflow-hidden bg-gray-50">
      {/* Blurred background blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-400/40 blur-3xl"></div>
      <div className="absolute top-40 -right-32 w-[500px] h-[500px] rounded-full bg-blue-400/40 blur-3xl"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center gap-2 p-6">
        <FaTrophy className="text-yellow-400 text-2xl drop-shadow-md" />
        <h1 className="text-2xl font-bold text-gray-900">Results</h1>
      </header>

      {/* Main content */}
      {loading ? (
        // Skeleton loader
        <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white/40 backdrop-blur-md p-6 shadow-lg animate-pulse mx-auto mt-6">
          <div className="h-6 w-3/5 bg-gray-300 rounded mb-2"></div>
          <div className="h-5 w-2/5 bg-gray-300 rounded mb-4"></div>
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-16 w-full bg-gray-300 rounded mb-3"></div>
            ))}
          <div className="flex gap-4 mt-4">
            <div className="flex-1 h-10 bg-gray-300 rounded"></div>
            <div className="flex-1 h-10 bg-gray-300 rounded"></div>
          </div>
        </div>
      ) : (
        // Actual Results card
        <motion.div
          className="flex flex-col items-center text-center bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-lg w-full max-w-xl max-h-[80vh] mx-auto mt-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-2xl font-semibold text-gray-900 mb-2">
            You scored <span className="font-bold">{score}</span> out of{" "}
            <span className="font-bold">{total}</span>
          </p>
          <p className="text-lg text-yellow-600 font-semibold drop-shadow-md mb-6">
            🏆 High Score: {highScore}
          </p>

          <div className="space-y-4 w-full overflow-y-auto pr-2">
            {questions.map((q, idx) => {
              const userAnswer = answers[idx];
              const correct = userAnswer === q.correct_answer;

              return (
                <div
                  key={q.id}
                  className={`rounded-xl p-4 shadow-md transition-all duration-300 w-full ${
                    correct ? "bg-green-100/60" : "bg-red-100/60"
                  }`}
                >
                  <p className="mb-2 font-medium text-gray-900">
                    Q{idx + 1}. {q.question}
                  </p>
                  <p
                    className={`font-semibold ${
                      correct ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    Your Answer: {userAnswer ?? "Not answered"}
                  </p>
                  {!correct && (
                    <p className="text-gray-800">
                      ✅ Correct Answer: <span className="font-medium">{q.correct_answer}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col md:flex-row gap-4 w-full">
            <motion.button
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Restart Quiz
            </motion.button>
            <motion.button
              onClick={() => navigate("/quiz")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-6 py-3 bg-green-600 text-white text-lg rounded-lg shadow-md hover:bg-green-700 transition"
            >
              Play Again
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ResultsPage;
