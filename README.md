[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=21831960)
# Assignment 5: Flashcards Trainer Backend API

## Overview

In this assignment, you will build a **Node.js + Express backend** with **MongoDB persistence** for your **Flashcards Trainer** mobile app from Assignment 4.

Your backend will expose a **RESTful JSON API** that:

- Stores decks and cards in MongoDB (instead of in-memory React Context only)
- Supports basic **CRUD operations** for decks and cards
- Allows marking cards as **favorites** so the Study tab can load them
- Can be consumed by your existing React Native app using `fetch` and a configurable `BASE_URL`

---

## Learning Objectives

By completing this assignment, you will be able to:

- Design a **RESTful API** for a real app feature set (Flashcards decks & cards)
- Implement routes in **Express.js** using appropriate HTTP methods
- Use **MongoDB + Mongoose** for persistent storage of application data
- Organize a backend into:
  - `index.js` (server setup)
  - `routes/` (route definitions)
  - `controllers/` (handler logic)
  - `models/` (Mongoose models)
- Enable **CORS** so your React Native app can communicate with the backend
- Connect your Assignment 4 app to this backend using `fetch` and a `BASE_URL` configuration

---

## Project & Folder Structure

Start from your Assignment 5 GitHub Classroom repository.

A **typical** structure (you may adapt slightly, but keep it clear and consistent):

```bash
assignment05-<GitHubUserName>/
├─ project/
│  ├─ FlashcardsTrainer/          # ← Your Assignment 4 RN app (copied)
│  └─ FlashcardsBackend/         # ← NEW: Backend project for Assignment 5
│      ├─ index.js
│      ├─ routes/
│      │   ├─ decksRoutes.js
│      │   └─ cardsRoutes.js
│      ├─ controllers/
│      │   ├─ decksController.js
│      │   └─ cardsController.js
│      ├─ models/
│      │   ├─ Deck.js
│      │   └─ Card.js
│      ├─ .env
│      ├─ package.json
│      └─ ...
├─ scripts/
├─ prompts.md
├─ video.md
├─ README.md
└─ ...
```

**Requirements:**

- Your backend must live inside `project/FlashcardsBackend`.
- Use a modular structure: separate files for models, routes, and controllers.

---

## Backend Functional Requirements

### 1. Data Model (MongoDB + Mongoose)

Define two Mongoose models: `Deck` and `Card`.

#### `Deck` Model

- `title: string` (required)
- `createdAt: Date` (default: now)

#### `Card` Model

- `deckId: ObjectId` (reference to `Deck`, required)
- `question: string` (required)
- `answer: string` (required)
- `isFavorite: boolean` (default: `false`)
- `createdAt: Date` (default: now)

Use:

- `mongoose.Schema`
- `mongoose.model`
- `mongoose.connect`
- Async/await for DB operations

---

### 2. Server Setup

Inside `project/Flashcards-Backend`:

1. Initialize a Node.js project:

   ```bash
   npm init -y
   ```

2. Install required dependencies:

   ```bash
   npm install express mongoose cors dotenv
   ```

   (You may also install `nodemon` as a dev dependency if you wish.)

3. Create a `.env` file:

   ```env
   MONGO_URI=your-mongodb-connection-string
   PORT=3000
   ```

---

### 3. REST API Endpoints

Your API must support the following endpoints.

#### Decks

**Base path:** `/api/decks`

1. `GET /api/decks`
   - Returns an array of all decks.

2. `POST /api/decks`
   - Creates a new deck.

3. `GET /api/decks/:deckId`
   - Returns the deck with the given ID.

4. `DELETE /api/decks/:deckId`
   - Deletes the deck.
   - Also deletes **all cards** belonging to this deck.

#### Cards

Support both deck-based and card-based operations.

1. `GET /api/decks/:deckId/cards`
   - Returns all cards for the specified deck.

2. `POST /api/decks/:deckId/cards`
   - Creates a new card in the given deck.

3. `PUT /api/cards/:cardId`
   - Updates a card’s `question` and/or `answer`.

4. `DELETE /api/cards/:cardId`
   - Deletes the specified card.

---

### 4. Favorites (Study Tab Support)

Provide endpoints to support the Study tab in your RN app.

1. `PATCH /api/cards/:cardId/favorite`
   - favorites/unfavorites card and returns the updated card.
   - If card not found:
     - `404 Not Found`.

2. `GET /api/cards/favorites`
   - Returns all cards where `isFavorite === true`.

---

## 5. Integration with FlashcardsTrainer App (Assignment 4)

Update your Assignment 4 React Native app so it uses this backend instead of only in-memory context.

Minimum requirements:

### 5.1 Base URL Configuration

In your RN app (inside `FlashcardsTrainer`):

