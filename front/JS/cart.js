//function to get the elements stored in the localStorage
function getBasket() {
  let basket = localStorage.getItem("basket");
  if (basket == null) {
    return [];
  } else {
    return JSON.parse(basket);
  }
}
//function to save the new elements to the localStorage
function saveBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}
//function to get element from basket and calculate totals
function getData(basket, array1, array2, apiData) {
  for (product of basket) {
    let id = product.id;
    let color = product.color;
    let qty = product.quantity;
    array1.push(qty);
    let foundProductId = apiData.find((e) => e._id == id);
    let price = foundProductId.price;
    array2.push(price);
  }
}
//function to create HTML content in cart
function createHMTL(productBasket, id, color, qty) {
  //create new article - product container
  let newArticle = document.createElement("article");
  newArticle.classList.add("cart__item");
  newArticle.setAttribute("data-id", `${id}`);
  newArticle.setAttribute("data-color", `${color}`);
  document.querySelector("#cart__items").append(newArticle);
  //create new first child div of article - container image
  let newDivImg = document.createElement("div");
  newDivImg.classList.add("cart__item__img");
  newArticle.append(newDivImg);
  //creating img element - image
  let newImg = document.createElement("img");
  newImg.setAttribute("src", `${productBasket.imageUrl}`);
  newImg.setAttribute("alt", `${productBasket.altTxt}`);
  newDivImg.append(newImg);
  //create article second child div - container
  let newDivContent = document.createElement("div");
  newDivContent.classList.add("cart__item__content");
  newArticle.append(newDivContent);
  //creating first child div of divContent - container for name price
  let newDivDescription = document.createElement("div");
  newDivDescription.classList.add("cart__item__content__description");
  newDivContent.append(newDivDescription);
  //creating title for divDescription - product name
  let newDivDescriptionTitle = document.createElement("h2");
  newDivDescription.append(newDivDescriptionTitle);
  newDivDescriptionTitle.textContent = `${productBasket.name}`;
  //creating 2 paragraphs for divDescription
  //paragraph color
  let newDivDescriptionParagraph1 = document.createElement("p");
  newDivDescription.append(newDivDescriptionParagraph1);
  newDivDescriptionParagraph1.textContent = `${color}`;
  //paragraph price
  let newDivDescriptionParagraph2 = document.createElement("p");
  newDivDescription.append(newDivDescriptionParagraph2);
  newDivDescriptionParagraph2.textContent = `${productBasket.price}` + " €";
  //creating second child div of divContent container for qty and delete button
  let newDivSettings = document.createElement("div");
  newDivSettings.classList.add("cart__item__content__settings");
  newDivContent.append(newDivSettings);
  //creating first child div of divSettings
  let newDivSettingsQuantity = document.createElement("div");
  newDivSettingsQuantity.classList.add(
    "cart__item__content__settings__quantity"
  );
  newDivSettings.append(newDivSettingsQuantity);
  //creating paragraph for divSettingsQuantity
  let newDivSettingsQuantityParagraph = document.createElement("p");
  newDivSettingsQuantityParagraph.textContent = "Qté : ";
  newDivSettingsQuantity.append(newDivSettingsQuantityParagraph);
  //creating input for divSettingsQuantity - shows item qty
  let newInput = document.createElement("input");
  newInput.setAttribute("type", "number");
  newInput.setAttribute("name", "itemQuantity");
  newInput.setAttribute("min", "1");
  newInput.setAttribute("max", "100");
  newInput.setAttribute("value", `${qty}`);
  newInput.classList.add("itemQuantity");
  newDivSettingsQuantity.append(newInput);
  //creating second child div of divSettings
  let newDivSettingsDelete = document.createElement("div");
  newDivSettingsDelete.classList.add("cart__item__content__settings__delete");
  newDivSettings.append(newDivSettingsDelete);
  //creating paragraph for divSettingsDelete - delete item button
  let newDivSettingsDeleteParagraph = document.createElement("p");
  newDivSettingsDeleteParagraph.classList.add("deleteItem");
  newDivSettingsDeleteParagraph.textContent = "Supprimer";
  newDivSettingsDelete.append(newDivSettingsDeleteParagraph);
}
//function to sum elements of an array together
function sumArrayElements(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}
//function to sum arrays between them. resultof that sum in a third array.
function sumArrays(array1, array2, array3) {
  for (let i = 0; i < Math.min(array1.length, array2.length); i++) {
    array3[i] = array1[i] * array2[i];
  }
}
//function that collects all the ID from localStorage and pushes them in an array
function getId() {
  let basket = getBasket();
  for (product of basket) {
    let id = product.id;
    products.push(id);
  }
}
//function to remove an element from the localStorage
function removeItem(product) {
  let basket = getBasket();
  basket = basket.filter((p) => p.id != product.id || p.color != product.color);
  saveBasket(basket);
}
//function to change to quantity of element in the localStorage
function changeItemQuantity(product, quantity) {
  let basket = getBasket();
  let foundProduct = basket.find(
    (p) => p.id == product.id && p.color == product.color
  );
  if (foundProduct != undefined) {
    foundProduct.quantity = +quantity;
  }
  saveBasket(basket);
}
//calling API to get all products
fetch(`http://localhost:3000/api/products`)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (productData) {
    //creating empty arrays to be used to calculate totals
    const allQuantity = [];
    const allPrice = [];
    const totalPrice = [];
    let basket = getBasket();
    //getting data from basket to insert in HTML and push to previous arrays
    for (let product of basket) {
      let id = product.id;
      let color = product.color;
      let qty = product.quantity;
      allQuantity.push(qty);
      let foundProductId = productData.find((e) => e._id == id);
      let price = foundProductId.price;
      allPrice.push(price);

      //*******CREATE HTML********
      createHMTL(foundProductId, id, color, qty);
    }
    //*******calculate total product quantity in basket*******
    let sumQuantity = sumArrayElements(allQuantity);
    //adding total product quantity in webpage
    document.getElementById("totalQuantity").textContent = `${sumQuantity}`;
    //calculate total price for each product
    sumArrays(allQuantity, allPrice, totalPrice);
    //calculate total final price of basket
    let sumFinalPrice = sumArrayElements(totalPrice);
    //insert final price of basket in webpage
    document.getElementById("totalPrice").textContent = `${sumFinalPrice}`;

    //******EVENT******
    //-------deleting item by clicking "supprimer"-------
    let deleteItem = document.querySelectorAll(".deleteItem");
    for (let item of deleteItem) {
      item.addEventListener("click", function removeFromBasket(e) {
        let container = e.target.closest(".cart__item");
        let containerDataId = container.dataset.id;
        let containerDataColor = container.dataset.color;
        //remove from DOM
        container.remove();
        // remove from localStorage
        removeItem({
          id: `${containerDataId}`,
          color: `${containerDataColor}`,
        });
        //-------recalculate totals-------
        //emptying arrays
        const allQuantity = [];
        const allPrice = [];
        const totalPrice = [];
        //Gets the basket after event completed
        let basket = getBasket();
        //get item quantity and price from basket and API and pushes the results in arrays
        getData(basket, allQuantity, allPrice, productData);
        //calculates total product quantity in basket
        let sumQuantity = sumArrayElements(allQuantity);
        console.log(sumQuantity);
        //adds total product quantity in webpage
        document.getElementById("totalQuantity").textContent = `${sumQuantity}`;
        //calculates total price for each product
        sumArrays(allQuantity, allPrice, totalPrice);
        //calculates total final price of basket
        let sumFinalPrice = sumArrayElements(totalPrice);
        //inserts final price of basket in webpage
        document.getElementById("totalPrice").textContent = `${sumFinalPrice}`;
      });
    }

    //-----changing quantities via the input-----
    //getting the HTML element that triggers the event
    let itemQuantity = document.querySelectorAll(".itemQuantity");
    //managing the event
    for (let quantity of itemQuantity) {
      quantity.addEventListener("change", function changeQuantity(e) {
        let newQuantity = e.target.value;
        let container = e.target.closest(".cart__item");
        let containerDataId = container.dataset.id;
        let containerDataColor = container.dataset.color;
        if (newQuantity < 0 || newQuantity > 100) {
          newQuantity = 0;
        }
        //updates quantity in localStorage
        if (newQuantity > 0 && newQuantity <= 100) {
          changeItemQuantity(
            {
              id: `${containerDataId}`,
              color: `${containerDataColor}`,
            },
            `${newQuantity}`
          );
        } else {
          alert("La quantité d'article doit être comprise entre 1 et 100.");
        }
        //-----recalculates totals------
        const allQuantity = [];
        const allPrice = [];
        const totalPrice = [];
        let basket = getBasket();
        //get item quantity and price from basket and API and pushes the results in arrays
        getData(basket, allQuantity, allPrice, productData);
        //calculate total product quantity in basket
        let sumQuantity = sumArrayElements(allQuantity);
        console.log(sumQuantity);
        //adding total product quantity in webpage
        document.getElementById("totalQuantity").textContent = `${sumQuantity}`;
        //calculate total price for each product
        sumArrays(allQuantity, allPrice, totalPrice);
        //calculate total final price of basket
        let sumFinalPrice = sumArrayElements(totalPrice);
        //insert final price of basket in webpage
        document.getElementById("totalPrice").textContent = `${sumFinalPrice}`;
      });
    }
  })

  .catch(function (err) {
    alert("Une erreur est survenue.");
  });

