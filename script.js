const API_URL = 'https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=50';
let allDeals = [];

// Exact keywords to prioritize your favorite games at the top
const PRIORITY_KEYWORDS = [
    'the last of us',
    'gta v',
    'grand theft auto',
    'need for speed',
    'nfs',
    'tomb raider',
    'carx',
    'euro truck simulator',
    'ets 2',
    'crew motorfest',
    'forza horizon',
    'call of duty'
];

const gamesContainer = document.getElementById('gamesContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterChips = document.querySelectorAll('.chip');

async function fetchDeals() {
    try {
        gamesContainer.innerHTML = '<p style="text-align: center; color: #94a3b8; grid-column: 1 / -1;">Loading amazing deals...</p>';
        const response = await fetch(API_URL);
        allDeals = await response.json();
        
        // Sort deals so your favorite games appear first
        const sortedDeals = sortDealsByPriority(allDeals);
        displayDeals(sortedDeals);
    } catch (error) {
        gamesContainer.innerHTML = '<p style="text-align: center; color: #ef4444; grid-column: 1 / -1;">Failed to load deals. Please try again later.</p>';
        console.error('Error fetching deals:', error);
    }
}

function sortDealsByPriority(deals) {
    let priorityDeals = [];
    let otherDeals = [];

    deals.forEach(deal => {
        const titleLower = deal.title.toLowerCase();
        const isPriority = PRIORITY_KEYWORDS.some(keyword => titleLower.includes(keyword));
        
        if (isPriority) {
            priorityDeals.push(deal);
        } else {
            otherDeals.push(deal);
        }
    });

    // Put your priority games first, followed by the rest, limited to 12 items
    return [...priorityDeals, ...otherDeals].slice(0, 12);
}

function displayDeals(deals) {
    if (deals.length === 0) {
        gamesContainer.innerHTML = '<p style="text-align: center; color: #94a3b8; grid-column: 1 / -1;">No game deals found.</p>';
        return;
    }

    gamesContainer.innerHTML = deals.map(deal => {
        const discount = Math.round(deal.savings);
        return `
            <div class="game-card">
                ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                <img src="${deal.thumb}" alt="${deal.title}" class="game-thumb" loading="lazy">
                <div class="game-info">
                    <h3 class="game-title" title="${deal.title}">${deal.title}</h3>
                    <div class="game-pricing">
                        <span class="sale-price">$${deal.salePrice}</span>
                        <span class="normal-price">$${deal.normalPrice}</span>
                    </div>
                    <a href="https://www.cheapshark.com/redirect?dealID=${deal.dealID}" target="_blank" class="deal-btn">Get Deal</a>
                </div>
            </div>
        `;
    }).join('');
}

// Search functionality
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = allDeals.filter(deal => deal.title.toLowerCase().includes(query));
    displayDeals(filtered);
}

searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Filter chips functionality
filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const filterType = chip.getAttribute('data-filter');
        let filtered = allDeals;

        if (filterType === 'free') {
            filtered = allDeals.filter(deal => parseFloat(deal.salePrice) === 0);
        } else if (filterType === 'under5') {
            filtered = allDeals.filter(deal => parseFloat(deal.salePrice) < 5);
        } else if (filterType === 'massive') {
            filtered = allDeals.filter(deal => parseFloat(deal.savings) >= 90);
        }

        displayDeals(sortDealsByPriority(filtered));
    });
});

// Initial fetch on page load
fetchDeals();