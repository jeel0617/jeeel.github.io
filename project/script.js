document.addEventListener('DOMContentLoaded', function () {

    const startBtn = document.getElementById("start-order-btn");
    const welcomeScreen = document.getElementById("welcome-screen");
    const orderTypeScreen = document.getElementById("order-type-screen");
    const dineInBtn = document.getElementById("dine-in-btn");
    const takeOutBtn = document.getElementById("take-out-btn");
    const menuScreen = document.getElementById("menu-screen");
    const sideNav = document.querySelector(".side-navigation");
    const sideBar = document.querySelector(".sidebar");
    let orderType = ""; 

    startBtn.addEventListener("click", function () {
        welcomeScreen.style.display = "none";
        orderTypeScreen.style.display = "flex";
    });

    dineInBtn.addEventListener("click", () => {
        orderType = "Dine In";
        showMenu();
    });     

    takeOutBtn.addEventListener("click", () => {
        orderType = "Take Out";
        showMenu();
    });

    function showMenu() {
        orderTypeScreen.style.display = "none";
        menuScreen.style.display = "block";
        sideNav.style.left = "0px";
        sideBar.style.right = "0px";

        document.querySelector(".sidebar-header").innerHTML = `<h3>My Orders (${orderType})</h3>`;
        
        const sandwichIcon = document.querySelector(".sandwich-icon");
        const cartIcon = document.querySelector(".cart-icon");

        if (sandwichIcon) sandwichIcon.style.display = "none";
        cartIcon.style.display = "none";
    }

    let cartItems = [];
    let totalAmount = 0;

    const cartCount = document.querySelector(".cart-icon span");
    const orderContainer = document.querySelector(".order-items");
    const totalDisplay = document.querySelector(".cart-total");

    function updateCart() {
        orderContainer.innerHTML = "";
        let count = 0;

        for (let item of cartItems) {
            count  +=item.qty;
        }   

        cartCount.textContent = count;

        if (cartItems.length === 0) {
            orderContainer.innerHTML = "<div class='empty-cart'>Your cart is empty</div>";
        } else {
            cartItems.forEach((item, i) => {
                const div = document.createElement("div");
                div.className = "order-item";
                div.innerHTML = `
                    ${item.qty}x ${item.name} - ₱${(item.qty * item.price).toFixed(2)}
                    <button class='remove-btn' data-index='${i}'>−</button>
                `;
                orderContainer.appendChild(div);
            });
        }
        
        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.onclick = (e) => {
                const index = e.target.dataset.index;
                const item = cartItems[index];
                
                item.qty -= 1;
                totalAmount -= item.price;
                
                if (item.qty <= 0) {
                    cartItems.splice(index, 1);
                }
                
                updateCart();
            };
        });
        
        

        totalDisplay.textContent = "₱" + totalAmount.toFixed(2);
        totalDisplay.style.fontSize = "18px";
        totalDisplay.style.fontWeight = "bold";

        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = this.getAttribute("data-i");
                totalAmount -= cartItems[index].price * cartItems[index].qty;
                cartItems.splice(index, 1);
                updateCart();
            });
        });
    }

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const card = this.closest(".card");
            const name = card.querySelector(".card--title").textContent.trim();
            const price = parseFloat(card.querySelector(".price").textContent.replace("₱", ""));
            
            let found = cartItems.find(item => item.name === name);
            if (found) {
                found.qty++;
            } else {
                cartItems.push({ name, price, qty: 1 });
            }

            totalAmount += price;
            updateCart();
        });
    });

    const categoryBtns = document.querySelectorAll(".category-item");
    const allCards = document.querySelectorAll(".card");

    categoryBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const category = this.getAttribute("data-category");
            categoryBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            allCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category");
                card.style.display = (category === "all" || cardCategory === category) ? "flex" : "none";
            });
        });
    });

    document.querySelectorAll(".side-nav-item").forEach(item => {
        item.addEventListener("click", function () {
            const category = this.getAttribute("data-category");
            document.querySelector(`.category-item[data-category='${category}']`)?.click();
        });
    });

    document.querySelector('.total--amount h5').style.fontSize = '18px';

  

