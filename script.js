function handleFileUpload(event, previewId) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById(previewId).src = e.target.result;
    if (previewId === 'imagePreview') {
      document.getElementById('image').value = e.target.result;
    } else if (previewId === 'carouselPreview') {
      document.getElementById('carouselImage').value = e.target.result;
    }
    document.getElementById(previewId).style.display = 'block';
  };
  if (file) {
    reader.readAsDataURL(file);
  }
}
const initialPhones = [{
  name: "iPhone 13 Pro",
  stock: 10,
  image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-max-graphite-select?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1631652956000",
  description: "iPhone 13 Pro com chip A15 Bionic",
  price: 5999.99
}, {
  name: "Samsung Galaxy S21",
  stock: 15,
  image: "https://images.samsung.com/is/image/samsung/p6pim/uk/galaxy-s21/gallery/uk-galaxy-s21-5g-g991-sm-g991bzadeua-thumb-368338803",
  description: "Samsung Galaxy S21 com 5G",
  price: 3999.99
}, {
  name: "Google Pixel 6",
  stock: 8,
  image: "https://lh3.googleusercontent.com/0QKq5vYj7LvzjA2K3OGZzHqwqGQgqLUJqI7ZBrCY6-vd89GbZdZ6LmaRnF9P8AjcWqY=w1200-h630-p",
  description: "Google Pixel 6 com chip Tensor",
  price: 4299.99
}, {
  name: "OnePlus 9",
  stock: 12,
  image: "https://oasis.opstatics.com/content/dam/oasis/page/2021/9-series/spec-image/9/Morning%20Mist_1080_1920.jpg",
  description: "OnePlus 9 com Snapdragon 888",
  price: 3599.99
}, {
  name: "Xiaomi Mi 11",
  stock: 20,
  image: "https://i01.appmifile.com/webfile/globalimg/products/pc/mi11/specs-01.png",
  description: "Xiaomi Mi 11 com câmera de 108MP",
  price: 3299.99
}];
const ADMIN_PASSWORD = "1234";
var swiper = new Swiper(".mySwiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false
  },
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true
  },
  pagination: {
    el: ".swiper-pagination"
  }
});
const initialCarouselItems = [{
  title: "iPhone 13 Pro",
  image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-max-graphite-select?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1631652956000",
  subtitle: "50% OFF em todos os modelos"
}, {
  title: "Samsung Galaxy S21",
  image: "https://images.samsung.com/is/image/samsung/p6pim/uk/galaxy-s21/gallery/uk-galaxy-s21-5g-g991-sm-g991bzadeua-thumb-368338803",
  subtitle: "Até R$3500 de desconto na troca"
}, {
  title: "Google Pixel 6",
  image: "https://lh3.googleusercontent.com/0QKq5vYj7LvzjA2K3OGZzHqwqGQgqLUJqI7ZBrCY6-vd89GbZdZ6LmaRnF9P8AjcWqY=w1200-h630-p",
  subtitle: "Frete Grátis na compra"
}, {
  title: "OnePlus 9",
  image: "https://oasis.opstatics.com/content/dam/oasis/page/2021/9-series/spec-image/9/Morning%20Mist_1080_1920.jpg",
  subtitle: "20% OFF à vista"
}, {
  title: "Xiaomi Mi 11",
  image: "https://i01.appmifile.com/webfile/globalimg/products/pc/mi11/specs-01.png",
  subtitle: "Desconto Estudante 15%"
}];
let carouselItems = JSON.parse(localStorage.getItem('carouselItems')) || initialCarouselItems;
let currentProduct = null;
function updateCartCount() {
  const cartCount = document.querySelector('.cart-count');
  const count = currentProduct ? 1 : 0;
  cartCount.textContent = count;
}
function closeCheckoutModal() {
  document.body.classList.remove('modal-open');
  document.getElementById('checkoutModal').style.display = 'none';
  currentProduct = null;
  updateCartCount();
}
function showCheckoutModal(product) {
  currentProduct = product;
  const modal = document.getElementById('checkoutModal');
  const productDetails = document.getElementById('selectedProduct');
  productDetails.innerHTML = `
    <h3>Produto Selecionado:</h3>
    <div class="product-details">
      <img src="${product.image}" alt="${product.name}">
      <div>
        <h4>${product.name}</h4>
        <p>Preço: R$ ${Number(product.price).toFixed(2)}</p>
      </div>
    </div>
  `;
  document.body.classList.add('modal-open');
  modal.style.display = 'block';
}
document.getElementById('checkoutForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const fullName = document.getElementById('fullName').value;
  const phone = document.getElementById('phone').value;
  if (fullName.length < 4) {
    alert('Nome deve ter no mínimo 4 caracteres');
    return;
  }
  const phoneRegex = /^[0-9]{11}$/;
  if (!phoneRegex.test(phone)) {
    alert('Telefone deve ter exatamente 11 números, sem formatação');
    return;
  }
  const formattedPhone = `(${phone.slice(0, 2)})${phone.slice(2, 7)}-${phone.slice(7)}`;
  const message = encodeURIComponent(`Olá! Nova compra:\n\n` + `Cliente: ${fullName}\n` + `Telefone: ${formattedPhone}\n\n` + `Produto: ${currentProduct.name}\n` + `Preço: R$ ${currentProduct.price.toFixed(2)}\n` + `Descrição: ${currentProduct.description}`);
  window.open(`https://wa.me/5531288805?text=${message}`, '_blank');
  closeCheckoutModal();
  this.reset();
});
function sendToWhatsApp(product) {
  currentProduct = product;
  updateCartCount();
}
function toggleCart() {
  const cartCount = document.querySelector('.cart-count');
  const currentCount = parseInt(cartCount.textContent);
  if (currentCount > 0) {
    if (currentProduct) {
      showCheckoutModal(currentProduct);
    } else {
      alert('Nenhum produto selecionado');
    }
  } else {
    alert('Carrinho vazio');
  }
}
function openPasswordModal() {
  document.body.classList.add('modal-open');
  document.getElementById('passwordModal').style.display = 'block';
}
function closePasswordModal() {
  document.body.classList.remove('modal-open');
  document.getElementById('passwordModal').style.display = 'none';
  document.getElementById('adminPassword').value = '';
  document.querySelectorAll('input[name="registerType"]').forEach(radio => radio.checked = false);
}
function closeCarouselModal() {
  document.body.classList.remove('modal-open');
  document.getElementById('carouselModal').style.display = 'none';
}
function validatePassword() {
  const password = document.getElementById('adminPassword').value;
  const registerType = document.querySelector('input[name="registerType"]:checked');
  if (password === ADMIN_PASSWORD && registerType) {
    closePasswordModal();
    if (registerType.value === 'carousel') {
      openCarouselModal();
    } else {
      openModal();
    }
  } else {
    alert('Senha incorreta ou tipo de cadastro não selecionado!');
  }
}
function openCarouselModal() {
  document.body.classList.add('modal-open');
  document.getElementById('carouselModal').style.display = 'block';
  displayRegisteredCarouselItems();
}
function displayRegisteredCarouselItems() {
  const container = document.getElementById('registeredCarouselItems');
  let html = '';
  carouselItems.forEach((item, index) => {
    html += `
      <div class="registered-item">
        <img src="${item.image}" alt="${item.title}">
        <div class="item-details">
          <h4>${item.title}</h4>
          <p>${item.subtitle}</p>
        </div>
        <button class="remove-btn" onclick="removeCarouselItem(${index})">Remover</button>
      </div>
    `;
  });
  container.innerHTML = html;
}
function removeCarouselItem(index) {
  carouselItems.splice(index, 1);
  localStorage.setItem('carouselItems', JSON.stringify(carouselItems));
  updateCarouselSlides();
  displayRegisteredCarouselItems();
}
function updateCarouselSlides() {
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  let slidesHTML = '';
  carouselItems.forEach(item => {
    slidesHTML += `
      <div class="swiper-slide">
        <img src="${item.image}" alt="${item.title}" style="width:200px;height:200px;object-fit:contain;margin-bottom:15px;">
        <h2>${item.title}</h2>
        <p>${item.subtitle}</p>
      </div>
    `;
  });
  swiperWrapper.innerHTML = slidesHTML;
  swiper.update();
}
document.getElementById('carouselForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const newItem = {
    title: document.getElementById('carouselTitle').value,
    image: document.getElementById('carouselImage').value,
    subtitle: document.getElementById('carouselSubtitle').value
  };
  carouselItems.push(newItem);
  localStorage.setItem('carouselItems', JSON.stringify(carouselItems));
  updateCarouselSlides();
  displayRegisteredCarouselItems();
  this.reset();
});
function openModal() {
  document.body.classList.add('modal-open');
  document.getElementById('peripheralModal').style.display = 'block';
  displayRegisteredPeripherals();
}
function closeModal() {
  document.body.classList.remove('modal-open');
  document.getElementById('peripheralModal').style.display = 'none';
  document.getElementById('peripheralForm').reset();
}
function removePeripheral(index) {
  let peripherals = JSON.parse(localStorage.getItem('peripherals')) || [];
  peripherals.splice(index, 1);
  localStorage.setItem('peripherals', JSON.stringify(peripherals));
  displayPeripherals();
  displayRegisteredPeripherals();
}
function displayRegisteredPeripherals() {
  const container = document.getElementById('registeredPeripheralsList');
  const peripherals = JSON.parse(localStorage.getItem('peripherals')) || [];
  let html = '';
  peripherals.forEach((peripheral, index) => {
    html += `
        <div class="registered-item">
          <img src="${peripheral.image}" alt="${peripheral.name}">
          <div class="item-details">
            <h4>${peripheral.name}</h4>
            <p>Estoque: ${peripheral.stock}</p>
            <p>Preço: R$ ${Number(peripheral.price).toFixed(2)}</p>
          </div>
          <button class="remove-btn" onclick="removePeripheral(${index})">Remover</button>
        </div>
      `;
  });
  container.innerHTML = html;
}
const peripheralForm = document.getElementById('peripheralForm');
let peripherals = JSON.parse(localStorage.getItem('peripherals')) || [];
peripheralForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const newPeripheral = {
    name: document.getElementById('name').value,
    stock: document.getElementById('stock').value,
    image: document.getElementById('imagePreview').src,
    description: document.getElementById('description').value,
    price: document.getElementById('price').value
  };
  peripherals.push(newPeripheral);
  localStorage.setItem('peripherals', JSON.stringify(peripherals));
  displayPeripherals();
  displayRegisteredPeripherals();
  peripheralForm.reset();
  document.getElementById('imagePreview').style.display = 'none';
});
function displayPeripherals() {
  const container = document.getElementById('products-container');
  const peripherals = JSON.parse(localStorage.getItem('peripherals')) || [];
  let peripheralsHTML = '';
  peripherals.forEach((peripheral, index) => {
    peripheralsHTML += `
        <div class="product">
          <img alt="${peripheral.name}" src="${peripheral.image}" width="200" height="200">
          <h3>${peripheral.name}</h3>
          <p>Estoque: ${peripheral.stock}</p>
          <p>${peripheral.description}</p>
          <p>R$ ${Number(peripheral.price).toFixed(2)}</p>
          <button class="buy-btn" onclick="sendToWhatsApp(${JSON.stringify(peripheral).replace(/"/g, '\'')})">
            Comprar
          </button>
        </div>
      `;
  });
  container.innerHTML = peripheralsHTML;
}
document.addEventListener('DOMContentLoaded', function () {
  document.title = 'AP Celulares';
  if (!localStorage.getItem('peripherals')) {
    localStorage.setItem('peripherals', JSON.stringify(initialPhones));
  }
  if (!localStorage.getItem('carouselItems')) {
    localStorage.setItem('carouselItems', JSON.stringify(initialCarouselItems));
    carouselItems = initialCarouselItems;
  }
  updateCarouselSlides();
  displayPeripherals();
});
function searchProducts() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const peripherals = JSON.parse(localStorage.getItem('peripherals')) || [];
  const filteredPeripherals = peripherals.filter(p => p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm));
  displayFilteredPeripherals(filteredPeripherals);
}
function displayFilteredPeripherals(peripherals) {
  const container = document.getElementById('products-container');
  let peripheralsHTML = '';
  peripherals.forEach((peripheral, index) => {
    peripheralsHTML += `
      <div class="product">
        <img alt="${peripheral.name}" src="${peripheral.image}" width="200" height="200">
        <h3>${peripheral.name}</h3>
        <p>Estoque: ${peripheral.stock}</p>
        <p>${peripheral.description}</p>
        <p>R$ ${Number(peripheral.price).toFixed(2)}</p>
        <button class="buy-btn" onclick="sendToWhatsApp(${JSON.stringify(peripheral).replace(/"/g, '\'')})">
          Comprar
        </button>
      </div>
    `;
  });
  container.innerHTML = peripheralsHTML;
}
const phoneRegex = /^\d{11}$/;




