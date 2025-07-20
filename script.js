// Main product image
const mainImage = document.getElementById('main-image');
// Thumbnails for desktop
const thumbnails = [
  document.getElementById('thumbnail-1'),
  document.getElementById('thumbnail-2'),
  document.getElementById('thumbnail-3'),
  document.getElementById('thumbnail-4')
];
// All product images
const imageSources = [
  'images/image-product-1.jpg',
  'images/image-product-2.jpg',
  'images/image-product-3.jpg',
  'images/image-product-4.jpg'
];
let currentImageIndex = 0;

// When you click a thumbnail, change the main image
for (let i = 0; i < thumbnails.length; i++) {
  thumbnails[i].addEventListener('click', function(e) {
    mainImage.src = imageSources[i];
    currentImageIndex = i;
    // Add border to selected thumbnail
    for (let k = 0; k < thumbnails.length; k++) {
      thumbnails[k].classList.remove('border-2');
      thumbnails[k].classList.remove('border-orange-500');
    }
    thumbnails[i].classList.add('border-2');
    thumbnails[i].classList.add('border-orange-500');
  });
}

// Lightbox functionality (big image popup)
let lightbox = null;
function openLightbox(index) {
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    // Lightbox content
    const box = document.createElement('div');
    box.className = 'relative bg-white rounded-xl p-4 flex flex-col items-center';
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'absolute top-2 right-2 text-gray-700 hover:text-orange-500 text-2xl font-bold';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = function() {
      lightbox.style.display = 'none';
    };
    box.appendChild(closeBtn);
    // Main image
    const bigImg = document.createElement('img');
    bigImg.className = 'rounded-xl w-[400px] h-[400px] object-cover mb-4';
    bigImg.src = imageSources[index];
    box.appendChild(bigImg);
    // Prev/Next buttons
    const navDiv = document.createElement('div');
    navDiv.className = 'flex gap-4 mb-2';
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '&#8592;';
    prevBtn.className = 'text-2xl';
    prevBtn.onclick = function() {
      let newIndex = index - 1;
      if (newIndex < 0) newIndex = imageSources.length - 1;
      document.body.removeChild(lightbox);
      lightbox = null;
      openLightbox(newIndex);
    };
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '&#8594;';
    nextBtn.className = 'text-2xl';
    nextBtn.onclick = function() {
      let newIndex = index + 1;
      if (newIndex >= imageSources.length) newIndex = 0;
      document.body.removeChild(lightbox);
      lightbox = null;
      openLightbox(newIndex);
    };
    navDiv.appendChild(prevBtn);
    navDiv.appendChild(nextBtn);
    box.appendChild(navDiv);
    // Thumbnails in lightbox
    const thumbsDiv = document.createElement('div');
    thumbsDiv.className = 'flex gap-2 mt-2';
    for (let i = 0; i < imageSources.length; i++) {
      const thumb = document.createElement('img');
      thumb.src = 'images/image-product-' + (i+1) + '-thumbnail.jpg';
      thumb.className = 'w-16 h-16 rounded-lg cursor-pointer';
      if (i === index) {
        thumb.className += ' border-2 border-orange-500';
      }
      thumb.onclick = function() {
        document.body.removeChild(lightbox);
        lightbox = null;
        openLightbox(i);
      };
      thumbsDiv.appendChild(thumb);
    }
    box.appendChild(thumbsDiv);
    lightbox.appendChild(box);
    document.body.appendChild(lightbox);
  } else {
    lightbox.style.display = 'flex';
  }
}

mainImage.addEventListener('click', function() {
  openLightbox(currentImageIndex);
});

// Quantity selector
const quantityDisplay = document.getElementById('quantity-display');
const minusBtn = document.getElementById('minus-btn');
const plusBtn = document.getElementById('plus-btn');
let quantity = 0;

minusBtn.addEventListener('click', function() {
  if (quantity > 0) {
    quantity = quantity - 1;
    quantityDisplay.textContent = quantity;
  }
});

plusBtn.addEventListener('click', function() {
  quantity = quantity + 1;
  quantityDisplay.textContent = quantity;
});

// Add to cart
const addToCartBtn = document.getElementById('add-to-cart-btn');
let cart = { count: 0 };
const cartCountBadge = document.getElementById('cart-count-badge');

function updateCartCountBadge() {
  if (cart.count > 0) {
    cartCountBadge.textContent = cart.count;
    cartCountBadge.classList.remove('hidden');
  } else {
    cartCountBadge.classList.add('hidden');
  }
}

addToCartBtn.addEventListener('click', function() {
  if (quantity > 0) {
    cart.count = cart.count + quantity;
    quantity = 0;
    quantityDisplay.textContent = quantity;
    updateCartDisplay();
    updateCartCountBadge();
  }
});

// Cart dropdown
const cartIcon = document.getElementById('cart-icon');
let cartDropdown = null;

cartIcon.addEventListener('click', function() {
  if (!cartDropdown) {
    cartDropdown = document.createElement('div');
    cartDropdown.className = 'absolute right-10 top-20 bg-white shadow-lg rounded-lg p-6 w-80 z-50';
    document.body.appendChild(cartDropdown);
  }
  if (cartDropdown.style.display === 'block') {
    cartDropdown.style.display = 'none';
  } else {
    updateCartDisplay();
    cartDropdown.style.display = 'block';
  }
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
    item.innerHTML = '<img src="images/image-product-1-thumbnail.jpg" class="w-12 h-12 rounded mr-4" />' +
      '<div class="flex-1">' +
      '<p class="text-gray-700">Fall Limited Edition Sneakers</p>' +
      '<p class="text-gray-500">$125.00 x ' + cart.count + ' <span class="font-bold text-gray-800">$' + (125 * cart.count).toFixed(2) + '</span></p>' +
      '</div>' +
      '<button id="remove-item" class="ml-4"><img src="images/icon-delete.svg" class="w-5 h-5" /></button>';
    cartDropdown.appendChild(item);
    const checkoutBtn = document.createElement('button');
    checkoutBtn.textContent = 'Checkout';
    checkoutBtn.className = 'w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg';
    cartDropdown.appendChild(checkoutBtn);
    // Remove item
    const removeBtn = item.querySelector('#remove-item');
    removeBtn.addEventListener('click', function() {
      cart.count = 0;
      updateCartDisplay();
      updateCartCountBadge();
    });
  }
  updateCartCountBadge();
}

// Initialize badge on page load
updateCartCountBadge();

// Mobile nav toggle
const burgerBtn = document.getElementById('burger-btn');
const mobileNav = document.getElementById('mobile-nav');
const closeMobileNavBtn = document.getElementById('close-mobile-nav');

if (burgerBtn && mobileNav && closeMobileNavBtn) {
  burgerBtn.addEventListener('click', function() {
    mobileNav.classList.remove('hidden');
  });
  closeMobileNavBtn.addEventListener('click', function() {
    mobileNav.classList.add('hidden');
  });
} 