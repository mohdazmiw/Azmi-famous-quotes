import os
import json
import random
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# Load quotes from JSON file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'quotes.json')

def load_quotes():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

QUOTES = load_quotes()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/quote/random', methods=['GET'])
def get_random_quote():
    category = request.args.get('category', '').strip()
    quotes_pool = QUOTES
    if category and category.lower() != 'all':
        quotes_pool = [q for q in QUOTES if q.get('category', '').lower() == category.lower()]
    
    if not quotes_pool:
        return jsonify({'error': 'No quotes found for the specified category'}), 404
        
    quote = random.choice(quotes_pool)
    return jsonify(quote)

@app.route('/api/quotes', methods=['GET'])
def get_quotes():
    author_filter = request.args.get('author', '').strip().lower()
    category_filter = request.args.get('category', '').strip().lower()
    query = request.args.get('q', '').strip().lower()

    filtered = QUOTES

    if category_filter and category_filter != 'all':
        filtered = [q for q in filtered if q.get('category', '').lower() == category_filter]

    if author_filter:
        filtered = [q for q in filtered if author_filter in q.get('author', '').lower()]

    if query:
        filtered = [
            q for q in filtered
            if query in q.get('quote', '').lower() or query in q.get('author', '').lower()
        ]

    return jsonify({
        'total': len(filtered),
        'quotes': filtered
    })

@app.route('/api/categories', methods=['GET'])
def get_categories():
    counts = {}
    for q in QUOTES:
        cat = q.get('category', 'Uncategorized')
        counts[cat] = counts.get(cat, 0) + 1
    
    sorted_categories = sorted([{'name': k, 'count': v} for k, v in counts.items()], key=lambda x: x['name'])
    return jsonify({
        'total_quotes': len(QUOTES),
        'categories': sorted_categories
    })

@app.route('/api/authors', methods=['GET'])
def get_authors():
    authors = sorted(list(set(q.get('author', '') for q in QUOTES if q.get('author'))))
    return jsonify({'authors': authors})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