1. Create a `.env` file (or similar) to store your API URL:

   ```env
   EXPO_PUBLIC_API_URL=http://<your-ip-or-host>:3000
   ```

2. Create a small config module, e.g. `src/config.ts`:

   ```ts
   import { Platform } from "react-native";

   const LOCALHOST =
     Platform.OS === "android"
       ? "http://10.0.2.2:3000"
       : "http://localhost:3000";

   export const BASE_URL =
     process.env.EXPO_PUBLIC_API_URL ?? LOCALHOST;
   ```

Use `BASE_URL` everywhere you call the backend.

### 5.2 Decks Screen

- On mount, fetch decks from:
  - `GET /api/decks`
- Display them as before.
- Apply the search bar filter client-side to the fetched decks.

### 5.3 Create Deck Modal

- On submit:
  - Call `POST /api/decks`
- If successful:
  - Close the modal and refresh the deck list (or update state directly).

### 5.4 Deck Detail Screen

- On mount:
  - Fetch cards from `GET /api/decks/:deckId/cards`
- “+” Floating Action Button:
  - Calls `POST /api/decks/:deckId/cards` to add a new card.
- Use the response to update the UI.

### 5.5 Favorites & Study Tab

- When a user favorites/unfavorites a card:
  - Call `PATCH /api/cards/:cardId/favorite`.
- In the Study tab:
  - Load favorite cards using `GET /api/cards/favorites`.

---

## Setup & Run

### Backend

```bash
cd project/FlashcardsBackend
npm install
node index.js
# or if you set up nodemon:
# npx nodemon index.js
```

### Frontend

```bash
cd project/FlashcardsTrainer
npx expo start --tunnel
```

Ensure your `BASE_URL` (or `EXPO_PUBLIC_API_URL`) correctly points to the backend server.

---

## Grading Rubric (100 points total)

| Category                 | Description                                                                                 | Points |
|--------------------------|---------------------------------------------------------------------------------------------|--------|
| **Architecture**         | Proper use of `index.js`, `routes/`, `controllers/`, `models/`                             | 20     |
| **RESTful API Design**   | Correct endpoints, HTTP methods, params, and status codes                                   | 20     |
| **MongoDB Persistence**  | Uses Mongoose models and async/await; data stored and retrieved correctly                  | 20     |
| **Integration**          | RN app successfully loads/saves decks, cards, and favorites via the backend                | 20     |
| **Code Quality**         | Clear structure, readable code, comments where helpful, minimal and relevant dependencies   | 10     |
| **Error Handling**       | Handles basic errors (missing fields, invalid IDs, not found) with appropriate responses   | 10     |

Total: **100 points**

---
<!-- BEGIN GENERAL INSTRUCTIONS -->
### 💡 Reminder: 

- A short **walkthrough video** (2-min max) demonstrating your application is required. Refer to the [`video.md`](/video.md) for complete details.

---

## ✅ Responsible Use of AI Tools

You are encouraged to use AI tools (such as Gemini, GitHub Copilot, and ChatGPT) to assist your learning, debug code, and explore best practices. However, AI should be used as a **guide**, not as an **author**. Your final code, explanations, and design decisions must reflect **your own understanding**.

You must:

1. **Do not submit AI-generated code without review.** Each assignment includes a quiz to assess your understanding.
2. **Do not use LLMs to answer conceptual or reflective questions.**
3. **Log all major prompts** in [`prompts.md`](prompts.md). This will be **graded** as part of your submission.
4. **Understand your code** before submitting. If you can't explain it, **don't submit it**.

---

## 🤔 Feeling Stuck?

Here’s what to do:

1. Review the assignment instructions and example materials posted on Moodle.
2. Post conceptual questions on the **“Ask the Class” forum** on Moodle. Do **not** post code publicly.
3. Search online for error messages or docs related to the assigment.
4. Attend office hours for help.

---

## ✅ Submission Instructions

Assignments are submitted via GitHub.
Submitting to GitHub simply means pushing your changes to your repository before the deadline. You may push changes multiple times before the deadline; the latest valid push will be graded.

From your Codespace terminal, run:
   ```bash
   ./scripts/submit.sh
   ```
This will commit and push your changes. Contact staff if this fails.

---

## 💻 Working on Assignments

Each assignment starts from the link posted on Moodle:

1. Click the assignment link.
2. Click **“Accept this assignment”**.
3. Click **“Open in Codespaces”** to launch your dev environment.

You’ll be taken to a fully configured cloud-based VSCode editor. No setup is needed, just log in and start coding. You do need an active internet connection.

---

Good luck and enjoy building your apps!

— Prof. Hadi Mohammadi  
hadi@brandeis.edu

<!-- END GENERAL INSTRUCTIONS -->



















