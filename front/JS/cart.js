function getBasket() {
  let basket = localStorage.getItem("basket");
  if (basket == null) {
    return [];
  } else {
    return JSON.parse(basket);
  }
}
function saveBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}
fetch(`http://localhost:3000/api/products`)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (productData) {
    const allQuantity = [];
    const allPrice = [];

    let basket = getBasket();

    for (let product of basket) {
      let id = product.id;
      let color = product.color;
      let qty = product.quantity;
      allQuantity.push(qty);
      let foundProductId = productData.find((e) => e._id == id);
      let price = foundProductId.price;
      allPrice.push(price);

      //-----CREATE HTML----
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
      newImg.setAttribute("src", `${foundProductId.imageUrl}`);
      newImg.setAttribute("alt", `${foundProductId.altTxt}`);
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
      newDivDescriptionTitle.textContent = `${foundProductId.name}`;
      //creating 2 paragraphs for divDescription
      //paragraph color
      let newDivDescriptionParagraph1 = document.createElement("p");
      newDivDescription.append(newDivDescriptionParagraph1);
      newDivDescriptionParagraph1.textContent = `${color}`;
      //paragraph price
      let newDivDescriptionParagraph2 = document.createElement("p");
      newDivDescription.append(newDivDescriptionParagraph2);
      newDivDescriptionParagraph2.textContent =
        `${foundProductId.price}` + " €";
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
      newDivSettingsDelete.classList.add(
        "cart__item__content__settings__delete"
      );
      newDivSettings.append(newDivSettingsDelete);
      //creating paragraph for divSettingsDelete - delete item button
      let newDivSettingsDeleteParagraph = document.createElement("p");
      newDivSettingsDeleteParagraph.classList.add("deleteItem");
      newDivSettingsDeleteParagraph.textContent = "Supprimer";
      newDivSettingsDelete.append(newDivSettingsDeleteParagraph);
    }
    //calculate total product quantity in basket
    let sumQuantity = 0;
    for (let i = 0; i < allQuantity.length; i++) {
      sumQuantity += allQuantity[i];
    }
    //adding total product quantity in webpage
    document.getElementById("totalQuantity").textContent = `${sumQuantity}`;

    //calculate total price for each product
    const totalPrice = [];
    for (let i = 0; i < Math.min(allQuantity.length, allPrice.length); i++) {
      totalPrice[i] = allQuantity[i] * allPrice[i];
    }
    //calculate total final price of basket
    let sumFinalPrice = 0;
    for (let i = 0; i < totalPrice.length; i++) {
      sumFinalPrice += totalPrice[i];
    }
    //insert final price of basket in webpage
    document.getElementById("totalPrice").textContent = `${sumFinalPrice}`;

    //-----EVENT-----
    //deleting item by clicking "supprimer"
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
        let basket = getBasket();
        const allQuantity = [];
        const allPrice = [];

        for (product of basket) {
          let id = product.id;
          let qty = product.quantity;
          allQuantity.push(qty);
          let foundProductId = productData.find((e) => e._id == id);
          let price = foundProductId.price;
          allPrice.push(price);
        }

        //calculate total product quantity in basket
        let sumQuantity = 0;
        for (let i = 0; i < allQuantity.length; i++) {
          sumQuantity += allQuantity[i];
        }
        //adding total product quantity in webpage
        document.getElementById("totalQuantity").textContent = `${sumQuantity}`;

        //calculate total price for each product
        const totalPrice = [];
        for (
          let i = 0;
          i < Math.min(allQuantity.length, allPrice.length);
          i++
        ) {
          totalPrice[i] = allQuantity[i] * allPrice[i];
        }
        //calculate total final price of basket
        let sumFinalPrice = 0;
        for (let i = 0; i < totalPrice.length; i++) {
          sumFinalPrice += totalPrice[i];
        }
        //insert final price of basket in webpage
        document.getElementById("totalPrice").textContent = `${sumFinalPrice}`;
      });
    }

    //changing quantities in the input
    let itemQuantity = document.querySelectorAll(".itemQuantity");

    for (let quantity of itemQuantity) {
      quantity.addEventListener("change", function changeQuantity(e) {
        let newQuantity = e.target.value;
        let container = e.target.closest(".cart__item");
        let containerDataId = container.dataset.id;
        let containerDataColor = container.dataset.color;
        changeItemQuantity(
          {
            id: `${containerDataId}`,
            color: `${containerDataColor}`,
          },
          `${newQuantity}`
        );
        let basket = getBasket();

        const allQuantity = [];
        const allPrice = [];

        for (product of basket) {
          let id = product.id;
          let qty = product.quantity;
          allQuantity.push(qty);
          let foundProductId = productData.find((e) => e._id == id);
          let price = foundProductId.price;
          allPrice.push(price);
        }

        //calculate total product quantity in basket
        let sumQuantity = 0;
        for (let i = 0; i < allQuantity.length; i++) {
          sumQuantity += allQuantity[i];
        }
        //adding total product quantity in webpage
        document.getElementById("totalQuantity").textContent = `${sumQuantity}`;

        //calculate total price for each product
        const totalPrice = [];
        for (
          let i = 0;
          i < Math.min(allQuantity.length, allPrice.length);
          i++
        ) {
          totalPrice[i] = allQuantity[i] * allPrice[i];
        }
        //calculate total final price of basket
        let sumFinalPrice = 0;
        for (let i = 0; i < totalPrice.length; i++) {
          sumFinalPrice += totalPrice[i];
        }
        //insert final price of basket in webpage
        document.getElementById("totalPrice").textContent = `${sumFinalPrice}`;
      });
    }
  })

  .catch(function (err) {
    //une erreur est survenue
  });
function removeItem(product) {
  let basket = getBasket();
  basket = basket.filter((p) => p.id != product.id || p.color != product.color);
  saveBasket(basket);
}

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

//*******FORM VALIDATION*********
//regex
let textRegex = new RegExp("^[A-Za-zÀ-ÖØ-öø-ÿ-' ]+$");
let addressRegex = new RegExp("^[A-Za-z0-9À-ÖØ-öø-ÿ-,' ]+$");
let emailRegex = new RegExp(
  "^[A-Za-z0-9'._-]+[@]{1}[A-Za-z0-9._-]+[.]{1}[a-z]{2,10}$"
);

function validInput(input, regex) {
  let testInput = regex.test(input.value);
  let p = input.nextElementSibling;
  console.log(textRegex);
  console.log(testInput);
  console.log(input.value);
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
      console.log(json);
      orderNumber = json.orderId;
      console.log(orderNumber);
      window.location.href = `./confirmation.html?orderId=${orderNumber}`;
    })
    .catch((err) => console.log(err));
}
//*************sending form once validated**********
const products = [];
let contact;
let submitBtn = document.getElementById("order");
let submitForm = submitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    validInput(firstName, textRegex) &&
    validInput(lastName, textRegex) &&
    validInput(address, addressRegex) &&
    validInput(city, textRegex) &&
    validInput(email, emailRegex)
  ) {
    contact = {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    };
    let basket = getBasket();
    for (product of basket) {
      let id = product.id;
      products.push(id);
    }
    console.log(products);
    console.log(contact);
    send();
    console.log(orderNumber);

    //localStorage.clear();
  } else {
    console.log("l'un des champs n'est pas valide");
  }
});
