//Heading Animation
let counter = 1;
setInterval(function(){
    document.getElementById("radio" + counter).checked = true;
    counter++;
    if(counter>7){
        counter = 1;
    }
}, 5000)

/*------------------------Scroll Top------------------*/
//Get the button:
mybutton = document.getElementById("myBtn");
// When the user scrolls down 500px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    mybutton.style.display = "block";

  } else {
    mybutton.style.display = "none";
  }
}
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}

const toggleButton = document.getElementById('toggle')
const navMenu = document.querySelector('.header-details')
const productMenu = document.getElementById('phones')
const tvMenu = document.getElementById('tv')
const appliancesMenu = document.getElementById('appliances')
const fashionMenu = document.getElementById('fashion')

toggleButton.addEventListener('click', () => {
    navMenu.classList.toggle('show-menu')
} )

//Set the products to the HTML page
async function getProducts(){
    try {
        const results = await fetch('products.json')
        const data = await results.json()
        const products = data.items;
        displayProducts(products)
    } catch (err) {
        console.log(err)
    }
}

function displayProducts(items){
    let shuffledProducts = items
    // .sort(() => Math.floor(Math.random()-0.5))
    let phoneArr = []
    let tvArr = []
    let appArr = []
    let fashArr = []
    let results= '';
    tvMenu.innerHTML = ''
    appliancesMenu.innerHTML = ''
    fashionMenu.innerHTML = ''
    for (let j=0; j<items.length; j++){
        if(items[j].section == "phones"){
            phoneArr.push(items[j])
        }
        else if (items[j].section == "Television"){
            tvArr.push(items[j])
        }
        else if (items[j].section == "Home Applicances"){
            appArr.push(items[j])
        } 
        else if (items[j].section == "Fashion"){
            fashArr.push(items[j])
        }
    }
    phoneArr = phoneArr.sort( ()=>Math.random()-0.5 )
    tvArr = tvArr.sort( ()=>Math.random()-0.5 )
    appArr = appArr.sort( ()=>Math.random()-0.5 )
    fashArr = fashArr.sort( ()=>Math.random()-0.5 )
    for (let i=0; i<phoneArr.length; i++){
        results += `
        <div class='img'>
            <img src=${phoneArr[i].image} alt="iphone">
            <h3>${phoneArr[i].name}</h3>
            <h3>₦${phoneArr[i].price}</h3>
            <div class="info-btns">
                <div class="btn cart-btn" data-id=${phoneArr[i].id}>ADD TO CART</div>
            </div>
        </div>
        `
        }
    productMenu.innerHTML = results
    for (let i=0; i<tvArr.length; i++){
        tvMenu.innerHTML += `
        <div class='img'>
            <img src=${tvArr[i].image} alt="iphone">
            <h3>${tvArr[i].name}</h3>
            <h3>₦${tvArr[i].price}</h3>
            <div class="info-btns">
                <div class="btn cart-btn" data-id=${tvArr[i].id}>ADD TO CART</div>
            </div>
        </div>
        `
        }
    
    for (let i=0; i<appArr.length; i++){
        appliancesMenu.innerHTML += `
        <div class='img'>
            <img src=${appArr[i].image} alt="iphone">
            <h3>${appArr[i].name}</h3>
            <h3>#${appArr[i].price}</h3>
            <div class="info-btns">
                <div class="btn cart-btn" data-id=${appArr[i].id}>ADD TO CART</div>
            </div>
        </div>
        `
        }
    for (let i=0; i<fashArr.length; i++){
        fashionMenu.innerHTML += `
        <div class='img'>
            <img src=${fashArr[i].image} alt="iphone">
            <h3>${fashArr[i].name}</h3>
            <h3>₦${fashArr[i].price}</h3>
            <div class="info-btns">
                <div class="btn cart-btn" data-id=${fashArr[i].id}>ADD TO CART</div>
            </div>
        </div>
        `
        }
        //Activate CartButton
        const cartButton = document.querySelectorAll(".cart-btn")

        //Loop through each of the add to cart buttons
        for(let i=0; i<cartButton.length; i++){
            cartButton[i].addEventListener('click', ()=>{
                //determine the particular cart button you are clicking
                let iD = cartButton[i].dataset.id - 1
                // console.log(iD)
                //The iD is equal to the index of the product in the products array
               cartNumbers(items[iD])

               //After working on cartNumbers function you set your total cost
               totalCost(items[iD])
            })
        }
}

