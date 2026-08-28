// Your exact favorite 12 games to show at the top
const MY_FAVORITE_GAMES = [
    {
        title: "The Last of Us",
        salePrice: "39.99",
        normalPrice: "59.99",
        savings: "33",
        thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/header.jpg",
        dealID: "last-of-us"
    },
    {
        title: "Grand Theft Auto V",
        salePrice: "14.99",
        normalPrice: "29.99",
        savings: "50",
        thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg",
        dealID: "gta-v"
    },
    {
        title: "Need for Speed Heat",
        salePrice: "3.50",
        normalPrice: "35.00",
        savings: "90",
        thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1222680/header.jpg",
        dealID: "nfs-heat"
    },
    {
        title: "Tomb Raider",
        salePrice: "2.99",
        normalPrice: "19.99",
        savings: "85",
        thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/203160/header.jpg",
        dealID: "tomb-raider"
    },
    {
        title: "CarX Street",
        salePrice: "15.99",
        normalPrice: "19.99",
        savings: "20",
        thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1110430/header.jpg",
        dealID: "carx-street"
    },
    {
        title: "Euro Truck Simulator 2",
        salePrice: "4.99",
        normalPrice: "19.99",
        savings: "75",
        thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/227300/header.jpg",
        dealID: "ets-2"
    },
    {
        title: "Need for Speed Unbound",
        salePrice: "6.99",
        normalPrice: "69.99",
        savings: "90",
        thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1846380/header.jpg",
        dealID: "nfs-unbound"
    },
    {
        title: "Need for Speed Payback",
        salePrice: "4.99",
        normalPrice: "29.99",
        savings: "83",
        thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1262580/header.jpg",
        dealID: "nfs-payback"
    },
    {
        title: "The Crew Motorfest",
        salePrice: "23.99",
        normalPrice: "59.99",
        savings: "60",
        thumb: "https://cdn1.epicgames.com/offer/1f7a0799f9064789bcf279b63a233b8b/EGS_TheCrewMotorfest_UbisoftReflections_S2_1200x1600-9831ce2313b35f6062f4bc699b3848b6",
        dealID: "crew-motorfest"
    },
    {
        title: "Forza Horizon 5",
        salePrice: "29.99",
        normalPrice: "59.99",
        savings: "50",
        thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1551360/header.jpg",
        dealID: "forza-horizon-5"
    },
    {
        title: "Call of Duty",
        salePrice: "19.99",
        normalPrice: "49.99",
        savings: "60",
        thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1938090/header.jpg",
        dealID: "call-of-duty"
    }
];

let allDeals = [...MY_FAVORITE_GAMES];

const gamesContainer = document.getElementById('gamesContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterChips = document.querySelectorAll('.chip');

async function fetchDeals() {
    try {
        gamesContainer.innerHTML = '<p style="text-align: center; color: #94a3b8; grid-column: 1 / -1;">Loading games...</p>';
        
        const response = await fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=50');
        const apiDeals = await response.json();
        
        // Combine your custom games first, then live API deals
        allDeals = [...MY_FAVORITE_GAMES, ...apiDeals];
        displayDeals(allDeals.slice(0, 12));
    } catch (error) {
        displayDeals(MY_FAVORITE_GAMES);
    }
}

function displayDeals(deals) {
    if (deals.length === 0) {
        gamesContainer.innerHTML = '<p style="text-align: center; color: #94a3b8; grid-column: 1 / -1;">No game deals found.</p>';
        return;
    }

    gamesContainer.innerHTML = deals.map(deal => {
        const discount = Math.round(deal.savings || 0);
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
                    <a href="https://www.google.com/search?q=${encodeURIComponent(deal.title + ' buy game deal')}" target="_blank" class="deal-btn">Get Deal</a>
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

        displayDeals(filtered.slice(0, 12));
    });
});

// Initial load
fetchDeals();