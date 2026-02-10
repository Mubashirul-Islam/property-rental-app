const main = document.querySelector("main[data-property-id]");
const propertyId = main?.dataset.propertyId;

const titleEl = document.getElementById("detail-title");
const locationEl = document.getElementById("detail-location");
const priceEl = document.getElementById("detail-price");
const descriptionEl = document.getElementById("detail-description");
const statsEl = document.getElementById("detail-stats");
const imageEl = document.getElementById("detail-image");
const placeholderEl = document.getElementById("detail-placeholder");
const carouselDots = document.getElementById("carousel-dots");
const carouselPrev = document.getElementById("carousel-prev");
const carouselNext = document.getElementById("carousel-next");

const formatPrice = (price) => {
  const value = Number(price);
  if (Number.isNaN(value)) {
    return `$${price}`;
  }
  return `$${value.toFixed(2)}`;
};

const renderStat = (label, value) => {
  const stat = document.createElement("div");
  stat.className = "stat";
  stat.innerHTML = `<strong>${value}</strong><br /><span class="muted">${label}</span>`;
  return stat;
};

const setActiveImage = (url, altText) => {
  imageEl.src = url;
  imageEl.alt = altText;
  imageEl.classList.remove("hidden");
  placeholderEl.classList.add("hidden");
};
let carouselImages = [];
let carouselIndex = 0;

const updateCarousel = () => {
  if (!carouselImages.length) {
    return;
  }

  const image = carouselImages[carouselIndex];
  setActiveImage(image.url, image.alt || "");

  const dots = carouselDots.querySelectorAll("button");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === carouselIndex);
  });
};

const renderCarousel = (images, title) => {
  carouselDots.innerHTML = "";
  carouselImages = images.map((image) => ({
    url: image.url,
    alt: image.alt || title,
  }));

  if (carouselImages.length <= 1) {
    carouselDots.classList.add("hidden");
    carouselPrev.classList.add("hidden");
    carouselNext.classList.add("hidden");
    return;
  }

  carouselImages.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to image ${index + 1}`);
    dot.addEventListener("click", () => {
      carouselIndex = index;
      updateCarousel();
    });
    carouselDots.appendChild(dot);
  });

  carouselDots.classList.remove("hidden");
  carouselPrev.classList.remove("hidden");
  carouselNext.classList.remove("hidden");
  updateCarousel();
};

if (propertyId) {
  fetch(`/api/properties/${propertyId}/`)
    .then((response) => response.json())
    .then((data) => {
      const property = data.property;
      if (!property) {
        return;
      }

      titleEl.textContent = property.title;
      if (property.location) {
        locationEl.textContent = `${property.location.address}, ${property.location.city}, ${property.location.country}`;
      } else {
        locationEl.textContent = "Location unavailable";
      }
      priceEl.textContent = `${formatPrice(property.price_per_night)} / night`;
      descriptionEl.textContent =
        property.description || "No description provided.";

      statsEl.innerHTML = "";
      statsEl.appendChild(renderStat("Bedrooms", property.bedrooms));
      statsEl.appendChild(renderStat("Bathrooms", property.bathrooms));
      statsEl.appendChild(renderStat("Max guests", property.max_guests));

      const images = (property.images || [])
        .map((item) => ({
          url: item.image,
          alt: item.alt_text,
          isPrimary: item.is_primary,
        }))
        .filter((item) => Boolean(item.url));

      if (property.primary_image) {
        images.unshift({
          url: property.primary_image,
          alt: property.title,
          isPrimary: true,
        });
      }

      const uniqueImages = images.filter((item, index, list) => {
        return list.findIndex((other) => other.url === item.url) === index;
      });

      if (uniqueImages.length) {
        const initial =
          uniqueImages.find((item) => item.isPrimary) || uniqueImages[0];
        carouselIndex = uniqueImages.findIndex((item) => item === initial);
        if (carouselIndex < 0) {
          carouselIndex = 0;
        }
        setActiveImage(initial.url, initial.alt || property.title);
        renderCarousel(uniqueImages, property.title);
      } else {
        placeholderEl.textContent = "No image available";
      }
    })
    .catch(() => {
      titleEl.textContent = "Unable to load property";
    });
} else {
  titleEl.textContent = "Property not found";
}

carouselPrev?.addEventListener("click", () => {
  if (!carouselImages.length) {
    return;
  }
  carouselIndex =
    (carouselIndex - 1 + carouselImages.length) % carouselImages.length;
  updateCarousel();
});

carouselNext?.addEventListener("click", () => {
  if (!carouselImages.length) {
    return;
  }
  carouselIndex = (carouselIndex + 1) % carouselImages.length;
  updateCarousel();
});
