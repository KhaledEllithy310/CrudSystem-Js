// Select Elements
const formElement = document.querySelector("form");
const inputName = document.getElementById("productName");
const inputPrice = document.getElementById("productPrice");
const inputCategory = document.getElementById("productCategory");
const inputDescription = document.getElementById("productDesc");
const inputCount = document.getElementById("productCount");

const inputSearch = document.getElementById("productSearch");

const addButton = document.getElementById("addButton");
const deleteAllElement = document.getElementById("deleteAll");

const tableBodyElement = document.getElementById("tBody");
const totalElement = document.getElementById("total");

// *************************************************************
// make variable to hold the status of the addButton (stauts may be "add" or "update")
let buttonStatus = "add";

// *************************************************************
// variable to contain the targetProduct in update operation
let targetProduct;

// *************************************************************
// create productsList array
let productsList;

if (localStorage.getItem("products") !== null) {
  // set products item from localStorage to productsList array
  productsList = JSON.parse(localStorage.getItem("products"));
  // call the drawProducts Function
  drawProducts(productsList);
} else {
  productsList = [];
}

// *************************************************************
// create product object and return this object
function createProduct(name, price, category, description, count) {
  return {
    id: Date.now(),
    name,
    // name : name,
    price,
    // price : price,
    category,
    description,
    count,
    // count : count,
    total: count * price,
  };
}

// *************************************************************
function defineProduct() {
  let product = createProduct(
    inputName.value,
    +inputPrice.value,
    inputCategory.value,
    inputDescription.value,
    +inputCount.value
  );

  productsList.push(product);
  // set productsList to localStorage
  localStorage.setItem("products", JSON.stringify(productsList));
  // call the drawProducts Function
  drawProducts(productsList);
}

// *************************************************************
// check the the status of the addButton to define the operation
addButton.addEventListener("click", function () {
  if (buttonStatus === "add") {
    defineProduct();
  } else if (buttonStatus === "update") {
    updateProduct();
  }

  formElement.reset();
});

// *************************************************************
// draw productsList in UI
function drawProducts(products) {
  let content = "";
  for (let index = 0; index < products.length; index++) {
    content += `
              <tr>
                <td>${index + 1}</td>
                <td>${products[index].id}</td>
                <td>${products[index].name}</td>
                <td>${products[index].price}</td>
                <td>${products[index].total}</td>
                <td>${products[index].category}</td>
                <td>${products[index].description}</td>
                <td class='d-flex justify-content-between align-items-center gap-3'>
                  <button class='btn btn-dark' onclick='incrementCount(${
                    products[index].id
                  })'>+</button>
                    ${products[index].count}
                  <button class='btn btn-info' onclick='decrementCount(${
                    products[index].id
                  })'>-</button>
                </td>
                <td>
                  <button onclick='deleteProduct(${
                    products[index].id
                  })' class="btn btn-danger"> Delete </button>
                </td>
                <td>
                  <button onclick='getTargetProduct(${
                    products[index].id
                  })' class="btn btn-warning"> Update </button>
                </td>
              </tr>
    `;
  }

  getProductsTotal();

  tableBodyElement.innerHTML = content;
}

// *************************************************************

// create deleteProduct function
function deleteProduct(productId) {
  productsList = productsList.filter(function (element) {
    return element.id !== productId;
  });
  // draw products after filteration
  drawProducts(productsList);
  // set productsList to localStorage
  localStorage.setItem("products", JSON.stringify(productsList));
}

// *************************************************************

// create getTargetProduct function
function getTargetProduct(productId) {
  targetProduct = productsList.find(function (element) {
    return element.id === productId;
  });

  // set the targetProduct values to the inputs to update them
  inputName.value = targetProduct.name;
  inputPrice.value = targetProduct.price;
  inputCategory.value = targetProduct.category;
  inputDescription.value = targetProduct.description;
  inputCount.value = targetProduct.count;

  buttonStatus = "update";
  addButton.innerText = "Update Product";
}

// *************************************************************
// create updateProduct function
function updateProduct() {
  const targetProductIndex = productsList.findIndex(function (element) {
    return element.id === targetProduct.id;
  });

  productsList[targetProductIndex] = {
    id: targetProduct.id,
    name: inputName.value,
    category: inputCategory.value,
    description: inputDescription.value,
    price: +inputPrice.value,
    count: +inputCount.value,
    total: +inputPrice.value * +inputCount.value,
  };

  // set productsList to localStorage
  localStorage.setItem("products", JSON.stringify(productsList));
  // call the drawProducts Function
  drawProducts(productsList);

  buttonStatus = "add";
  addButton.innerText = "Add Product";
}

// *************************************************************

inputSearch.addEventListener("input", function (event) {
  // set the value of inputSearch input to variable and change it to toLowerCase
  let searchInputValue = event.target.value.toLowerCase();
  // call searchInProducts function and passing searchInputValue element
  searchInProducts(searchInputValue);
});

// *************************************************************

// create search Function
function searchInProducts(searchQuery) {
  let newProductsList = productsList.filter(function (element) {
    return (
      element.name.toLowerCase().includes(searchQuery) ||
      element.category.toLowerCase().includes(searchQuery) ||
      element.description.toLowerCase().includes(searchQuery)
    );
  });

  // draw newProductsList after search
  drawProducts(newProductsList);
}
// *************************************************************
function incrementCount(productId) {
  const product = productsList.find(function (element) {
    return element.id === productId;
  });
  product.count += 1;
  product.total = product.price * product.count;
  // set productsList to localStorage
  localStorage.setItem("products", JSON.stringify(productsList));
  // call the drawProducts Function
  drawProducts(productsList);
}

// *************************************************************

function decrementCount(productId) {
  const product = productsList.find(function (element) {
    return element.id === productId;
  });

  if (product.count > 0) {
    product.count -= 1;
  }
  product.total = product.price * product.count;
  // set productsList to localStorage
  localStorage.setItem("products", JSON.stringify(productsList));
  // call the drawProducts Function
  drawProducts(productsList);
}

// *************************************************************
// get the total price of all items

function getProductsTotal() {
  const total = productsList.reduce(function (previousElement, currentElement) {
    return previousElement + currentElement.total;
  }, 0);

  totalElement.innerText = `${total} $`;
}

getProductsTotal();

// *************************************************************

deleteAllElement.addEventListener("click", function () {
  productsList = [];
  localStorage.setItem("products", JSON.stringify(productsList));
  // call the drawProducts Function
  drawProducts(productsList);
});

// here he looks to the refernce of the deleteAll function
// deleteAllElement.addEventListener('click',deleteAll)

// function deleteAll() {
//   productsList = [];
//   localStorage.setItem("products", JSON.stringify(productsList));
//   // call the drawProducts Function
//   drawProducts(productsList);
// }

// https://www.udemy.com/course/the-complete-javascript-course/
// https://www.youtube.com/@NetNinja/playlists
// https://www.youtube.com/@UniqueCoderzAcademy/playlists
// https://www.youtube.com/watch?v=_rDqhxrkANc&list=PLtFbQRDJ11kFJFzd5UNy5vSnkbR031vG9

// https://chrome.google.com/webstore/detail/transover/aggiiclaiamajehmlfpkjmlbadmkledi
// https://chrome.google.com/webstore/detail/ejoy-english-learn-with-m/amfojhdiedpdnlijjbhjnhokbnohfdfb
