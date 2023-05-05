// Import and constants variable
import {products as CurrentProducts} from './products.js'
const productSection = document.querySelector('.products')
const categoryContainers = document.querySelector('.categories-container')
const searchInput = document.querySelector('.search-input')
const notfound = document.querySelector('.not-found')
const basketAmount = document.querySelector('.basket-text')
const clearBasket = document.querySelector('.clear-basket')
const basketBar = document.querySelector('.basket-bar > .basket-text')
const popUpMenu = document.querySelector('.pop-up')
let basketsBtn = []
let productInBasket = []

// Create a category menu
function renderCategories(arr) {
  categoryContainers.innerText = ''
  const category = ['Wszystkie']
  arr.filter((product) => {
    !category.includes(product.category) ? category.push(product.category) : null
  })
  category.forEach((element) => {
    const createElement = document.createElement('button')
    createElement.className = element === 'Wszystkie' ? 'category-item active' : 'category-item'
    createElement.innerText = element
    categoryContainers.appendChild(createElement)
  })
}

// Rendering a list of products
function renderProducts(products) {
  productSection.innerHTML = ''

  products?.forEach((element) => {
    const createElement = document.createElement('div')
    createElement.className = `product-item ${element.sale ? 'on-sale' : ''}`
    createElement.innerHTML = ` <img src="${element.image}" class="product-image">
        <div class="product-name">${element.name}</div>
        <p class="product-description">${element.description}</p>
        <div class="price-bar">
            <span class="product-price ${element.sale ? 'active' : ''}">${element.price} zł</span>
            <span class="product-sale-price">${(element.sale ? element.price - element.saleAmount : element.price).toFixed(2)} zł</span>
        </div>
        <button class="add-to-basket-btn" id="${element.id}">Dodaj do koszyka</button>
        <span class="sale-notification">Promocja</span>
    </div>`
    productSection.appendChild(createElement)
  })
  basketsBtn = document.querySelectorAll('.add-to-basket-btn')
  // adding a item to basket
  productSection.addEventListener('click', function (event) {
    if (event.target.classList.contains('add-to-basket-btn')) {
      clearBasket.classList.add('active')
      const productId = event.target.id
      const product = CurrentProducts.find((item) => item.id == productId)
      productInBasket.push(product)
      sumOfBasket(productInBasket)
    }
  })
}

// Execute core function when site load
document.onload = renderProducts(CurrentProducts)
document.onload = renderCategories(CurrentProducts)

const categoryBtn = document.querySelectorAll('.category-item')

// mark a current category
categoryBtn.forEach((element) => {
  element.addEventListener('click', () => {
    searchInput.value = ''
    notfound.classList.remove('active')
    categoryBtn.forEach((element) => element.classList.remove('active'))
    element.classList.add('active')
    const categoryOfProduct = CurrentProducts.filter((item) => item.category === element.innerText)
    element.innerText === 'Wszystkie' ? renderProducts(CurrentProducts) : renderProducts(categoryOfProduct)
  })
})

// create a searchBar
searchInput.addEventListener('input', (event) => {
  let searchArray = CurrentProducts.filter((element) => element.name.toLowerCase().includes(event.target.value.toLowerCase()))
  searchArray.length === 0 ? notfound.classList.add('active') : notfound.classList.remove('active')
  renderProducts(searchArray)
})

// Manage a Basket
function sumOfBasket(arr) {
  popUpMenu.innerHTML = ''
  let sum = 0
  arr.forEach((element) => {
    const createElement = document.createElement('li')
    createElement.className = 'basket-item'
    createElement.innerHTML = `
    <img src="${element.image}"><p class="basket-name">${element.name}</p><p class="basket-price">${(element.sale ? element.price - element.saleAmount : element.price).toFixed(2)} zł</p>  
    <button id=${element.id} class='remove-from-basket'>x</button>`
    popUpMenu.appendChild(createElement)
    element.sale ? (sum += element.price - element.saleAmount) : (sum += element.price)
  })
  basketAmount.innerText = sum.toFixed(2) + ' zł'

  const basketRemove = document.querySelectorAll('.remove-from-basket')

  // remowing element from basket
  basketRemove?.forEach((element) =>
    element.addEventListener('click', (event) => {
      productInBasket = productInBasket.filter((element) => event.target.id != element.id)
      sumOfBasket(productInBasket)
    })
  )
}

// Adding listeners for basket's buttons
basketBar.addEventListener('click', () => {
  popUpMenu.classList.toggle('active')
})
