import { showAlert } from "./utils.js";
const loader = document.querySelector(".loader");

const fileUploads = document.querySelectorAll(".fileUpload");
const labels = document.querySelectorAll(".label");
let imagePaths = []; // will store all uploaded imags paths;
let s3uploadPaths = [];
// let files = [];
let sizes = [];

let form = new FormData();
const objectsToBeDeleted = [];
const imagesToBeDeleted = [];
fileUploads.forEach((fileUpload, index) =>
  fileUpload.addEventListener("change", async (e) => {
    const file = fileUpload.files[0];
    if (!file.type.includes("image")) return showAlert("Upload image only!");

    console.log(e.target.nextSibling.style.backgroundImage);
    //prettier-ignore
    if (e.target.nextSibling.style.backgroundImage.startsWith(`url("https://vintar-digital-market.s3.eu-central-1.amazonaws.com`)) {
      console.log("image deleted in s3 bucket");
      objectsToBeDeleted.push(e.target.nextSibling.style.backgroundImage)
      imagesToBeDeleted.push(e.target.nextSibling.style.backgroundImage)
    }

    //Set background image with the file's blob
    const bg = URL.createObjectURL(file);
    let label = document.querySelector(`label[for=${fileUpload.id}]`);
    label.style.backgroundImage = `url(${bg}`;

    let productImage = document.querySelector(".product-image");
    productImage.src = bg;
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
// let product;
//   // if there is a product (when editing) then
//   // push the img paths to imagePaths variable
//   if (product) {
//     labels.forEach((label) => {
//       if (!label.style.backgroundImage) return;
//       const imgPath = label.style.backgroundImage
//         ? label.style.backgroundImage
//             .match(/(?:"[^"]*"|^[^"]*$)/)[0]
//             .replace(/"/g, "")
//         : undefined;
//       imagePaths.push(imgPath);
//     });
//   }

const formValidation = (e) => {
  //prettier-ignore
  if (!name.value || !briefDes.value || !detailedDes.value  || !price.value){
    e.target.disabled = false;
    return showAlert("Please fill out all the required fields!");
  }
  return true;
};

const imageValidation = (e, files) => {
  console.log(imagePaths.length);
  if (files.length <= 0 && imagePaths.length <= 0) {
    e.target.disabled = false;
    return showAlert("Please upload an image!");
  }
  return true;
};

//=================SUBMIT Btn
addProduct.addEventListener("click", async (e) => {
  e.target.disabled = true; // prevents from being submitted 2x
  loader.style.display = "block";
  if (!formValidation(e)) return;

  getSizes();
  const productId = window.location.pathname.split("/")[2] || null;

  labels.forEach((label) => {
    //prettier-ignore
    if(label.style.backgroundImage.startsWith(`url("https://vintar-digital-market.s3.eu-central-1.amazonaws.com`)){
      const imgPath = label.style.backgroundImage.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "")
      if(imagePaths.includes(imgPath)) return;
      imagePaths.push(imgPath)
    }
  });

  const files = [];
  fileUploads.forEach((fileUpload) => {
    const file = fileUpload.files[0];
    if (!file || !file.type.includes("image")) return;
    return files.push(file);
  });

  if (!imageValidation(e, files)) return;

  form.set(
    "product",
    JSON.stringify({
      id: productId,
      name: name.value,
      briefDes: briefDes.value,
      detailedDes: detailedDes.value,
      imagePaths,
      sizes,
      stocks: stocks.value,
      price: price.value,
    })
  );

  // 1.) get all files and append to form.

  form.delete("files");
  files.forEach((file) => {
    // if (form.getAll("files").includes(file)) return;
    return form.append("files", file);
  });

  console.log(form.getAll("files"), "being uploaded...");
  const data = await fetch("/s3url", {
    method: "POST",
    body: form,
  });

  const datas = await data.json();
  if (datas.status === "failed") {
    e.target.disabled = false;
    return showAlert(datas.message);
  }

  //===============================================
  // delete amazon bg image
  objectsToBeDeleted.forEach((object) => {
    fetch("/s3url/deleteObject", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        object,
      }),
    });
  });
  //===============================================

  console.log("change location to /seller");
  return (location.href = "/seller");

  //   const msg = fetchProduct.message.match(/\Please.*?\!/gm);
  //   const newMsg = msg.join("\n");
});