getProducts()

/*--------------------------Cart Section------------------------*/

function cartNumbers(product){
    // console.log("The product clicked is", product)
    let productCount = parseInt(localStorage.getItem('cartNumbers'));

    //check if there are items in the cart
    if(productCount){
        localStorage.setItem('cartNumbers', productCount+1)
        document.querySelector('.count').textContent = productCount + 1;
    } 
    //If there are no items in the cart we set the cartNumbers to Local storage giving it a value of 1
    else{
        localStorage.setItem('cartNumbers', 1)
        document.querySelector('.count').textContent = 1;
    }
    //Create a function to store the cartItem clicked to local storage
    setItems(product)
}

function setItems(product){
    //Check if you have items already in your cart by getting it from local storage. If not you set to local storage
    let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
    if (cartItems != null){ //If there are already items in the cart
        //Then check if the item clicked is different from the item already in cart
        if(cartItems[product.tag] == undefined){
            cartItems = {
                ...cartItems,
                [product.tag]: product
            }
        }
        cartItems[product.tag].inCart +=1;
    } else {
        //Initialise the value of a particular item in cart to 1
        product.inCart = 1
        //create a cartItem object with a tag of the product name and has values of the product
        cartItems = {
            [product.tag] : product
        }
    }
    localStorage.setItem('productsInCart', JSON.stringify(cartItems))
}


//Create a function to save the cartNumber when the page is refreshed
function onLoadCartNumbers(){
    let productCount = parseInt(localStorage.getItem('cartNumbers'));
    //If there is a productCount i.e item in the local storage let it display the number anytime the page is loaded
    if(productCount){
        document.querySelector('.count').textContent = productCount
    }
}

//Find the total cost of products in the cart
function totalCost(product){
    let itemPrice = parseFloat(product.price.replace(/,/g, '')) //You replace comma seperated price string with space to you can parse it to a float number
    let cartCost = localStorage.getItem('totalCost');
    
    console.log(cartCost)

    //check if cartCost exist already
    if (cartCost != null){
        cartCost = parseFloat(cartCost)
        localStorage.setItem("totalCost", cartCost+itemPrice)
    } else{
        localStorage.setItem("totalCost", itemPrice)
    }
}

function displayCart(){
    let cartItems = localStorage.getItem("productsInCart")
    cartItems = JSON.parse(cartItems)
    let productContainer = document.querySelector(".products")
    let cartCost = JSON.parse(localStorage.getItem('totalCost'));
    if (cartItems && productContainer){
        productContainer.innerHTML = ''
        //Loop through all the items on the cart storage
        Object.values(cartItems).map(item => {
            let total = item.inCart * parseFloat(item.price.replace(/,/g, ''))
            productContainer.innerHTML += `
            <div class='product-header'>
                <div class='product'>
                    <i class='bx bxs-trash'></i>
                    <img src='${item.image}'>
                    <span>${item.name}</span>
                </div>
                <div class='price'>${item.price}</div>
                <div class='quantity'>
                    <i class='bx bxs-chevron-left-circle'></i>
                    <span>${item.inCart}</span>
                    <i class='bx bxs-chevron-right-circle'></i>
                </div>
                <div class = 'total'>
                ₦${total.toLocaleString()}
                </div>
            </div>
            `
        })
        productContainer.innerHTML += `
            <div class='basketTotalContainer'>
                <h4 class='basketTotalTitle'>Cart Total</h4>
                <h4 class='basketTotal'>₦${cartCost.toLocaleString()}
            </div>
        `
    }
    toDecreaseItem()
    toIncreaseItem()  
    removeLocalItems()
}