//*******FORM VALIDATION*********
//regex rules
let textRegex = new RegExp("^[A-Za-zÀ-ÖØ-öø-ÿ-' ]+$");
let addressRegex = new RegExp("^[A-Za-z0-9À-ÖØ-öø-ÿ-,' ]+$");
let emailRegex = new RegExp(
  "^[A-Za-z0-9'._-]+[@]{1}[A-Za-z0-9._-]+[.]{1}[a-z]{2,10}$"
);
//function to test input and return result
function validInput(input, regex) {
  let testInput = regex.test(input.value);
  let p = input.nextElementSibling;
  if (testInput) {
    p.textContent = "Champ valide";
    return true;
  } else {
    p.textContent = "Champ non valide";
    return false;
  }
}
//first name validation
let firstName = document.getElementById("firstName");
let inputFirstName = firstName.addEventListener("change", function () {
  validInput(firstName, textRegex);
});

// last name validation
let lastName = document.getElementById("lastName");
let inputlastName = lastName.addEventListener("change", function () {
  validInput(lastName, textRegex);
});

// address validation
let address = document.getElementById("address");
let inputAddress = address.addEventListener("change", function () {
  validInput(address, addressRegex);
});
//validation city
let city = document.getElementById("city");
let inputCity = city.addEventListener("change", function () {
  validInput(city, textRegex);
});

