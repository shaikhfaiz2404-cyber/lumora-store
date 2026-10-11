/* ============================================
   LUMORA STORE — Main Application
   Features: Auth, Profiles, Payment Info, Admin Panel
   ============================================ */

// ===== State =====
let cart = [];
let orders = [];
let users = [];
let currentUser = null;
let currentFilter = "all";

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", () => {
    loadFromStorage();
    loadCustomProducts();
    renderProducts();
    setupNavigation();
    setupCart();
    setupCheckout();
    setupAdmin();
    setupAddProductForm();
    setupSignIn();
    setupAuth();
    setupProfilePage();
    updateCartCount();
    updateAuthUI();
});

// ===== Storage =====
function saveToStorage() {
    localStorage.setItem("lumora_cart", JSON.stringify(cart));
    localStorage.setItem("lumora_orders", JSON.stringify(orders));
    localStorage.setItem("lumora_users", JSON.stringify(users));
    localStorage.setItem("lumora_current_user", JSON.stringify(currentUser));
}

function loadFromStorage() {
    try {
        cart = JSON.parse(localStorage.getItem("lumora_cart")) || [];
        orders = JSON.parse(localStorage.getItem("lumora_orders")) || [];
        users = JSON.parse(localStorage.getItem("lumora_users")) || [];
        currentUser = JSON.parse(localStorage.getItem("lumora_current_user")) || null;
    } catch (e) {
        cart = []; orders = []; users = []; currentUser = null;
    }
}

function loadCustomProducts() {
    try {
        const custom = JSON.parse(localStorage.getItem("lumora_custom_products")) || [];
        custom.forEach((p) => PRODUCTS.push(p));
    } catch (e) {}
}

function saveCustomProducts() {
    const defaultIds = ["pc-001","pc-002","pc-003","st-001","st-002","led-001","led-002","led-003","dk-001","dk-002","dk-003","dk-004"];
    const custom = PRODUCTS.filter((p) => !defaultIds.includes(p.id));
    localStorage.setItem("lumora_custom_products", JSON.stringify(custom));
}

// ===== Auth System =====
function setupAuth() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value.trim().toLowerCase();
            const pass = document.getElementById("loginPassword").value;
            handleLogin(email, pass);
        });
    }

    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("signupName").value.trim();
            const email = document.getElementById("signupEmail").value.trim().toLowerCase();
            const pass = document.getElementById("signupPassword").value;
            handleSignup(name, email, pass);
        });
    }

    const showSignup = document.getElementById("showSignup");
    if (showSignup) {
        showSignup.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("loginForm").style.display = "none";
            document.getElementById("signupForm").style.display = "block";
        });
    }
    const showLogin = document.getElementById("showLogin");
    if (showLogin) {
        showLogin.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("loginForm").style.display = "block";
            document.getElementById("signupForm").style.display = "none";
        });
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
}

function handleSignup(name, email, pass) {
    if (!name || !email || !pass) { showToast("Please fill all fields."); return; }
    if (pass.length < 6) { showToast("Password must be at least 6 characters."); return; }
    if (users.find((u) => u.email === email)) { showToast("Email already exists. Please login."); return; }

    const user = {
        id: "u" + Date.now().toString(36),
        name: name, email: email, password: pass,
        addresses: [], savedUpi: "", createdAt: new Date().toISOString(),
    };
    users.push(user);
    currentUser = user;
    saveToStorage();
    closeModal();
    updateAuthUI();
    showToast("Welcome, " + name + "! Account created.");
}

function handleLogin(email, pass) {
    const user = users.find((u) => u.email === email && u.password === pass);
    if (!user) { showToast("Invalid email or password."); return; }
    currentUser = user;
    saveToStorage();
    closeModal();
    updateAuthUI();
    if (email === ADMIN_EMAIL) {
        isAdminAuthenticated = true;
        showToast("Welcome, Admin!");
        setTimeout(() => { window.location.href = "admin.html"; }, 500);
    } else {
        showToast("Welcome back, " + user.name + "!");
    }
}

