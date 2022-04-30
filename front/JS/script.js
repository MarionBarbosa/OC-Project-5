let url = "http://localhost:3000/api/products";
fetch(url)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (productData) {
    appendData(productData);
  })

  .catch(function (err) {
    alert("Une erreur est survenue lors du chargement de la page.");
  });
//function to create HTML for each product
function appendData(apiData) {
  for (let product of apiData) {
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
