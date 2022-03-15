const productDetail = document.querySelector(".product-detail");

// style="background-image: url()"
const renderProductDetail = (data) => {
  productDetail.innerHTML = `
    <div class="product-image">
      <img class="img" src="${data.imagePaths.find(
        (el) => el !== null
      )}" alt="" />
      <div class="product-images">
          <img src="${
            data.imagePaths[0] ? data.imagePaths[0] : "../img/noimg.png"
          }" alt="" />
          <img src="${
            data.imagePaths[1] ? data.imagePaths[1] : "../img/noimg.png"
          }" alt="" />
          <img src="${
            data.imagePaths[2] ? data.imagePaths[2] : "../img/noimg.png"
          }" alt="" />
          <img src="${
            data.imagePaths[3] ? data.imagePaths[3] : "../img/noimg.png"
          }" alt="" />
      </div>
    </div>

    <div class="product-details">

        <h2 class="product-brand">${data.name}</h2>
        <p class="product-short-des">
        ${data.detailedDes}
        </p>


        <div class="available-sizes">
          <h3>Available Size(s)</h3>
          <div>
              <input class="sizes" type="checkbox" ${
                data.sizes[0] ? "checked" : ""
              } value="s"> </input >
              <input class="sizes" type="checkbox" ${
                data.sizes[1] ? "checked" : ""
              } value="m">  </input>
              <input class="sizes" type="checkbox" ${
                data.sizes[2] ? "checked" : ""
              } value="l">  </input>
          </div>
        </div>

        <div class="stock-and-price">
              <p> In stock: <span> ${data.stocks || 0} </span></p>
              <p> Price: <span>&#8369;${data.price} </span></p>
        </div>

        <div class="btns">
            <span class="add-to-cart btn">PM is the key!</span>
        
        </div>
    </div>
    `;
};

// <span class="add-to-wishlist btn">add to wishlist</span>

window.onload = async () => {
  //============Get Product Data from DB
  const url = window.location.pathname;
  const urlID = url.split("/")[2];

  const fetchProductDB = await fetch(urlID, {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ id: urlID }),
  });

  const product = await fetchProductDB.json();
  if (product.status === "error") {
    showAlert("There is no product with this ID.");
    return setTimeout(() => {
      location.href = "/";
    }, 3000);
  }
  renderProductDetail(product);

  // must render product before retrieving element
  const productImages = document.querySelector(".product-images");
  const productImage = document.querySelector(".product-image img");
  console.log(productImage);

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

  addToCartBtn.addEventListener("click", async () => {
    console.log("test");
    const fetchUserDB = await fetch("/database/user", {
      method: "post",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ email: product.email }),
    });

    const user = await fetchUserDB.json();
    name.innerHTML = `Name: ${user.name}`;
    email.innerHTML = `Email: ${user.email}`;
    phone.innerHTML = `Phone: ${user.phone}`;
    phone.href = `tel:${user.phone}`;

    contactInfo.classList.toggle("hide-contact-info");
  });

  //============Close Contact Information
  const close = document.querySelector(".close");
  close.addEventListener("click", () => {
    contactInfo.classList.add("hide-contact-info");
  });
};
