function getBasket() {
  let basket = localStorage.getItem("basket");
  if (basket == null) {
    return [];
  } else {
    return JSON.parse(basket);
  }
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
    let basketContent = getBasket();

    for (let product of basketContent) {
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
      //creating input for divSettingsQuantity - shows item qty, can be changed
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
    console.log(sumQuantity);
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
    console.log(allQuantity);
    console.log(allPrice);
    console.log(totalPrice);
    console.log(sumFinalPrice);
    //insert final price of basket in webpage
    document.getElementById("totalPrice").textContent = `${sumFinalPrice}`;
  })
  .catch(function (err) {
    //une erreur est survenue
  });

/*
//Removing item from basket by clicking delete text
let deleteItem = document.querySelector(
  ".cart__item__content__settings__delete"
);
deleteItem.addEventListener("click", function removeFromBasket(product) {
  let basket = getBasket();
  basket = basket.filter((p) => p.id != product.id);
  saveBasket(basket);
});
//changing the quantity of an item
let itemQuantity = document.querySelector(".itemQuantity");
itemQuantity.addEventListener(
  "change",
  function changeQuantity(product, quantity) {
    let basket = getBasket();
    let getQuantity = +itemQuantity.value;
    if (getQuantity > 0) {
      let foundProduct = basket.find((p) => p.id == product.id);
      if (foundProduct != undefined) {
        foundProduct.quantity == `${getQuantity}`;
        saveBasket(basket);
        console.log("change");
      }
    } else {
      console.log("remove");
    }

    saveBasket(basket);
  }
);
*/
