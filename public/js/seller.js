//=============edit and trash btns
const edits = document.querySelectorAll(".edit");
const trash = document.querySelectorAll(".trash");
// const elements = [edits, trash];

trash.forEach((el) =>
  el.addEventListener("click", async (e) => {
    const productID = el.dataset.product_id;

    // delete product with the above product id
    const res = await fetch("/delete-a-product", {
      method: "post",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ productID }),
    });

    const result = await res.json();
    console.log(result);
    if (result.status === "success") window.location.reload();
  })
);
