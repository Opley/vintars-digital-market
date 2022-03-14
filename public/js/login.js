import { showAlert } from "./utils.js";

const email = document.querySelector("#email") || null;
const password = document.querySelector("#password") || null;
const loginBtn = document.querySelector(".loginBtn");
const loader = document.querySelector(".loader");

window.onload = async () => {
  if (sessionStorage.user) {
    const storedToken = JSON.parse(sessionStorage.user)?.token;
    if (!storedToken) return;

    const data = await fetch("/auth", {
      method: "get",
      headers: new Headers({
        Authorization: `Bearer ${storedToken}`,
      }),
    });

    const token = await data.json();

    if (token.status === "error") {
      return showAlert(token.message);
    }

    location.href = "/";
  }
};

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

  sessionStorage.user = JSON.stringify(data);
  location.href = "/";
});
