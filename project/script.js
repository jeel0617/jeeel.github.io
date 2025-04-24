document.addEventListener('DOMContentLoaded', function () {

    var startBtn = document.getElementById("start-order-btn");
    var welcomeScreen = document.getElementById("welcome-screen");
    var menuScreen = document.getElementById("menu-screen");
    var sideNav = document.querySelector(".side-navigation");
    var sideBar = document.querySelector(".sidebar");

    startBtn.addEventListener("click", function () {
        welcomeScreen.style.display = "none";
        menuScreen.style.display = "block";
        sideNav.style.left = "0px";
        sideBar.style.right = "0px";

     
        var cartIcon = document.querySelector(".cart-icon");

        sandwichIcon.style.display = "none";
        cartIcon.style.display = "none";
    });

    var cartItems = [];
    var totalAmount = 0;

    var cartCount = document.querySelector(".cart-icon span");
    var orderContainer = document.querySelector(".order-items");
    var totalDisplay = document.querySelector(".cart-total");

    function updateCart() {
        orderContainer.innerHTML = "";
        var count = 0;

        for (var i = 0; i < cartItems.length; i++) {
            count += cartItems[i].qty;
        }

        cartCount.textContent = count;

        for (var j = 0; j < cartItems.length; j++) {
            var div = document.createElement("div");
            div.className = "order-item";
            div.innerHTML = cartItems[j].qty + "x " + cartItems[j].name + " - ₱" + (cartItems[j].qty * cartItems[j].price).toFixed(2) + 
                " <button class='remove-btn' data-i='" + j + "'>x</button>";
            orderContainer.appendChild(div);
        }

        totalDisplay.textContent = "₱" + totalAmount.toFixed(2);

        var removeBtns = document.querySelectorAll(".remove-btn");
        for (var r = 0; r < removeBtns.length; r++) {
            removeBtns[r].addEventListener("click", function () {
                var index = this.getAttribute("data-i");
                totalAmount -= cartItems[index].price * cartItems[index].qty;
                cartItems.splice(index, 1);
                updateCart();
            });
        }
    }

    var addButtons = document.querySelectorAll(".add-to-cart");
    for (var a = 0; a < addButtons.length; a++) {
        addButtons[a].addEventListener("click", function () {
            var parent = this.closest(".card");
            var itemTitle = parent.querySelector(".card--title").textContent.trim();
            var priceStr = parent.querySelector(".price").textContent;
            var itemPrice = parseFloat(priceStr.replace("₱", ""));

            var isFound = false;

            for (var k = 0; k < cartItems.length; k++) {
                if (cartItems[k].name === itemTitle) {
                    cartItems[k].qty += 1;
                    isFound = true;
                    break;
                }
            }

            if (!isFound) {
                cartItems.push({
                    name: itemTitle,
                    price: itemPrice,
                    qty: 1
                });
            }

            totalAmount += itemPrice;
            updateCart();
        });
    }

    var categoryBtns = document.querySelectorAll(".category-item");
    var allCards = document.querySelectorAll(".card");

    for (var c = 0; c < categoryBtns.length; c++) {
        categoryBtns[c].addEventListener("click", function () {
            var cat = this.getAttribute("data-category");

            for (var i = 0; i < categoryBtns.length; i++) {
                categoryBtns[i].classList.remove("active");
            }

            this.classList.add("active");

            for (var j = 0; j < allCards.length; j++) {
                var cardCat = allCards[j].getAttribute("data-category");
                if (cat === "all" || cardCat === cat) {
                    allCards[j].style.display = "flex";
                } else {
                    allCards[j].style.display = "none";
                }
            }
        });
    }

    var navItems = document.querySelectorAll(".side-nav-item");
    for (var n = 0; n < navItems.length; n++) {
        navItems[n].addEventListener("click", function () {
            var cat = this.getAttribute("data-category");
            var match = document.querySelector(".category-item[data-category='" + cat + "']");
            if (match) {
                match.click();
            }
        });
    }

    var checkout = document.querySelector(".checkout-btn");
    checkout.addEventListener("click", function () {
        if (cartItems.length === 0) {
            alert("Erm? Select your orders first");
            return;
        }
    
        let receiptWindow = window.open('', '', 'width=400,height=600');
        receiptWindow.document.write(`
            <html>
            <head>
                <title>Receipt - VARLEYCIOUS!</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h2 { text-align: center; }
                    .item { margin-bottom: 10px; }
                    .total { font-weight: bold; margin-top: 20px; border-top: 1px solid #000; padding-top: 10px; }
                </style>
            </head>
            <body>
                <h2>VARLEYCIOUS! Receipt</h2>
        `);
    
        cartItems.forEach(item => {
            let subtotal = item.qty * item.price;
            receiptWindow.document.write(`
                <div class="item">${item.name} x${item.qty} - ₱${subtotal.toFixed(2)}</div>
            `);
        });
    
        receiptWindow.document.write(`
            <div class="total">Total: ₱${totalAmount.toFixed(2)}</div>
            <p style="text-align:center;">Thank you for ordering!</p>
            <script>window.print();<\/script>
            </body></html>
        `);
        receiptWindow.document.close();
    
        // Reset cart
        cartItems = [];
        totalAmount = 0;
        updateCart();
        orderContainer.innerHTML = "<div class='empty-cart'>Your cart is empty</div>";
    });

    var searchBar = document.querySelector(".search--box input");
    searchBar.addEventListener("input", function () {
        var value = this.value.toLowerCase();

        for (var s = 0; s < allCards.length; s++) {
            var itemName = allCards[s].querySelector(".card--title").textContent.toLowerCase();
            if (itemName.includes(value)) {
                allCards[s].style.display = "flex";
            } else {
                allCards[s].style.display = "none";
            }
        }
    });

});
