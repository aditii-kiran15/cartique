const products = [
    {
        id: 1,
        name: "Classic Beige Tote",
        category: "Accessories",
        price: 799,
        rating: 4.8,
        tag: "BESTSELLER",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80",
        description: "A timeless everyday tote with a minimal design. Perfect for college, shopping and everyday adventures."
    },
    {
        id: 2,
        name: "Everyday White Sneakers",
        category: "Fashion",
        price: 1299,
        rating: 4.9,
        tag: "POPULAR",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
        description: "Comfortable everyday sneakers that add a fresh touch to your casual outfits."
    },
    {
        id: 3,
        name: "Minimal Gold Watch",
        category: "Accessories",
        price: 1499,
        rating: 4.7,
        tag: "TRENDING",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
        description: "A sophisticated watch with a clean dial and elegant finish. A perfect everyday accessory."
    },
    {
        id: 4,
        name: "Soft Knit Sweater",
        category: "Fashion",
        price: 1199,
        rating: 4.6,
        tag: "NEW",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=80",
        description: "A soft, versatile sweater that brings comfort and effortless style to your wardrobe."
    },
    {
        id: 5,
        name: "Everyday Sunglasses",
        category: "Accessories",
        price: 599,
        rating: 4.5,
        tag: "JUST IN",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80",
        description: "Chic sunglasses that complete your everyday look with a touch of confidence."
    },
    {
        id: 6,
        name: "Ceramic Coffee Mug",
        category: "Lifestyle",
        price: 399,
        rating: 4.8,
        tag: "FAVOURITE",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80",
        description: "A simple ceramic mug for your morning coffee, evening tea and little everyday moments."
    },
    {
        id: 7,
        name: "Classic Shoulder Bag",
        category: "Accessories",
        price: 1099,
        rating: 4.7,
        tag: "POPULAR",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
        description: "A versatile shoulder bag with a stylish silhouette, made for outings and everyday use."
    },
    {
        id: 8,
        name: "Minimal Desk Lamp",
        category: "Lifestyle",
        price: 899,
        rating: 4.6,
        tag: "NEW",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80",
        description: "Give your study space a cosy touch with this minimalist desk lamp."
    }
];


// 2. GET HTML ELEMENTS

const productGrid = document.getElementById("productGrid");
const productTotal = document.getElementById("productTotal");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const categoryButtons = document.querySelectorAll(".category-chip");
const emptyMessage = document.getElementById("emptyMessage");

const productModal = document.getElementById("productModal");
const modalContent = document.getElementById("modalContent");
const closeModalButton = document.getElementById("closeModal");

const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartButton = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const checkoutButton = document.getElementById("checkoutButton");
const toast = document.getElementById("toast");


// 3. APPLICATION STATE

let selectedCategory = "All";
let searchTerm = "";
let sortOption = "default";
let toastTimer;

let cart = [];

try {
    const savedCart = JSON.parse(
        localStorage.getItem("cartiqueCart") || "[]"
    );

    if (Array.isArray(savedCart)) {
        cart = savedCart
            .filter(item =>
                item &&
                Number.isInteger(item.id) &&
                products.some(product => product.id === item.id)
            )
            .map(item => ({
                id: item.id,
                quantity: Math.max(
                    1,
                    Math.min(99, Math.floor(Number(item.quantity) || 1))
                )
            }));
    }
} catch (error) {
    cart = [];
}


// 4. FORMAT PRICE

function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(price);
}


// 5. DISPLAY NOTIFICATIONS

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


// 6. SAVE CART TO LOCAL STORAGE

function saveCart() {
    try {
        localStorage.setItem(
            "cartiqueCart",
            JSON.stringify(cart)
        );
    } catch (error) {
        showToast("Unable to save cart in this browser.");
    }
}


// 7. DISPLAY PRODUCT CARDS

