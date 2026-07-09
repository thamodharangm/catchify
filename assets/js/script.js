const RELEASES_API =
  "https://api.github.com/repos/thamodharangm/catchify/releases/latest";
const FEATURES_URL = "assets/features.txt";

const changelogElement = document.getElementById("changelog_element");
const featuresElement = document.getElementById("features_element");

function makeHttpRequest(url, callback) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      callback(xmlHttp.responseText);
    }
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
}

document.addEventListener("DOMContentLoaded", function () {
  new Splide("#screenshot-carousel", {
    type: "loop",
    perPage: 3,
    gap: "2rem",
    pagination: true,
    arrows: false,
    breakpoints: {
      1200: { perPage: 3, gap: "2rem" },
      699: { perPage: 2, gap: "1.5rem" },
      560: { perPage: 1, gap: "1rem" },
    },
  }).mount();
});

window.onload = function () {
  assignNavClass();
  window.addEventListener("resize", assignNavClass);
  setupNavToggle();
  fetchLatestRelease();
  fetchAppFeatures(FEATURES_URL);
};

function fetchLatestRelease() {
  makeHttpRequest(RELEASES_API, (res) => {
    try {
      const release = JSON.parse(res);

      let asset = (release.assets || []).find(
        (a) =>
          a.name.endsWith(".apk") &&
          !a.name.includes("arm64") &&
          !a.name.includes("fdroid") &&
          !a.name.includes("debug"),
      );

      if (!asset) {
        asset = (release.assets || []).find((a) => a.name.endsWith(".apk"));
      }

      if (asset) {
        document.querySelectorAll("[data-download-link]").forEach((el) => {
          el.setAttribute("href", asset.browser_download_url);
        });
      }

      const versionEl = document.getElementById("download-version");
      if (versionEl && release.tag_name) {
        versionEl.textContent = "v" + release.tag_name.replace(/^v/, "");
      }

      if (release.body) {
        parseChangelog(release.body);
      }
    } catch (error) {
      console.error("Error fetching latest Catchify release:", error);
    }
  });
}

function fetchAppFeatures(featuresUrl) {
  const featureIcons = [
    "ad_off",
    "cloud_download",
    "playlist_add",
    "equalizer",
    "lyrics",
    "language",
    "insights",
    "block",
  ];

  makeHttpRequest(featuresUrl, (res) => {
    try {
      const lines = res.split(/\r?\n/).filter((line) => line.trim() !== "");

      const features = lines
        .slice(1)
        .map((line) =>
          line
            .trim()
            .replace(/^\*\s*/, "")
            .trim(),
        )
        .filter((line) => line.length > 0);

      features.forEach((feature, index) => {
        const card = document.createElement("article");
        card.className = "feature-card";

        const icon = document.createElement("i");
        icon.textContent = featureIcons[index % featureIcons.length];

        const text = document.createElement("span");
        text.textContent = feature;

        card.appendChild(icon);
        card.appendChild(text);
        featuresElement.appendChild(card);
      });
    } catch (error) {
      console.error("Error processing app features:", error);
    }
  });
}

function parseChangelog(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
  let hasBullet = false;

  lines.forEach((line) => {
    const itemMatch = line.match(/^\*\s+(.+)$/);
    if (itemMatch) {
      hasBullet = true;
      const processedText = itemMatch[1].replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
      const listItem = document.createElement("p");
      listItem.innerHTML = `• ${processedText}`;
      changelogElement.appendChild(listItem);
    }
  });

  if (!hasBullet) {
    const paragraph = document.createElement("p");
    paragraph.innerHTML = text.trim().replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
    changelogElement.appendChild(paragraph);
  }
}

function assignNavClass() {
  const nav = document.getElementById("navigation-bar");
  if (window.innerWidth > 760) {
    nav.classList.remove("top", "nav-open");
    nav.classList.add("left");
    const toggle = document.getElementById("nav-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  } else {
    nav.classList.remove("left");
    nav.classList.add("top");
  }
}

function setupNavToggle() {
  const nav = document.getElementById("navigation-bar");
  const toggle = document.getElementById("nav-toggle");
  if (!nav || !toggle) return;

  toggle.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", function () {
      nav.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}
