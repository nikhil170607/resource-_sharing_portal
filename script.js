// Initial Starter Resources
const defaultResources = [
  {
    id: 1,
    title: "HTML5 & CSS3 Complete Cheat Sheet",
    course: "CSE326",
    category: "Lecture Notes",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    desc: "PDF & Web guide covering semantic tags, forms, Flexbox, and CSS Grid layouts.",
    rating: 5,
    downloads: 18,
    bookmarked: true,
    approved: true
  },
  {
    id: 2,
    title: "End-Term Previous Year Question Paper (2025)",
    course: "MTH101",
    category: "Question Papers",
    link: "https://example.com/mth101-pyq",
    desc: "Solved question paper for Engineering Calculus with step-by-step marking scheme.",
    rating: 4,
    downloads: 32,
    bookmarked: false,
    approved: true
  },
  {
    id: 3,
    title: "JavaScript DOM Manipulation Lab Manual",
    course: "CSE326",
    category: "Lab Manuals",
    link: "https://javascript.info/document",
    desc: "10 practical exercises on event listeners, form validation, and localStorage.",
    rating: 5,
    downloads: 11,
    bookmarked: false,
    approved: false // Starts as Pending to demonstrate Moderation
  }
];

// Load data from localStorage or use default
let resources = JSON.parse(localStorage.getItem("portalResources")) || defaultResources;
let showBookmarkedOnly = false;

// Save data to localStorage
function saveData() {
  localStorage.setItem("portalResources", JSON.stringify(resources));
}

// 1. Upload / Link New Resource
function addResource(event) {
  event.preventDefault();

  const newRes = {
    id: Date.now(),
    title: document.getElementById("title").value.trim(),
    course: document.getElementById("courseTag").value.trim().toUpperCase(),
    category: document.getElementById("category").value,
    link: document.getElementById("link").value.trim(),
    desc: document.getElementById("desc").value.trim(),
    rating: 5,
    downloads: 0,
    bookmarked: false,
    approved: false // Requires moderator approval
  };

  resources.unshift(newRes);
  saveData();
  document.getElementById("resourceForm").reset();
  alert("Resource submitted! Enable 'Moderator Mode' in the top bar to approve it.");
  renderResources();
}

// 2. Render & Filter Resources
function renderResources() {
  const list = document.getElementById("resourceList");
  const search = document.getElementById("searchInput").value.toLowerCase();
  const catFilter = document.getElementById("categoryFilter").value;
  const isMod = document.getElementById("modSwitch").checked;

  list.innerHTML = "";

  const filtered = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(search) || res.course.toLowerCase().includes(search);
    const matchesCat = catFilter === "All" || res.category === catFilter;
    const matchesBookmark = !showBookmarkedOnly || res.bookmarked;
    const matchesMod = isMod || res.approved; // Hide unapproved unless Moderator Mode is ON
    return matchesSearch && matchesCat && matchesBookmark && matchesMod;
  });

  // Update Stats Bar
  document.getElementById("statsBar").innerText = 
    `Showing ${filtered.length} resource(s) | Total Downloads: ${resources.reduce((sum, r) => sum + r.downloads, 0)}`;

  if (filtered.length === 0) {
    list.innerHTML = `<p>No matching resources found.</p>`;
    return;
  }

  filtered.forEach(res => {
    const card = document.createElement("div");
    card.className = `res-card ${!res.approved ? "pending" : ""}`;

    card.innerHTML = `
      <div>
        <div class="tag-row">
          <span class="badge course-badge">${res.course}</span>
          <span class="badge">${res.category}</span>
        </div>
        <h4 class="res-title">${res.title}</h4>
        <p class="res-meta">
          ⭐ ${res.rating}/5 &nbsp;|&nbsp; 📥 ${res.downloads} Downloads 
          ${!res.approved ? " &nbsp;|&nbsp; ⏳ <b>Pending Approval</b>" : ""}
        </p>
      </div>

      <div>
        <div class="card-actions">
          <button onclick="previewResource(${res.id})">👁️ Preview</button>
          <button onclick="downloadResource(${res.id})">📥 Download</button>
          <button onclick="rateResource(${res.id})">⭐ Rate</button>
          <button onclick="toggleBookmark(${res.id})">${res.bookmarked ? "🔖 Saved" : "☆ Save"}</button>
        </div>

        ${isMod ? `
          <div class="mod-actions">
            ${!res.approved ? `<button class="btn-approve" onclick="approveResource(${res.id})">✔ Approve</button>` : ""}
            <button class="btn-delete" onclick="deleteResource(${res.id})">✖ Delete</button>
          </div>
        ` : ""}
      </div>
    `;
    list.appendChild(card);
  });
}

// 3. Preview Metadata Modal
function previewResource(id) {
  const res = resources.find(r => r.id === id);
  document.getElementById("modalTitle").innerText = res.title;
  document.getElementById("modalCourse").innerText = res.course;
  document.getElementById("modalCategory").innerText = res.category;
  document.getElementById("modalStatus").innerText = res.approved ? "Approved" : "Pending Moderation";
  document.getElementById("modalDownloads").innerText = res.downloads;
  document.getElementById("modalRating").innerText = res.rating;
  document.getElementById("modalDesc").innerText = res.desc;
  document.getElementById("previewModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("previewModal").style.display = "none";
}

// 4. Download Tracking
function downloadResource(id) {
  const res = resources.find(r => r.id === id);
  res.downloads += 1;
  saveData();
  renderResources();
  window.open(res.link, "_blank");
}

// 5. Star Rating System (Cycles 1 to 5 stars)
function rateResource(id) {
  const res = resources.find(r => r.id === id);
  res.rating = (res.rating % 5) + 1;
  saveData();
  renderResources();
}

// 6. Bookmarks Toggle
function toggleBookmark(id) {
  const res = resources.find(r => r.id === id);
  res.bookmarked = !res.bookmarked;
  saveData();
  renderResources();
}

function toggleBookmarkFilter() {
  showBookmarkedOnly = !showBookmarkedOnly;
  document.getElementById("bookmarkFilterBtn").classList.toggle("active", showBookmarkedOnly);
  renderResources();
}

// 7. Moderation (Approve / Delete)
function approveResource(id) {
  const res = resources.find(r => r.id === id);
  res.approved = true;
  saveData();
  renderResources();
}

function deleteResource(id) {
  resources = resources.filter(r => r.id !== id);
  saveData();
  renderResources();
}

// Initialize Portal on Page Load
renderResources();