function handleLogout() {
    currentUser = null;
    isAdminAuthenticated = false;
    saveToStorage();
    updateAuthUI();
    showToast("Logged out.");
    window.location.href = "index.html";
}

function updateAuthUI() {
    const authLinks = document.getElementById("authLinks");
    if (!authLinks) return;
    if (currentUser) {
        if (currentUser.email === ADMIN_EMAIL) {
            authLinks.innerHTML = '<a href="admin.html" class="nav-link">Admin</a><a href="profile.html" class="nav-link">My Profile</a><a href="#" class="nav-link" id="logoutBtn">Logout</a>';
        } else {
            authLinks.innerHTML = '<a href="profile.html" class="nav-link">My Profile</a><a href="#" class="nav-link" id="logoutBtn">Logout</a>';
        }
        const logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
    } else {
        authLinks.innerHTML = '<a href="#" class="nav-link" id="signInLink">Sign In</a>';
        setupSignIn();
    }
}

function setupProfilePage() {
    const saveUpiForm = document.getElementById("saveUpiForm");
    if (saveUpiForm && currentUser) {
        document.getElementById("profileUpi").value = currentUser.savedUpi || "";
        saveUpiForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const upiId = document.getElementById("profileUpi").value.trim();
            if (!upiId) { showToast("Please enter your UPI ID."); return; }
            currentUser.savedUpi = upiId;
            const userIdx = users.findIndex(u => u.id === currentUser.id);
            if (userIdx >= 0) users[userIdx].savedUpi = upiId;
            saveToStorage();
            showToast("UPI ID saved! Faster checkout next time.");
        });
    }
}

function setupSignIn() {
    const signInLink = document.getElementById("signInLink");
    if (signInLink) {
        signInLink.addEventListener("click", (e) => {
            e.preventDefault();
            showModal("signInModal");
        });
    }
}

// ===== Navigation =====
function setupNavigation() {
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => { navLinks.classList.toggle("active"); });
    }
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (href.startsWith("#") && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: "smooth" });
                if (navLinks) navLinks.classList.remove("active");
            }
        });
    });
}

// ===== Product Rendering =====
function renderProducts(filter = "all", search = "") {
    const grid = document.getElementById("productGrid");
    if (!grid) return;
    let filtered = PRODUCTS;
    if (filter !== "all") filtered = filtered.filter((p) => p.category === filter);
    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--text-secondary)"><p style="font-size:3rem;margin-bottom:1rem">📦</p><p>No products found.</p></div>';
        return;
    }
    grid.innerHTML = filtered.map((p) => `
        <div class="product-card" onclick="openProduct('${p.id}')">
            <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><div class="product-badge">${p.category}</div></div>
            <div class="product-info">
                <h3 class="product-name">${p.name}</h3>
                <p class="product-desc">${p.description}</p>
                <div class="product-footer"><span class="product-price">₹${p.price}</span><button class="add-to-cart" onclick="event.stopPropagation();addToCart('${p.id}')">Add to Cart</button></div>
            </div>
        </div>`).join("");
    document.querySelectorAll(".product-card").forEach((card, i) => {
        card.style.opacity = "0"; card.style.transform = "translateY(20px)";
        setTimeout(() => { card.style.opacity = "1"; card.style.transform = "translateY(0)"; }, i * 50);
    });
}

// ===== Cart System =====
function setupCart() {
    document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            renderProducts(currentFilter, document.querySelector(".search-box input")?.value || "");
        });
    });
    const searchInput = document.querySelector(".search-box input");
    if (searchInput) searchInput.addEventListener("input", (e) => renderProducts(currentFilter, e.target.value));
}

function addToCart(productId) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const existing = cart.find((item) => item.id === productId);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    saveToStorage(); updateCartCount();
    showToast(product.name + " added to cart!");
}

