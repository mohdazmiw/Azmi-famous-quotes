# Azmi's Famous Quotes (QuoteVault) 📜

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/)
[![Flask 3.0+](https://img.shields.io/badge/flask-3.1.3-green.svg)](https://flask.palletsprojects.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests: 11 Passed](https://img.shields.io/badge/tests-11%20passed-brightgreen.svg)]()

A fast, lightweight, and responsive web application built with **Python Flask**, **Vanilla JavaScript (ES6+)**, and **Semantic HTML5 / CSS3**. It allows users to discover, search, and explore a curated collection of 100 timeless quotes from history's most notable philosophers, scientists, authors, and leaders.

---

## 🌟 Key Features

- **🎲 Random Quote Generator:** Generates a random quote with smooth fade animations. Supports scoping random quotes to the active category.
- **🔍 Real-Time Author Search:** Debounced (250ms) search input with `<datalist>` autocomplete suggestions.
- **🏷️ Category Filtering:** Explore quotes filtered by 6 primary categories with live count badges:
  - 🏛️ *Philosophy* (Socrates, Aristotle, Marcus Aurelius, Nietzsche, Plato, Confucius...)
  - 🔬 *Science* (Albert Einstein, Marie Curie, Alan Turing, Richard Feynman, Isaac Newton...)
  - 📚 *Literature* (William Shakespeare, Oscar Wilde, Maya Angelou, Mark Twain, Hemingway...)
  - 💡 *Inspiration* (Mahatma Gandhi, Martin Luther King Jr., Eleanor Roosevelt, Helen Keller...)
  - 😄 *Humor* (Mark Twain, Oscar Wilde, Groucho Marx...)
  - 👑 *Leadership* (Steve Jobs, Winston Churchill, Nelson Mandela, Theodore Roosevelt, Sun Tzu...)
- **💬 Keyword Search:** Search through quote text and authors simultaneously.
- **📋 One-Click Copy:** Modern Clipboard API integration with an animated toast confirmation.
- **𝕏 Share on Twitter/X:** Direct link with pre-composed quote and author text.
- **📱 Responsive Glassmorphic UI:** Modern dark mode design system, mobile-friendly controls, and zero external frontend dependencies.

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Backend** | Python 3, Flask 3.1 | REST API endpoints, routing, and in-memory JSON data caching |
| **Frontend** | Vanilla JavaScript (ES6+) | Native `fetch` API, DOM manipulation, debouncing, zero build steps |
| **Styling** | Semantic HTML5 & CSS3 | Custom CSS properties, CSS Grid, Flexbox, glassmorphic styling |
| **Database** | JSON (`quotes.json`) | Curated dataset of 100 structured quotes with IDs, authors, and categories |
| **Testing** | `unittest` | 11 automated unit test cases for API routes and data schema integrity |

---

## 📂 Project Structure

```text
Azmi-famous-quotes/
├── data/
│   └── quotes.json            # 100 curated quotes (id, quote, author, category)
├── static/
│   ├── css/
│   │   └── style.css          # Design system, CSS variables & animations
│   └── js/
│       └── app.js             # Vanilla JS: state, API calls, event handlers
├── templates/
│   └── index.html             # Semantic HTML5 single-page layout
├── tests/
│   └── test_app.py            # Unit test suite covering all endpoints
├── .gitignore                 # Excludes venv, pycache, OS files, and env vars
├── app.py                     # Flask server and REST API routes
├── requirements.txt           # Python package dependencies
└── README.md                  # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+** installed
- **Git** installed

### 1. Clone the Repository
```bash
git clone https://github.com/mohdazmiw/Azmi-famous-quotes.git
cd Azmi-famous-quotes
```

### 2. Set Up Virtual Environment

**On Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**On macOS / Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Application
```bash
python app.py
```

Open your browser and navigate to:
👉 **`http://127.0.0.1:5000`**

---

## 📡 REST API Reference

The backend provides a clean RESTful API:

### 1. Get Random Quote
```http
GET /api/quote/random
GET /api/quote/random?category=Science
```
**Sample Response:**
```json
{
  "id": 2,
  "quote": "Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world.",
  "author": "Albert Einstein",
  "category": "Science"
}
```

### 2. Search & Filter Quotes
```http
GET /api/quotes?author=Einstein
GET /api/quotes?category=Philosophy
GET /api/quotes?q=wisdom
```
**Sample Response:**
```json
{
  "total": 6,
  "quotes": [
    {
      "id": 2,
      "quote": "Imagination is more important than knowledge...",
      "author": "Albert Einstein",
      "category": "Science"
    }
  ]
}
```

### 3. Get Category Counts
```http
GET /api/categories
```
**Sample Response:**
```json
{
  "total_quotes": 100,
  "categories": [
    { "name": "Humor", "count": 6 },
    { "name": "Inspiration", "count": 21 },
    { "name": "Leadership", "count": 13 },
    { "name": "Literature", "count": 15 },
    { "name": "Philosophy", "count": 23 },
    { "name": "Science", "count": 22 }
  ]
}
```

### 4. Get List of Authors
```http
GET /api/authors
```
**Sample Response:**
```json
{
  "authors": [
    "Agatha Christie",
    "Alan Turing",
    "Albert Einstein",
    "Aristotle",
    ...
  ]
}
```

---

## 🧪 Running Automated Tests

Run the built-in test suite to verify data integrity and API routes:

```bash
# Windows
.\.venv\Scripts\python -m unittest discover -s tests -v

# macOS / Linux
python -m unittest discover -s tests -v
```

---

## 📜 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
