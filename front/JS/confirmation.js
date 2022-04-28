//getting orderId
let str = window.location.href;
let url = new URL(str);
let orderId = url.searchParams.get("orderId");

//insert orderId in HTML
document.getElementById("orderId").textContent = `${orderId}`;