function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    saveToStorage(); updateCartCount(); renderCart();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const el = document.getElementById("cartCount");
    if (el) { el.textContent = count; el.style.transform = "scale(1.3)"; setTimeout(() => (el.style.transform = "scale(1)"), 200); }
}

function renderCart() {
    const container = document.getElementById("cartContainer");
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart"><span class="empty-cart-icon">🛒</span><h2>Your cart is empty</h2><p>Add some products to get started.</p><a href="index.html#products" class="btn btn-primary" style="margin-top:1rem">Browse Products</a></div>';
        return;
    }
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 499 ? 0 : 40;
    const total = subtotal + shipping;
    container.innerHTML = '<div class="cart-items">' + cart.map((item) => '<div class="cart-item"><img src="' + item.image + '" alt="' + item.name + '" class="cart-item-img"><div class="cart-item-info"><h3 class="cart-item-name">' + item.name + '</h3><p class="cart-item-price">₹' + item.price + ' × ' + item.quantity + '</p></div><span class="cart-item-total">₹' + (item.price * item.quantity).toFixed(2) + '</span><button class="remove-btn" onclick="removeFromCart(\'' + item.id + '\')">×</button></div>').join("") + '</div><div class="cart-summary"><div class="summary-row"><span>Subtotal</span><span>₹' + subtotal.toFixed(2) + '</span></div><div class="summary-row"><span>Shipping</span><span>' + (shipping === 0 ? "FREE" : "₹" + shipping) + '</span></div><div class="summary-row summary-total"><span>Total</span><span>₹' + total.toFixed(2) + '</span></div><button class="btn btn-primary checkout-btn" onclick="openCheckout()">Proceed to Checkout</button></div>';
}

// ===== Checkout =====
function setupCheckout() {
    const form = document.getElementById("orderForm");
    if (form) form.addEventListener("submit", (e) => { e.preventDefault(); submitOrderDetails(); });
}

function openCheckout() {
    if (cart.length === 0) return;
    showModal("checkoutModal");
    showCheckoutStep("form");
}

function showCheckoutStep(step) {
    const stepForm = document.getElementById("checkoutFormStep");
    const stepPayment = document.getElementById("checkoutPaymentStep");
    if (!stepForm || !stepPayment) return;
    if (step === "form") { stepForm.style.display = "block"; stepPayment.style.display = "none"; }
    else { stepForm.style.display = "none"; stepPayment.style.display = "block"; generateUPIQr(); }
}

function submitOrderDetails() {
    const form = document.getElementById("orderForm");
    const formData = new FormData(form);
    if (!formData.get("name") || !formData.get("phone") || !formData.get("address") || !formData.get("city") || !formData.get("state") || !formData.get("pincode")) {
        showToast("Please fill all required fields."); return;
    }
    window._pendingOrder = { customer: { name: formData.get("name"), phone: formData.get("phone"), email: formData.get("email") || "", address: formData.get("address"), city: formData.get("city"), state: formData.get("state"), pincode: formData.get("pincode"), landmark: formData.get("landmark") || "" } };
    showCheckoutStep("payment");
}

function generateUPIQr() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 499 ? 0 : 40;
    const finalTotal = subtotal + shipping;
    const merchantName = "Lumora Store";
    const note = "Order from Lumora Store";
    const upiUrl = "upi://pay?pa=" + FAMPAY_UPI + "&pn=" + encodeURIComponent(merchantName) + "&am=" + finalTotal.toFixed(2) + "&cu=INR&tn=" + encodeURIComponent(note);
    const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(upiUrl);
    const container = document.getElementById("paymentSection");
    if (container) {
        container.innerHTML = '<div class="payment-qr"><p class="payment-instruction">Tap the button below to pay with UPI</p><a href="' + upiUrl + '" class="btn btn-primary" style="display:block;text-align:center;margin-bottom:1rem;text-decoration:none">Pay with UPI</a><p style="font-size:0.8rem;color:var(--text-dim);margin-bottom:1rem">Or scan this QR code from another device:</p><img src="' + qrUrl + '" alt="UPI QR Code" class="qr-image" style="width:180px;height:180px" /><div class="payment-details"><p><strong>Amount:</strong> ₹' + finalTotal.toFixed(2) + '</p><p><strong>UPI ID:</strong> ' + FAMPAY_UPI + '</p></div><p class="payment-warning">⚠️ Click "I Have Paid" only after you have sent the money.</p><button class="btn btn-primary" onclick="confirmUserPayment()">I Have Paid</button></div>';
    }
}