// const initialPhones = [{
//   name: "iPhone 13 Pro",
//   stock: 10,
//   image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-max-graphite-select?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1631652956000",
//   description: "iPhone 13 Pro com chip A15 Bionic",
//   price: 5999.99
// }, {
//   name: "Samsung Galaxy S21",
//   stock: 15,
//   image: "https://images.samsung.com/is/image/samsung/p6pim/uk/galaxy-s21/gallery/uk-galaxy-s21-5g-g991-sm-g991bzadeua-thumb-368338803",
//   description: "Samsung Galaxy S21 com 5G",
//   price: 3999.99
// }, {
//   name: "Google Pixel 6",
//   stock: 8,
//   image: "https://lh3.googleusercontent.com/0QKq5vYj7LvzjA2K3OGZzHqwqGQgqLUJqI7ZBrCY6-vd89GbZdZ6LmaRnF9P8AjcWqY=w1200-h630-p",
//   description: "Google Pixel 6 com chip Tensor",
//   price: 4299.99
// }, {
//   name: "OnePlus 9",
//   stock: 12,
//   image: "https://oasis.opstatics.com/content/dam/oasis/page/2021/9-series/spec-image/9/Morning%20Mist_1080_1920.jpg",
//   description: "OnePlus 9 com Snapdragon 888",
//   price: 3599.99
// }, {
//   name: "Xiaomi Mi 11",
//   stock: 20,
//   image: "https://i01.appmifile.com/webfile/globalimg/products/pc/mi11/specs-01.png",
//   description: "Xiaomi Mi 11 com câmera de 108MP",
//   price: 3299.99
// }];
// const ADMIN_PASSWORD = "1234";
// var swiper = new Swiper(".mySwiper", {
//   effect: "coverflow",
//   grabCursor: true,
//   centeredSlides: true,
//   slidesPerView: "auto",
//   loop: true,
//   autoplay: {
//     delay: 2500,
//     disableOnInteraction: false
//   },
//   coverflowEffect: {
//     rotate: 50,
//     stretch: 0,
//     depth: 100,
//     modifier: 1,
//     slideShadows: true
//   },
//   pagination: {
//     el: ".swiper-pagination"
//   }
// });
// const initialCarouselItems = [{
//   title: "iPhone 13 Pro",
//   image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-max-graphite-select?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1631652956000",
//   subtitle: "50% OFF em todos os modelos"
// }, {
//   title: "Samsung Galaxy S21",
//   image: "https://images.samsung.com/is/image/samsung/p6pim/uk/galaxy-s21/gallery/uk-galaxy-s21-5g-g991-sm-g991bzadeua-thumb-368338803",
//   subtitle: "Até R$3500 de desconto na troca"
// }, {
//   title: "Google Pixel 6",
//   image: "https://lh3.googleusercontent.com/0QKq5vYj7LvzjA2K3OGZzHqwqGQgqLUJqI7ZBrCY6-vd89GbZdZ6LmaRnF9P8AjcWqY=w1200-h630-p",
//   subtitle: "Frete Grátis na compra"
// }, {
//   title: "OnePlus 9",
//   image: "https://oasis.opstatics.com/content/dam/oasis/page/2021/9-series/spec-image/9/Morning%20Mist_1080_1920.jpg",
//   subtitle: "20% OFF à vista"
// }, {
//   title: "Xiaomi Mi 11",
//   image: "https://i01.appmifile.com/webfile/globalimg/products/pc/mi11/specs-01.png",
//   subtitle: "Desconto Estudante 15%"
// }];
// let carouselItems = JSON.parse(localStorage.getItem('carouselItems')) || initialCarouselItems;
// function openPasswordModal() {
//   document.body.classList.add('modal-open');
//   document.getElementById('passwordModal').style.display = 'block';
// }
// function closePasswordModal() {
//   document.body.classList.remove('modal-open');
//   document.getElementById('passwordModal').style.display = 'none';
//   document.getElementById('adminPassword').value = '';
//   document.querySelectorAll('input[name="registerType"]').forEach(radio => radio.checked = false);
// }
// function closeCarouselModal() {
//   document.body.classList.remove('modal-open');
//   document.getElementById('carouselModal').style.display = 'none';
// }
// function validatePassword() {
//   const password = document.getElementById('adminPassword').value;
//   const registerType = document.querySelector('input[name="registerType"]:checked');
//   if (password === ADMIN_PASSWORD && registerType) {
//     closePasswordModal();
//     if (registerType.value === 'carousel') {
//       openCarouselModal();
//     } else {
//       openModal();
//     }
//   } else {
//     alert('Senha incorreta ou tipo de cadastro não selecionado!');
//   }
// }
// function openCarouselModal() {
//   document.body.classList.add('modal-open');
//   document.getElementById('carouselModal').style.display = 'block';
//   displayRegisteredCarouselItems();
// }
// function displayRegisteredCarouselItems() {
//   const container = document.getElementById('registeredCarouselItems');
//   let html = '';
//   carouselItems.forEach((item, index) => {
//     html += `
//       <div class="registered-item">
//         <img src="${item.image}" alt="${item.title}">
//         <div class="item-details">
//           <h4>${item.title}</h4>
//           <p>${item.subtitle}</p>
//         </div>
//         <button class="remove-btn" onclick="removeCarouselItem(${index})">Remover</button>
//       </div>
//     `;
//   });
//   container.innerHTML = html;
// }
// function removeCarouselItem(index) {
//   carouselItems.splice(index, 1);
//   localStorage.setItem('carouselItems', JSON.stringify(carouselItems));
//   updateCarouselSlides();
//   displayRegisteredCarouselItems();
// }
// function updateCarouselSlides() {
//   const swiperWrapper = document.querySelector('.swiper-wrapper');
//   let slidesHTML = '';
//   carouselItems.forEach(item => {
//     slidesHTML += `
//       <div class="swiper-slide">
//         <img src="${item.image}" alt="${item.title}" style="width:200px;height:200px;object-fit:contain;margin-bottom:15px;">
//         <h2>${item.title}</h2>
//         <p>${item.subtitle}</p>
//       </div>
//     `;
//   });
//   swiperWrapper.innerHTML = slidesHTML;
//   swiper.update();
// }
// document.getElementById('carouselForm').addEventListener('submit', function (e) {
//   e.preventDefault();
//   const newItem = {
//     title: document.getElementById('carouselTitle').value,
//     image: document.getElementById('carouselImage').value,
//     subtitle: document.getElementById('carouselSubtitle').value
//   };
//   carouselItems.push(newItem);
//   localStorage.setItem('carouselItems', JSON.stringify(carouselItems));
//   updateCarouselSlides();
//   displayRegisteredCarouselItems();
//   this.reset();
// });
// function openModal() {
//   document.body.classList.add('modal-open');
//   document.getElementById('peripheralModal').style.display = 'block';
//   displayRegisteredPeripherals();
// }
// function closeModal() {
//   document.body.classList.remove('modal-open');
//   document.getElementById('peripheralModal').style.display = 'none';
//   document.getElementById('peripheralForm').reset();
// }
// function sendToWhatsApp(product) {
//   const message = encodeURIComponent(`Olá! Gostaria de comprar:\n\n` + `Produto: ${product.name}\n` + `Preço: R$ ${product.price.toFixed(2)}\n` + `Descrição: ${product.description}`);
//   window.open(`https://wa.me/5531988035657?text=${message}`, '_blank');
// }
// function removePeripheral(index) {
//   let peripherals = JSON.parse(localStorage.getItem('peripherals')) || [];
//   peripherals.splice(index, 1);
//   localStorage.setItem('peripherals', JSON.stringify(peripherals));
//   displayPeripherals();
//   displayRegisteredPeripherals();
// }
// function displayRegisteredPeripherals() {
//   const container = document.getElementById('registeredPeripheralsList');
//   const peripherals = JSON.parse(localStorage.getItem('peripherals')) || [];
//   let html = '';
//   peripherals.forEach((peripheral, index) => {
//     html += `
//         <div class="registered-item">
//           <img src="${peripheral.image}" alt="${peripheral.name}">
//           <div class="item-details">
//             <h4>${peripheral.name}</h4>
//             <p>Estoque: ${peripheral.stock}</p>
//             <p>Preço: R$ ${Number(peripheral.price).toFixed(2)}</p>
//           </div>
//           <button class="remove-btn" onclick="removePeripheral(${index})">Remover</button>
//         </div>
//       `;
//   });
//   container.innerHTML = html;
// }
// const peripheralForm = document.getElementById('peripheralForm');
// let peripherals = JSON.parse(localStorage.getItem('peripherals')) || [];
// peripheralForm.addEventListener('submit', function (e) {
//   e.preventDefault();
//   const newPeripheral = {
//     name: document.getElementById('name').value,
//     stock: document.getElementById('stock').value,
//     image: document.getElementById('image').value,
//     description: document.getElementById('description').value,
//     price: document.getElementById('price').value
//   };
//   peripherals.push(newPeripheral);
//   localStorage.setItem('peripherals', JSON.stringify(peripherals));
//   displayPeripherals();
//   displayRegisteredPeripherals();
//   peripheralForm.reset();
// });
// function displayPeripherals() {
//   const container = document.getElementById('products-container');
//   const peripherals = JSON.parse(localStorage.getItem('peripherals')) || [];
//   let peripheralsHTML = '';
//   peripherals.forEach((peripheral, index) => {
//     peripheralsHTML += `
//         <div class="product">
//           <img alt="${peripheral.name}" src="${peripheral.image}" width="200" height="200">
//           <h3>${peripheral.name}</h3>
//           <p>Estoque: ${peripheral.stock}</p>
//           <p>${peripheral.description}</p>
//           <p>R$ ${Number(peripheral.price).toFixed(2)}</p>
//           <button class="buy-btn" onclick="sendToWhatsApp(${JSON.stringify(peripheral).replace(/"/g, '\'')})">
//             Comprar
//           </button>
//         </div>
//       `;
//   });
//   container.innerHTML = peripheralsHTML;
// }
// document.addEventListener('DOMContentLoaded', function () {
//   document.title = 'AP Celulares';
//   if (!localStorage.getItem('peripherals')) {
//     localStorage.setItem('peripherals', JSON.stringify(initialPhones));
//   }
//   if (!localStorage.getItem('carouselItems')) {
//     localStorage.setItem('carouselItems', JSON.stringify(initialCarouselItems));
//     carouselItems = initialCarouselItems;
//   }
//   updateCarouselSlides();
//   displayPeripherals();
// });
// function searchProducts() {
//   const searchTerm = document.getElementById('search').value.toLowerCase();
//   const peripherals = JSON.parse(localStorage.getItem('peripherals')) || [];
//   const filteredPeripherals = peripherals.filter(p => p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm));
//   displayFilteredPeripherals(filteredPeripherals);
// }
// function displayFilteredPeripherals(peripherals) {
//   const container = document.getElementById('products-container');
//   let peripheralsHTML = '';
//   peripherals.forEach((peripheral, index) => {
//     peripheralsHTML += `
//       <div class="product">
//         <img alt="${peripheral.name}" src="${peripheral.image}" width="200" height="200">
//         <h3>${peripheral.name}</h3>
//         <p>Estoque: ${peripheral.stock}</p>
//         <p>${peripheral.description}</p>
//         <p>R$ ${Number(peripheral.price).toFixed(2)}</p>
//         <button class="buy-btn" onclick="sendToWhatsApp(${JSON.stringify(peripheral).replace(/"/g, '\'')})">
//           Comprar
//         </button>
//       </div>
//     `;
//   });
//   container.innerHTML = peripheralsHTML;
// }
// function toggleCart() {
//   const cartCount = document.querySelector('.cart-count');
//   const currentCount = parseInt(cartCount.textContent);
//   cartCount.textContent = currentCount === 0 ? "1" : "0";
//   alert('Funcionalidade do carrinho em desenvolvimento');
// }
// const style = document.createElement('style');
// style.textContent = `
//   .swiper-wrapper {
//     transition-timing-function: linear !important;
//   }
// `;
// document.head.appendChild(style);