document.querySelector(".checkout-btn").addEventListener("click", function () {
    if (cartItems.length === 0) {
        alert("Please select your orders first");
        return;
    }

    const payment = document.querySelector('input[name="payment"]:checked').value;
    const orderNumber = "VC" + Math.floor(100000 + Math.random() * 900000);
    const date = new Date().toLocaleString();

    /* receipt window */
    const receiptWindow = window.open('', '', 'width=400,height=600');
    if (!receiptWindow) {
        alert("Popup blocked! Please allow popups for this site.");
        return;
    }

    /* receipt content */
    receiptWindow.document.write(`
        <html>
        <head>
            <title>Receipt - VARLEYCIOUS!</title>
            <style>
                body { font-family: 'Poppins', sans-serif; padding: 20px; background: #FFF8E1; }
                .receipt-container { background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .receipt-header { text-align: center; margin-bottom: 20px; border-bottom: 1px dashed #ccc; padding-bottom: 10px; }
                .receipt-header h2 { color: #4E342E; margin: 0 0 5px; }
                .order-number, .order-date { font-size: 14px; color: #6D5550; }
                .order-type { font-weight: bold; margin: 15px 0; }
                .item-row, .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                .total-row { border-top: 1px solid #ddd; padding-top: 10px; font-weight: bold; font-size: 18px; }
                .print-btn { margin-top: 20px; background: #6D5550; color: white; border: none; padding: 10px; border-radius: 5px; width: 100%; font-size: 16px; }
                .print-btn:hover { background: #4E342E; }
                .close-btn { margin-top: 10px; background: #4E342E; color: white; border: none; padding: 10px; border-radius: 5px; width: 100%; font-size: 16px; }
            </style>
        </head>
        <body>
            <div class="receipt-container">
                <div class="receipt-header">
                    <h2>VARLEYCIOUS!</h2>
                    <div class="order-number">Order #${orderNumber}</div>
                    <div class="order-date">${date}</div>
                </div>
                <div class="order-type">Order Type: ${orderType}</div>
                <div class="payment-method-info">Payment Method: ${payment}</div>
    `);

    cartItems.forEach(item => {
        receiptWindow.document.write(`
            <div class="item-row">
                <div>${item.name} x${item.qty}</div>
                <div>₱${(item.qty * item.price).toFixed(2)}</div>
            </div>
        `);
    });

    receiptWindow.document.write(`
                <div class="total-row">
                    <div>Total:</div>
                    <div>₱${totalAmount.toFixed(2)}</div>
                </div>
                <button class="print-btn" onclick="window.print()">Print Receipt</button>
                <button class="close-btn" onclick="window.close(); opener.location.reload();">Close Receipt</button>
            </div>
        </body>
        </html>
    `);
    
    receiptWindow.document.close();
    
    receiptWindow.onbeforeunload = function() {
        /* reset to welcome screen */
        setTimeout(function() {
            window.location.reload();
        }, 500);
    };

    cartItems = [];
    totalAmount = 0;
    updateCart();
});

    document.querySelector(".search--box input").addEventListener("input", function () {
        const value = this.value.toLowerCase();
        allCards.forEach(card => {
            const name = card.querySelector(".card--title").textContent.toLowerCase();
            card.style.display = name.includes(value) ? "flex" : "none";
        });
    });

    updateCart();
});


document.addEventListener('DOMContentLoaded', () => {
    const sideNav = document.querySelector(".side-navigation");
    const sideBar = document.querySelector(".sidebar");
  
    const navWidth = "250px";
    const cartWidth = "300px";
  
    document.getElementById('toggle-nav').addEventListener('click', () => {
      const isNavOpen = sideNav.style.left === "0px" || !sideNav.style.left;
      sideNav.style.left = isNavOpen ? `-${navWidth}` : "0px";
  
    
      if (sideBar.style.right === "0px") {
        sideBar.style.right = `-${cartWidth}`;
      }
    });
  
    document.getElementById('toggle-cart').addEventListener('click', () => {
      const isCartOpen = sideBar.style.right === "0px" || !sideBar.style.right;
      sideBar.style.right = isCartOpen ? `-${cartWidth}` : "0px";
  
    
      if (sideNav.style.left === "0px") {
        sideNav.style.left = `-${navWidth}`;
      }
    });
  });

  
  