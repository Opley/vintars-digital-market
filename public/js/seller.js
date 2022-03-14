const mainBody = document.querySelector("main");
const allProductsBody = document.querySelector(".allProductsBody");
const addAProductBtn = document.querySelector(".add-a-product-btn");

addAProductBtn.addEventListener("click", () => {
  localStorage.removeItem("product");
  window.location.href = "/add-a-product";
});

let scrollVertical;

const fetchDeleteProductDB = async (id) => {
  const fetchProduct = await fetch(`/product-detail/delete`, {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ id }),
  });

  const deletedProduct = await fetchProduct.json();
  scrollVertical = window.scrollY;
  localStorage.setItem("scroll", scrollVertical);
  window.location.reload();
};

// mainBody.innerHTML = "test";
const renderProductsHTML = (data) => {
  data.forEach((product) => {
    allProductsBody.innerHTML += `
        <div class="products">
            <a href="/product-detail/${product._id}" class="detail">detail</a>
            <svg
                class="edit"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM18.5793 19.531C20.6758 17.698 22 15.0036 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.9616 3.28743 17.6225 5.33317 19.4535L6.99999 10.9738H9.17026L12 6.07251L14.8297 10.9738H17L18.5793 19.531ZM16.0919 21.1272L15.2056 12.9738H8.79438L7.90814 21.1272C9.15715 21.688 10.5421 22 12 22C13.4579 22 14.8428 21.688 16.0919 21.1272Z"
                  fill="currentColor"/>
            </svg>

           <svg class="trash"
             
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17 5V4C17 2.89543 16.1046 2 15 2H9C7.89543 2 7 2.89543 7 4V5H4C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H5V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H17ZM15 4H9V5H15V4ZM17 7H7V18C7 18.5523 7.44772 19 8 19H16C16.5523 19 17 18.5523 17 18V7Z"
                  fill="currentColor"/>
                <path d="M9 9H11V17H9V9Z" fill="currentColor" />
                <path d="M13 9H15V17H13V9Z" fill="currentColor" />
          </svg>
            <img src="${product.imagePaths.find((el) => el !== null)}" alt="" />
        </div>
    `;
  });
};

let fetchedProduct;

//when clicked on product ~> product-detail w/ products info from db
window.onload = async () => {
  if (!sessionStorage.user) {
    location.href = "/unauthorize-access";
    return;
  }

  // =============validate user token
  const user = JSON.parse(sessionStorage.user);
  const fetchVerifyToken = await fetch("/auth", {
    method: "get",
    headers: new Headers({
      Authorization: `Bearer ${user.token}`,
    }),
  });
  const token = await fetchVerifyToken.json();

  if (token.status === "error") {
    alert(token.message);
    location.href = "/unauthorize-access";
  }

  // =============fetch products from database
  const fetchProductsDB = await fetch("/database", {
    method: "get",
    headers: new Headers({
      Authorization: `Bearer ${user.email}`,
    }),
  });

  const products = await fetchProductsDB.json();
  renderProductsHTML(products);

  //=============edit and trash btns
  const edits = document.querySelectorAll(".edit");
  const trash = document.querySelectorAll(".trash");
  const elements = [edits, trash];

  const fetchProductDB = async (id) => {
    const fetchProduct = await fetch(`/product-detail/${id}`, {
      method: "post",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ id }),
    });

    let product = await fetchProduct.json();
    product.edit = true;

    JSON.stringify(localStorage.setItem("product", JSON.stringify(product)));
    window.location.href = "/add-a-product";
  };

  elements.forEach(([...element]) => {
    element.forEach((el) => {
      el.addEventListener("click", (e) => {
        if (e.target.closest(".edit")) {
          const productID = e.target
            .closest(".products")
            .firstElementChild.href.split("/")
            .pop();

          fetchedProduct = fetchProductDB(productID);
        } else if (e.target.closest(".trash")) {
          const productID = e.target
            .closest(".products")
            .firstElementChild.href.split("/")
            .pop();

          fetchDeleteProductDB(productID);
        }
      });
    });
  });
  scrollVertical = localStorage.getItem("scroll");
  window.scroll({
    top: scrollVertical,
    left: 0,
    behavior: "smooth",
  });
};
