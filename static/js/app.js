/**
 * QuoteVault — Vanilla JavaScript Application
 */

(function () {
  'use strict';

  // State
  let state = {
    currentHeroQuote: null,
    activeCategory: 'all',
    authorQuery: '',
    keywordQuery: '',
    categories: [],
    authors: []
  };

  // DOM Elements
  const heroCard = document.getElementById('hero-quote-card');
  const heroText = document.getElementById('hero-quote-text');
  const heroAuthor = document.getElementById('hero-quote-author');
  const heroCategory = document.getElementById('hero-category');
  const heroQuoteId = document.getElementById('hero-quote-id');
  const btnNextQuote = document.getElementById('btn-next-quote');
  const btnCopyQuote = document.getElementById('btn-copy-quote');
  const btnShareQuote = document.getElementById('btn-share-quote');
  const btnExportCsv = document.getElementById('btn-export-csv');

  const categoryPillsContainer = document.getElementById('category-pills');
  const authorInput = document.getElementById('author-search');
  const keywordInput = document.getElementById('keyword-search');
  const clearAuthorBtn = document.getElementById('clear-author');
  const clearKeywordBtn = document.getElementById('clear-keyword');
  const authorsDatalist = document.getElementById('authors-datalist');

  const quotesGrid = document.getElementById('quotes-grid');
  const resultsCount = document.getElementById('results-count');
  const gridTitle = document.getElementById('grid-title');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  const emptyState = document.getElementById('empty-state');
  const emptyResetBtn = document.getElementById('empty-reset-btn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const themeToggleBtn = document.getElementById('theme-toggle');

  let toastTimeout = null;
  let debounceTimeout = null;

  // ==========================================
  // Initialization
  // ==========================================
  async function init() {
    initTheme();
    setupEventListeners();
    await Promise.all([
      loadCategories(),
      loadAuthors(),
      fetchRandomQuote(),
      searchQuotes()
    ]);
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('quotevault-theme');
    if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  function toggleTheme() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('quotevault-theme', 'dark');
      showToast('Switched to Dark mode');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('quotevault-theme', 'light');
      showToast('Switched to Light mode');
    }
  }

  // ==========================================
  // Event Listeners
  // ==========================================
  function setupEventListeners() {
    // Theme Switch
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }
    // Next Random Quote
    btnNextQuote.addEventListener('click', () => {
      fetchRandomQuote();
    });

    // Copy Hero Quote
    btnCopyQuote.addEventListener('click', () => {
      if (state.currentHeroQuote) {
        copyQuoteToClipboard(state.currentHeroQuote, btnCopyQuote);
      }
    });

    // Export to CSV
    if (btnExportCsv) {
      btnExportCsv.addEventListener('click', () => {
        const params = new URLSearchParams();
        if (state.activeCategory && state.activeCategory !== 'all') {
          params.append('category', state.activeCategory);
        }
        if (state.authorQuery) {
          params.append('author', state.authorQuery);
        }
        if (state.keywordQuery) {
          params.append('q', state.keywordQuery);
        }
        window.location.href = `/api/export/csv?${params.toString()}`;
        showToast('Exporting quotes to CSV...');
      });
    }

    // Author Search Input with Debounce
    authorInput.addEventListener('input', (e) => {
      state.authorQuery = e.target.value.trim();
      clearAuthorBtn.style.display = state.authorQuery ? 'block' : 'none';
      debounceSearch();
    });

    clearAuthorBtn.addEventListener('click', () => {
      authorInput.value = '';
      state.authorQuery = '';
      clearAuthorBtn.style.display = 'none';
      searchQuotes();
    });

    // Keyword Search Input with Debounce
    keywordInput.addEventListener('input', (e) => {
      state.keywordQuery = e.target.value.trim();
      clearKeywordBtn.style.display = state.keywordQuery ? 'block' : 'none';
      debounceSearch();
    });

    clearKeywordBtn.addEventListener('click', () => {
      keywordInput.value = '';
      state.keywordQuery = '';
      clearKeywordBtn.style.display = 'none';
      searchQuotes();
    });

    // Reset Filters Buttons
    resetFiltersBtn.addEventListener('click', resetFilters);
    emptyResetBtn.addEventListener('click', resetFilters);
  }

  function debounceSearch() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      searchQuotes();
    }, 250);
  }

  function resetFilters() {
    state.activeCategory = 'all';
    state.authorQuery = '';
    state.keywordQuery = '';

    authorInput.value = '';
    keywordInput.value = '';
    clearAuthorBtn.style.display = 'none';
    clearKeywordBtn.style.display = 'none';

    updateActiveCategoryPill();
    searchQuotes();
  }

  // ==========================================
  // API Fetch Functions
  // ==========================================

  // 1. Fetch Random Quote
  async function fetchRandomQuote() {
    try {
      btnNextQuote.disabled = true;
      heroText.classList.add('fade-out');

      let url = '/api/quote/random';
      if (state.activeCategory && state.activeCategory !== 'all') {
        url += `?category=${encodeURIComponent(state.activeCategory)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch quote');
      const quote = await res.json();

      setTimeout(() => {
        renderHeroQuote(quote);
        heroText.classList.remove('fade-out');
        btnNextQuote.disabled = false;
      }, 150);
    } catch (err) {
      console.error('Error fetching random quote:', err);
      btnNextQuote.disabled = false;
      heroText.classList.remove('fade-out');
    }
  }

  // 2. Load Categories
  async function loadCategories() {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) return;
      const data = await res.json();
      state.categories = data.categories || [];
      renderCategoryPills(state.categories, data.total_quotes);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  }

  // 3. Load Authors (for autocomplete suggestions)
  async function loadAuthors() {
    try {
      const res = await fetch('/api/authors');
      if (!res.ok) return;
      const data = await res.json();
      state.authors = data.authors || [];

      authorsDatalist.innerHTML = state.authors
        .map(author => `<option value="${escapeHtml(author)}">`)
        .join('');
    } catch (err) {
      console.error('Error loading authors:', err);
    }
  }

  // 4. Search Quotes
  async function searchQuotes() {
    try {
      const params = new URLSearchParams();
      if (state.activeCategory && state.activeCategory !== 'all') {
        params.append('category', state.activeCategory);
      }
      if (state.authorQuery) {
        params.append('author', state.authorQuery);
      }
      if (state.keywordQuery) {
        params.append('q', state.keywordQuery);
      }

      const res = await fetch(`/api/quotes?${params.toString()}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();

      renderQuotesGrid(data.quotes || []);
      updateResultsHeader(data.total);
    } catch (err) {
      console.error('Error searching quotes:', err);
    }
  }

  // ==========================================
  // Render Functions
  // ==========================================

  function renderHeroQuote(quote) {
    state.currentHeroQuote = quote;
    heroText.textContent = `"${quote.quote}"`;
    heroAuthor.textContent = `— ${quote.author}`;
    heroCategory.textContent = quote.category;
    heroQuoteId.textContent = `Quote #${quote.id}`;

    // Apply category color attribute
    heroCategory.setAttribute('data-category', quote.category.toLowerCase());

    // Update X/Twitter share URL
    const tweetText = `"${quote.quote}" — ${quote.author}`;
    btnShareQuote.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  }

  function renderCategoryPills(categories, totalQuotes) {
    let html = `
      <button class="pill ${state.activeCategory === 'all' ? 'active' : ''}" data-category="all">
        All <span class="pill-count">${totalQuotes}</span>
      </button>
    `;

    categories.forEach(cat => {
      const isActive = state.activeCategory.toLowerCase() === cat.name.toLowerCase();
      html += `
        <button class="pill ${isActive ? 'active' : ''}" data-category="${escapeHtml(cat.name)}">
          ${escapeHtml(cat.name)} <span class="pill-count">${cat.count}</span>
        </button>
      `;
    });

    categoryPillsContainer.innerHTML = html;

    // Attach click events
    categoryPillsContainer.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const cat = pill.getAttribute('data-category');
        state.activeCategory = cat;
        updateActiveCategoryPill();
        searchQuotes();
        // Also fetch a random quote from this category for the hero
        fetchRandomQuote();
      });
    });
  }

  function updateActiveCategoryPill() {
    categoryPillsContainer.querySelectorAll('.pill').forEach(pill => {
      const cat = pill.getAttribute('data-category').toLowerCase();
      if (cat === state.activeCategory.toLowerCase()) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  function renderQuotesGrid(quotes) {
    if (!quotes || quotes.length === 0) {
      quotesGrid.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    quotesGrid.innerHTML = quotes.map(quote => `
      <article class="quote-grid-card" data-id="${quote.id}">
        <div class="card-content">
          <p class="grid-card-quote">"${escapeHtml(quote.quote)}"</p>
          <span class="grid-card-author">— ${escapeHtml(quote.author)}</span>
        </div>
        <div class="card-footer">
          <span class="category-badge" data-category="${quote.category.toLowerCase()}">${escapeHtml(quote.category)}</span>
          <button class="btn-card-copy" data-id="${quote.id}" title="Copy quote">
            📋 Copy
          </button>
        </div>
      </article>
    `).join('');

    // Event listeners on cards: click to view in Hero
    quotesGrid.querySelectorAll('.quote-grid-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // If copy button was clicked, don't re-select
        if (e.target.closest('.btn-card-copy')) return;

        const id = parseInt(card.getAttribute('data-id'), 10);
        const selected = quotes.find(q => q.id === id);
        if (selected) {
          renderHeroQuote(selected);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    // Copy buttons inside cards
    quotesGrid.querySelectorAll('.btn-card-copy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        const selected = quotes.find(q => q.id === id);
        if (selected) {
          copyQuoteToClipboard(selected, btn);
        }
      });
    });
  }

  function updateResultsHeader(total) {
    const isFiltered = (state.activeCategory !== 'all') || state.authorQuery || state.keywordQuery;

    resultsCount.textContent = `${total} ${total === 1 ? 'quote' : 'quotes'} found`;
    resetFiltersBtn.style.display = isFiltered ? 'inline-block' : 'none';

    let titleParts = [];
    if (state.activeCategory && state.activeCategory !== 'all') {
      titleParts.push(state.activeCategory);
    }
    if (state.authorQuery) {
      titleParts.push(`by "${state.authorQuery}"`);
    }
    if (state.keywordQuery) {
      titleParts.push(`containing "${state.keywordQuery}"`);
    }

    if (titleParts.length > 0) {
      gridTitle.textContent = `Quotes in ${titleParts.join(' ')}`;
    } else {
      gridTitle.textContent = 'All 100 Quotes';
    }
  }

  // ==========================================
  // Utilities
  // ==========================================

  function copyQuoteToClipboard(quote, btnEl) {
    const textToCopy = `"${quote.quote}" — ${quote.author}`;
    const handleSuccess = () => {
      showToast('Quote copied to clipboard!');
      if (btnEl) {
        const originalHtml = btnEl.innerHTML;
        btnEl.innerHTML = '✓ Copied!';
        btnEl.classList.add('copied');
        setTimeout(() => {
          btnEl.innerHTML = originalHtml;
          btnEl.classList.remove('copied');
        }, 1800);
      }
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy)
        .then(handleSuccess)
        .catch(() => fallbackCopy(textToCopy, btnEl));
    } else {
      fallbackCopy(textToCopy, btnEl);
    }
  }

  function fallbackCopy(text, btnEl) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('Quote copied to clipboard!');
      if (btnEl) {
        const originalHtml = btnEl.innerHTML;
        btnEl.innerHTML = '✓ Copied!';
        btnEl.classList.add('copied');
        setTimeout(() => {
          btnEl.innerHTML = originalHtml;
          btnEl.classList.remove('copied');
        }, 1800);
      }
    } catch (err) {
      showToast('Failed to copy quote');
    }
    document.body.removeChild(textArea);
  }

  function showToast(msg) {
    toastMessage.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
