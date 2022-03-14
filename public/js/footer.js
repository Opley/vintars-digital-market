const footer = document.querySelector("footer");

const renderFooter = () => {
  footer.innerHTML = `
   
    <div class="logo">  <img src="../img/footerLogo.svg" alt="" /></div>
    <p class="aboutParagraph">
      Vintar's Digital Market is a free web application that is intended to enable 
      product sellers the ability to showcase their products in a single location and also
      allow buyers to quickly find desired products. The website is built by a member
      of the community in hope of making your life easier! 

      This is the first live version of this web application. 
      The following features will be built in the future: <br>

    <br> *Real-time messaging system.
    <br> *The ability to search items/products. 
    <br> *The ability to 'like'/'heart' a product. <br>

     
    </p>
  
  <div class="contacts">
    <div class="name">Mr. Poludong</div>
    <div class="email">IlokanoProgrammer@gmail.com</div>
    <div class="telephone">tel. 1-800-000-0000, 1-800-111-1111</div>
  </div>
    `;
};

renderFooter();
