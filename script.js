const API_BASE = 'https://www.cheapshark.com/api/1.0';
let storeMap = {}; // Will hold store ID to store name mapping

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const dealsGrid = document.getElementById('deals-grid');
const statusMessage = document.getElementById('status-message');

// Optional: Custom Affiliate Redirect Variable
// Replace with your affiliate ID if registered with networks like Impact or CJ
const AFFILIATE_ID = ''; 

// 1. Fetch store info on page load to map storeIDs to real store names
async function fetchStores() {
    try {
        const response = await fetch(`${API_BASE}/stores`);
        const stores = await response.json();
        stores.forEach(store => {
            if (store.isActive) {
                storeMap[store.storeID] = store.storeName;
            }
        });
    } catch (error) {
        console.error('Error fetching store metadata:', error);
    }
}

// 2. Fetch game deals by search title
async function searchDeals(title) {
    statusMessage.innerHTML = '<p>Searching for deals...</p>';
    dealsGrid.innerHTML = '';

    try {
        const response = await fetch(`${API_BASE}/deals?title=${encodeURIComponent(title)}&limit=24`);
        const deals = await response.json();

        if (deals.length === 0) {
            statusMessage.innerHTML = '<p>No deals found. Try a different search term.</p>';
            return;
        }

        statusMessage.innerHTML = '';
        renderDeals(deals);
    } catch (error) {
        console.error('Error fetching deals:', error);
        statusMessage.innerHTML = '<p>Failed to load deals. Please try again later.</p>';
    }
}

// 3. Render deal cards into the DOM
function renderDeals(deals) {
    dealsGrid.innerHTML = deals.map(deal => {
        const storeName = storeMap[deal.storeID] || 'Store';
        const savings = Math.round(parseFloat(deal.savings));
        
        // Construct deal link (CheapShark deal ID to full redirect link)
        let dealUrl = `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`;
        if (AFFILIATE_ID) {
            dealUrl += `&publisherID=${AFFILIATE_ID}`;
        }

        return `
            <div class="game-card">
                <img src="${deal.thumb}" alt="${deal.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x160?text=No+Image'">
                <div class="card-details">
                    <h3>${deal.title}</h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Store: ${storeName}</p>
                    <div class="price-container">
                        ${deal.normalPrice !== deal.salePrice ? `<span class="normal-price">$${deal.normalPrice}</span>` : ''}
                        ${savings > 0 ? `<span class="savings-badge">-${savings}%</span>` : ''}
                    </div>
                    <a href="${dealUrl}" target="_blank" rel="noopener noreferrer" class="deal-btn">View Deal</a>
                </div>
            </div>
        `;
    }).join('');
}

// Event Listeners
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        searchDeals(query);
    }
});

// Initialize App
fetchStores();