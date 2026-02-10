const main = document.querySelector("main[data-property-id]");
const propertyId = main?.dataset.propertyId;

const titleEl = document.getElementById("detail-title");
const locationEl = document.getElementById("detail-location");
const priceEl = document.getElementById("detail-price");
const descriptionEl = document.getElementById("detail-description");
const statsEl = document.getElementById("detail-stats");
const imageEl = document.getElementById("detail-image");
const placeholderEl = document.getElementById("detail-placeholder");

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

      if (property.primary_image) {
        imageEl.src = property.primary_image;
        imageEl.alt = property.title;
        imageEl.classList.remove("hidden");
        placeholderEl.classList.add("hidden");
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