function toIncreaseItem(){
    const toIncrease = document.querySelectorAll('.bxs-chevron-right-circle')
    for (let i=0; i<toIncrease.length; i++){ 
        toIncrease[i].addEventListener('click', () =>{
            let toincr;
            if (localStorage.getItem("productsInCart") === null) {
                toincr = [];
            } else {
                //If you already have items you parse it into an array using JSON
                toincr = JSON.parse(localStorage.getItem("productsInCart"));
            }
            //You convert the object into a loopable array
            let item = Object.values(toincr);
            //Get the particual item in cart you want to increase
            let single_item = item[i];
            single_item.inCart = Number(single_item.inCart)
            single_item.inCart +=1
            //Get the totalPrice and cartNumbers from local storage so you can update them
            let totalPrice = localStorage.getItem("totalCost");
            let cartNumbers = localStorage.getItem("cartNumbers");
            //convert the total price and cartNumbers to a number
            totalPrice = Number(totalPrice);
            cartNumbers = Number(cartNumbers)
            //Add the increase in price to the total price
            single_item.price = single_item.price.split(",").join("");
            let get_price = Number(single_item.price);
            totalPrice += get_price;
            get_price.toLocaleString()
            //Increate the cart number accordingly
            cartNumbers += 1;
            //Reset cart items stored in your local storage
            localStorage.setItem("totalCost", totalPrice);
            localStorage.setItem("cartNumbers", cartNumbers);
            localStorage.setItem("productsInCart", JSON.stringify(item));
            location.reload()
        })
    }
}

function toDecreaseItem(){
    const toDecrease = document.querySelectorAll('.bxs-chevron-left-circle')
    for (let i=0; i<toDecrease.length; i++){ 
        toDecrease[i].addEventListener('click', () =>{
            let todec;
            if (localStorage.getItem("productsInCart") === null) {
                todec = [];
            } else {
                //If you already have items you parse it into an array using JSON
                todec = JSON.parse(localStorage.getItem("productsInCart"));
            }
            //You convert the object into a loopable array
            let item = Object.values(todec);
            //Get the particual item in cart you want to increase
            let single_item = item[i];
            single_item.inCart = Number(single_item.inCart)
            if(single_item.inCart>0){
                single_item.inCart -=1
                //Get the totalPrice and cartNumbers from local storage so you can update them
                let totalPrice = localStorage.getItem("totalCost");
                let cartNumbers = localStorage.getItem("cartNumbers");
                //convert the total price and cartNumbers to a number
                totalPrice = Number(totalPrice);
                cartNumbers = Number(cartNumbers)
                //Add the increase in price to the total price
                single_item.price = single_item.price.split(",").join("");
                let get_price = Number(single_item.price);
                totalPrice -= get_price;
                get_price.toLocaleString()
                //Increate the cart number accordingly
                cartNumbers -= 1;
                //Reset cart items stored in your local storage
                localStorage.setItem("totalCost", totalPrice);
                localStorage.setItem("cartNumbers", cartNumbers);
                localStorage.setItem("productsInCart", JSON.stringify(item));
                location.reload()
            }
        })
    }
}

function removeLocalItems(){
    //Removing Items from the cart
    const deleteButton = document.querySelectorAll(".bxs-trash");
    for (let i = 0; i < deleteButton.length; i++) {
        deleteButton[i].addEventListener("click", () => {
            let todels;
            if (localStorage.getItem("productsInCart") === null) {
                todels = [];
            } else {
                //If you already have items you parse it into an array using JSON
                todels = JSON.parse(localStorage.getItem("productsInCart"));
            }
            //You convert the object into a loopable array
            let items = Object.values(todels);
            let single_item = items[i];  //The Item to be removed
            items.splice(i, 1); //You splice out the item you want to remove from the cart
            
            //Readjust your totalprice and cart number
            let totalPrice = localStorage.getItem("totalCost");
            let cartNumbers = localStorage.getItem("cartNumbers");
            //convert the total price to a number
            totalPrice = Number(totalPrice);
            //Remove the particalar item deleted price from the cart
            single_item.price = single_item.price.split(",").join("");
            let get_price = Number(single_item.price);
            totalPrice -= single_item.inCart * get_price;
            //Remove the particalar item deleted inCarts number from the cart
            cartNumbers -= single_item.inCart;

            // delete todels[single_item.tag];

            //Reset cart items stored in your local storage
            localStorage.setItem("totalCost", totalPrice);
            localStorage.setItem("cartNumbers", cartNumbers);
            localStorage.setItem("productsInCart", JSON.stringify(items));
            location.reload()
        });
    }
    
}
onLoadCartNumbers()
displayCart()


/*========================= SCROLL REVEAL ANIMATION =================== */
const sr = ScrollReveal({
    origin: 'top',
    distance: '30px',
    duration: 2000,
    reset: true
});

sr.reveal(`.phones, .img, .information, .footer-infos`,{
    interval: 200
})