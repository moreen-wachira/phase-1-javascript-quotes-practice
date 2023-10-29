document.addEventListener('DOMContentLoaded', () => {
    const quoteForm = document.getElementById('new-quote-form');
    const quoteList = document.getElementById('quote-list');
    
    // Fetch quotes from the API and display them
    function fetchQuotes() {
        fetch('http://localhost:3000/quotes?_embed=likes')
            .then(response => response.json())
            .then(quotes => {
                quoteList.innerHTML = ''; // Clear the list
                quotes.forEach(quote => displayQuote(quote));
            });
    }

    // Display a single quote
    function displayQuote(quote) {
        const li = document.createElement('li');
        li.classList.add('quote-card');

        const blockquote = document.createElement('blockquote');
        blockquote.classList.add('blockquote');

        const p = document.createElement('p');
        p.classList.add('mb-0');
        p.innerText = quote.quote;

        const footer = document.createElement('footer');
        footer.classList.add('blockquote-footer');
        footer.innerText = quote.author;

        const br = document.createElement('br');

        const likeButton = document.createElement('button');
        likeButton.classList.add('btn-success');
        likeButton.innerText = `Likes: ${quote.likes.length}`;
        likeButton.addEventListener('click', () => likeQuote(quote));

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn-danger');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', () => deleteQuote(quote));

        blockquote.appendChild(p);
        blockquote.appendChild(footer);
        blockquote.appendChild(br);
        blockquote.appendChild(likeButton);
        blockquote.appendChild(deleteButton);

        li.appendChild(blockquote);
        quoteList.appendChild(li);
    }

    // Handle quote liking
    function likeQuote(quote) {
        // Create a new like for the quote
        const newLike = {
            quoteId: quote.id
        };

        fetch('http://localhost:3000/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newLike)
        })
        .then(response => response.json())
        .then(like => {
            // Update the quote's like count and display it
            quote.likes.push(like);
            fetchQuotes(); // Refresh the list to display the updated like count
        });
    }

    // Handle quote deletion
    function deleteQuote(quote) {
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
            method: 'DELETE'
        })
        .then(() => {
            fetchQuotes(); // Refresh the list to remove the deleted quote
        });
    }

    // Handle form submission
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const quote = document.getElementById('quote').value;
        const author = document.getElementById('author').value;

        // Create a new quote and add it to the API
        const newQuote = {
            quote,
            author
        };

        fetch('http://localhost:3000/quotes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newQuote)
        })
        .then(response => response.json())
        .then(() => {
            fetchQuotes(); // Refresh the list to add the new quote
            // Clear the form fields
            document.getElementById('quote').value = '';
            document.getElementById('author').value = '';
        });
    });

    // Fetch and display quotes when the page loads
    fetchQuotes();
});