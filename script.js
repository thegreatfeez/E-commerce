
const mainImage = document.querySelector('img[alt="Sneakers"]');
const thumbnails = document.querySelectorAll('.lg\\:flex img');
let currentImageIndex = 0;
const imageSources = [
  'images/image-product-1.jpg',
  'images/image-product-2.jpg',
  'images/image-product-3.jpg',
  'images/image-product-4.jpg',
];

let lightbox;
function openLightbox(index) {
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    lightbox.innerHTML = `
      <div class="relative bg-white rounded-xl p-4 flex flex-col items-center">
        <button class="absolute top-2 right-2 text-gray-700 hover:text-orange-500 text-2xl font-bold btn-lightbox-close">&times;</button>
        <img src="${imageSources[index]}" class="rounded-xl w-[400px] h-[400px] object-cover mb-4 lightbox-main-img" />
        <div class="flex gap-4 mb-2">
          <button class="btn-lightbox-prev text-2xl">&#8592;</button>
          <button class="btn-lightbox-next text-2xl">&#8594;</button>
        </div>
        <div class="flex gap-2 mt-2">
          ${imageSources.map((src, i) => `<img src="images/image-product-${i+1}-thumbnail.jpg" class="w-16 h-16 rounded-lg cursor-pointer lightbox-thumb ${i === index ? 'border-2 border-orange-500' : ''}" data-index="${i}" />`).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);
  } else {
    lightbox.querySelector('.lightbox-main-img').src = imageSources[index];
    lightbox.querySelectorAll('.lightbox-thumb').forEach((thumb, i) => {
      thumb.classList.toggle('border-2', i === index);
      thumb.classList.toggle('border-orange-500', i === index);
    });
    lightbox.style.display = 'flex';
  }
  currentImageIndex = index;
  // Close button
  lightbox.querySelector('.btn-lightbox-close').onclick = () => {
    lightbox.style.display = 'none';
  };
  // Prev/Next
  lightbox.querySelector('.btn-lightbox-prev').onclick = () => {
    let newIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
    openLightbox(newIndex);
  };
  lightbox.querySelector('.btn-lightbox-next').onclick = () => {
    let newIndex = (currentImageIndex + 1) % imageSources.length;
    openLightbox(newIndex);
  };
  // Thumbnails
  lightbox.querySelectorAll('.lightbox-thumb').forEach(thumb => {
    thumb.onclick = (e) => {
      openLightbox(Number(thumb.dataset.index));
    };
  });
}

mainImage.addEventListener('click', () => openLightbox(currentImageIndex));


const desktopThumbnails = document.querySelectorAll('.lg\\:flex img');
desktopThumbnails.forEach((thumb, i) => {
  thumb.addEventListener('click', () => {
    mainImage.src = imageSources[i];
    currentImageIndex = i;
    desktopThumbnails.forEach((t, j) => {
      t.classList.toggle('border-2', j === i);
      t.classList.toggle('border-orange-500', j === i);
    });
  });
});

// Quantity Selector
const quantityDisplay = document.querySelector('.quantity-display');
const minusBtn = document.querySelector('.btn-minus');
const plusBtn = document.querySelector('.btn-plus');
let quantity = 0;

minusBtn.addEventListener('click', () => {
  if (quantity > 0) {
    quantity--;
    quantityDisplay.textContent = quantity;
  }
});

plusBtn.addEventListener('click', () => {
  quantity++;
  quantityDisplay.textContent = quantity;
});

//  Add to Cart
const addToCartBtn = document.querySelector('.btn-add-to-cart');
let cart = { count: 0 };

// Cart count badge
const cartCountBadge = document.getElementById('cart-count-badge');

function updateCartCountBadge() {
  if (cart.count > 0) {
    cartCountBadge.textContent = cart.count;
    cartCountBadge.classList.remove('hidden');
  } else {
    cartCountBadge.classList.add('hidden');
  }
}

addToCartBtn.addEventListener('click', () => {
  if (quantity > 0) {
    cart.count += quantity;
    quantity = 0;
    quantityDisplay.textContent = quantity;
    updateCartDisplay();
    updateCartCountBadge();
  }
});

// Cart View and Removal
const cartIcon = document.querySelector('img[alt="cart"]');
let cartDropdown;

cartIcon.addEventListener('click', () => {
  if (!cartDropdown) {
    cartDropdown = document.createElement('div');
    cartDropdown.className = 'absolute right-10 top-20 bg-white shadow-lg rounded-lg p-6 w-80 z-50';
    document.body.appendChild(cartDropdown);
  }
  updateCartDisplay();
  cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
});

function updateCartDisplay() {
  if (!cartDropdown) return;
  cartDropdown.innerHTML = '';
  const title = document.createElement('h3');
  title.textContent = 'Cart';
  title.className = 'font-bold mb-4';
  cartDropdown.appendChild(title);
  if (cart.count === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Your cart is empty.';
    empty.className = 'text-gray-500';
    cartDropdown.appendChild(empty);
  } else {
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between mb-4';
    item.innerHTML = `
      <img src="images/image-product-1-thumbnail.jpg" class="w-12 h-12 rounded mr-4" />
      <div class="flex-1">
        <p class="text-gray-700">Fall Limited Edition Sneakers</p>
        <p class="text-gray-500">$125.00 x ${cart.count} <span class="font-bold text-gray-800">$${(125 * cart.count).toFixed(2)}</span></p>
      </div>
      <button id="remove-item" class="ml-4"><img src="images/icon-delete.svg" class="w-5 h-5" /></button>
    `;
    cartDropdown.appendChild(item);
    const checkoutBtn = document.createElement('button');
    checkoutBtn.textContent = 'Checkout';
    checkoutBtn.className = 'w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg';
    cartDropdown.appendChild(checkoutBtn);
    // Remove item
    item.querySelector('#remove-item').addEventListener('click', () => {
      cart.count = 0;
      updateCartDisplay();
      updateCartCountBadge();
    });
  }
  updateCartCountBadge();
}



// Initialize badge on page load
updateCartCountBadge();

// Mobile Nav Toggle
const burgerBtn = document.querySelector('button.lg\\:hidden');
const mobileNav = document.getElementById('mobile-nav');
const closeMobileNavBtn = document.getElementById('close-mobile-nav');

if (burgerBtn && mobileNav && closeMobileNavBtn) {
  burgerBtn.addEventListener('click', () => {
    mobileNav.classList.remove('hidden');
  });
  closeMobileNavBtn.addEventListener('click', () => {
    mobileNav.classList.add('hidden');
  });
} 