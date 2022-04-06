//Looking and storing ID value from the URL of the active page.
let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");

console.log(id);

//getting information from API with previously stored ID
fetch(`http://localhost:3000/api/products/${id}`)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (productData) {
    console.log(productData);
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