function confirmUserPayment() {
    const pending = window._pendingOrder;
    if (!pending) { showToast("Please fill the form first."); showCheckoutStep("form"); return; }
    // If user has saved UPI, skip the payment info form and finalize directly
    if (currentUser && currentUser.savedUpi) {
        finalizeOrderWithSavedUpi(pending, currentUser.savedUpi);
        return;
    }
    const container = document.getElementById("paymentSection");
    if (container) {
        container.innerHTML = '<div class="payment-info-form"><h3>Payment Confirmation</h3><p>Enter your UPI ID. It will be saved for faster checkout next time.</p><form id="paymentInfoForm"><div class="form-group"><label>Your UPI ID *</label><input type="text" id="payUpiId" required placeholder="yourname@bank"><small>We will save this for faster payments next time</small></div><div class="form-group"><label>Transaction Reference / UTR (optional)</label><input type="text" id="payTxnRef" placeholder="Transaction ID from your payment app"></div><button type="submit" class="btn btn-primary" style="width:100%">Submit & Confirm Order</button></form></div>';
        const payForm = document.getElementById("paymentInfoForm");
        payForm.addEventListener("submit", (e) => { e.preventDefault(); finalizeOrder(pending); });
    }
}

function finalizeOrderWithSavedUpi(pending, upiId) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 499 ? 0 : 40;
    const order = {
        id: "LUM" + Date.now().toString(36).toUpperCase(),
        timestamp: new Date().toISOString(),
        customer: pending.customer,
        userId: currentUser ? currentUser.id : null,
        items: cart.map((item) => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity, image: item.image, marketplace: item.marketplace, orderUrl: item.orderUrl })),
        subtotal: subtotal, shipping: shipping, total: subtotal + shipping,
        status: "pending_payment", paymentStatus: "awaiting_verification",
        paymentInfo: { method: "upi", upiId: upiId, txnRef: "N/A" },
        marketplace: cart[0]?.marketplace || "meesho", trackingId: "",
    };
    orders.push(order); saveToStorage();
    cart = []; saveToStorage(); updateCartCount();
    sendOrderNotification(order);
    sendOrderToBackend(order);
    closeModal(); showOrderConfirmation(order);
    window._pendingOrder = null;
}

function finalizeOrder(pending) {
    const upiId = document.getElementById("payUpiId").value.trim();
    if (!upiId) { showToast("Please enter your UPI ID."); return; }
    if (currentUser) {
        currentUser.savedUpi = upiId;
        const userIdx = users.findIndex(u => u.id === currentUser.id);
        if (userIdx >= 0) users[userIdx].savedUpi = upiId;
        saveToStorage();
    }
    const paymentInfo = { method: "upi", upiId: upiId };
    const txnRef = document.getElementById("payTxnRef").value.trim() || "N/A";
    paymentInfo.txnRef = txnRef;
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 499 ? 0 : 40;
    const order = {
        id: "LUM" + Date.now().toString(36).toUpperCase(),
        timestamp: new Date().toISOString(),
        customer: pending.customer,
        userId: currentUser ? currentUser.id : null,
        items: cart.map((item) => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity, image: item.image, marketplace: item.marketplace, orderUrl: item.orderUrl })),
        subtotal: subtotal, shipping: shipping, total: subtotal + shipping,
        status: "pending_payment", paymentStatus: "awaiting_verification",
        paymentInfo: paymentInfo, marketplace: cart[0]?.marketplace || "meesho", trackingId: "",
    };
    orders.push(order); saveToStorage();
    cart = []; saveToStorage(); updateCartCount();
    sendOrderNotification(order);
    sendOrderToBackend(order);
    closeModal(); showOrderConfirmation(order);
    window._pendingOrder = null;
}

