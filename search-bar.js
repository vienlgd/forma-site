// get the search bar in the header -- this to easily search the t-shirts
var searchBar = document.querySelector(".icon-nav input[type='text']");

// list of all Forma products so the search bar works on every page
var allProducts = [
    { name: "Everyday Comfort T-shirt", price: "₱ 259", link: "shop-product1-bootstrap.html" },
    { name: "Do Good Work T-shirt", price: "₱ 259", link: "shop-product2-bootstrap.html" },
    { name: "Don't Be Late T-shirt", price: "₱ 259", link: "shop-product3-bootstrap.html" }
];

if (searchBar) {
    // make sure the parent div can hold a dropdown box
    var navBox = searchBar.parentElement;
    navBox.style.position = "relative";

    // create a simple dropdown box below the search input
    var resultBox = document.createElement("div");
    resultBox.id = "search-dropdown";
    resultBox.style.position = "absolute";
    resultBox.style.top = "42px";
    resultBox.style.left = "0";
    resultBox.style.width = "240px";
    resultBox.style.backgroundColor = "#ffffff";
    resultBox.style.border = "1px solid #ddd";
    resultBox.style.borderRadius = "8px";
    resultBox.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
    resultBox.style.zIndex = "9999";
    resultBox.style.display = "none";
    resultBox.style.overflow = "hidden";
    navBox.appendChild(resultBox);

    // function to show matching products in the dropdown
    function showSearchResults(keyword) {
        var text = keyword.toLowerCase().trim();
        resultBox.innerHTML = ""; // clear old results

        if (text === "") {
            resultBox.style.display = "none";
            return;
        }

        var foundCount = 0;

        // loop through all 3 shirts
        for (var i = 0; i < allProducts.length; i++) {
            var item = allProducts[i];

            if (item.name.toLowerCase().indexOf(text) !== -1) {
                foundCount = foundCount + 1;

                var link = document.createElement("a");
                link.href = item.link;
                link.textContent = item.name + " (" + item.price + ")";
                link.style.display = "block";
                link.style.padding = "10px 12px";
                link.style.fontSize = "13px";
                link.style.color = "#222";
                link.style.textDecoration = "none";
                link.style.borderBottom = "1px solid #f0f0f0";

                resultBox.appendChild(link);
            }
        }

        // if nothing matched
        if (foundCount === 0) {
            var emptyText = document.createElement("p");
            emptyText.textContent = "No matching shirts found";
            emptyText.style.margin = "0";
            emptyText.style.padding = "10px 12px";
            emptyText.style.fontSize = "13px";
            emptyText.style.color = "#777";
            resultBox.appendChild(emptyText);
        }

        resultBox.style.display = "block";
    }

    // show results as the user types
    searchBar.addEventListener("input", function () {
        showSearchResults(searchBar.value);
    });

    // stop Enter from redirecting to shop-bootstrap.html
    searchBar.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            showSearchResults(searchBar.value);
        }
    });

    // hide dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!navBox.contains(event.target)) {
            resultBox.style.display = "none";
        }
    });
}