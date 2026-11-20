const TO_ADDRESS = "hello@examplewebsite142.com";
const form = document.querySelector("#contact-form");

function buildMailto() {
    const name = document.querySelector("#full-name").value;
    const email = document.querySelector("#email").value;
    const text = document.querySelector("#message").value;

    const subject = "[NEW] Website Inquiry from " + name;
    const body =
        "Name: " + name + "\r\n" +
        "Email: " + email + "\r\n\r\n" +
        text;

    return (
        "mailto:" + TO_ADDRESS +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body)
    );
}

// Custom pop-up feedback matching Forma's design
function showStatusPopup(message) {
    const submitBtn = form.querySelector(".contact-submit");
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
    const rect = submitBtn.getBoundingClientRect();
    popup.style.left = `${rect.left + rect.width / 2}px`;
    popup.style.top = `${rect.top - popup.offsetHeight - 8}px`;
    popup.style.opacity = "1";
    popup.style.transform = "translate(-50%, 0)";

    setTimeout(() => {
        popup.style.opacity = "0";
        popup.style.transform = "translate(-50%, 4px)";
    }, 2200);
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    showStatusPopup("Opening email...");
    window.location.href = buildMailto();
});