async function sendOrderToBackend(order) {
    if (!BACKEND_URL) return;
    try {
        const res = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order })
        });
        const data = await res.json();
        if (data.success) {
            showToast("Order sent to backend!");
        }
    } catch (err) {
        console.error("Backend sync failed:", err);
    }
}

function showOrderConfirmation(order) {
    const container = document.getElementById("orderConfirmation");
    if (!container) return;
    container.style.display = "block";
    container.innerHTML = '<div class="confirmation-box"><div class="confirmation-icon">✓</div><h2>Order Placed!</h2><p class="confirmation-id">Order ID: ' + order.id + '</p><p>Thank you for your order, <strong>' + order.customer.name + '</strong>!</p><p>We will verify your payment and ship your order soon.</p><div class="confirmation-details"><p><strong>Total:</strong> ₹' + order.total.toFixed(2) + '</p><p><strong>Payment:</strong> ' + order.paymentInfo.method.toUpperCase() + ' — ' + (order.paymentInfo.upiId || order.paymentInfo.cardNumber) + '</p><p><strong>Shipping to:</strong> ' + order.customer.city + ', ' + order.customer.state + ' - ' + order.customer.pincode + '</p></div><button class="btn btn-primary" onclick="this.parentElement.parentElement.style.display=\'none\'">Continue Shopping</button></div>';
}

// ===== Admin Auth =====
const ADMIN_EMAIL = "lumora.main5@gmail.com";
const ADMIN_PASSWORD = "Lumora@1001";
let isAdminAuthenticated = false;

function setupAdmin() {
    if (isAdminAuthenticated) { renderAdmin(); return; }
    showAdminLogin();
}

function showAdminLogin() {
    const container = document.getElementById("adminContent");
    if (!container) return;
    container.innerHTML = '<div class="admin-login"><div class="admin-login-box"><h2>Admin Access</h2><p>Sign in with your admin account</p><form id="adminLoginForm"><div class="form-group"><label for="adminEmail">Email</label><input type="email" id="adminEmail" required placeholder="Admin email"></div><div class="form-group"><label for="adminPass">Password</label><input type="password" id="adminPass" required placeholder="Admin password"></div><button type="submit" class="btn btn-primary" style="width:100%">Login</button></form></div></div>';
    const form = document.getElementById("adminLoginForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("adminEmail").value.trim().toLowerCase();
            const pass = document.getElementById("adminPass").value;
            if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) { isAdminAuthenticated = true; showToast("Welcome, Admin!"); renderAdmin(); }
            else { showToast("Invalid email or password!"); }
        });
    }
}

function logoutAdmin() { isAdminAuthenticated = false; showAdminLogin(); showToast("Logged out"); }

