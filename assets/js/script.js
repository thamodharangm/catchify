const RELEASES_API =
  "https://api.github.com/repos/thamodharangm/catchify/releases/latest";

const changelogElement = document.getElementById("changelog_element");

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

window.onload = function () {
  assignNavClass();
  window.addEventListener("resize", assignNavClass);
  fetchLatestRelease();
};

function fetchLatestRelease() {
  makeHttpRequest(RELEASES_API, (res) => {
    try {
      const release = JSON.parse(res);

      const asset = (release.assets || []).find(
        (a) =>
          a.name.startsWith("catchify-v") &&
          a.name.endsWith(".apk") &&
          !a.name.includes("arm64") &&
          !a.name.includes("fdroid") &&
          !a.name.includes("debug"),
      );

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

function parseChangelog(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");

  lines.forEach((line) => {
    const itemMatch = line.match(/^\*\s+(.+)$/);
    if (itemMatch) {
      const processedText = itemMatch[1].replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
      const listItem = document.createElement("p");
      listItem.innerHTML = `• ${processedText}`;
      changelogElement.appendChild(listItem);
    }
  });
}

function assignNavClass() {
  const nav = document.getElementById("navigation-bar");
  if (window.innerWidth > 760) {
    nav.classList.remove("bottom");
    nav.classList.add("left");
  } else {
    nav.classList.remove("left");
    nav.classList.add("bottom");
  }
}
