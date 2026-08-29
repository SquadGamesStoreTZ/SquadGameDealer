// Store ID mapping for CheapShark stores
const STORE_MAP = {
    "1": "Steam",
    "2": "Epic Games",
    "3": "GOG",
    "7": "G2A",
    "8": "GreenManGaming",
    "11": "Humble Store",
    "25": "Itch.io"
};

// 12 Popular Favorite Games pinned permanently to the front
const FAVORITE_GAMES = [
    {
        title: "The Last of Us Part I",
        salePrice: "$39.99",
        normalPrice: "$59.99",
        savings: "33% OFF",
        thumb: "https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/header.jpg",
        dealID: "fav-1",
        storeID: "1"
    },
    {
        title: "Grand Theft Auto V",
        salePrice: "$14.99",
        normalPrice: "$29.99",
        savings: "50% OFF",
        thumb: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg",
        dealID: "fav-2",
        storeID: "1"
    },
    {
        title: "Need for Speed Heat",
        salePrice: "$3.50",
        normalPrice: "$35.00",
        savings: "90% OFF",
        thumb: "https://cdn.cloudflare.steamstatic.com/steam/apps/1222680/header.jpg",
        dealID: "fav-3",
        storeID: "2"
    },
    {
        title: "Tomb Raider",
        salePrice: "$2.99",
        normalPrice: "$19.99",
        savings: "85% OFF",
        thumb: "https://cdn.cloudflare.steamstatic.com/steam/apps/203160/header.jpg",
        dealID: "fav-4",
        storeID: "1"
    },
    {
        title: "CarX Street",
        salePrice: "$13.99",
        normalPrice: "$19.99",
        savings: "30% OFF",
        thumb: "https://cdn.cloudflare.steamstatic.com/steam/apps/1114130/header.jpg",
        dealID: "fav-5",
        storeID: "1"
    },
    {
        title: "Euro Truck Simulator 2",
        salePrice: "$4.99",
        normalPrice: "$19.99",
        savings: "75% OFF",
        thumb: "https://cdn.cloudflare.steamstatic.com/steam/apps/227300/header.jpg",
        dealID: "fav-6",
        storeID: "1"
    },
    {
        title: "Need for Speed Unbound",
        salePrice: "$6.99",
        normalPrice: "$69.99",
        savings: "90% OFF",
        thumb: "https://cdn.cloudflare.steamstatic.com/steam/apps/1846250/header.jpg",
        dealID: "fav-7",
        storeID: "2"
    },
    {
        title: "Need for Speed Payback",
        salePrice: "$2.99",
        normalPrice: "$29.99",
        savings: "90% OFF",
        thumb: "https://cdn.cloudflare.steamstatic.com/steam/apps/1262580/header.jpg",
        dealID: "fav-8",
        storeID: "2"
    },
    {
        title: "The Crew Motorfest",
        salePrice: "$23.99",
        normalPrice: "$59.99",
        savings: "60% OFF",
        thumb: "https://cdn.cloudflare.steamstatic.com/steam/apps/2698490/header.jpg",
        dealID: "fav-9",
        storeID: "3"
    },
    {
        title: "Forza Horizon 5",
        salePrice: "$29.99",
        normalPrice: "$59.99",
        savings: "50% OFF",
        thumb: "https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg",
        dealID: "fav-10",
        storeID: "1"
    },
    {
        title: "Call of Duty: Modern Warfare III",
        salePrice: "$34.99",
        normalPrice: "$69.99",
        savings: "50% OFF",
        thumb: "https://cdn.cloudflare.steamstatic.com/steam/apps/2519060/header.jpg",
        dealID: "fav-11",
        storeID: "1"
    },
    {
        title: "Red Dead Redemption 2",
        salePrice: "$19.79",
        normalPrice: "$59.99",
        savings: "67% OFF",
        thumb: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
        dealID: "fav-12",
        storeID: "1"
    }
];

let allLoadedDeals = [...FAVORITE_GAMES];
let currentFilter = 'all';
let currentSearchQuery = '';

const gamesGrid = document.getElementById('gamesGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterChips = document.querySelectorAll('.chip');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderGames(allLoadedDeals);
    fetchLiveDeals();

    // Search event listeners
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Filter chip event listeners
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.getAttribute('data-filter');
            applyFiltersAndSearch();
        });
    });
});

