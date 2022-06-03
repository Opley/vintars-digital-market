import { showAlert } from "./utils.js";

//=============edit and trash btns
const edits = document.querySelectorAll(".edit");
const trash = document.querySelectorAll(".trash");

// const elements = [edits, trash];

trash.forEach((el) =>
  el.addEventListener("click", async (e) => {
    const id = el.dataset.product_id;

    // delete product with the above product id
    const res = await fetch("/delete-a-product", {
      method: "post",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ id }),
    });

    const result = await res.json();
    if (result.status === "success") return window.location.reload(true);

    showAlert(result.data);
  })
);
