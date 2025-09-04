# 🎉 Quiz App

A modern, responsive **Quiz Application** built with **React + TypeScript + TailwindCSS**.  
This project was created as part of a **take-home assessment** to showcase front-end fundamentals, state management, API handling, and clean UI/UX design.

---

## 🚀 Features

- **Landing Page**
  - Animated illustration, glowing background effects, and smooth entry transitions.

- **Dynamic Quiz Page**
  - Fetches live trivia questions from [Open Trivia DB](https://opentdb.com/).
  - One question per screen with shuffled options.
  - **30s countdown timer** ⏳ per question (auto-skip when time runs out).
  - Progress indicators (quiz progress + timer).
  - Navigation controls: **Previous, Skip, Next, Finish**.
  - Prevents progression without selecting an answer.

- **Scoring System**
  - Tracks correct/incorrect answers.
  - Score updates dynamically if user changes an answer.

- **Results Page**
  - Displays detailed summary: correct vs incorrect answers, user’s choice, and correct answer.
  - Persistent **High Score** saved in `localStorage` 🏆.
  - Actions to **Restart Quiz** or **Play Again**.

- **Beautiful UI/UX**
  - Glassmorphic cards + glowing gradient blobs.
  - Skeleton loaders for smooth loading states.
  - Subtle animations with **Framer Motion**.

- **Responsive Design**
  - Works seamlessly on desktop and mobile.

---

## 🛠️ Tech Stack

- **React (TypeScript)** — functional components & hooks  
- **React Router** — `/quiz`, `/results` routes  
- **Axios** — API integration with Open Trivia DB  
- **TailwindCSS** — modern styling with responsiveness  
- **Framer Motion** — animations & transitions  
- **React Icons** — simple, lightweight icons  

---

## 📂 Project Structure
src/
├─ components/
│ ├─ LandingPage.tsx
│ ├─ QuizPage.tsx
│ ├─ ResultsPage.tsx
├─ assets/
│ └─ undraw_focused_m9bj.svg
├─ App.tsx
└─ main.tsx


---

## ▶️ Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/quiz-app.git
   cd quiz-app
2. **Install the dependencies**
   npm install
   # or
   yarn install
3.**Run Locally**
   npm run dev
4. **Build for production**
   npm run build
**live_demo:**
   description: "Hosted version of the Quiz App"
   links:
    vercel: "[https://your-app.vercel.app](https://quiz-app-lghp.vercel.app/)"

**highlights:**
  - "Implemented most of the core + bonus features from the assignment"
  - "Added extra polish with animations, skeleton loaders, and a high-score system"
  - "Focused on clean state management and smooth user experience"

**contact:**
  author: "Utkarsh Bhola"
  email: "utkarsh.bhola31@gmail.com"

