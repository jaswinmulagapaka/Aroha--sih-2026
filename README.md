# 🎯 SkillPath — AI-Powered Learning & Skill-Gap Analyzer

> Find out exactly what you know, what you're missing, and how to close the gap — powered by AI.

SkillPath is a hackathon MVP that helps learners figure out where they stand on the path to mastering a new course or skill. Enter your name, tell us what you already know, pick a course you want to learn, and let AI do the rest — mapping your current skills against what's required, showing your progress visually, and guiding you the rest of the way with quests, a chatbot mentor, and achievements.

---

## ✨ Features

### 🧠 Skill-Gap Detection
- Enter your **name**, your **known skills**, and the **course** you want to learn.
- The AI compares your existing skills against the skills required for that course.
- Instantly see:
  - ✅ Skills you already have
  - 📌 Skills you still need to learn

### 📊 Progress Circle
- A dynamic **percentage circle** visualizes how much of the course you've already mastered vs. how much is left to learn.

### 💬 AI Chatbot Mentor
- A built-in **AI chatbot** you can open anytime from the UI.
- Ask questions, get explanations, or get guidance on what to learn next — all inside the same interface.

### 🗺️ Quests Section
- Skills to learn are broken down into **quests** (bite-sized learning goals).
- Each quest has:
  - A **checklist** of skills/topics to complete
  - A **percentage calculator** showing quest completion progress

### 🏆 Achievements
- Unlock achievements as you complete quests and close skill gaps.
- Keeps learning motivating and game-like instead of just a checklist.

---

## 🕹️ How It Works

1. **Enter your details** — Name, known skills, and the course you want to learn.
2. **Press Enter** — The AI analyzes your input.
3. **Get your skill report** — See matched skills vs. skill gaps, along with your completion percentage.
4. **Start a quest** — Pick from the generated quests to begin closing your skill gaps.
5. **Chat with the AI** — Open the chatbot anytime for help, explanations, or guidance.
6. **Earn achievements** — Track your progress and celebrate milestones as you go.

---

## 🛠️ Tech Stack

> _Update this section with your actual stack before submitting._

- **Frontend:** _e.g. React / HTML, CSS, JS_
- **Backend:** _e.g. Node.js + Express / Flask_
- **AI Integration:** _e.g. OpenAI API / Claude API_
- **Database:** _e.g. MongoDB / Firebase_
- **Other tools:** _e.g. Chart.js or SVG for the progress circle_

---

## 🚀 Getting Started

### Prerequisites
- Node.js / Python (whichever your stack uses)
- An API key for your chosen AI provider

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/skillpath.git
cd skillpath

# Install dependencies
npm install
# or
pip install -r requirements.txt
```

### Environment Variables
Create a `.env` file in the root directory and add:

```
AI_API_KEY=your_api_key_here
```

### Run the App

```bash
npm start
# or
python app.py
```

Then open `http://localhost:3000` (or your configured port) in your browser.

---

## 📁 Project Structure

```
skillpath/
├── frontend/          # UI components (skill form, progress circle, quests, chatbot)
├── backend/           # API routes, AI logic, skill-gap matching
├── data/              # Course skill requirements / quest data
├── .env.example
└── README.md
```

---

## 🗓️ Roadmap / Future Improvements

- [ ] Add more courses and skill categories
- [ ] Personalized learning resources per missing skill
- [ ] Leaderboard for achievements
- [ ] Save user progress across sessions
- [ ] Mobile-friendly UI

---

## 👥 Team

Built with ❤️ during [Hackathon Name] by:
- _Your name(s) here_

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