function renderAdmin() {
    const container = document.getElementById("adminContent");
    if (!container) return;
    const pending = orders.filter((o) => o.status === "pending_payment");
    const confirmed = orders.filter((o) => o.status === "confirmed");
    const ordered = orders.filter((o) => o.status === "ordered");
    const shipped = orders.filter((o) => o.status === "shipped");
    container.innerHTML = '<div class="admin-top-bar"><h2>Orders</h2><div class="admin-top-actions"><button class="btn btn-small btn-secondary" onclick="toggleAddProduct()">+ Add Product</button><button class="btn btn-small btn-secondary" onclick="exportProducts()">Export</button><button class="btn btn-small btn-secondary" onclick="logoutAdmin()">Logout</button></div></div><div id="addProductForm" class="add-product-form" style="display:none"><h3>Add New Product</h3><form id="newProductForm" class="order-form"><div class="form-group"><label>Product Name *</label><input type="text" id="np-name" required placeholder="Product name"></div><div class="form-row"><div class="form-group"><label>Category *</label><select id="np-category" required><option value="">Select category</option><option value="Phone Cases">Phone Cases</option><option value="Stickers">Stickers</option><option value="LED Lights">LED Lights</option><option value="Desk Accessories">Desk Accessories</option></select></div><div class="form-group"><label>Price (₹) *</label><input type="number" id="np-price" required min="1" placeholder="Selling price"></div></div><div class="form-group"><label>Description</label><textarea id="np-desc" rows="2" placeholder="Short product description"></textarea></div><div class="form-group"><label>Marketplace *</label><select id="np-marketplace" required><option value="">Select marketplace</option><option value="meesho">Meesho</option><option value="amazon">Amazon</option><option value="flipkart">Flipkart</option></select></div><div class="form-group"><label>Product URL *</label><input type="url" id="np-url" required placeholder="https://www.meesho.com/..."><small>Paste the full product link</small></div><div class="form-group"><label>Image URL (optional)</label><input type="url" id="np-image" placeholder="https://..."></div><div class="form-actions"><button type="submit" class="btn btn-primary">Add Product</button><button type="button" class="btn btn-secondary" onclick="toggleAddProduct()">Cancel</button></div></form></div><div class="admin-stats"><div class="admin-stat"><span class="stat-num">' + pending.length + '</span><span class="stat-label">Awaiting Payment</span></div><div class="admin-stat"><span class="stat-num">' + confirmed.length + '</span><span class="stat-label">Confirmed</span></div><div class="admin-stat"><span class="stat-num">' + ordered.length + '</span><span class="stat-label">Ordered</span></div><div class="admin-stat"><span class="stat-num">' + shipped.length + '</span><span class="stat-label">Shipped</span></div></div><div class="admin-orders"><h3>Orders</h3>' + (orders.length === 0 ? '<p class="no-orders">No orders yet.</p>' : "") + orders.map((order) => {
        const mp = MARKETPLACES[order.marketplace] || MARKETPLACES.meesho;
        return '<div class="admin-order" data-status="' + order.status + '"><div class="order-header"><span class="order-id">' + order.id + '</span><span class="order-status status-' + order.status + '">' + order.status.replace(/_/g, " ") + '</span></div><div class="order-body"><div class="order-customer"><p><strong>' + order.customer.name + '</strong></p><p>' + order.customer.phone + '</p><p>' + order.customer.address + '</p><p>' + order.customer.city + ', ' + order.customer.state + ' - ' + order.customer.pincode + '</p></div><div class="order-items">' + order.items.map((item) => '<p>' + item.name + ' × ' + item.quantity + ' — ₹' + (item.price * item.quantity).toFixed(2) + '</p>').join("") + '</div><div class="order-total"><p><strong>Total: ₹' + order.total.toFixed(2) + '</strong></p><p>Payment: ' + (order.paymentInfo ? order.paymentInfo.method.toUpperCase() : "N/A") + '</p>' + (order.paymentInfo ? '<p>UPI: ' + (order.paymentInfo.upiId || order.paymentInfo.cardNumber) + '</p>' : "") + (order.paymentInfo && order.paymentInfo.txnRef !== "N/A" ? '<p>Txn: ' + order.paymentInfo.txnRef + '</p>' : "") + '</div></div><div class="order-actions">' + (order.status === "pending_payment" ? '<p class="marketplace-label">Source: <strong style="color:' + mp.color + '">' + mp.name + '</strong></p><div class="action-btns"><button class="btn btn-small btn-primary" onclick="confirmPayment(\'' + order.id + '\')">✓ Confirm Payment</button><button class="btn btn-small btn-secondary" onclick="cancelOrder(\'' + order.id + '\')">✕ Cancel</button></div>' : "") + (order.status === "confirmed" ? '<button class="btn btn-small btn-primary" onclick="proceedToMarketplace(\'' + order.id + '\')">Proceed →</button>' : "") + (order.status === "ordered" ? '<button class="btn btn-small btn-secondary" onclick="markShipped(\'' + order.id + '\')">Mark as Shipped</button>' : "") + (order.status === "shipped" ? '<p class="shipped-label">✓ Order completed</p>' : "") + '</div></div>';
    }).join("") + '</div>';
}

