let loading = document.getElementById('loader');
let productsContainer = document.getElementById('products-container');
let search = document.getElementById('searchInput')
let searchBtn = document.getElementById('search-btn')
let categoryFilter = document.getElementById('categories')
let home = document.getElementById('home')
let switchTheme = document.getElementById("checkbox")
let sorting = document.getElementById('sortFilter')
let filters = document.getElementById('filters')
let title = document.getElementById('shopCart')

// ------------user 
let user = JSON.parse(localStorage.getItem('currentUser')) || false;

// ---------------getProducts----------------------
let productsPromise = new Promise((resolve, reject) => {
    activeLoader();

    fetch('https://dummyjson.com/products?limit=2000')
        .then(res => res.json())
        .then(data => {
            setTimeout(() => {
                disableLoader();
                resolve(data.products);
            }, 1300);
        })
        .catch(error => {
            setTimeout(() => {
                disableLoader();
                reject(error);
                // handle the error
                Swal.fire({
                    title : 'An Error accurred',
                    text : `An Error has accured Please Try Again`,
                    icon : 'info',
                    showCancelButton : true,
                    cancelButtonText : `No`,
                    confirmButtonText : 'Try Again'
                }).then(result => {
                    if(result.isConfirmed){
                        window.reload
                    }else{
                        return;
                    }
                })
            }, 1300);
        });
})
// ------------------------------------------------
// -------------------loading---------------------

// active the loader when getting products
function activeLoader() {
    loading.classList.add('active');
}
// disable the loader when products are gotten
function disableLoader() {
    loading.classList.remove('active');
}
// -------------------------------------------
// ------------------show or hide containers---------------
function hideSections(...sections) {
    sections.forEach(sec => sec.style.display = 'none');
}

function showSection(section, display = 'block') {
    section.style.display = display;
    section.style.opacity=1
}
// -----------------------------------------

