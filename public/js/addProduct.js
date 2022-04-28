import { showAlert } from "./utils.js";

const fileUploads = document.querySelectorAll(".fileUpload");
const labels = document.querySelectorAll(".label");
let imagePaths = []; // will store all uploaded imags paths;
let sizes = [];

if (product) {
  labels.forEach((label) => {
    const imgPath = label.style.backgroundImage
      ? label.style.backgroundImage
          .match(/(?:"[^"]*"|^[^"]*$)/)[0]
          .replace(/"/g, "")
      : null;
    imagePaths.push(imgPath);
  });
}

fileUploads.forEach((fileUpload, index) =>
  fileUpload.addEventListener("change", async () => {
    const file = fileUpload.files[0];

    if (file.type.includes("image")) {
      //means user uploaded an image
      console.log("test");
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

addProduct.addEventListener("click", async (e) => {
  getSizes();
  const fetchDatabase = await fetch("/add-a-product", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      id: product?._id || null,
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
  console.log(fetchDatabase);

  if (fetchProduct.status === "error") {
    const msg = fetchProduct.message.match(/\Please.*?\!/gm);
    const newMsg = msg.join("\n");
    showAlert(newMsg);
  } else {
    localStorage.removeItem("product");
    location.href = "/seller";
  }
});
