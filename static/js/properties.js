const resultsGrid = document.getElementById("results-grid");
const resultsTitle = document.getElementById("results-title");
const resultsMeta = document.getElementById("results-meta");
const emptyState = document.getElementById("results-empty");
const pagination = document.getElementById("pagination");
const pagePrev = document.getElementById("page-prev");
const pageNext = document.getElementById("page-next");
const pageInfo = document.getElementById("page-info");

const params = new URLSearchParams(window.location.search);
const city = params.get("city");
const country = params.get("country");

const displayQuery = city || country;
const queryType = city ? "city" : "country";
const pageSize = 8;
let allProperties = [];
let currentPage = Number(params.get("page")) || 1;

const formatPrice = (price) => {
  const value = Number(price);
  if (Number.isNaN(value)) {
    return `$${price}`;
  }
  return `$${value.toFixed(2)}`;
};

const formatLocation = (location) => {
  if (!location) {
    return "Location unavailable";
  }
  return `${location.city}, ${location.country}`;
};

const renderEmpty = (message) => {
  emptyState.textContent = message;
  emptyState.classList.remove("hidden");
  renderPagination(1);
};

const updatePageParam = (page) => {
  params.set("page", String(page));
  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", nextUrl);
};

const renderPagination = (totalPages) => {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  pagePrev.disabled = currentPage <= 1;
  pageNext.disabled = currentPage >= totalPages;
};

const renderPage = () => {
  const totalPages = Math.ceil(allProperties.length / pageSize) || 1;
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  resultsGrid.innerHTML = "";
  const start = (currentPage - 1) * pageSize;
  const pageItems = allProperties.slice(start, start + pageSize);

  pageItems.forEach((property) => {
    resultsGrid.appendChild(createCard(property));
  });

  renderPagination(totalPages);
  updatePageParam(currentPage);
};

const createCard = (property) => {
  const card = document.createElement("article");
  card.className = "property-card";

  const media = document.createElement("div");
  media.className = "property-media";

  if (property.primary_image) {
    const img = document.createElement("img");
    img.src = property.primary_image;
    img.alt = property.title;
    media.appendChild(img);
  } else {
    media.textContent = "No image";
  }

  const body = document.createElement("div");
  body.className = "property-body";

  const title = document.createElement("div");
  title.className = "property-title";
  title.textContent = property.title;

  const meta = document.createElement("div");
  meta.className = "property-meta";
  meta.textContent = `${property.bedrooms} bed · ${property.bathrooms} bath · ${property.max_guests} guests`;

  const location = document.createElement("div");
  location.className = "muted";
  location.textContent = formatLocation(property.location);

  const price = document.createElement("div");
  price.textContent = `${formatPrice(property.price_per_night)} / night`;

  body.appendChild(title);
  body.appendChild(meta);
  body.appendChild(location);
  body.appendChild(price);

  const link = document.createElement("a");
  link.href = `/properties/${property.id}/`;
  link.appendChild(media);
  link.appendChild(body);

  card.appendChild(link);

  return card;
};

if (!displayQuery) {
  resultsTitle.textContent = "Search required";
  resultsMeta.textContent = "Use the home page to search by city or country.";
  renderEmpty("No search was provided.");
} else {
  resultsTitle.textContent = `Properties in ${displayQuery}`;
  resultsMeta.textContent = `Filtering by ${queryType}.`;

  fetch(`/api/properties/?${queryType}=${encodeURIComponent(displayQuery)}`)
    .then((response) => response.json())
    .then((data) => {
      const properties = data.properties || [];
      if (!properties.length) {
        renderEmpty("No properties found for this search.");
        return;
      }

      allProperties = properties;
      renderPage();
    })
    .catch(() => {
      renderEmpty("Unable to load results. Try again later.");
    });
}

pagePrev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage -= 1;
    renderPage();
  }
});

pageNext.addEventListener("click", () => {
  const totalPages = Math.ceil(allProperties.length / pageSize) || 1;
  if (currentPage < totalPages) {
    currentPage += 1;
    renderPage();
  }
});
