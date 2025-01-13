let phones = JSON.parse(localStorage.getItem('phones')) || [];
let carouselItems = JSON.parse(localStorage.getItem('carouselItems')) || [];
let peripherals = JSON.parse(localStorage.getItem('peripherals')) || [];
let cartItems = [];

// Função para atualizar o armazenamento local
function savePhonesToLocalStorage() {
  localStorage.setItem('phones', JSON.stringify(phones));
}

// Função para atualizar o armazenamento local do carrossel
function saveCarouselItemsToLocalStorage() {
  localStorage.setItem('carouselItems', JSON.stringify(carouselItems));
}

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
function displayPeripherals() {
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

function closeCheckoutModal() {
  document.body.classList.remove('modal-open');
  document.getElementById('checkoutModal').style.display = 'none';
}

function showCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  const productDetails = document.getElementById('selectedProduct');
  let productsHTML = `<h3>Produtos Selecionados:</h3>`;
  let totalPrice = 0;

  cartItems.forEach(product => {
    productsHTML += `
      <div class="product-details">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h4>${product.name}</h4>
          <p>Preço: R$ ${Number(product.price).toFixed(2)}</p>
        </div>
      </div>
    `;
    totalPrice += Number(product.price);
  });

  productsHTML += `<h4>Total: R$ ${totalPrice.toFixed(2)}</h4>`;
  productDetails.innerHTML = productsHTML;

  document.body.classList.add('modal-open');
  modal.style.display = 'block';
}
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
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

  if (cartItems.length === 0) {
    alert('Carrinho está vazio!');
    return;
  }

  let productsMessage = cartItems.map(product => `Produto: ${product.name}\n` +
    `Preço: ${formatCurrency(Number(product.price))}\n` +
    `Descrição: ${product.description}`).join('\n\n');
  
  const totalPrice = cartItems.reduce((sum, product) => sum + Number(product.price), 0);

  const message = encodeURIComponent(`Nova compra:\n\n` +
    `Cliente: ${fullName}\n` +
    `Telefone: ${formattedPhone}\n\n` +
    `${productsMessage}\n\n` +
    `Total: ${formatCurrency(totalPrice)}`);

  window.open(`https://wa.me/5531288805?text=${message}`, '_blank');

  cartItems = []; 
  updateCartCount();  
  closeCheckoutModal(); 
  this.reset();  
});


function updateCartCount() {
  console.log("Carrinho atualizado:", cartItems.length);
  const cartCountElement = document.getElementById('cart-count');
  cartCountElement.textContent = cartItems.length;
}


function sendToWhatsApp(product) {
  cartItems.push(product); 
  updateCartCount(); 
  console.log(cartItems)
}

function toggleCart() {
  const cartCount = cartItems.length;
  if (cartCount > 0) {
    showCheckoutModal(); 
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
  peripherals.splice(index, 1);
  localStorage.setItem('peripherals', JSON.stringify(peripherals));
  displayPeripherals();
  displayRegisteredPeripherals();
}

function displayRegisteredPeripherals() {
  const container = document.getElementById('registeredPeripheralsList');
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

function searchProducts() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
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