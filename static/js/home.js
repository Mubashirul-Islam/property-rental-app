const searchInput = document.getElementById("search-input");
const suggestions = document.getElementById("suggestions");
const searchForm = document.getElementById("search-form");

let locations = [];

const normalize = (value) => value.trim().toLowerCase();

const clearSelection = () => {
  searchInput.dataset.city = "";
  searchInput.dataset.country = "";
};

const setSelection = (location) => {
  searchInput.value = `${location.city}, ${location.country}`;
  searchInput.dataset.city = location.city;
  searchInput.dataset.country = location.country;
};

const renderSuggestions = (matches) => {
  suggestions.innerHTML = "";
  if (!matches.length) {
    suggestions.classList.add("hidden");
    return;
  }

  matches.forEach((location, index) => {
    const item = document.createElement("li");
    item.textContent = `${location.city}, ${location.country}`;
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", index === 0 ? "true" : "false");
    item.addEventListener("click", () => {
      setSelection(location);
      suggestions.classList.add("hidden");
    });
    suggestions.appendChild(item);
  });
  suggestions.classList.remove("hidden");
};

const matchLocations = (query) => {
  const normalized = normalize(query);
  if (!normalized) {
    return [];
  }
  return locations
    .filter((location) => {
      const city = location.city.toLowerCase();
      const country = location.country.toLowerCase();
      return city.includes(normalized) || country.includes(normalized);
    })
    .slice(0, 6);
};

const findBestMatch = (query) => {
  const normalized = normalize(query);
  if (!normalized) {
    return null;
  }

  const cityMatch = locations.find(
    (location) => normalize(location.city) === normalized
  );
  if (cityMatch) {
    return { type: "city", value: cityMatch.city };
  }

  const countryMatch = locations.find(
    (location) => normalize(location.country) === normalized
  );
  if (countryMatch) {
    return { type: "country", value: countryMatch.country };
  }

  return { type: "city", value: query.trim() };
};

fetch("/api/locations/")
  .then((response) => response.json())
  .then((data) => {
    locations = data.locations || [];
  })
  .catch(() => {
    locations = [];
  });

searchInput.addEventListener("input", (event) => {
  clearSelection();
  const matches = matchLocations(event.target.value);
  renderSuggestions(matches);
});

searchInput.addEventListener("focus", (event) => {
  const matches = matchLocations(event.target.value);
  renderSuggestions(matches);
});

document.addEventListener("click", (event) => {
  if (!suggestions.contains(event.target) && event.target !== searchInput) {
    suggestions.classList.add("hidden");
  }
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value;
  if (!query.trim()) {
    return;
  }

  let type = "city";
  let value = query.trim();

  if (searchInput.dataset.city) {
    type = "city";
    value = searchInput.dataset.city;
  } else if (searchInput.dataset.country) {
    type = "country";
    value = searchInput.dataset.country;
  } else {
    const match = findBestMatch(query);
    if (match) {
      type = match.type;
      value = match.value;
    }
  }

  const params = new URLSearchParams({ [type]: value });
  window.location.href = `/properties/?${params.toString()}`;
});
