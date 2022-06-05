import { showAlert } from "./utils.js";

const productsContainer = document.querySelector(".allProductsContainer");
const allProducts = document.querySelector(".allProductsBody");
const title = document.querySelector(".allProductsTitle");
const btns = document.querySelector(".btns");

productsContainer.addEventListener("click", async (e) => {
  const heart = e.target.closest(".heart");
  if (!heart) return;

  const product = products.find((product, index) => {
    return product.id === heart.dataset.productid;
  });

  // like and unlike a product
  // this is based on the product variable in JS not backend
  if (heart.classList.contains("red-heart")) {
    // unlike a product
    product?.likers.find(function (liker, index) {
      if (liker.userId == user?.id) {
        return product.likers.splice(index, 1);
      }
    });
  } else {
    product.likers.push({ userId: user?.id });
  }

  const productId = heart.dataset.productid;
  heart.classList.toggle("red-heart");

  const result = await fetch("/api/likes/like-a-product", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ productId }),
  });
  const like = await result.json();

  if (like.status === "success") {
  } else {
    heart.classList.toggle("red-heart");
    showAlert(like.data);
  }
});

const generateBtns = (curPage, leftHide, rightHide) => {
  return `
  <button class="btn leftBtn ${leftHide}" data-goto=${+curPage - 1}> ${
    +curPage - 1
  } </button>
  <button class="btn rightBtn ${rightHide}" data-goto=${+curPage + 1}> ${
    +curPage + 1
  } </button>`;
};
console.log(user);

const generatePaginatedMarkup = (curPage) => {
  allProducts.innerHTML = "";
  const start = (curPage - 1) * 20;
  const end = start + 20;
  const newProduct = products.slice(start, end);

  newProduct.forEach((product) => {
    const bolean = product?.likers.find((liker) => liker.userId === user?.id);
    allProducts.innerHTML += `
      <div class="products">
        <a class="detail" href="/product-detail/${product.id}">detail</a>
        <svg class='heart ${bolean ? "red-heart" : ""}' data-productid="${
      product.id
    }" data-likeid="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.0122 5.57169L10.9252 4.48469C8.77734 2.33681 5.29493 2.33681 3.14705 4.48469C0.999162 6.63258 0.999162 10.115 3.14705 12.2629L11.9859 21.1017L11.9877 21.0999L12.014 21.1262L20.8528 12.2874C23.0007 10.1395 23.0007 6.65711 20.8528 4.50923C18.705 2.36134 15.2226 2.36134 13.0747 4.50923L12.0122 5.57169ZM11.9877 18.2715L16.9239 13.3352L18.3747 11.9342L18.3762 11.9356L19.4386 10.8732C20.8055 9.50635 20.8055 7.29028 19.4386 5.92344C18.0718 4.55661 15.8557 4.55661 14.4889 5.92344L12.0133 8.39904L12.006 8.3918L12.005 8.39287L9.51101 5.89891C8.14417 4.53207 5.92809 4.53207 4.56126 5.89891C3.19442 7.26574 3.19442 9.48182 4.56126 10.8487L7.10068 13.3881L7.10248 13.3863L11.9877 18.2715Z" fill="currentColor"></path></svg>
        <img src="${product.imagePaths[0]}" alt="">
      </div>
    `;
  });
  if (+curPage === 1 && +curPage >= products.length / 20) {
    return (btns.innerHTML = generateBtns(curPage, "hide", "hide"));
  }

  if (+curPage === 1) {
    return (btns.innerHTML = generateBtns(curPage, "hide"));
  }

  if (+curPage >= products.length / 20) {
    return (btns.innerHTML = generateBtns(curPage, "", "hide"));
  }

  btns.innerHTML = `<button class="btn leftBtn" data-goto=${+curPage - 1}> ${
    +curPage - 1
  } </button>
  <button class="btn rightBtn" data-goto=${+curPage + 1}> ${
    +curPage + 1
  } </button>`;
};

productsContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn");
  if (!btn) return;

  const page = btn.dataset.goto;
  generatePaginatedMarkup(page);

  localStorage.setItem("currentPage", page);
  productsContainer.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

window.onload = () => {
  localStorage.setItem("currentPage", 1);
  generatePaginatedMarkup(localStorage.getItem("currentPage"));
};
