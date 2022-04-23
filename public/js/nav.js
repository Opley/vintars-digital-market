const navBar = document.querySelector(".navBar");

const logout = async () => {
  const fetchData = await fetch("/logout", {
    method: "get",
    headers: new Headers({ "Content-Type": "application/json" }),
  });

  const logout1 = await fetchData.json();
};

const clearScroll = () => {
  localStorage.setItem("scroll", 0);
};

const renderNavBar = () => {
  navBar.innerHTML = `
  <a href="/"
  ><svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="#e9f5e7"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6 22.8787C4.34315 22.8787 3 21.5355 3 19.8787V9.87866C3 9.84477 3.00169 9.81126 3.00498 9.77823H3C3 9.20227 3.2288 8.64989 3.63607 8.24262L9.87868 2.00002C11.0502 0.828445 12.9497 0.828445 14.1213 2.00002L20.3639 8.24264C20.7712 8.6499 21 9.20227 21 9.77823H20.995C20.9983 9.81126 21 9.84477 21 9.87866V19.8787C21 21.5355 19.6569 22.8787 18 22.8787H6ZM12.7071 3.41423L19 9.70713V19.8787C19 20.4309 18.5523 20.8787 18 20.8787H15V15.8787C15 14.2218 13.6569 12.8787 12 12.8787C10.3431 12.8787 9 14.2218 9 15.8787V20.8787H6C5.44772 20.8787 5 20.4309 5 19.8787V9.7072L11.2929 3.41423C11.6834 3.02371 12.3166 3.02371 12.7071 3.41423Z"
      fill="currentColor"
    /></svg
></a>
<div class="searchBox">
  <input class="searchBoxInput" type="text" placeholder="Coming soon..." />
</div>

<svg
  class="svgMenu"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z"
    fill="currentColor"
  />
  <path
    d="M2 12.0322C2 11.4799 2.44772 11.0322 3 11.0322H21C21.5523 11.0322 22 11.4799 22 12.0322C22 12.5845 21.5523 13.0322 21 13.0322H3C2.44772 13.0322 2 12.5845 2 12.0322Z"
    fill="currentColor"
  />
  <path
    d="M3 17.0645C2.44772 17.0645 2 17.5122 2 18.0645C2 18.6167 2.44772 19.0645 3 19.0645H21C21.5523 19.0645 22 18.6167 22 18.0645C22 17.5122 21.5523 17.0645 21 17.0645H3Z"
    fill="currentColor"
  />
</svg>
<div class="hidden-nav hide">
  <svg
    class="svgArrow"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.3284 11.0001V13.0001L7.50011 13.0001L10.7426 16.2426L9.32842 17.6568L3.67157 12L9.32842 6.34314L10.7426 7.75735L7.49988 11.0001L20.3284 11.0001Z"
      fill="currentColor"
    />
  </svg>
  <ul class="hamburger-links">
    <li class="links"><a href="/">Home</a></li>
    <li class="links"><a href="/all-products">Products</a></li>
     ${
       user
         ? `<li class="links"><a href="/seller" onclick="clearScroll()">Seller's Dashboard</a></li>
            <li class="links"><a href="/logout">Logout as (${user[0].name})</a></li>`
         : `<li class="links"><a href="/seller" onclick="clearScroll()">Become A Seller</a></li>
            <li class="links"><a href="/login">Login</a></li>`
     }
  </ul>
</div>

<div class="bigNav">
  <ul class="links">
    <a href="/"><li class="link">Home</li></a>
    <a href="/all-products"> <li class="link">Products</li></a>
    ${
      user
        ? `<li class="links"><a href="/seller">Seller's Dashboard</a></li><li class="links"><a href="/login" onclick="logout()">Logout</a></li>`
        : `<li class="links"><a href="/seller">Become A Seller</a></li><li class="links"><a href="/login">Login</a></li>`
    }
  </ul>
</div>
    `;
};

renderNavBar();
const svgMenu = document.querySelector(".svgMenu");
const hideMenu = document.querySelector(".svgArrow");
const nav = document.querySelector(".hidden-nav");
const hamburgerMenu = document.querySelector(".hamburger-links");

const arr = [hideMenu, hamburgerMenu];

svgMenu.addEventListener("click", () => {
  nav.style.opacity = 1;
  nav.style.pointerEvents = "auto";
  nav.style.transform = "translateX(0%)";
  svgMenu.style.pointerEvents = "none";
});

hideMenu.addEventListener("click", () => {
  nav.style.opacity = 0;
  nav.style.pointerEvents = "none";
  nav.style.transform = "translate(0)";
  svgMenu.style.pointerEvents = "all";
});
