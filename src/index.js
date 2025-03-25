document.addEventListener('DOMContentLoaded', () => {
    const quotesList = document.getElementById('quotes-list');
    const newQuoteForm = document.getElementById('new-quote-form');
    const sortToggle = document.getElementById('sort-toggle');
    let isSorted = false;

    // Fetch and display quotes
    function fetchQuotes() {
        fetch('http://localhost:3000/quotes?_embed=likes')
            .then(response => response.json())
            .then(quotes => {
                // Sort quotes if toggle is on
                if (isSorted) {
                    quotes.sort((a, b) => a.author.localeCompare(b.author));
                }

                quotesList.innerHTML = ''; // Clear existing quotes
                quotes.forEach(renderQuote);
            });
    }

    // Render individual quote
    function renderQuote(quote) {
        const totalLikes = quote.likes.length;
        const li = document.createElement('li');
        li.className = 'quote-card mb-3';
        li.innerHTML = `
            <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn btn-success like-btn' data-id="${quote.id}">
                    Likes: <span>${totalLikes}</span>
                </button>
                <button class='btn btn-danger delete-btn' data-id="${quote.id}">Delete</button>
            </blockquote>
        `;

        // Like button event
        li.querySelector('.like-btn').addEventListener('click', () => {
            fetch('http://localhost:3000/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quoteId: quote.id,
                    createdAt: Math.floor(Date.now() / 1000)
                })
            }).then(() => fetchQuotes());
        });

        // Delete button event
        li.querySelector('.delete-btn').addEventListener('click', () => {
            fetch(`http://localhost:3000/quotes/${quote.id}`, {
                method: 'DELETE'
            }).then(() => fetchQuotes());
        });

        quotesList.appendChild(li);
    }

    // Add new quote
    newQuoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const quoteInput = document.getElementById('quote-input');
        const authorInput = document.getElementById('author-input');

        fetch('http://localhost:3000/quotes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quote: quoteInput.value,
                author: authorInput.value
            })
        }).then(() => {
            quoteInput.value = '';
            authorInput.value = '';
            fetchQuotes();
        });
    });

    // Sort toggle
    sortToggle.addEventListener('click', () => {
        isSorted = !isSorted;
        sortToggle.textContent = isSorted 
            ? 'Unsort Quotes' 
            : 'Sort by Author';
        fetchQuotes();
    });

    // Initial fetch
    fetchQuotes();
});