function displayProducts(productList) {
    productGrid.innerHTML = "";

    productTotal.textContent =
        `${productList.length} ${productList.length === 1 ? "product" : "products"}`;

    emptyMessage.hidden = productList.length !== 0;

    productList.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

                <span class="product-tag">${product.tag}</span>

                <button
                    class="quick-add"
                    data-action="add"
                    data-id="${product.id}"
                >
                    + Add to bag
                </button>
            </div>

            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>

                <div class="product-bottom">
                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <span class="product-rating">
                        ★ ${product.rating}
                    </span>
                </div>
            </div>
        `;

        productGrid.appendChild(card);
    });
}


// 8. SEARCH, FILTER AND SORT PRODUCTS

function updateProducts() {
    let filteredProducts = [...products];

    if (selectedCategory !== "All") {
        filteredProducts = filteredProducts.filter(product =>
            product.category === selectedCategory
        );
    }

    if (searchTerm.trim() !== "") {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (sortOption === "low-high") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high-low") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "name") {
        filteredProducts.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    displayProducts(filteredProducts);
}


// Search event
searchInput.addEventListener("input", event => {
    searchTerm = event.target.value;
    updateProducts();
});


// Sorting event
sortSelect.addEventListener("change", event => {
    sortOption = event.target.value;
    updateProducts();
});


// Category filter event
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        categoryButtons.forEach(item =>
            item.classList.remove("active")
        );

        button.classList.add("active");
        selectedCategory = button.dataset.category;

        updateProducts();
    });
});


// 9. PRODUCT DETAILS POPUP

function openProductModal(productId) {
    const product = products.find(item => item.id === productId);

    if (!product) return;

    modalContent.innerHTML = `
        <div class="modal-product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>

        <div class="modal-product-info">
            <p class="eyebrow">${product.category}</p>

            <h2 id="modalTitle">${product.name}</h2>

            <div class="product-rating">
                ★ ${product.rating} / 5
            </div>

            <p class="modal-product-price">
                ${formatPrice(product.price)}
            </p>

            <p>${product.description}</p>

            <button
                class="primary-button"
                data-action="add"
                data-id="${product.id}"
            >
                Add to shopping bag
            </button>
        </div>
    `;

    productModal.hidden = false;
    document.body.style.overflow = "hidden";
}

function closeProductModal() {
    productModal.hidden = true;

    if (cartOverlay.hidden) {
        document.body.style.overflow = "";
    }
}

closeModalButton.addEventListener("click", closeProductModal);

productModal.addEventListener("click", event => {
    if (event.target === productModal) {
        closeProductModal();
    }
});


// 10. ADD PRODUCT TO CART

function addToCart(productId) {
    const product = products.find(item => item.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        if (existingItem.quantity >= 99) {
            showToast("Maximum quantity reached.");
            return;
        }

        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    saveCart();
    updateCart();

    showToast(`${product.name} added to your bag!`);
}


// 11. UPDATE CART COUNT AND TOTAL

function updateCart() {
    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = cart.reduce((total, item) => {
        const product = products.find(p => p.id === item.id);

        return total + (product ? product.price * item.quantity : 0);
    }, 0);

    cartCount.textContent = totalItems;
    cartSubtotal.textContent = formatPrice(subtotal);

    displayCartItems();
}


// 12. DISPLAY CART ITEMS

function displayCartItems() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <span>♡</span>
                <p>Your bag is waiting for something lovely.</p>
            </div>
        `;

        return;
    }

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);

        if (!product) return;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <div>
                <h3>${product.name}</h3>
                <p>${formatPrice(product.price)}</p>

                <div class="quantity-controls">
                    <button
                        data-action="decrease"
                        data-id="${product.id}"
                        aria-label="Decrease quantity"
                    >−</button>

                    <span>${item.quantity}</span>

                    <button
                        data-action="increase"
                        data-id="${product.id}"
                        aria-label="Increase quantity"
                    >+</button>
                </div>

                <button
                    class="remove-item"
                    data-action="remove"
                    data-id="${product.id}"
                >
                    Remove
                </button>
            </div>

            <span class="cart-item-price">
                ${formatPrice(product.price * item.quantity)}
            </span>
        `;

        cartItems.appendChild(cartItem);
    });
}


// 13. CHANGE QUANTITY OR REMOVE ITEMS

function changeQuantity(productId, action) {
    const item = cart.find(product => product.id === productId);

    if (!item) return;

    if (action === "increase") {
        if (item.quantity >= 99) {
            showToast("Maximum quantity reached.");
            return;
        }

        item.quantity++;
    }

    if (action === "decrease") {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(product => product.id !== productId);
        }
    }

    if (action === "remove") {
        cart = cart.filter(product => product.id !== productId);
        showToast("Item removed from your bag.");
    }

    saveCart();
    updateCart();
}


// 14. HANDLE PRODUCT AND CART BUTTONS

document.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");

    if (button) {
        const action = button.dataset.action;
        const productId = Number(button.dataset.id);

        if (!Number.isInteger(productId)) return;

        if (action === "add") {
            addToCart(productId);
            return;
        }

        if (
            action === "increase" ||
            action === "decrease" ||
            action === "remove"
        ) {
            changeQuantity(productId, action);
        }

        return;
    }

    const productCard = event.target.closest(".product-card");

    if (productCard) {
        const addButton = productCard.querySelector('[data-action="add"]');

        if (addButton) {
            openProductModal(Number(addButton.dataset.id));
        }
    }
});


// 15. OPEN AND CLOSE SHOPPING BAG

cartButton.addEventListener("click", () => {
    updateCart();
    cartOverlay.hidden = false;
    document.body.style.overflow = "hidden";
});

function closeShoppingBag() {
    cartOverlay.hidden = true;

    if (productModal.hidden) {
        document.body.style.overflow = "";
    }
}

closeCartButton.addEventListener("click", closeShoppingBag);

cartOverlay.addEventListener("click", event => {
    if (event.target === cartOverlay) {
        closeShoppingBag();
    }
});


// 16. CHECKOUT DEMO

checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Your shopping bag is empty!");
        return;
    }

    showToast("Checkout demo only — no real payment is processed.");
});


// 17. CLOSE POPUPS WITH ESCAPE KEY

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeProductModal();
        closeShoppingBag();
    }
});


// 18. INITIALIZE THE STORE

updateProducts();
updateCart();