// Fetch active deals from CheapShark API to include in full search and browse
async function fetchLiveDeals() {
    try {
        const response = await fetch('https://www.cheapshark.com/api/1.0/deals?pageSize=60');
        const data = await response.json();
        
        const apiDeals = data.map(deal => ({
            title: deal.title,
            salePrice: `$${deal.salePrice}`,
            normalPrice: `$${deal.normalPrice}`,
            savings: `${Math.round(deal.savings)}% OFF`,
            thumb: deal.thumb,
            dealID: deal.dealID,
            storeID: deal.storeID
        }));

        // Merge favorites on top, followed by live API deals (avoiding duplicate titles)
        const favoriteTitles = new Set(FAVORITE_GAMES.map(g => g.title.toLowerCase()));
        const uniqueApiDeals = apiDeals.filter(d => !favoriteTitles.has(d.title.toLowerCase()));

        allLoadedDeals = [...FAVORITE_GAMES, ...uniqueApiDeals];
        applyFiltersAndSearch();
    } catch (error) {
        console.error("Error fetching live deals:", error);
    }
}

// Comprehensive search handling all games
async function handleSearch() {
    currentSearchQuery = searchInput.value.trim().toLowerCase();
    
    if (currentSearchQuery === '') {
        applyFiltersAndSearch();
        return;
    }

    // Search both locally loaded games and query CheapShark endpoint for universal results
    try {
        const response = await fetch(`https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(currentSearchQuery)}&pageSize=60`);
        const data = await response.json();

        const searchApiDeals = data.map(deal => ({
            title: deal.title,
            salePrice: `$${deal.salePrice}`,
            normalPrice: `$${deal.normalPrice}`,
            savings: `${Math.round(deal.savings)}% OFF`,
            thumb: deal.thumb,
            dealID: deal.dealID,
            storeID: deal.storeID
        }));

        // Combine local cache with new search results uniquely
        const existingTitles = new Set(allLoadedDeals.map(g => g.title.toLowerCase()));
        const newDeals = searchApiDeals.filter(d => !existingTitles.has(d.title.toLowerCase()));
        allLoadedDeals = [...allLoadedDeals, ...newDeals];

        applyFiltersAndSearch();
    } catch (error) {
        console.error("Error searching API:", error);
        applyFiltersAndSearch();
    }
}

// Filter and render logic
function applyFiltersAndSearch() {
    let filtered = allLoadedDeals.filter(game => {
        // Search filter matching
        const matchesSearch = currentSearchQuery === '' || game.title.toLowerCase().includes(currentSearchQuery);
        if (!matchesSearch) return false;

        // Category & Store filter matching
        const saleNum = parseFloat(game.salePrice.replace('$', ''));
        const savingsNum = parseInt(game.savings) || 0;

        if (currentFilter === 'free') return saleNum === 0;
        if (currentFilter === 'under5') return saleNum > 0 && saleNum < 5;
        if (currentFilter === '90plus') return savingsNum >= 90;
        if (currentFilter.startsWith('store-')) {
            const targetStoreId = currentFilter.replace('store-', '');
            return game.storeID === targetStoreId;
        }

        return true; // 'all' filter
    });

    renderGames(filtered);
}

// Render game cards into the HTML grid
function renderGames(games) {
    gamesGrid.innerHTML = '';

    if (games.length === 0) {
        gamesGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 3rem;">No game deals found matching your criteria.</p>`;
        return;
    }

    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';

        const storeName = STORE_MAP[game.storeID] || 'Store Deal';
        const dealLink = game.dealID.startsWith('fav-') 
            ? `https://www.cheapshark.com/search?q=${encodeURIComponent(game.title)}`
            : `https://www.cheapshark.com/redirect?dealID=${game.dealID}`;

        card.innerHTML = `
            <div class="card-image-container">
                <img src="${game.thumb}" alt="${game.title}" loading="lazy" onerror="this.src='squardii logo.jpg'">
                <div class="discount-badge">${game.savings}</div>
            </div>
            <div class="card-content">
                <div>
                    <h3 class="game-title" title="${game.title}">${game.title}</h3>
                    <div class="game-pricing">
                        <span class="sale-price">${game.salePrice}</span>
                        <span class="normal-price">${game.normalPrice}</span>
                    </div>
                </div>
                <a href="${dealLink}" target="_blank" rel="noopener noreferrer" class="get-deal-btn">Get Deal (${storeName})</a>
            </div>
        `;
        gamesGrid.appendChild(card);
    });
}