const postData = (url, data) => {
  fetch(url, {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => processData(data));
};

const loader = document.querySelector(".loader");
// alert function
const showAlert = (msg) => {
  loader.style.display = "none";
  let alertBox = document.querySelector(".alert-box");
  let alertMsg = document.querySelector(".alert-msg");
  alertMsg.innerHTML = msg;
  alertBox.classList.add("show");
  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 3000);
  return false;
};

const processData = (data) => {
  // if data has an error
  if (data.alert) {
    showAlert(data.alert);
  }

  // if data is valid
  if (data.token) {
    sessionStorage.user = JSON.stringify(data);
    location.href = "/";
  }

  //if data is true and...
  if (data.loggedIn) {
    // location.href = "/";
  }

  if (data.status === "fail") {
    showAlert(data.message);
  }
};

export { showAlert };