function confirmPayment(orderId) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    order.status = "confirmed"; saveToStorage(); renderAdmin();
    showToast("Payment confirmed! Ready to order.");
}

function cancelOrder(orderId) {
    orders = orders.filter((o) => o.id !== orderId);
    saveToStorage(); renderAdmin(); showToast("Order cancelled.");
}

function proceedToMarketplace(orderId) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const mp = MARKETPLACES[order.marketplace] || MARKETPLACES.meesho;
    const product = order.items[0];
    const url = product.orderUrl || "https://www.meesho.com";
    order.status = "ordered"; saveToStorage();
    const customerText = "Name: " + order.customer.name + "\nPhone: " + order.customer.phone + "\nAddress: " + order.customer.address + "\nCity: " + order.customer.city + "\nState: " + order.customer.state + "\nPincode: " + order.customer.pincode + "\nLandmark: " + order.customer.landmark + "\n\nProduct: " + product.name + "\nQuantity: " + order.items.reduce((sum, i) => sum + i.quantity, 0) + "\nTotal: ₹" + order.total;
    navigator.clipboard.writeText(customerText).then(() => { showToast("Customer details copied! Opening " + mp.name + "..."); });
    window.open(url, "_blank"); renderAdmin();
}

function markShipped(orderId) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    order.status = "shipped"; saveToStorage(); renderAdmin(); showToast("Order marked as shipped!");
}

// ===== Add Product =====
function toggleAddProduct() {
    const form = document.getElementById("addProductForm");
    if (form) form.style.display = form.style.display === "none" ? "block" : "none";
}

