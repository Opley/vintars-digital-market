// const productDetail = document.querySelector(".product-detail");
import { showAlert } from "./utils.js";
const loader = document.querySelector(".loader");

// // style="background-image: url()"
// const renderProductDetail = (data) => {
//   console.log(`<p>${data.detailedDes}</p>`);
//   productDetail.innerHTML = `
//     <div class="product-image">
//       <img class="img" src="${data.imagePaths.find(
//         (el) => el !== null
//       )}" alt="" />
//       <div class="product-images">
//           <img src="${
//             data.imagePaths[0] ? data.imagePaths[0] : "../img/noimg.png"
//           }" alt="" />
//           <img src="${
//             data.imagePaths[1] ? data.imagePaths[1] : "../img/noimg.png"
//           }" alt="" />
//           <img src="${
//             data.imagePaths[2] ? data.imagePaths[2] : "../img/noimg.png"
//           }" alt="" />
//           <img src="${
//             data.imagePaths[3] ? data.imagePaths[3] : "../img/noimg.png"
//           }" alt="" />
//       </div>
//     </div>

//     <div class="product-details">

//         <h2 class="product-brand">${data.name}</h2>
//         <p class="product-short-des">
//         ${data.detailedDes}
//         </p>

//         <div class="available-sizes">
//           <h3>Available Size(s)</h3>
//           <div>
//               <input class="sizes" type="checkbox" ${
//                 data.sizes[0] ? "checked" : ""
//               } value="s"> </input >
//               <input class="sizes" type="checkbox" ${
//                 data.sizes[1] ? "checked" : ""
//               } value="m">  </input>
//               <input class="sizes" type="checkbox" ${
//                 data.sizes[2] ? "checked" : ""
//               } value="l">  </input>
//           </div>
//         </div>

//         <div class="stock-and-price">
//               <p> In stock: <span> ${data.stocks || 0} </span></p>
//               <p> Price: <span>&#8369;${data.price} </span></p>
//         </div>

//         <div class="btns">
//             <span class="add-to-cart btn">PM is the key!</span>

//         </div>
//     </div>
//     `;
// };

// <span class="add-to-wishlist btn">add to wishlist</span>

// window.onload = async () => {
//   //============Get Product Data from DB
//   const url = window.location.pathname;
//   const urlID = url.split("/")[2];

//   const fetchProductDB = await fetch(urlID, {
//     method: "post",
//     headers: new Headers({ "Content-Type": "application/json" }),
//     body: JSON.stringify({ id: urlID }),
//   });

//   const product = await fetchProductDB.json();
//   if (product.status === "error") {
//     showAlert("There is no product with this ID.");
//     return setTimeout(() => {
//       location.href = "/";
//     }, 3000);
//   }

// console.log(product.detailedDes);

// renderProductDetail(product);

// // must render product before retrieving element
const productImages = document.querySelector(".product-images");
const productImage = document.querySelector(".product-image img");

productImages.addEventListener("click", (e) => {
  if (e.target.tagName !== "IMG") return;
  productImage.src = `${e.target.src}`;
});

//============ADD to CART
const contactInfo = document.querySelector(".contact-info");
const name = document.querySelector(".name");
const email = document.querySelector(".email");
const phone = document.querySelector(".phone");
const addToCartBtn = document.querySelector(".add-to-cart");

addToCartBtn.addEventListener("click", () => {
  contactInfo.classList.toggle("hide-contact-info");
});

//============Close Contact Information
const close = document.querySelector(".close");
close.addEventListener("click", () => {
  contactInfo.classList.add("hide-contact-info");
});
// };

//===================================================
//==================REVIEWS

const reviewsBtn = document.querySelector(".reviewsBtn");
const reviews = document.querySelector(".reviews");
const addAReview = document.querySelector(".add-a-review");
const reviewInputBox = document.querySelector(".review-input-box");
const reviewInput = document.querySelector(".review-input");
const addReviewBtn = document.querySelector(".add-review-submit-btn");

reviewsBtn.addEventListener("click", (e) => {
  console.log("clicked review btn");
  reviews.classList.toggle("hide");
  if (!reviews.classList[1]) {
    window.scrollBy({
      top: 500,
      left: 0,
      behavior: "smooth",
    });
  } else {
    console.log(this);
    window.scrollBy({
      top: -20,
      left: 0,
      behavior: "smooth",
    });
  }

  addAReview.addEventListener("click", (e) => {
    if (e.target.classList[0] === "gg-math-plus") {
      addAReview.innerHTML = `<i class="gg-math-minus"></i>`;
      reviewInputBox.classList.toggle("expand");
      // reviewInputBox.style.maxHeight = "initial";
    } else {
      addAReview.innerHTML = `<i class="gg-math-plus"></i>`;
      reviewInputBox.classList.toggle("expand");

      // reviewInputBox.style.maxHeight = 0;
    }
  });
});

// const reviewBox = document.querySelectorAll(".review-box");
const submitReview = async (url, method, body) => {
  const result = await fetch(url, {
    method: method,
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  const review = await result.json();

  // const nameTag = document.querySelector(".nameTag");
  // var tempDiv = document.createElement("div");
  // tempDiv.classList.add("review-box");
  // tempDiv.innerHTML = `
  // <span class="name"> ${nameTag.innerHTML} </span>
  // <p class="review"> "${reviewInput.value}" </p>
  // <span class="createdAt"> - Created today </span>
  // `;

  if (review.status === "success") {
    window.location.reload();
  }
  if (review.status === "failed") {
    return showAlert(review.data);
  }
};

addReviewBtn.addEventListener("click", async (e) => {
  e.target.disabled = true;

  if (e.target.innerHTML === "login") return (window.location = "/login");
  const reviewId = e.target.dataset.reviewid;
  const product = window.location.pathname.split("/")[2];
  loader.style.display = "block";

  if (reviewId) {
    // update
    submitReview(`/update-a-review/${reviewId}`, "PATCH", {
      id: reviewId,
      review: reviewInput.value,
    });
  } else {
    //create
    submitReview("/add-a-review", "post", {
      review: reviewInput.value,
      product,
    });
  }
  // e.target.innerHTML = `<img class="" src="../img/loader.gif" alt="">`;
});