//validation email
let email = document.getElementById("email");
let inputEmail = email.addEventListener("change", function () {
  validInput(email, emailRegex);
});

//FUNCTION SENDING DATA TO API
function send() {
  fetch(`http://localhost:3000/api/products/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({ contact, products }),
  })
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (json) {
      //getting orderId and inserting it in the URL
      orderNumber = json.orderId;
      window.location.href = `./confirmation.html?orderId=${orderNumber}`;
    })
    .catch((err) =>
      alert(
        "Votre commande a échouée. Nous vous invitons à essayer une nouvelle fois."
      )
    );
}
//*************sending form once validated**********
//creating an array that will contain all the ID from the localStorage
const products = [];
//creating object that will contain all customer's informations
let contact;
//listening to event on submit button COMMANDER
let submitBtn = document.getElementById("order");
let submitForm = submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    validInput(firstName, textRegex) &&
    validInput(lastName, textRegex) &&
    validInput(address, addressRegex) &&
    validInput(city, textRegex) &&
    validInput(email, emailRegex) &&
    localStorage.length > 0
  ) {
    contact = {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    };
    getId();
    send();
    localStorage.clear();
  } else if (localStorage.length < 1) {
    alert("Votre panier est vide.");
  } else if (
    !validInput(firstName, textRegex) ||
    !validInput(lastName, textRegex) ||
    !validInput(address, addressRegex) ||
    !validInput(city, textRegex) ||
    !validInput(email, emailRegex)
  ) {
    alert("L'un des champs du formulaire n'est pas valide.");
  }
});
