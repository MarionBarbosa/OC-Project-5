//Looking and storing ID value from the URL of the active page.
let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");

//getting information from API with previously stored ID
fetch(`http://localhost:3000/api/products/${id}`)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (productData) {
    //create image element and adding alt information
    let newImg = document.createElement("img");
    newImg.setAttribute("src", `${productData.imageUrl}`);
    newImg.setAttribute("alt", `${productData.altTxt}`);
    document.querySelector(".item__img").append(newImg);
    //adding title text
    document.querySelector("#title").innerText = `${productData.name}`;
    //adding item price
    document.querySelector("#price").innerText = `${productData.price}`;
    //ading item description
    document.querySelector(
      "#description"
    ).innerText = `${productData.description}`;

    //define colors for the product
    for (let color of productData.colors) {
      //create new color option
      let newOption = document.createElement("option");
      newOption.setAttribute("value", `${color}`);
      newOption.innerText = `${color}`;
      document.querySelector("#colors").append(newOption);
    }
  })

  .catch(function (err) {
    //une erreur est survenue
  });

//function to save the new elements to the localStorage
function saveBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}
//function to get the elements stored in the localStorage
function getBasket() {
  let basket = localStorage.getItem("basket");
  if (basket == null) {
    return [];
  } else {
    return JSON.parse(basket);
  }
}
//function to add a new element to the localSstorage
function addBasket(product, quantity) {
  let basket = getBasket();
  //increment quantity of product if product already in basket else add the product to the basket
  let foundProduct = basket.find(
    (p) => p.id == product.id && p.color == product.color
  );
  if (foundProduct != undefined) {
    foundProduct.quantity = +foundProduct.quantity + +quantity;
  } else {
    product.quantity = +quantity;
    basket.push(product);
  }
  saveBasket(basket);
}

//*****Adding product to basket*****

//adding product to localStorage on click event
let addToCart = document.getElementById("addToCart");
addToCart.addEventListener("click", function addToLocalStorage() {
  //Getting values for color and item qty
  let getColor = document.getElementById("colors").value;
  let getQuantity = +document.getElementById("quantity").value;
  if (getColor != null && getQuantity > 0) {
    addBasket(
      {
        id: `${id}`,
        color: `${getColor}`,
      },
      `${getQuantity}`
    );
  } else {
    alert("Veuillez sélectionner une couleur et une quantité.");
  }
});
