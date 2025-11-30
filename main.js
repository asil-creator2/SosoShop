let loading = document.getElementById('loader');
let productsContainer = document.getElementById('products-container');
let search = document.getElementById('searchInput')
let searchBtn = document.getElementById('search-btn')
let categoryFilter = document.getElementById('categories')
let home = document.getElementById('home')
let switchTheme = document.getElementById("checkbox")
let cartIcon = document.getElementById('cartIcon')
let cartCount = document.getElementById('cartCount')
let cartContainer = document.getElementById('cartContainer')
let mainUserPage = document.getElementById('userPage');
let slideContainer = document.getElementById('slideshow-container')
let dotsContainer = document.getElementById('dots')
// local storage
let cart = []
let user = JSON.parse(localStorage.getItem('currentUser'));
cart = loadCart();


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
            }, 1300);
        });
});

// update the cart number in the navbar
function updateCartCount() {
    cartCount.innerText = cart.length;
}
// active the loader when getting products
function activeLoader() {
    loading.classList.add('active');
}
// disable the loader when products are gotten
function disableLoader() {
    loading.classList.remove('active');
}
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
            <div class="quantity-box">
                <button class="qty-btn minus">−</button>
                <span class="qty-value">1</span>
                <button class="qty-btn plus">+</button>
            </div>


            <div class="product-price">$${product.price}</div>

            <div class="product-actions">
                <button class="add-to-cart" data-id="${product.id}">
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
            attachCartEvents();
            attachQuantityEvents(1)
        });
    }
    else{
        productsContainer.innerHTML = "";
        products.forEach(product => makeCard(productsContainer,product));
        attachCartEvents();
        attachQuantityEvents(1)
    }
}
// handles the search 
function filtering() {
    productsPromise.then(products => {

        clear();

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

        productsContainer.innerHTML = '';

        if (filteredProducts.length > 0) {
            combineCards(filteredProducts, "sub");
        } 
        else {
            productsContainer.innerHTML = `
                <h2 class="noProducts">No products found</h2>
            `;
        }

    });
}
// clears the search input
function clear(){
    let clearBtn = document.getElementById('x')
    clearBtn.onclick = () => {
        search.value = ''
        filtering()
    }
}
// the user page that shows when the user click his name
function userPage() {
    const userH = document.getElementById('user');

    userH.innerHTML = `<i class="fa-solid fa-user"></i> ${user.name}`;

    userH.addEventListener('click', () => {
        productsContainer.innerHTML = '';
        categoryFilter.style.opacity = 0;

        mainUserPage.style.opacity = 1;
        mainUserPage.style.display = 'block';
        productsContainer.innerHTML = ''
        cartContainer.innerHTML = ''
        slideContainer.style.display = 'none'
        dotsContainer.style.display = 'none'

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
// load the cart when the website is loaded
function loadCart() {
    if (!user || !user.email) return [];
    return JSON.parse(localStorage.getItem(`cart_${user.email}`)) || [];
}
// save the cart in local storege
function saveCart() {
    if (!user || !user.email) return;
    localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
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
// add the product in the cart
function cartMake(product) {
    // 1. Update the Data
    cart.push(product);
    saveCart()
    // 2. Update the Counter UI
    cartCount.innerText = cart.length;

    console.log("Added to cart:", product.title);
    Swal.fire({
    title: 'Success!',
    text: 'Item was succesfully added to cart',
    icon: 'success'
    })
}
// make the card for the products in the cart
function makeCartCard(product) {
    // Note the added <div class="product-card"> wrapper
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
                    <button class="qty-btn minus">−</button>
                    <span class="qty-value">${product.quantity}</span>
                    <button class="qty-btn plus">+</button>
                </div>

                <div class="product-price">$${product.price}</div>

                <div class="product-actions">
                    <button class="remove-from-cart" data-id="${product.id}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div> 
        </div> `;
}

function attachQuantityEvents() {
    document.querySelectorAll('.quantity-box').forEach(box => {
        let plus = box.querySelector('.plus');
        let minus = box.querySelector('.minus');
        let value = box.querySelector('.qty-value');

        let card = box.closest('.product-card');

        // حالة الصفحة الرئيسية (لا يوجد cart array)
        if (!card.dataset.id) {
            let count = parseInt(value.textContent);

            plus.addEventListener('click', () => {
                count++;
                value.textContent = count;
            });

            minus.addEventListener('click', () => {
                if (count > 1) {
                    count--;
                    value.textContent = count;
                }
            });

            return;
        }

        // -------------------------
        // حالة السلة (cart items)
        // -------------------------

        let id = Number(card.dataset.id);

        let productInCart = cart.find(item => item.id === id);

        // تأكد أن له quantity
        if (!productInCart.quantity) {productInCart.quantity = 1};

        value.textContent = productInCart.quantity;

        plus.addEventListener('click', () => {
            productInCart.quantity++;
            value.textContent = productInCart.quantity;
            saveCart();
        });

        minus.addEventListener('click', () => {
            if (productInCart.quantity > 1) {
                productInCart.quantity--;
                value.textContent = productInCart.quantity;
                saveCart();
            }
        });
    });
}

// display all cart products when clicking cart
function displayCart() {
    // Hides the shop
    productsContainer.style.display = 'none';
    categoryFilter.style.opacity = 0;
    
    // Shows the cart and enables grid layout
    cartContainer.style.display = 'grid';
    cartContainer.innerHTML = '';   
    mainUserPage.style.display = 'none'
    mainUserPage.style.opacity = 0
    slideContainer.style.display = 'none'
    dotsContainer.style.display = 'none'

    // ... (rest of the logic for handling empty cart and item display)
    if(cart.length === 0) {
        cartContainer.innerHTML = '<h2 class="case">Cart is Empty</h2>';
    } else {
        cart.forEach(product => {
            cartContainer.innerHTML += makeCartCard(product);

        });
        attachRemoveEvents();
        attachQuantityEvents()
    }
}
// attach these events to the products in the cart
function attachRemoveEvents() {
    let removeBtns = document.querySelectorAll('.remove-from-cart');

    removeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;

            const index = cart.findIndex(item => item.id == id);

            // If found, remove ONLY that one item (splice takes index and quantity)
            if (index > -1) {
                cart.splice(index, 1);
            }

            // Update storage
            saveCart()
            // Update counter
            cartCount.innerText = cart.length;

            if (cart.length === 0) {

                Swal.fire({
                    title: 'Removed',
                    text: 'Your cart is now empty',
                    icon: 'info',
                    timer: 1500,
                    showConfirmButton: false
                });

                cartContainer.innerHTML = '<h2 class="case">Cart is Empty</h2>';
                return;             } else {
                // Refresh cart visual to show item is gone
                displayCart(); 
 
                Swal.fire({
                    title: 'Removed',
                    text: 'item was removed from your cart',
                    icon: 'info',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    });
}
// attach these events for all the products
function attachCartEvents() {
    let addBtns = document.querySelectorAll('.add-to-cart');

    addBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card')
            const qty = parseInt(card.querySelector('.qty-value').textContent); // get selected quantity


            productsPromise.then(products => {
                const id =Number(btn.dataset.id);
                const product = products.find(p => p.id == id);
                const  selectedProduct = {...product}
                const productExists = cart.find(item => Number(item.id) === id);

                selectedProduct.quantity = qty
                if (product && !productExists) {
                    cartMake(selectedProduct);
                }
                else{
                    productExists.quantity = productExists.quantity + qty
                    saveCart()
                }
                updateCartCount()
            });
        });
    });
}


// ----------------start slider-----------------------
let slideIndex = -1; // مهم جدًا
showSlide();

function showSlide() {
    let i;
    let dots = document.getElementsByClassName('dot');
    let slides = document.getElementsByClassName('mySlides');

    // Hide all slides
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }

    // Move to next slide
    slideIndex++;

    // If end → restart
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }

    // Remove active from all dots
    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }

    // Show current slide + activate dot
    slides[slideIndex].style.display = 'block';
    dots[slideIndex].classList.add('active');

    // Loop
    setTimeout(showSlide, 2000);
}
// --------------------end slider----------------------



combineCards(productsPromise,'main')

switchTheme.addEventListener("change", () => {
    document.body.classList.toggle("dark");
});
search.addEventListener('input', filtering)

cartIcon.addEventListener('click', displayCart);


home.addEventListener('click' , () => {
    // Hide Cart, Show Shop
    cartContainer.style.display = 'none';
    productsContainer.style.display = 'grid'; // or 'flex', depending on your CSS
    
    categoryFilter.style.opacity = 1;
    mainUserPage.style.opacity = 0;
    mainUserPage.style.display = 'none';
    slideContainer.style.display = 'block'
    slideContainer.style.opacity = 1
    dotsContainer.style.display = 'block'
    dotsContainer.style.opacity = 1


    
    // Check if products are already loaded so we don't fetch again unnecessarily
    if(productsContainer.innerHTML === "") {
        combineCards(productsPromise, 'main');
    }
});
searchBtn.addEventListener('click' , filtering)

categoryFilter.addEventListener('change' , filtering)
updateCartCount();
getUser()
clear()

