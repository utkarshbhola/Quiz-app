import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import he from "he";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
}

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);

  const navigate = useNavigate();

  //Fetch questions
  useEffect(() => {
    axios
       .get("https://opentdb.com/api.php", {
    params: { amount: 5, type: "multiple" }, // you can also add difficulty, category
  })
  .then((res) => {
    const results = res.data.results;

    interface ApiQuestion {
      question: string;
      correct_answer: string;
      incorrect_answers: string[];
    }

    const decodedQuestions: Question[] = results.map((q: ApiQuestion, idx: number) => {
      const options = [...q.incorrect_answers, q.correct_answer];
      options.sort(() => Math.random() - 0.5); // shuffle

      return {
        id: idx + 1,
        question: he.decode(q.question).trim(),
        options: options.map((opt: string) => he.decode(opt).trim()),
        correct_answer: he.decode(q.correct_answer).trim(),
      };
    });

    setQuestions(decodedQuestions);
    setAnswers(Array(decodedQuestions.length).fill(null));
    setSelected(null);
  })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Timer effect
  useEffect(() => {
    if (loading || questions.length === 0) return;

    if (timeLeft === 0) {
      handleSkip();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, loading]);

  // Reset timer + restore selection when question changes
  useEffect(() => {
    setTimeLeft(30);
    setSelected(answers[currentIndex]);
  }, [currentIndex]);

  const handleNext = () => {
    if (!selected) return;

    const currentQ = questions[currentIndex];
    const isCorrect = selected === currentQ.correct_answer;

    const nextAnswers = [...answers];
    let nextScore = score;

    if (nextAnswers[currentIndex] === null) {
      nextScore = score + (isCorrect ? 1 : 0);
    } else {
      const prevAnswer = nextAnswers[currentIndex];
      const wasCorrect = prevAnswer === currentQ.correct_answer;

      if (wasCorrect && !isCorrect) nextScore = score - 1;
      if (!wasCorrect && isCorrect) nextScore = score + 1;
    }

    nextAnswers[currentIndex] = selected;

    setScore(nextScore);
    setAnswers(nextAnswers);
    setSelected(null);

    goToNextOrFinish(nextScore, nextAnswers);
  };

  const handleSkip = () => {
    setSelected(null);
    goToNextOrFinish(score, answers);
  };

  const goToNextOrFinish = (newScore: number, newAnswers: (string | null)[]) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
    } else {
      navigate("/results", {
        state: { score: newScore, total: questions.length, answers: newAnswers, questions },
      });
    }
  };

  if (loading) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 p-4">
      {/* Background blur blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-400/40 blur-3xl"></div>
      <div className="absolute top-40 -right-32 w-[500px] h-[500px] rounded-full bg-blue-400/40 blur-3xl"></div>

      {/* Skeleton Card */}
      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white/30 backdrop-blur-md p-6 shadow-xl animate-pulse">
        {/* Progress bar skeleton */}
        <div className="h-2 w-full rounded-full bg-gray-200 mb-2"></div>
        <div className="h-4 w-24 bg-gray-300 rounded mb-4"></div>

        {/* Timer skeleton */}
        <div className="h-2 w-full rounded-full bg-gray-200 mb-2"></div>
        <div className="h-4 w-16 bg-gray-300 rounded mb-6"></div>

        {/* Question skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-full bg-gray-300 rounded"></div>
          <div className="h-6 w-full bg-gray-300 rounded"></div>
          <div className="h-6 w-full bg-gray-300 rounded"></div>
          <div className="h-6 w-full bg-gray-300 rounded"></div>
        </div>

        {/* Buttons skeleton */}
        <div className="mt-6 flex gap-3">
          <div className="flex-1 h-10 bg-gray-300 rounded"></div>
          <div className="flex-1 h-10 bg-gray-300 rounded"></div>
          <div className="flex-1 h-10 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}


  if (questions.length === 0) {
    return <div className="flex h-screen items-center justify-center text-red-600 text-lg">No questions available.</div>;
  }

  const q = questions[currentIndex];

  const timeProgress = (timeLeft / 30) * 100;
  const quizProgress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 p-4">
      {/* Glowing blur lights */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-400/40 blur-3xl"></div>
      <div className="absolute top-40 -right-32 w-[500px] h-[500px] rounded-full bg-blue-400/40 blur-3xl"></div>

      {/* Quiz Container (Glassmorphic) */}
      <div className="relative z-10 w-full max-w-xl rounded-2xl border bg-white/30 backdrop-blur-md p-6 shadow-xl">
        {/* Progress Bar */}
        <div className="mb-2 w-full">
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all"
              style={{ width: `${quizProgress}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-gray-800 font-medium">
            Question {currentIndex + 1} of {questions.length} • Score: {score}
          </div>
        </div>

        {/* Timer */}
        <div className="mb-4 w-full">
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full transition-all ${timeLeft <= 10 ? "bg-red-500" : "bg-green-500"}`}
              style={{ width: `${timeProgress}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs font-bold text-gray-800">⏳ {timeLeft}s</div>
        </div>

        {/* Question Card */}
        <p className="mb-5 text-lg font-medium">{q.question}</p>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelected(opt)}
              className={`w-full rounded-lg border px-4 py-2 transition ${
                selected === opt ? "bg-blue-600 text-white" : "bg-white/70 hover:bg-blue-50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex w-full gap-3">
          {currentIndex > 0 && (
            <button
              onClick={() => setCurrentIndex(currentIndex - 1)}
              className="flex-1 rounded-lg bg-gray-200/70 px-4 py-2 text-gray-800 shadow hover:bg-gray-300 transition"
            >
              Previous
            </button>
          )}

          {currentIndex < questions.length  && (
            <button
              onClick={handleSkip}
              className="flex-1 rounded-lg bg-yellow-500/80 px-4 py-2 text-white shadow hover:bg-yellow-600 transition"
            >
              Skip
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!selected}
            className={`flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white shadow transition ${
              !selected ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {currentIndex < questions.length? "Next" : "Finish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
