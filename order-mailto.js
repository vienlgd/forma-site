(function () {
    const TO_ADDRESS = "orders@examplewebsite142.com";
    const order = document.querySelector(".product-form");

    // Exit safely if this script runs on a page without .product-form
    if (!order) return;

    function buildMailto() {
        const productName = document.querySelector(".product-title")?.innerText.trim() || "Unknown Product";
        const productPrice = document.querySelector(".product-price")?.innerText.trim() || "N/A";
        const size = document.querySelector('input[name="size"]:checked')?.value || "Not selected";
        const color = document.querySelector('input[name="color"]:checked')?.value || "Not selected";
        const quantity = document.querySelector("#quantity")?.value || "1";

        const subject = "[NEW ORDER] " + productName;
        const body = 
            "Customer Name: \r\n" +
            "Contact Number: \r\n" +
            "Shipping Information: \r\n" +
            "Item: " + productName + "\r\n" + 
            "Price: " + productPrice + "\r\n" + 
            "Size: " + size + "\r\n" + 
            "Color: " + color + "\r\n" + 
            "Quantity: " + quantity;
        
        return (
            "mailto:" + TO_ADDRESS +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(body)
        );
    }

    function showStatusPopup(message) {
        // Targets the submit button inside .product-form instead of undefined 'form'
        const submitBtn = order.querySelector('button[type="submit"], input[type="submit"]');
        let popup = document.getElementById("forma-cart-popup");

        if (!popup) {
            popup = document.createElement("div");
            popup.id = "forma-cart-popup";
            Object.assign(popup.style, {
                position: "fixed",
                backgroundColor: "var(--color-luntian, #4c733d)",
                color: "#ffffff",
                fontFamily: "'Manrope', sans-serif",
                fontSize: "12.5px",
                fontWeight: "700",
                padding: "7px 14px",
                borderRadius: "6px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.18)",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                zIndex: "9999",
                opacity: "0",
                transition: "opacity 0.2s ease, transform 0.2s ease"
            });
            document.body.appendChild(popup);
        }

        popup.textContent = message;

        if (submitBtn) {
            const rect = submitBtn.getBoundingClientRect();
            popup.style.left = `${rect.left + rect.width / 2}px`;
            popup.style.top = `${rect.top - popup.offsetHeight - 8}px`;
        }

        popup.style.opacity = "1";
        popup.style.transform = "translate(-50%, 0)";

        setTimeout(() => {
            popup.style.opacity = "0";
            popup.style.transform = "translate(-50%, 4px)";
        }, 2200);
    }

    order.addEventListener("submit", function (event) {
        event.preventDefault();
        showStatusPopup("Opening email...");
        window.location.href = buildMailto();
    });
})();