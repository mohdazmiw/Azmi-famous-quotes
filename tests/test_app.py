import os
import json
import unittest
import sys

# Ensure parent directory is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, DATA_FILE

class TestQuoteApp(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_quotes_dataset_integrity(self):
        """Test quotes.json has exactly 100 valid items with required fields."""
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            quotes = json.load(f)

        self.assertEqual(len(quotes), 100, "Dataset must contain exactly 100 quotes")

        ids = set()
        for idx, item in enumerate(quotes):
            self.assertIn('id', item)
            self.assertIn('quote', item)
            self.assertIn('author', item)
            self.assertIn('category', item)

            self.assertTrue(len(item['quote'].strip()) > 0)
            self.assertTrue(len(item['author'].strip()) > 0)
            self.assertTrue(len(item['category'].strip()) > 0)

            ids.add(item['id'])

        self.assertEqual(len(ids), 100, "All 100 quote IDs must be unique")

    def test_index_route(self):
        """Test GET / returns 200 OK and serves the HTML page."""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'QuoteVault', response.data)

    def test_random_quote(self):
        """Test GET /api/quote/random returns a valid quote."""
        response = self.app.get('/api/quote/random')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)

        self.assertIn('id', data)
        self.assertIn('quote', data)
        self.assertIn('author', data)
        self.assertIn('category', data)

    def test_random_quote_with_category(self):
        """Test GET /api/quote/random?category=Science returns a science quote."""
        response = self.app.get('/api/quote/random?category=Science')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['category'], 'Science')

    def test_random_quote_invalid_category(self):
        """Test GET /api/quote/random?category=NonExistentCategory returns 404."""
        response = self.app.get('/api/quote/random?category=NonExistentCategory')
        self.assertEqual(response.status_code, 404)

    def test_quotes_list_all(self):
        """Test GET /api/quotes returns all 100 quotes by default."""
        response = self.app.get('/api/quotes')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['total'], 100)
        self.assertEqual(len(data['quotes']), 100)

    def test_quotes_filter_by_author(self):
        """Test searching quotes by author name."""
        response = self.app.get('/api/quotes?author=Einstein')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertGreater(data['total'], 0)
        for q in data['quotes']:
            self.assertIn('einstein', q['author'].lower())

    def test_quotes_filter_by_category(self):
        """Test filtering quotes by category."""
        response = self.app.get('/api/quotes?category=Philosophy')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertGreater(data['total'], 0)
        for q in data['quotes']:
            self.assertEqual(q['category'].lower(), 'philosophy')

    def test_quotes_keyword_search(self):
        """Test searching quotes by keyword."""
        response = self.app.get('/api/quotes?q=wisdom')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertGreater(data['total'], 0)
        for q in data['quotes']:
            matched = ('wisdom' in q['quote'].lower()) or ('wisdom' in q['author'].lower())
            self.assertTrue(matched)

    def test_categories_endpoint(self):
        """Test GET /api/categories returns categories and counts summing to 100."""
        response = self.app.get('/api/categories')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)

        self.assertEqual(data['total_quotes'], 100)
        total_counted = sum(c['count'] for c in data['categories'])
        self.assertEqual(total_counted, 100)

    def test_authors_endpoint(self):
        """Test GET /api/authors returns a list of unique authors."""
        response = self.app.get('/api/authors')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('authors', data)
        self.assertGreater(len(data['authors']), 10)
        # Check sorted
        self.assertEqual(data['authors'], sorted(data['authors']))

if __name__ == '__main__':
    unittest.main()