function exportProducts() {
    let js = "// Product data for Lumora Store\n";
    js += "const PRODUCTS = " + JSON.stringify(PRODUCTS, null, 4) + ";\n\n";
    js += "const FAMPAY_UPI = \"" + FAMPAY_UPI + "\";\n\n";
    js += "const TELEGRAM_BOT_TOKEN = \"" + TELEGRAM_BOT_TOKEN + "\";\n";
    js += "const TELEGRAM_CHAT_ID = \"" + TELEGRAM_CHAT_ID + "\";\n\n";
    js += "const MARKETPLACES = " + JSON.stringify(MARKETPLACES, null, 4) + ";\n";
    const blob = new Blob([js], { type: "text/javascript" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "products.js";
    a.click();
    showToast("products.js downloaded! Replace the file and redeploy.");
}

function setupAddProductForm() {
    const form = document.getElementById("newProductForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("np-name").value.trim();
        const category = document.getElementById("np-category").value;
        const price = parseInt(document.getElementById("np-price").value);
        const desc = document.getElementById("np-desc").value.trim();
        const marketplace = document.getElementById("np-marketplace").value;
        const url = document.getElementById("np-url").value.trim();
        const image = document.getElementById("np-image").value.trim() || "https://placehold.co/300x300/1a1a2e/00f0ff?text=" + encodeURIComponent(name.substring(0, 15));
        if (!name || !category || !price || !marketplace || !url) { showToast("Please fill all required fields."); return; }
        const newProduct = { id: "p" + Date.now().toString(36), name: name, category: category, price: price, marketplace: marketplace, orderUrl: url, image: image, description: desc || "No description available." };
        PRODUCTS.push(newProduct); saveToStorage(); saveCustomProducts(); renderProducts(); toggleAddProduct(); form.reset();
        showToast('"' + name + '" added to store!');
    });
}

// ===== Notifications =====
function sendOrderNotification(order) {
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const c = order.customer;
        const message = "🛒 NEW ORDER RECEIVED!\n\n━━━━━━━━━━━━━━━━━━━━\n📋 ORDER DETAILS\n━━━━━━━━━━━━━━━━━━━━\nOrder ID: " + order.id + "\nStatus: Pending Payment Verification\nPayment: " + (order.paymentInfo ? order.paymentInfo.method.toUpperCase() : "N/A") + " — " + (order.paymentInfo ? (order.paymentInfo.upiId || order.paymentInfo.cardNumber) : "N/A") + "\n\n━━━━━━━━━━━━━━━━━━━━\n👤 CUSTOMER DETAILS\n━━━━━━━━━━━━━━━━━━━━\nName: " + c.name + "\nPhone: " + c.phone + "\nEmail: " + (c.email || "N/A") + "\nAddress: " + c.address + "\nCity: " + c.city + "\nState: " + c.state + "\nPIN Code: " + c.pincode + "\nLandmark: " + (c.landmark || "N/A") + "\n\n━━━━━━━━━━━━━━━━━━━━\n🛍️ ITEMS ORDERED\n━━━━━━━━━━━━━━━━━━━━\n" + order.items.map((i) => "• " + i.name + " × " + i.quantity + " — ₹" + (i.price * i.quantity).toFixed(2)).join("\n") + "\n\n━━━━━━━━━━━━━━━━━━━━\n💰 PAYMENT SUMMARY\n━━━━━━━━━━━━━━━━━━━━\nSubtotal: ₹" + order.subtotal.toFixed(2) + "\nShipping: " + (order.shipping === 0 ? "FREE" : "₹" + order.shipping.toFixed(2)) + "\nTotal: ₹" + order.total.toFixed(2) + "\n\n━━━━━━━━━━━━━━━━━━━━\n📦 FULFILLMENT\n━━━━━━━━━━━━━━━━━━━━\nSource: " + (MARKETPLACES[order.marketplace]?.name || "Meesho") + "\nAction: Verify payment in Fampay → Confirm Payment → Proceed";
        fetch("https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }) }).catch((err) => console.error("Telegram notification failed:", err));
    }
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Lumora Store - New Order!", { body: order.customer.name + " ordered ₹" + order.total.toFixed(2) });
    }
}

if ("Notification" in window && Notification.permission === "default") { Notification.requestPermission(); }

// ===== Product Detail Modal =====
function openProduct(productId) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const container = document.getElementById("productModalContent");
    if (!container) return;
    const specs = product.specs || product.compatible || product.designs || [];
    container.innerHTML = '<div class="modal-product"><div class="modal-product-image"><img src="' + product.image + '" alt="' + product.name + '"></div><div class="modal-product-info"><span class="product-badge">' + product.category + '</span><h2>' + product.name + '</h2><p class="product-desc">' + product.description + '</p>' + (specs.length ? '<div class="product-specs"><h4>Specifications:</h4><ul>' + specs.map((s) => '<li>' + s + '</li>').join("") + '</ul></div>' : "") + '<div class="product-footer"><span class="product-price">₹' + product.price + '</span><button class="btn btn-primary" onclick="addToCart(\'' + product.id + '\');closeModal()">Add to Cart</button></div></div></div>';
    showModal("productModal");
}

// ===== Modal System =====
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) { modal.classList.add("active"); document.body.style.overflow = "hidden"; }
}

function closeModal() {
    document.querySelectorAll(".modal-overlay").forEach((m) => m.classList.remove("active"));
    document.body.style.overflow = "";
}

document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
});

document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

// ===== Toast =====
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast"; toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 300); }, 3000);
}