// --------------------getStars----------------------
// get the number of stars each product has
function generateStarRating(rate) {
    let stars = "";
    const fullStars = Math.floor(rate);
    const halfStar = rate % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    return stars;
}
//------------------------------------------------
// ---------------------products-----------------------
// make the card for the main container
function makeCard(container,product) {
    const card = document.createElement("div");
    card.className = "product-card";
    product.quantity ;
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.thumbnail}" alt="${product.title}">
        </div>

        <div class="product-info">
            <div class="product-category">${product.category}</div>

            <h3 class="product-title">${product.title}</h3>

            <p class="product-description">${product.description}</p>

            <div class="product-rating">
                <div class="stars">${generateStarRating(product.rating)}</div>
                <div class="rating-count">(${product.reviews?.length || 0})</div>
            </div>

            <div class="product-price">$${product.price}</div>

            <div class="product-actions">
                <button class="add-to-cart" onclick = "cartFunctions.addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="wishlist-btn"><i class="far fa-heart"></i></button>
            </div>
        </div>    
    `;

    container.appendChild(card);
}
// make all the cards for the main container
function combineCards(products,key) {
    if (key === 'main'){
        products.then(productsDiv => {
            productsContainer.innerHTML = "";
            productsDiv.forEach(product => makeCard(productsContainer,product));
        });
    }
    else{
        productsContainer.innerHTML = "";
        products.forEach(product => makeCard(productsContainer,product));
    }
}

// ----------------------filtering----------------------------
// handles the search 
function filtering() {
    productsPromise.then(products => {
        let searchValue = search.value.toLowerCase();

        let filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(searchValue) ||
            product.description.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue)
        );

        const selectedCategory = categoryFilter.value;

        if (selectedCategory !== "all") {
            filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
        }

        // Sorting
        if (sorting.value !== 'featured') {
            if (sorting.value === 'price-asc') {
                filteredProducts.sort((a, b) => a.price - b.price);
            } else if (sorting.value === 'price-desc') {
                filteredProducts.sort((a, b) => b.price - a.price);
            } else if (sorting.value === 'rating-asc') {
                filteredProducts.sort((a, b) => a.rating - b.rating);
            } else if (sorting.value === 'rating-desc') {
                filteredProducts.sort((a, b) => b.rating - a.rating);
            }
        }

        productsContainer.innerHTML = '';

        if (filteredProducts.length > 0) {
            combineCards(filteredProducts, "sub");
        } else {
            productsContainer.innerHTML = `<h2 class="noProducts">No products found</h2>`;
        }
    });
}

// ----------------------userPage--------------------------
//elements
let mainUserPage = document.getElementById('userPage');



// the user page that shows when the user click his name
function userPage() {
    const userH = document.getElementById('user');

    userH.innerHTML = `<i class="fa-solid fa-user"></i> ${user.name}`;

    userH.addEventListener('click', () => {
        hideSections(filters)
        productsContainer.innerHTML = '';
        showSection(mainUserPage)
        productsContainer.innerHTML = ''
        cartContainer.innerHTML = ''
        mainUserPage.innerHTML = `
            <div class="profile-card">
                <img id="userImg" class="avatar" src="./image/image.png" alt="User Image">

                <h2 id="userName">${user.name}</h2>
                <p id="userEmail" class="email">${user.email}</p>

                <div class="buttons">
                    <button class="btn edit">Edit Profile</button>
                    <button class="btn logout" id="logoutBtn">Log Out</button>
                </div>
            </div>
        `;
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            location.reload(); // Refresh to reset state
        }); 
    });
}
// get the current user
function getUser() {
    const signUp = document.getElementById('signup-btn');

    if (user && user.email) {
        userPage();
        signUp.classList.remove('active');
    } else {
        signUp.classList.add('active');
        signUp.addEventListener('click', () => {
            window.location.href = './signUp/signUp.html';
        });
    }
}


// display all cart products when clicking cart


// ----------------start slider-----------------------
// swiper
// ال slider بتاع الاعلانات
var swiper = new Swiper(".mySwiper", {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
        pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },

});
// end swiper
// --------------------end slider----------------------
// --------------------cart--------------------------
// cart Elements
let mainCartContainer = document.getElementById('mainCartContainer')
let cart = []
cart = loadCart();
let cartIcon = document.getElementById('cartIcon')
let cartCount = document.getElementById('cartCount')
let cartContainer = document.getElementById('cartContainer')
let box = document.getElementById('box')
let clear = document.getElementById('clear')

// cart Functions
// load the cart when the website is loaded
function loadCart() {
    if (!user || !user.email) return [];
    return JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];
}
// update the cart number in the navbar
function updateCartCount() {
    cartCount.innerText = cart.length;
}
let cartFunctions ={
    totalValue : 0 ,
    total : document.getElementById('summary-total'),

    decrease : function (id) {
        const product = cart.find(product => product.id === id)
        if (product.quantity != 1){
            product.quantity --
        }
        else{
            return;
        }
        saveCart()
        displayCart()
        this.getTotal()
    },
    increase : function(id) {
        const product = cart.find(product => product.id === id)
        product.quantity ++
        saveCart()
        displayCart()
        this.getTotal()
    },
    addToCart : async function (id) {
        const products = await productsPromise;
        const product = products.find(p => p.id === id);

        const productExists = cart.find(item => item.id === id);

        if (productExists) {
            Swal.fire({
                title: 'Product Exists',
                text: `(${productExists.title}) Already Exists`,
                icon: 'info',
                timer: 1500,
                showConfirmButton: false
            });
            return;
        }

        cart.push({
            ...product,
            quantity: 1
        });

        saveCart();
        updateCartCount();


        Swal.fire({
            title: 'Product Added',
            text: `${product.title}\nWas Added Successfully!`,
            icon: 'success'
        });
        this.getTotal()
    },
    remove : function (id) {
        const index = cart.findIndex(product => product.id == id)
        Swal.fire({
            title: "Do You want to remove this Product ? ",
            text: `${cart[index].title}\nWill Be removed from Cart !`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                saveCart();
                cart.splice(index, 1);
                Swal.fire({
                    title: "Product Removed!",
                    text:`${cart[index].title}\nWas Removed from the Cart!`,
                    icon: "success",
                    confirmButtonText: "ok",
                });
                displayCart()
                updateCartCount()
                this.getTotal()
            }
});

    },
    updateTotal : function () {
        this.total.innerHTML = `Total Price : $${this.totalValue.toFixed(2)}`;
    },
    clearCart : function () {
        cart = []
        localStorage.removeItem(`cart_${user.email}`)
        Swal.fire({
            title: "Do You want to clear you Cart  ",
            text: `(Note : this action can't be undone !) ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                saveCart();
                cart = []
                localStorage.removeItem(`cart_${user.email}`)
                Swal.fire({
                    title: "The Cart Was Cleared",
                    text:`The Cart is Now Empty`,
                    icon: "success",
                    confirmButtonText: "Ok",
                });
                displayCart()
                updateCartCount()
            }
        })
    },
    getTotal : function () {
        this.totalValue = 0;
        this.totalValue = cart.reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0);
        this.updateTotal();
    },

}
function displayCart() {
    // Hides the 
    hideSections(filters)
    hideSections(productsContainer,mainUserPage)
    showSection(mainCartContainer)
    showSection(cartContainer,'grid')
    showSection(clear)
    showSection(box)
    title.textContent = 'You Shopping Cart'
    cartContainer.innerHTML = '';   
    cartContainer.classList.remove('billContainer')


    // ... (rest of the logic for handling empty cart and item display)
    if(cart.length === 0) {
        box.style.display = 'none'
        clear.style.display = 'none'
        cartContainer.innerHTML = '<h2 class="case">Cart is Empty</h2>';
        return;
    } else {
        box.style.display = 'block'
        clear.style.display = 'block'

        cart.forEach(product => {
            cartContainer.innerHTML += makeCartCard(product);
        });

    }
    cartFunctions.getTotal()
}
function makeCartCard(product) {
    return `
        <div class="product-card"> 
            <div class="product-image">
                <img src="${product.thumbnail}" alt="${product.title}">
            </div>

            <div class="product-info">
                <div class="product-category">${product.category}</div>

                <h3 class="product-title">${product.title}</h3>

                <p class="product-description">${product.description}</p>

                <div class="product-rating">
                    <div class="stars">${generateStarRating(product.rating)}</div>
                    <div class="rating-count">(${product.reviews?.length || 0})</div>
                </div>
                <div class="quantity-box">
                    <button class="qty-btn minus" onclick = "cartFunctions.decrease(${product.id})">−</button>
                    <span class="qty-value">${product.quantity || 1}</span>
                    <button class="qty-btn plus" onclick = "cartFunctions.increase(${product.id})">+</button>
                </div>

                <div class="product-price">$${product.price}</div>

                <div class="product-actions">
                    <button class="remove-from-cart" onclick = "cartFunctions.remove(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div> 
        </div> `;
}
// save the cart in local storege
function saveCart() {
    if (!user || !user.email) return;
    localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
}
// ----------------------bill-----------------------

