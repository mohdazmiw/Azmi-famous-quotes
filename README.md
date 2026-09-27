# QuoteVault 📜

A modern, responsive web application built with **Python Flask**, **Vanilla JavaScript (ES6+)**, and **Semantic HTML5/CSS** to display, search, and explore 100 of history's most famous and inspiring quotes.

---

## Features

- **🎲 Random Quote Generator:** Generates a random quote on click with smooth fade animation. Supports category-specific random quotes.
- **🔍 Author Search:** Live, debounced search by author name with autocomplete datalist suggestions.
- **🏷️ Category Filtering:** Filter quotes across 6 categories with live count badges:
  - *Philosophy*
  - *Science*
  - *Literature*
  - *Inspiration*
  - *Humor*
  - *Leadership*
- **💬 Keyword Search:** Search through quote text and authors simultaneously.
- **📋 Copy to Clipboard:** One-click copy for any quote with an animated toast notification.
- **𝕏 Share on Twitter/X:** Directly open tweet composer with pre-filled quote and author.
- **📱 Fully Responsive Design:** Modern dark-themed layout with glassmorphism cards and mobile-friendly controls.

---

## Project Structure

```text
quotes-flask-app/
├── data/
│   └── quotes.json            # 100 curated quotes with id, author, category
├── static/
│   ├── css/
│   │   └── style.css          # Modern CSS styling with variables & animations
│   └── js/
│       └── app.js             # Pure vanilla JavaScript frontend logic
├── templates/
│   └── index.html             # Semantic HTML5 template
├── tests/
│   └── test_app.py            # Unit test suite (11 test cases)
├── app.py                     # Flask server and REST API endpoints
├── requirements.txt           # Python dependencies (Flask)
└── README.md
```

---

## Getting Started

### 1. Activate the Virtual Environment

**Windows PowerShell:**
```powershell
cd C:\Users\mohda\AppData\Local\agy\bin\quotes-flask-app
.\.venv\Scripts\Activate.ps1
```

### 2. Run the Flask Server

```powershell
.\.venv\Scripts\python app.py
```

### 3. Open in Browser

Open your browser and navigate to:
**[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## Running Automated Tests

Run the test suite to verify data integrity and API endpoints:

```powershell
.\.venv\Scripts\python -m unittest discover -s tests -v
```
