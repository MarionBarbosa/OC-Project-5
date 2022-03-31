let url = "http://localhost:3000/api/products";
fetch(url)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (productData) {
    appendData(productData);
    console.log(appendData);
  })

  .catch(function (err) {
    //une erreur est survenue
  });
/*function appendData(productData) {
  let productContainer = document.getElementById("items");
  for (let i = 0; i < productData.length; i++) {
    let products =
      (productContainer.innerHTML = `<a href="./product.html?id=${productData._id[i]}">
            <article>
              <img src=${productData[i].imageUrl} alt=${productData[i].altTxt}>
              <h3 class="productName">${productData[i].name}</h3>
              <p class="productDescription">${productData[i].description}</p>
            </article>
          </a>`);
    productContainer.appendChild(products);
  }
}
function appendData(productData) {
  for (let product of productData) {
    let productContainer = document.getElementById("items");
    let products =
      (productContainer.innerHTML = `<a href="./product.html?id=${product._id}">
            <article>
              <img src=${product.imageUrl} alt=${product.altTxt}>
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
          </a>`);
    productContainer.appendChild(products);
  }
}
*/
function appendData(productData) {
  for (let product of productData) {
    let newLink = document.createElement("a");
    newLink.setAttribute("href", `./product.html?id=${product._id}`);
    let newArticle = document.createElement("article");
    let newImg = document.createElement("img");
    newImg.setAttribute("src", `${product.imageUrl}`);
    newImg.setAttribute("alt", `${product.altTxt}`);
    let newTitle = document.createElement("h3");
    newTitle.classList.add("productName");
    newTitle.innerText = `${product.name}`;
    let newParagraph = document.createElement("p");
    newParagraph.classList.add("productDescription");
    newParagraph.innerText = `${product.description}`;

    newLink.append(newArticle);
    newArticle.append(newImg);
    newArticle.append(newTitle);
    newArticle.append(newParagraph);
    document.getElementById("items").appendChild(newLink);
  }
}
