// import { fetchedProduct1 } from "./seller.js";
import { showAlert } from "./utils.js";

const fileUploads = document.querySelectorAll(".fileUpload");
let imagePaths = []; // will store all uploaded imags paths;
let sizes = [];

fileUploads.forEach((fileUpload, index) =>
  fileUpload.addEventListener("change", async () => {
    const file = fileUpload.files[0];

    if (file.type.includes("image")) {
      //means user uploaded an image
      const fetchUrl = await fetch("/s3url");
      const url = await fetchUrl.json();
      await fetch(url, {
        method: "PUT",
        headers: new Headers({ "Content-Type": "multipart/form-data" }),
        body: file,
      });
      const imageUrl = url.split("?")[0];
      imagePaths[index] = imageUrl;

      let label = document.querySelector(`label[for=${fileUpload.id}]`);
      label.style.backgroundImage = `url(${imageUrl})`;

      let productImage = document.querySelector(".product-image");
      productImage.src = imageUrl;
    } else {
      showAlert("upload image only");
    }
  })
);

//===============draft and submit
const draft = document.querySelector(".draft");
const addProduct = document.querySelector(".add-product");
const name = document.querySelector(".name");
const briefDes = document.querySelector(".brief-des");
const detailedDes = document.querySelector(".detailed-des");
const stocks = document.querySelector(".stocks");
const price = document.querySelector(".price");

const sizeCheckbox = document.querySelectorAll(".size-checkbox");
const getSizes = () => {
  sizes = [];
  sizeCheckbox.forEach((checkbox) => {
    if (checkbox.checked) {
      sizes.push(checkbox.value);
    }
  });
};

const storedUser = JSON.parse(sessionStorage.user);
const product = JSON.parse(localStorage.getItem("product"));

const postProductDatailDB = async (url) => {
  getSizes();
  const fetchDatabase = await fetch(url, {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      id: product?._id || null,
      email: storedUser.email,
      token: storedUser.token,
      name: name.value,
      briefDes: briefDes.value,
      detailedDes: detailedDes.value,
      imagePaths,
      sizes,
      stocks: stocks.value,
      price: price.value,
    }),
  });
  const fetchProduct = await fetchDatabase.json();

  if (fetchProduct.status === "error") {
    const msg = fetchProduct.message.match(/\Please.*?\!/gm);
    const newMsg = msg.join("\n");
    showAlert(newMsg);
  } else {
    localStorage.removeItem("product");
    location.href = "/seller";
  }
};

addProduct.addEventListener("click", async (e) => {
  if (!product) {
    postProductDatailDB("/add-a-product");
  } else {
    // validate user owns the product
    postProductDatailDB("/add-a-product/update-a-product");
  }
});

window.onload = () => {
  if (!product) return;

  //prettier-ignore
  name.value = product.name,
  briefDes.value = product.briefDes,
  detailedDes.value = product.detailedDes,
  stocks.value = product.stocks;
  price.value = product.price;
  imagePaths = product.imagePaths;
  sizes = product.sizes;

  // product.sizes.forEach((size) => {
  //   const [input] = document.querySelectorAll(`input[value=${size}]`);
  //   input.checked = true;
  // });

  let productImage = document.querySelector(".product-image");
  productImage.src = product.imagePaths.find((el) => el !== null);

  fileUploads.forEach((fileUpload, i) => {
    let label = document.querySelector(`label[for=${fileUpload.id}]`);
    if (!product.imagePaths[i]) return;
    label.style.backgroundImage = `url(${product.imagePaths[i]})`;
  });
};
