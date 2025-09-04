from fastapi import FastAPI, HTTPException
import requests, random
app = FastAPI(title="Quiz Backend")

TRIVIA_API = "https://opentdb.com/api.php"

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Quiz API running 🚀"}

@app.get("/quiz/")
def get_quiz(amount: int = 4, category: int = None, difficulty: str = None):
    """
    Fetch quiz questions from Open Trivia DB and normalize them.
    Query params:
    - amount: number of questions (default=4)
    - category: category ID (optional, see Open Trivia DB categories)
    - difficulty: easy/medium/hard (optional)
    """

    params = {"amount": amount, "type": "multiple"}
    if category:
        params["category"] = category
    if difficulty:
        params["difficulty"] = difficulty

    try:
        response = requests.get(TRIVIA_API, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        if data["response_code"] != 0:
            raise HTTPException(status_code=400, detail="No questions found.")

        # Normalize structure for frontend
        questions = []
        for idx, q in enumerate(data["results"], 1):
            options = q["incorrect_answers"] + [q["correct_answer"]]
            random.shuffle(options)  # shuffle so correct isn’t always last
            questions.append({
                "id": idx,
                "question": q["question"],
                "options": options,
                "correct_answer": q["correct_answer"]
            })

        return {"questions": questions}

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trivia: {str(e)}")
