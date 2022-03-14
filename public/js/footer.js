const footer = document.querySelector("footer");

const renderFooter = () => {
  footer.innerHTML = `
   
    <div class="logo">  <img src="../img/footerLogo.svg" alt="" /></div>
    <p class="aboutParagraph">
      Vintar's Digital Market is lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore qui
      officiis laborum obcaecati. Id, ducimus tempore aspernatur ullam
      vel, facilis blanditiis soluta animi voluptate dolore veritatis nam
      minus adipisci sapiente. Nulla expedita vero nesciunt facere nisi
      ipsum numquam dicta quas quia, error, deleniti tempora ad enim,
      ratione mollitia maxime ullam!
    </p>
  
  <div class="contacts">
    <div class="name">Mr. Poludong</div>
    <div class="email">Poludong@gmail.com</div>
    <div class="telephone">tel. 1800-123-4560, 1800-456-7898</div>
  </div>
    `;
};

renderFooter();
