import { showAlert } from "./utils.js";

const name = document.querySelector("#name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirmPassword");
const phone = document.querySelector("#phone");
const signupBtn = document.querySelector(".signupBtn");

signupBtn.addEventListener("click", async () => {
  // little features
  let tempNumber = phone.value
    .split("")
    .filter((e) => e !== "-" && e !== " ")
    .join("");

  //////////////////////
  if (true) {
    const fetchData = await fetch("/signup", {
      method: "post",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        phone: tempNumber,
      }),
    });

    const data = await fetchData?.json();
    console.log(data);
    if (data.status === "error") {
      if (data.code === 11000) {
        return showAlert("The email address already exist");
      }
      const msg = data.message.match(/\Please.*?\!/gm);
      const newMsg = msg.join("\n");
      return showAlert(newMsg);
    }

    window.location = "/";
  }
});