let makeBill  = {
    button : document.getElementById('payment'),
    click: function () {
        cartContainer.innerHTML = ''
        productsContainer.innerHTML = ''
        mainUserPage.style.display = 'none'
        cartContainer.classList.add('billContainer')
        cartContainer.style.overflow = 'visible'
        clear.style.display = 'none'

        box.style.opacity = 0
        title.textContent = 'Your Bill'
        // Styled invoice HTML
        cartContainer.innerHTML = `
            <div class="invoice">
                <h2>Invoice</h2>
                <h1>Company : SosoShop</h1>
                <div class="details">
                    <div class="from">
                        <strong>From:</strong><br>
                        Company Address<br>
                        Email: ic.asil2011@gmail.com<br>
                        Phone: 123-456-7890
                    </div>
                    <div class="to">
                        <strong>To:</strong><br>
                        Customer Name : ${user.name}<br>
                        Email: ${user.email}
                    </div>
                </div>

                <table id="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                    <tfoot>
                        <tr class="total">
                            <td colspan="4">Grand Total</td>
                            <td>$${cartFunctions.totalValue.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>

                <div class="footer">
                    Thank you for choosing our Shop!
                </div>
            </div>
            <br>
            <br>
            <button class = "back payment" id = 'back' onclick => <i class="fa-solid fa-arrow-left"></i> Back To Shop</button>
        `

        let tableBody = document.querySelector('#table tbody')

        cart.forEach((product, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${product.title}</td>
                    <td>${product.quantity}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>$${(product.price * product.quantity).toFixed(2)}</td>
                </tr>
            `
        })
        let back = document.getElementById('back')
        back.addEventListener('click', () => {
            // Hide Cart, Show Shop
            hideSections(cartContainer,mainCartContainer,mainUserPage)
            showSection(productsContainer,'grid')
            
            if(productsContainer.innerHTML === "") {
                combineCards(productsPromise, 'main');
            }})

    },
}

// -----------------Theme Toggle -----------------------
// Apply saved theme on page load
const savedTheme = localStorage.getItem(`theme${user.email}`)
if (savedTheme) {
    document.body.className = savedTheme;
    switchTheme.checked = savedTheme === 'dark';
}

// Toggle theme on switch change
switchTheme.addEventListener("change", () => {
    if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        localStorage.setItem(`theme${user.email}`, 'light');
    } else {
        document.body.classList.add("dark");
        localStorage.setItem(`theme${user.email}`, 'dark');
    }
});
//------------------------------------------------------

function runWebsite() {

    combineCards(productsPromise,'main')

    search.addEventListener('input', filtering)

    cartIcon.addEventListener('click', displayCart);

    makeBill.button.addEventListener('click', makeBill.click)

    home.addEventListener('click' , () => {
        // Hide Cart, Show Shop
        hideSections(cartContainer,mainCartContainer,mainUserPage)
        showSection(productsContainer,'grid')
        showSection(filters)
        if(productsContainer.innerHTML === "") {
            combineCards(productsPromise, 'main');
        }
    });

    searchBtn.addEventListener('click' , filtering)

    sorting.addEventListener('change', filtering);

    categoryFilter.addEventListener('change' , filtering)
    updateCartCount();
    getUser()
}



runWebsite()