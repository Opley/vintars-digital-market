//=============edit and trash btns
const edits = document.querySelectorAll(".edit");
const trash = document.querySelectorAll(".trash");
// const elements = [edits, trash];

let count = 0;

trash.forEach((el) =>
  el.addEventListener("click", async (e) => {
    count++;
    console.log(count);
    if (count > 1) return;
    const productID = el.dataset.product_id;

    // delete product with the above product id
    const res = await fetch("/delete-a-product", {
      method: "post",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ productID }),
    });

    const result = await res.json();
    console.log(result);
    if (result.status === "success") window.location.reload(true);
  })
);
