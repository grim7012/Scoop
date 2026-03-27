
# 🍦 Scoop — AI Flavor Sommelier

Scoop is an AI-powered conversational assistant that helps users discover, understand, and experiment with ice cream flavors. It blends a curated flavor database with generative AI to create a unique, interactive “flavor discovery” experience.

---

## ✨ Features

* 💬 **Natural Chat Experience**
  Talk to Scoop like a friend — no rigid commands, just conversation.

* 🍨 **Smart Flavor Recommendations**
  Suggests flavors based on mood, preferences, pairings, and context.

* 🧠 **Hybrid Intelligence System**
  Combines:

  * Structured flavor database (30+ curated flavors)
  * AI-generated creative suggestions

* 🎯 **Context-Aware Responses**
  Understands user intent (casual chat vs recommendations vs recipes)

* 🍽️ **Flavor Pairing Insights**
  Suggests combinations with drinks, toppings, and occasions

* 🧪 **Experimental Flavor Discovery**
  Goes beyond the database to suggest unique and creative flavor ideas

---

## 🏗️ Tech Stack

* **Frontend:** Next.js (App Router), React, TypeScript
* **Backend:** Next.js API Routes
* **AI Model:** Gemini (Google Generative AI)
* **Styling:** Custom UI (minimal, typography-focused design)

---

## 🧠 How It Works

### 1. User Input

User sends a message (e.g., *“something bold with coffee”*)

---

### 2. Intent Detection

The system determines whether the user wants:

* Conversation
* Recommendations
* Recipes

---

### 3. Flavor Retrieval

A custom search function:

* Parses keywords
* Scores flavors based on relevance
* Returns top matches from the database

---

### 4. Context Injection

Relevant flavors are compressed into a lightweight format and sent to the AI model.

---

### 5. AI Response Generation

The AI:

* Responds conversationally
* Suggests flavors (from DB or creatively)
* Maintains a human-like tone

---

### 6. Response Handling

* Plain text → rendered directly
* Structured responses → used for UI components (cards, recipes)

---

## ⚡ Performance Optimizations

* 🔹 **Minimal Context Injection** (top 3–5 flavors only)
* 🔹 **Short-Term Memory** (last 5–6 messages)
* 🔹 **Compact Prompt Design**
* 🔹 **Conditional Context Loading** (only for recommendations)

---

## 🎨 Design Philosophy

* No clutter, no icons overload
* Bold typography-driven UI
* Slight neon glow aesthetic
* Focus on storytelling through conversation

---

## 🧩 Core Functions

### 🔍 Flavor Search

Finds relevant flavors using keyword matching and scoring.

### 🧾 Context Builder

Converts flavor data into compact strings for efficient AI processing.

### 🧠 Intent Detection

Prevents unnecessary AI load by distinguishing casual chat from recommendation queries.

---

## 🚀 Future Improvements

* 🔄 Streaming responses (real-time typing effect)
* 🧠 Memory system (user preferences over time)
* 🎯 Personalized recommendations
* 🖼️ AI-generated flavor visuals
* 📱 Mobile app version

---

## 📦 Setup

```bash
git clone <repo-url>
cd scoop
npm install
```

Create `.env.local`:

```env
GEMINI_API_KEY=your_api_key_here
```

Run the app:

```bash
npm run dev
```

---

