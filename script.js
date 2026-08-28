const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const gamesContainer = document.getElementById('gamesContainer');

// Fetch trending deals on page load
window.addEventListener('DOMContentLoaded', () => {
    fetchDeals('');
});

searchBtn.addEventListener('click', () => {
    fetchDeals(searchInput.value.trim());
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchDeals(searchInput.value.trim());
    }
});

async function fetchDeals(query) {
    gamesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #fff;">Searching for game deals...</p>';

    let url = 'https://www.cheapshark.com/api/1.0/deals?sortBy=Savings&pageSize=12';
    if (query) {
        url = `https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(query)}&pageSize=12`;
    }

    try {
        const response = await fetch(url);
        const deals = await response.json();
        displayDeals(deals);
    } catch (error) {
        gamesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ef4444;">Failed to load deals. Please check your connection.</p>';
    }
}

function displayDeals(deals) {
    gamesContainer.innerHTML = '';

    if (!deals || deals.length === 0) {
        gamesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #fff;">No game deals found.</p>';
        return;
    }

    deals.forEach(deal => {
        const card = document.createElement('div');
        card.className = 'game-card';

        const normalPrice = parseFloat(deal.normalPrice).toFixed(2);
        const salePrice = parseFloat(deal.salePrice).toFixed(2);

        card.innerHTML = `
            <img src="${deal.thumb}" alt="${deal.title}" onerror="this.src='https://via.placeholder.com/200x110?text=Game'">
            <div class="game-info">
                <div>
                    <h3 class="game-title" title="${deal.title}">${deal.title}</h3>
                    <div class="game-price-row">
                        <span class="normal-price">$${normalPrice}</span>
                        <span class="sale-price">$${salePrice}</span>
                    </div>
                </div>
                <a href="https://www.cheapshark.com/redirect?dealID=${deal.dealID}" target="_blank" class="get-deal-btn">Get Deal</a>
            </div>
        `;

        gamesContainer.appendChild(card);
    });
}