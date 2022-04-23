import { showAlert } from "./utils.js";

const email = document.querySelector("#email") || null;
const password = document.querySelector("#password") || null;
const loginBtn = document.querySelector(".loginBtn");
const loader = document.querySelector(".loader");

loginBtn.addEventListener("click", async () => {
  loader.style.display = "block";

  const fetchData = await fetch("/login", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  });

  const data = await fetchData.json();

  if (data.status === "error" || data.status === "fail") {
    if (data.code === 11000) {
      return showAlert("The email address already exist");
    }

    return showAlert(data.message);
  }

  location.href = "/";
});
