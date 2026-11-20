const WISHLIST_STORAGE_KEY = "forma_wishlist";

function getWishlist() {
  try {
    const saved = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveWishlist(items) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
}

function updateButtonState(button, isWishlisted) {
  button.classList.toggle("is-wishlisted", isWishlisted);
  button.setAttribute("aria-pressed", String(isWishlisted));
}

function syncWishlistButtons() {
  const wishlist = getWishlist();
  const buttons = document.querySelectorAll(".wishlist-button");

  buttons.forEach((button, index) => {
    const card = button.closest("[data-product-id]");
    const productId = card?.dataset.productId || `home-item-${index + 1}`;
    button.dataset.productId = productId;

    updateButtonState(button, wishlist.includes(productId));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  syncWishlistButtons();

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".wishlist-button");
    if (!button) return;

    const productId = button.dataset.productId;
    if (!productId) return;

    const wishlist = getWishlist();
    const itemIndex = wishlist.indexOf(productId);
    let nowWishlisted = false;

    if (itemIndex === -1) {
      wishlist.push(productId);
      nowWishlisted = true;
    } else {
      wishlist.splice(itemIndex, 1);
      nowWishlisted = false;
    }

    saveWishlist(wishlist);
    updateButtonState(button, nowWishlisted);
  });
});