function getStatusClass(status) {
    switch ((status || "").trim().toLowerCase()) {
        case "visited":
            return "status-visited";
        case "grounds only":
            return "status-grounds-only";
        case "not visited":
        default:
            return "status-not-visited";
    }
}

function getTempleIcon(status) {
    const cssClass = getStatusClass(status);

    return `
    <svg class="status-icon ${cssClass}" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
      <path d="M32 6l6 10h8l-4 8h8l-6 8v22h4v4H16v-4h4V32l-6-8h8l-4-8h8l6-10zm-6 48h12V34H26v20zm-2-24h16l4-6H20l4 6z"/>
    </svg>
  `;
}

function createTempleCard(temple) {
    const card = document.createElement("article");
    card.className = "temple-card";

    const hasImage = temple.imageUrl && temple.imageUrl.trim() !== "";
    const hasSource = temple.sourceUrl && temple.sourceUrl.trim() !== "";

    const imageSection = hasImage
        ? `
      <div class="temple-image-wrap">
        ${hasSource
            ? `<a class="temple-image-link" href="${temple.sourceUrl}" target="_blank" rel="noopener noreferrer">
                 <img class="temple-image" src="${temple.imageUrl}" alt="${temple.name}">
               </a>`
            : `<img class="temple-image" src="${temple.imageUrl}" alt="${temple.name}">`
        }
      </div>
    `
        : `
      <div class="temple-image-wrap">
        <div class="temple-image-placeholder">No image available</div>
      </div>
    `;

    card.innerHTML = `
    ${imageSection}
    <div class="temple-info">
      <div class="temple-title-row">
        ${getTempleIcon(temple.visitStatus)}
        <h2 class="temple-title">${temple.name || "Unnamed Temple"}</h2>
      </div>

      <p class="temple-meta"><strong>State:</strong> ${temple.state || ""}</p>
      <p class="temple-meta"><strong>City:</strong> ${temple.city || ""}</p>
      <p class="temple-meta"><strong>Address:</strong> ${temple.address || ""}</p>
      <p class="temple-status-text">Status: ${temple.visitStatus || "Not Visited"}</p>
    </div>
  `;

    return card;
}

async function loadTemples() {
    const stateTitle = document.getElementById("stateTitle");
    const templeList = document.getElementById("templeList");

    try {
        const response = await fetch("temples.json");

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const temples = await response.json();

        const pageStateName = temples.length > 0 ? temples[0].state : "State";
        document.title = `${pageStateName} Temples`;
        stateTitle.textContent = `${pageStateName} Temples`;

        templeList.innerHTML = "";

        if (!Array.isArray(temples) || temples.length === 0) {
            templeList.innerHTML = `<div class="empty-message">No temples found for this state yet.</div>`;
            return;
        }

        temples.forEach((temple) => {
            templeList.appendChild(createTempleCard(temple));
        });
    } catch (error) {
        templeList.innerHTML = `
      <div class="error-message">
        Could not load temples.json for this state.
      </div>
    `;
        console.error("Error loading temples:", error);
    }
}

loadTemples();