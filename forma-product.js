document.addEventListener('DOMContentLoaded', () => {
    const mainImg = document.querySelector('.main-product-img');
    const thumbnails = Array.from(document.querySelectorAll('.thumbnail-list .thumbnail'));
    const colorRadios = Array.from(document.querySelectorAll('input[name="color"]'));
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    const colors = ['Blue', 'Yellow', 'Orange'];

    function setActiveSlide(index) {
        if (!mainImg || thumbnails.length === 0) return;
        if (index < 0) index = thumbnails.length - 1;
        if (index >= thumbnails.length) index = 0;

        // 1. Update main image & active thumbnail outline
        mainImg.src = thumbnails[index].src;
        mainImg.alt = thumbnails[index].alt;
        thumbnails.forEach((thumb, i) => thumb.classList.toggle('active', i === index));

        // 2. Sync the Color pill radio button
        const targetColor = colors[index];
        const matchingRadio = colorRadios.find(r => r.value === targetColor);
        if (matchingRadio) matchingRadio.checked = true;
    }

    // Color pill click -> updates shirt preview & thumbnail
    colorRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const idx = colors.indexOf(radio.value);
            if (idx !== -1) setActiveSlide(idx);
        });
    });

    // Thumbnail click -> updates shirt preview & color pill
    thumbnails.forEach((thumb, idx) => {
        thumb.addEventListener('click', () => setActiveSlide(idx));
    });

    // Carousel < and > arrows
    prevBtn?.addEventListener('click', () => {
        const currentIdx = thumbnails.findIndex(t => t.classList.contains('active'));
        setActiveSlide(currentIdx - 1);
    });

    nextBtn?.addEventListener('click', () => {
        const currentIdx = thumbnails.findIndex(t => t.classList.contains('active'));
        setActiveSlide(currentIdx + 1);
    });

    // Quantity - and + buttons
    const qtyInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');

    minusBtn?.addEventListener('click', () => {
        const val = parseInt(qtyInput.value, 10) || 1;
        if (val > 1) qtyInput.value = val - 1;
    });

    plusBtn?.addEventListener('click', () => {
        const val = parseInt(qtyInput.value, 10) || 1;
        if (val < 99) qtyInput.value = val + 1;
    });

    // Pop-up message positioned right above the clicked icon
    let popupTimer;

    function showPopupNear(targetBtn, message) {
        let popup = document.getElementById('forma-cart-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'forma-cart-popup';
            Object.assign(popup.style, {
                position: 'fixed',
                backgroundColor: 'var(--color-luntian, #427033)',
                color: '#ffffff',
                fontFamily: "'Manrope', sans-serif",
                fontSize: '12.5px',
                fontWeight: '700',
                padding: '6px 12px',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: '9999',
                opacity: '0',
                transition: 'opacity 0.2s ease, transform 0.2s ease'
            });
            document.body.appendChild(popup);
        }

        popup.textContent = message;
        popup.style.opacity = '0';
        popup.style.transform = 'translate(-50%, 4px)';

        const rect = targetBtn.getBoundingClientRect();
        const popupWidth = popup.offsetWidth;
        const popupHeight = popup.offsetHeight;

        let left = rect.left + rect.width / 2;
        const margin = 12;
        if (left - popupWidth / 2 < margin) left = margin + popupWidth / 2;
        if (left + popupWidth / 2 > window.innerWidth - margin) {
            left = window.innerWidth - margin - popupWidth / 2;
        }

        const top = Math.max(margin, rect.top - popupHeight - 8);
        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;

        requestAnimationFrame(() => {
            popup.style.opacity = '1';
            popup.style.transform = 'translate(-50%, 0)';
        });

        clearTimeout(popupTimer);
        popupTimer = setTimeout(() => {
            popup.style.opacity = '0';
            popup.style.transform = 'translate(-50%, 4px)';
        }, 1600);
    }

    // ==========================================
    // WISHLIST & CART STORAGE + POPUP + COLOR CHANGE
    // ==========================================

    var wishlistItems = JSON.parse(localStorage.getItem("forma_wishlist")) || [];
    var cartItems = JSON.parse(localStorage.getItem("forma_cart")) || [];

    function getProductId(button) {
        var card = button.closest("[data-product-id]");
        if (card) {
            return card.getAttribute("data-product-id");
        }

        var itemBox = button.closest(".featured-item, .shop-card");
        if (itemBox) {
            var link = itemBox.querySelector("a[href*='shop-product']");
            if (link) {
                var href = link.getAttribute("href");
                if (href.indexOf("product1") !== -1) return "product-1";
                if (href.indexOf("product2") !== -1) return "product-2";
                if (href.indexOf("product3") !== -1) return "product-3";
            }
        }

        var pageUrl = window.location.href;
        if (pageUrl.indexOf("product1") !== -1) return "product-1";
        if (pageUrl.indexOf("product2") !== -1) return "product-2";
        if (pageUrl.indexOf("product3") !== -1) return "product-3";

        return "product-1";
    }

    // 1. WISHLIST / FAVORITES BUTTONS
    var wishlistButtons = document.querySelectorAll(".btn-wishlist, .wishlist-button, .liked-button, button[aria-label*='wishlist']");

    for (var i = 0; i < wishlistButtons.length; i++) {
        (function (btn) {
            var productId = getProductId(btn);
            var isFavoritesPage = window.location.href.indexOf("favorites-bootstrap.html") !== -1;

            if (!isFavoritesPage && wishlistItems.indexOf(productId) !== -1) {
                btn.classList.add("is-active");
                btn.style.backgroundColor = "var(--color-accent)";
            }

            btn.addEventListener("click", function (e) {
                e.preventDefault();
                wishlistItems = JSON.parse(localStorage.getItem("forma_wishlist")) || [];
                var index = wishlistItems.indexOf(productId);

                if (index === -1) {
                    wishlistItems.push(productId);
                    localStorage.setItem("forma_wishlist", JSON.stringify(wishlistItems));
                    btn.classList.add("is-active");
                    if (!isFavoritesPage) {
                        btn.style.backgroundColor = "var(--color-accent)";
                    }
                    showPopupNear(btn, "Added to wishlist");
                } else {
                    wishlistItems.splice(index, 1);
                    localStorage.setItem("forma_wishlist", JSON.stringify(wishlistItems));
                    btn.classList.remove("is-active");
                    if (!isFavoritesPage) {
                        btn.style.backgroundColor = "var(--color-primary)";
                    }
                    showPopupNear(btn, "Removed from wishlist");

                    if (isFavoritesPage) {
                        var col = btn.closest("[class*='col-']");
                        if (col) col.style.display = "none";
                    }
                }
            });
        })(wishlistButtons[i]);
    }

    // 2. ADD TO CART / CART BUTTONS
    var cartButtons = document.querySelectorAll(".btn-cart, .cart-button, .added-button, button[aria-label*='cart']");

    for (var j = 0; j < cartButtons.length; j++) {
        (function (btn) {
            var productId = getProductId(btn);
            var isCartPage = window.location.href.indexOf("cart-bootstrap.html") !== -1;

            if (!isCartPage && cartItems.indexOf(productId) !== -1) {
                btn.classList.add("is-active");
                btn.style.backgroundColor = "var(--color-luntian)";
            }

            btn.addEventListener("click", function (e) {
                e.preventDefault();
                cartItems = JSON.parse(localStorage.getItem("forma_cart")) || [];
                var index = cartItems.indexOf(productId);

                if (index === -1) {
                    cartItems.push(productId);
                    localStorage.setItem("forma_cart", JSON.stringify(cartItems));
                    btn.classList.add("is-active");
                    if (!isCartPage) {
                        btn.style.backgroundColor = "var(--color-luntian)";
                    }
                    showPopupNear(btn, "Added to cart");
                } else {
                    cartItems.splice(index, 1);
                    localStorage.setItem("forma_cart", JSON.stringify(cartItems));
                    btn.classList.remove("is-active");
                    if (!isCartPage) {
                        btn.style.backgroundColor = "var(--color-primary)";
                    }
                    showPopupNear(btn, "Removed from cart");

                    if (isCartPage) {
                        var col = btn.closest("[class*='col-']");
                        if (col) col.style.display = "none";
                    }
                }
            });
        })(cartButtons[j]);
    }

    // 3. SYNC CARDS ON FAVORITES & CART PAGES
    if (window.location.href.indexOf("favorites-bootstrap.html") !== -1) {
        var favCards = document.querySelectorAll(".liked-card");
        for (var f = 0; f < favCards.length; f++) {
            var favId = favCards[f].getAttribute("data-product-id");
            if (wishlistItems.indexOf(favId) === -1) {
                var favCol = favCards[f].closest("[class*='col-']");
                if (favCol) favCol.style.display = "none";
            }
        }
    }

    if (window.location.href.indexOf("cart-bootstrap.html") !== -1) {
        var cartCards = document.querySelectorAll(".cart-card");
        for (var c = 0; c < cartCards.length; c++) {
            var cartId = cartCards[c].getAttribute("data-product-id");
            if (cartItems.indexOf(cartId) === -1) {
                var cartCol = cartCards[c].closest("[class*='col-']");
                if (cartCol) cartCol.style.display = "none";
            }
        }
    }

    // ==========================================
    // 4. ACCOUNT, SIGN UP, SIGN IN & PROFILE
    // ==========================================
    function getSessionState() {
        var state = { user: null, loggedIn: false };

        // 1. Check URL parameter (survives file:/// page changes)
        try {
            var params = new URLSearchParams(window.location.search);
            var urlData = params.get("forma_session");
            if (urlData) {
                state = JSON.parse(decodeURIComponent(urlData));
            }
        } catch (err) {}

        // 2. Check window.name (survives file:/// tab navigation)
        try {
            if (!state.user && window.name && window.name.indexOf("FORMA_STATE:") === 0) {
                state = JSON.parse(window.name.replace("FORMA_STATE:", ""));
            }
        } catch (err) {}

        // 3. Check localStorage (survives Live Server / http://)
        try {
            var lsUser = JSON.parse(localStorage.getItem("forma_user"));
            var lsLoggedIn = localStorage.getItem("forma_logged_in") === "true";
            if (lsUser) state.user = lsUser;
            if (lsLoggedIn) state.loggedIn = true;
        } catch (err) {}

        return state;
    }

    function saveSessionState(user, loggedIn) {
        var state = { user: user, loggedIn: loggedIn };
        try {
            window.name = "FORMA_STATE:" + JSON.stringify(state);
        } catch (err) {}
        try {
            if (user) {
                localStorage.setItem("forma_user", JSON.stringify(user));
            }
            localStorage.setItem("forma_logged_in", loggedIn ? "true" : "false");
        } catch (err) {}
        return encodeURIComponent(JSON.stringify(state));
    }

    function goToPageWithSession(pageUrl, user, loggedIn) {
        var encoded = saveSessionState(user, loggedIn);
        var separator = pageUrl.indexOf("?") === -1 ? "?" : "&";
        window.location.href = pageUrl + separator + "forma_session=" + encoded;
    }

    var session = getSessionState();
    var savedUser = session.user;
    var isLoggedIn = session.loggedIn;

    // Keep session alive across ALL internal .html links
    if (savedUser || isLoggedIn) {
        saveSessionState(savedUser, isLoggedIn);
        var encodedCurrent = encodeURIComponent(JSON.stringify(session));
        var allPageLinks = document.querySelectorAll('a[href*=".html"]');
        for (var k = 0; k < allPageLinks.length; k++) {
            var rawHref = allPageLinks[k].getAttribute("href");
            if (rawHref && rawHref.indexOf("http") !== 0 && rawHref.indexOf("forma_session=") === -1) {
                var sep = rawHref.indexOf("?") === -1 ? "?" : "&";
                allPageLinks[k].setAttribute("href", rawHref + sep + "forma_session=" + encodedCurrent);
            }
        }
    }

    // Header Account / Profile Icon Redirect (matches any Account/Profile link in header)
    var accountLinks = document.querySelectorAll(
        'header a[aria-label="Account"], header a[aria-label="Profile"], .icon-nav a[href*="signin"], .icon-nav a[href*="profile"]'
    );
    for (var a = 0; a < accountLinks.length; a++) {
        var targetPage = (isLoggedIn && savedUser) ? "profile-bootstrap.html" : "signin-bootstrap.html";
        if (savedUser || isLoggedIn) {
            var enc = encodeURIComponent(JSON.stringify(session));
            accountLinks[a].setAttribute("href", targetPage + "?forma_session=" + enc);
        } else {
            accountLinks[a].setAttribute("href", targetPage);
        }

        accountLinks[a].addEventListener("click", function (e) {
            e.preventDefault();
            var current = getSessionState();
            if (current.loggedIn && current.user) {
                goToPageWithSession("profile-bootstrap.html", current.user, true);
            } else {
                goToPageWithSession("signin-bootstrap.html", current.user, false);
            }
        });
    }

    // Sign Up Page (signup-bootstrap.html)
    var signupForm = document.getElementById("cacc-form") || (window.location.href.indexOf("signup") !== -1 ? document.querySelector("form") : null);
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();

            var fnameEl = document.getElementById("fname");
            var lnameEl = document.getElementById("lname");
            var emailEl = document.getElementById("email");
            var mobileEl = document.getElementById("mnumber");
            var bdayEl = document.getElementById("bday");
            var passEl = document.getElementById("password");

            var userData = {
                firstName: fnameEl ? fnameEl.value.trim() : "",
                lastName: lnameEl ? lnameEl.value.trim() : "",
                email: emailEl ? emailEl.value.trim() : "",
                mobile: mobileEl ? mobileEl.value.trim() : "",
                birthday: bdayEl ? bdayEl.value : "",
                password: passEl ? passEl.value : ""
            };

            if (!userData.email || !userData.password) {
                alert("Please fill in your email and password.");
                return;
            }

            alert("Account created! Please sign in.");
            goToPageWithSession("signin-bootstrap.html", userData, false);
        });
    }

    // Sign In Page (signin-bootstrap.html)
    var signinForm = document.getElementById("signin-form") || (window.location.href.indexOf("signin") !== -1 ? document.querySelector("form") : null);
    if (signinForm) {
        signinForm.addEventListener("submit", function (e) {
            e.preventDefault();

            var emailInput = document.getElementById("email") || signinForm.querySelector('input[type="email"]');
            var passInput = document.getElementById("password") || signinForm.querySelector('input[type="password"]');

            var enteredEmail = emailInput ? emailInput.value.trim() : "";
            var enteredPassword = passInput ? passInput.value : "";
            var latestUser = getSessionState().user;

            if (!latestUser) {
                alert("No account found. Please create an account first.");
                goToPageWithSession("signup-bootstrap.html", null, false);
                return;
            }

            if (enteredEmail === latestUser.email && enteredPassword === latestUser.password) {
                goToPageWithSession("profile-bootstrap.html", latestUser, true);
            } else {
                alert("Incorrect email or password. Please try again.");
            }
        });
    }

    // Profile Page (profile-bootstrap.html)
    var profileDetails = document.querySelector(".profile-details");
    if (profileDetails) {
        function maskEmail(email) {
            var parts = email.split("@");
            if (parts.length !== 2) return email;
            var visible = parts[0].slice(0, 2);
            return visible + "**********@" + parts[1];
        }

        function maskPhone(phone) {
            if (!phone || phone.length <= 2) return phone || "***********00";
            return "***********" + phone.slice(-2);
        }

        function maskBirthday(bday) {
            if (!bday) return "**/**/2026";
            var year = bday.split("-")[0];
            return "**/**/" + year;
        }

        var values = profileDetails.querySelectorAll(".profile-value");
        if (values.length >= 4 && savedUser) {
            values[0].textContent = savedUser.firstName + " " + savedUser.lastName;
            values[1].textContent = maskEmail(savedUser.email);
            values[2].textContent = maskPhone(savedUser.mobile);
            values[3].textContent = maskBirthday(savedUser.birthday);
        }

        var logoutBtn = document.createElement("button");
        logoutBtn.type = "button";
        logoutBtn.textContent = "Log Out";
        logoutBtn.className = "signin-submit mt-5";
        logoutBtn.style.width = "auto";
        logoutBtn.style.padding = "9px 28px";

        logoutBtn.addEventListener("click", function () {
            goToPageWithSession("signin-bootstrap.html", savedUser, false);
        });

        profileDetails.appendChild(logoutBtn);
    }
});