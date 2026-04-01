function qs(s) { return document.querySelector(s) }
function qsa(s) { return document.querySelectorAll(s) }

const SHOPPING_LIST = qs('#shopping-list')
const ADD_BUTTONS = qsa('.add')
const CART = qs('#cartCounter')
const CLEAR = qs('#clear')

//warunek sprawdza czy element shopping-list istnieje na stronie

if (SHOPPING_LIST) {
        SHOPPING_LIST.addEventListener('click', (e) => {
        const button = e.target.closest('button')
        if (!button) return
        
        const key = button.closest('.cart-item').dataset.key

        if (button.classList.contains('qty-up')) changeQty(key, +1)
        if (button.classList.contains('qty-down')) changeQty(key, -1)
        if (button.classList.contains('remove-item')) removeItem(key)
    })
}

function clearCart() {
    localStorage.clear()
    if (SHOPPING_LIST) loadCart()
    updateCartCounter()
}

function loadCart() {
    if (!SHOPPING_LIST) return

    SHOPPING_LIST.innerHTML = ""
    let totalItems = 0
    let totalPrice = 0

    for (let i = 0; i < localStorage.length; i++) {
        const KEY = localStorage.key(i)
        const VALUE = JSON.parse(localStorage.getItem(KEY))

        totalItems += VALUE.qty
        totalPrice += VALUE.price * VALUE.qty 

        SHOPPING_LIST.insertAdjacentHTML('beforeend', `
            <div class="cart-item glassmorphed" data-key="${KEY}">
                <img src="${VALUE.img}">
                <p class="description">${VALUE.desc}</p>
                <p class="price">Cena: ${VALUE.price*VALUE.qty}zł</p>
                <div class="qty-controls">
                    <button class="qty-up">
                        <i class="fa-solid fa-angle-up"></i>
                    </button>
                    <span class="amount">${VALUE.qty}</span>
                    <button class="qty-down">
                        <i class="fa-solid fa-angle-down"></i>
                    </button>
                </div>
                    <button class="remove-item">
                        <i class="fa-solid fa-x"></i>
                    </button>
            </div>
        `)
    }

    const AMOUNT_EL = qs('#productAmount')
    if (AMOUNT_EL) AMOUNT_EL.innerHTML = totalItems

    const PRICE_EL = qs('#totalPrice')
    if (PRICE_EL) PRICE_EL.innerHTML = `${totalPrice}zł`

    updateCartCounter()
}

function changeQty(key, delta) {
    const item = JSON.parse(localStorage.getItem(key))
    item.qty += delta

    if (item.qty <= 0) {
        localStorage.removeItem(key)
    } else {
        localStorage.setItem(key, JSON.stringify(item))
    }

    loadCart()
}

if (CLEAR) CLEAR.onclick = clearCart


ADD_BUTTONS.forEach(button => {
    button.onclick = function(e) {
        e.preventDefault()
        const VALUE = this.value
        const PRODUCT = this.closest('.product')
        const IMG = PRODUCT.querySelector('img').src
        const DESC = PRODUCT.querySelector('.description').textContent
        const PRICE = PRODUCT.querySelector('.price').getAttribute('data-price')
        const KEY = `produkt${VALUE}`

        const existing = localStorage.getItem(KEY)
        if (existing) {
            const parsed = JSON.parse(existing)
            parsed.qty += 1
            localStorage.setItem(KEY, JSON.stringify(parsed))
        } else {
            localStorage.setItem(KEY, JSON.stringify({ img: IMG, desc: DESC, price: PRICE, qty: 1 }))
        }
        showNotification()
        updateCartCounter()
    }
})

function showNotification() {
    const NOTIF = qs('#notification')
    NOTIF.classList.remove("hidden")
    setTimeout(() => NOTIF.classList.add("hidden"), 5000)
}


function updateCartCounter() {
    let totalItems = 0
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        const value = JSON.parse(localStorage.getItem(key))
        totalItems += value.qty
    }
    if (CART) CART.innerHTML = totalItems > 0 ? `KOSZYK(${totalItems})` : `KOSZYK`
}

function removeItem(key) {
    localStorage.removeItem(key)
    loadCart()
}