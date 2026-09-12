const TOKEN_KEY = "lf_token";

const CATEGORIES = [
  "Electronics",
  "Documents",
  "Bags",
  "Clothing",
  "Jewelry",
  "Keys",
  "Pets",
  "Other",
];

const state = {
  user: null,
  unread: 0,
};

function $(sel, root) {
  return (root || document).querySelector(sel);
}

function applyFinalVisualOverrides() {
  try {
    if (!document.getElementById("force-full-delete-btn-style")) {
      const s = document.createElement("style");
      s.id = "force-full-delete-btn-style";
      s.textContent = `
        .public-detail-actions, .public-detail-shell .public-detail-actions {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        .public-detail-actions #delete-item-btn,
        #delete-item-btn,
        #security-found-delete-btn {
          width: 100% !important;
          max-width: 100% !important;
          min-height: 52px !important;
          border-radius: 999px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-sizing: border-box !important;
        }
      `;
      document.head.appendChild(s);
    }
  } catch (_e) {}

  if (document.getElementById("final-visual-overrides")) return;

  const style = document.createElement("style");
  style.id = "final-visual-overrides";
  style.textContent = `
    #home-lost-items .card-media,
    #home-found-items .card-media {
      height: 118px !important;
      min-height: 118px !important;
      overflow: hidden !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    #home-lost-items .card-media img,
    #home-found-items .card-media img {
      width: auto !important;
      max-width: 78% !important;
      height: 104px !important;
      max-height: 104px !important;
      object-fit: contain !important;
      display: block !important;
    }
    .public-item-thumb {
      width: 68px !important;
      height: 68px !important;
    }
    .public-detail-page {
      max-width: 1270px !important;
      margin: 0 auto !important;
      padding-bottom: 64px !important;
    }
    .public-detail-shell {
      width: 100% !important;
      max-width: none !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 0 !important;
      align-items: stretch !important;
      padding: 28px !important;
      border: 1px solid var(--line) !important;
      border-radius: 28px !important;
      background: #fff !important;
      box-shadow: 0 18px 48px rgba(0,0,0,.055) !important;
      box-sizing: border-box !important;
    }
    .public-detail-top {
      display: grid !important;
      grid-template-columns: minmax(0,1fr) minmax(280px,360px) !important;
      gap: 40px !important;
      align-items: start !important;
      width: 100% !important;
    }
    .public-detail-media {
      width: 100% !important;
      max-width: 360px !important;
      aspect-ratio: 1 / 1 !important;
      min-height: 0 !important;
      height: auto !important;
      border: 1px solid var(--line) !important;
      border-radius: 22px !important;
      background: #f7f7f7 !important;
      overflow: hidden !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: none !important;
      justify-self: end !important;
    }
    .public-detail-media img {
      width: 100% !important;
      height: 100% !important;
      min-height: 0 !important;
      max-height: none !important;
      object-fit: contain !important;
      display: block !important;
    }
    .public-detail-image-button {
      width: 100% !important;
      height: 100% !important;
      padding: 0 !important;
      border: 0 !important;
      background: transparent !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: zoom-in !important;
    }
    .public-detail-image-button img {
      transition: transform .2s ease !important;
    }
    .public-detail-image-button:hover img {
      transform: scale(1.025) !important;
    }
    #modal.image-modal-open .modal-panel {
      width: min(96vw, 1120px) !important;
      max-width: none !important;
      padding: 0 !important;
      overflow: hidden !important;
      border: 1px solid var(--line) !important;
      border-radius: 22px !important;
      background: #fff !important;
    }
    #modal.image-modal-open #modal-title {
      display: none !important;
    }
    #modal.image-modal-open #modal-body {
      padding: 0 !important;
    }
    .public-image-lightbox {
      position: relative;
      width: 100%;
      min-height: min(78vh, 820px);
      max-height: calc(100vh - 48px);
      padding: 30px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      border: 1px solid var(--line);
      border-radius: 22px;
      overflow: hidden;
    }
    .public-image-close {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 2;
      width: 42px;
      height: 42px;
      padding: 0;
      border: 1px solid #111;
      border-radius: 50%;
      background: #fff;
      color: #111;
      font-size: 25px;
      font-weight: 500;
      line-height: 1;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
    .public-image-close:hover {
      background: #111;
      color: #fff;
    }
    .public-image-lightbox img {
      display: block;
      width: auto;
      height: auto;
      max-width: min(88vw, 980px);
      max-height: calc(100vh - 110px);
      object-fit: contain;
      border-radius: 14px;
    }
    .public-detail-info {
      min-width: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      padding: 8px 0 0 !important;
      box-shadow: none !important;
      display: flex !important;
      flex-direction: column !important;
    }
    .public-detail-topline {
      padding-bottom: 18px !important;
      border-bottom: 1px solid var(--line) !important;
    }
    .public-detail-info h1 {
      margin: 24px 0 10px !important;
      font-size: clamp(34px,4vw,58px) !important;
      line-height: 1 !important;
      letter-spacing: -.05em !important;
      overflow-wrap: anywhere !important;
    }
    .public-detail-description {
      margin: 0 0 28px !important;
      color: #666 !important;
      font-size: 15px !important;
      line-height: 1.75 !important;
    }
    .public-detail-facts {
      display: block !important;
      width: 100% !important;
      margin-top: 8px !important;
      border: 0 !important;
      border-radius: 0 !important;
      overflow: visible !important;
      background: transparent !important;
    }
    .public-detail-fact {
      display: grid !important;
      grid-template-columns: minmax(140px,220px) minmax(0,1fr) !important;
      gap: 24px !important;
      align-items: start !important;
      padding: 15px 0 !important;
      border-top: 1px solid var(--line) !important;
      background: transparent !important;
      min-width: 0 !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    .public-detail-fact span {
      margin: 0 !important;
      color: #888 !important;
      font-size: 10px !important;
      font-weight: 800 !important;
      letter-spacing: .1em !important;
      text-transform: uppercase !important;
    }
    .public-detail-fact strong {
      color: #151515 !important;
      font-size: 14px !important;
      line-height: 1.55 !important;
      word-break: break-word !important;
    }
    .public-detail-actions {
      display: flex !important;
      flex-direction: column !important;
      gap: 10px !important;
      margin-top: 24px !important;
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
    }
    .public-detail-actions .btn {
      width: 100% !important;
      max-width: 100% !important;
      box-sizing: border-box !important;
      border-radius: 999px !important;
      min-height: 48px !important;
      justify-content: center !important;
    }
    .public-detail-actions #resolve-btn,
    .public-detail-actions #claim-btn,
    .public-detail-actions #contact-btn {
      width: 100% !important;
      max-width: 100% !important;
    }
    .found-collect-card {
      width: 100% !important;
    }

    .found-collect-card {
      margin-top: 30px !important;
      padding: 24px 0 0 !important;
      border: 0 !important;
      border-top: 1px solid var(--line) !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }
    .found-collect-head {
      padding-bottom: 17px !important;
      border-bottom: 1px solid var(--line) !important;
    }
    .found-collect-grid {
      display: block !important;
      margin-top: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      overflow: visible !important;
      background: transparent !important;
    }
    .found-collect-value,
    .found-collect-primary {
      display: grid !important;
      grid-template-columns: minmax(130px,.42fr) minmax(0,1fr) !important;
      gap: 24px !important;
      align-items: start !important;
      padding: 15px 0 !important;
      border-bottom: 1px solid var(--line) !important;
      background: transparent !important;
    }
    .found-collect-value span {
      margin: 0 !important;
    }
    .found-collect-value strong {
      font-size: 14px !important;
    }
    .found-collect-card {
      width: 100% !important;
      max-width: none !important;
      box-sizing: border-box !important;
    }
    .public-detail-actions {
      margin-top: 28px !important;
      padding-top: 0 !important;
    }
    .public-detail-signin {
      border-top: 1px solid var(--line) !important;
    }
    .sec-dash .form-grid img {
      width: auto !important;
      height: auto !important;
      max-width: 220px !important;
      max-height: 180px !important;
      object-fit: contain !important;
      display: block !important;
    }
    #custody-form > button[type="submit"] {
      width: 100% !important;
      min-width: 0 !important;
      display: block !important;
      box-sizing: border-box !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    .security-custody-panel {
      width: 100% !important;
      max-width: none !important;
      box-sizing: border-box !important;
      align-self: stretch !important;
    }
    .security-custody-form {
      width: 100% !important;
      max-width: none !important;
      box-sizing: border-box !important;
      display: block !important;
    }
    .security-custody-action-field {
      width: 100% !important;
    }
    .security-custody-action-field select {
      width: 100% !important;
      box-sizing: border-box !important;
    }
    .security-custody-date-time {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 18px 20px !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    .security-custody-date-time > .owner-field {
      min-width: 0 !important;
    }
    .security-custody-date-time input {
      width: 100% !important;
      height: 50px !important;
      box-sizing: border-box !important;
    }
    @media (max-width:700px){
      .security-custody-date-time {
        grid-template-columns: 1fr !important;
      }
    }
    .public-detail-actions #resolve-btn {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      display: block !important;
      box-sizing: border-box !important;
    }
    #add-sub-form .hero-actions {
      display: grid !important;
      grid-template-columns: repeat(2,minmax(0,1fr)) !important;
      justify-content: center !important;
      align-items: center !important;
      gap: 14px !important;
      width: 100% !important;
      padding: 0 !important;
      box-sizing: border-box !important;
    }
    #add-sub-form .hero-actions .btn {
      width: 100% !important;
      min-width: 0 !important;
      margin: 0 !important;
      box-sizing: border-box !important;
    }
    .public-detail-shell{
      max-width:1270px !important;
      margin:0 auto !important;
      min-height:520px !important;
      align-items:start !important;
    }
    .public-detail-info{
      align-self:stretch !important;
      padding:8px 10px 8px 0 !important;
    }
    .public-detail-media{
      align-self:start !important;
      margin-top:0 !important;
    }
    .public-detail-facts{
      width:100% !important;
    }
    .public-detail-fact{
      min-height:52px !important;
    }
    
    @media (max-width: 900px) {
      .public-detail-top {
        grid-template-columns: 1fr !important;
        gap: 24px !important;
      }
      .public-detail-media {
        max-width: 100% !important;
        justify-self: stretch !important;
      }
    }

    @media (max-width:760px){
      .public-detail-shell{
        grid-template-columns:1fr !important;
        min-height:0 !important;
      }
      .public-detail-info{
        grid-column:1 !important;
        grid-row:2 !important;
        padding-right:0 !important;
      }
      .public-detail-media{
        grid-column:1 !important;
        grid-row:1 !important;
        justify-self:center !important;
      }
    }
    @media (max-width:980px) {
      .public-detail-shell {
        grid-template-columns:minmax(0,1fr) minmax(280px,340px) !important;
        gap:30px !important;
      }
      .public-detail-media {
        width:min(100%,360px) !important;
        justify-self:end !important;
      }
    }
    @media (max-width:980px) {
      .found-collect-card,
      .public-detail-actions #resolve-btn,
      .public-detail-actions .btn {
        width: 100% !important;
        max-width: 100% !important;
      }
    }
    @media (max-width:760px) {
      #home-lost-items .card-media,
      #home-found-items .card-media {
        height:105px !important;
        min-height:105px !important;
      }
      #home-lost-items .card-media img,
      #home-found-items .card-media img {
        height:92px !important;
        max-height:92px !important;
      }
      .public-detail-shell {
        display:flex !important;
        flex-direction:column !important;
        gap:0 !important;
        padding:20px !important;
      }
      .public-detail-top {
        grid-template-columns:1fr !important;
        gap:24px !important;
      }
      .public-detail-media {
        width:min(100%,340px) !important;
        justify-self:center !important;
      }
      .public-detail-info {
        padding-top:0 !important;
      }
      .found-collect-card,
      .public-detail-actions #resolve-btn {
        width:100% !important;
      }
    }
    @media (max-width:560px) {
      .public-detail-shell {
        border-radius:22px !important;
        padding:16px !important;
      }
      .public-detail-media {
        width:100% !important;
        border-radius:18px !important;
      }
      .public-detail-fact,
      .found-collect-value,
      .found-collect-primary {
        grid-template-columns:1fr !important;
        gap:6px !important;
      }
      #add-sub-form .hero-actions {
        grid-template-columns:1fr !important;
      }
    }
  `;

  document.head.appendChild(style);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(value) {
  if (!value) return "—";

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) {
    return String(value);
  }

  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusLabel(value) {
  return String(value || "").replace(/_/g, " ");
}

function formatDateTime(dateVal, timeVal) {
  const d = dateVal ? new Date(dateVal) : null;
  if (!d || Number.isNaN(d.getTime())) return "—";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  let timePart = "";
  if (timeVal && String(timeVal).trim()) {
    const raw = String(timeVal).trim();
    // Accept HH:MM or already formatted
    const m = raw.match(/^(\d{1,2}):(\d{2})/);
    if (m) {
      let h = parseInt(m[1], 10);
      const min = m[2];
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12;
      if (h === 0) h = 12;
      timePart = ` ${h} : ${min} ${ampm}`;
    } else {
      timePart = ` ${raw}`;
    }
  }

  return `${dd} - ${mm} - ${yyyy}${timePart}`;
}

function lostDisplayStatus(item) {
  return itemPublicStatus(item);
}

function lostActionLabel(item) {
  if (item.actionTaken === "in_department") return "Submitted by someone in department";
  if (item.actionTaken === "submitted_to_owner") return "Submitted to owner";
  return "Not found yet";
}

/** Status shown to all users & staff */
function itemPublicStatus(item) {
  if (!item) return "—";
  if (item.status === "removed") return "Removed";
  if (item.actionTaken === "submitted_to_owner") {
    return "Submitted";
  }
  if (item.status === "resolved") {
    return "Submitted";
  }
  if (item.actionTaken === "in_department") {
    return "Found";
  }
  if (item.type === "found" && item.status === "open") return "Found";
  if (item.status === "claimed") return "Claimed";
  return item.type === "lost" ? "Not yet Found" : statusLabel(item.status);
}


function displayItemStatus(item) {
  return item && item.type === "lost" ? itemPublicStatus(item) : statusLabel(item && item.status);
}

function isFoundPubliclyVisible(item) {
  if (!item || item.type !== "found") return true;
  if (item.status === "removed") return false;
  const custody = item.foundCustody || {};
  const mode = String(custody.mode || "").toLowerCase();
  const status = String(custody.verificationStatus || "").toLowerCase();
  const visibility = String(custody.visibility || "").toLowerCase();
  if (mode === "security") {
    return status === "verified";
  }
  if (mode === "self" || status === "not_required") return true;
  if (visibility === "pending" || visibility === "hidden") return false;
  if (status === "pending" || status === "rejected") return false;
  return true;
}

function foundVerificationLabel(item) {
  const status = String(item?.foundCustody?.verificationStatus || "").toLowerCase();
  const mode = String(item?.foundCustody?.mode || "").toLowerCase();

  if (mode === "self" || status === "not_required") return "Live — Self Custody";
  if (status === "pending") return "Pending Verification";
  if (status === "verified") return "Verified — Live";
  if (status === "rejected") return "Not Verified";
  return "Legacy Found Item";
}

function foundVisibilityLabel(item) {
  const visibility = String(item?.foundCustody?.visibility || "").toLowerCase();
  if (visibility === "public") return "Live";
  if (visibility === "pending") return "Pending Verification";
  if (visibility === "hidden") return "Not Public";
  return "Live";
}

function foundCollectFromHtml(item) {
  if (item?.type !== "found") return "";

  const custody = item.foundCustody || {};
  const visibility = String(custody.visibility || "").toLowerCase();
  const status = String(custody.verificationStatus || "").toLowerCase();
  if (visibility && visibility !== "public") return "";
  if (status && !["not_required", "verified"].includes(status)) return "";

  const holder = custody.holderDetails || {};
  if (!holder.name) return "";

  const personType = String(holder.personType || "").toLowerCase();
  const personLabel = personType === "student"
    ? "Student"
    : personType === "employee"
      ? "Employee"
      : personType === "security"
        ? "Security Personnel"
        : "—";
  const idLabel = personType === "student"
    ? "Enrollment Number"
    : personType === "security"
      ? "Security ID"
      : "Employee ID";

  return `
    <section class="found-collect-card" aria-label="Collect from">
      <div class="found-collect-head">
        <div>
          <p class="found-detail-kicker">COLLECTION DETAILS</p>
          <h2>Collect from</h2>
          <p class="found-collect-sub">The item is currently held by the person shown below.</p>
        </div>
        <span class="found-collect-badge">Verified holder</span>
      </div>

      <div class="found-collect-grid">
        <div class="found-collect-value found-collect-primary">
          <span>Name</span>
          <strong>${escapeHtml(holder.name)}</strong>
        </div>
        <div class="found-collect-value">
          <span>Person type</span>
          <strong>${escapeHtml(personLabel)}</strong>
        </div>
        <div class="found-collect-value">
          <span>${escapeHtml(idLabel)}</span>
          <strong>${escapeHtml(holder.idNumber || "—")}</strong>
        </div>
        ${personType === "student" ? `
          <div class="found-collect-value">
            <span>Programme</span>
            <strong>${escapeHtml(holder.programme || "—")}</strong>
          </div>
          <div class="found-collect-value">
            <span>Department / Specialization</span>
            <strong>${escapeHtml(holder.department || "—")}</strong>
          </div>
          <div class="found-collect-value">
            <span>Year</span>
            <strong>${escapeHtml(holder.year || "—")}</strong>
          </div>
        ` : personType === "security" ? `
          <div class="found-collect-value">
            <span>Security Department / Area</span>
            <strong>${escapeHtml(holder.workDepartment || "—")}</strong>
          </div>
        ` : `
          <div class="found-collect-value">
            <span>Department / Area</span>
            <strong>${escapeHtml(holder.workDepartment || "—")}</strong>
          </div>
        `}
      </div>
    </section>
  `;
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getEffectiveRole(user) {
  if (!user) return null;
  return user.role === "admin" ? "security_head" : user.role;
}

function getDashboardRoute(user) {
  const role = getEffectiveRole(user);

  if (role === "security_head") {
    return "#/security-head";
  }

  if (role === "sub_security") {
    return "#/sub-security";
  }

  return "#/dashboard";
}

function isSecurityStaff(user) {
  const role = getEffectiveRole(user);

  return role === "security_head" || role === "sub_security";
}

function isSecurityHead(user) {
  return getEffectiveRole(user) === "security_head";
}

function setSession(token, user) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  state.user = user;
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  state.user = null;
  state.unread = 0;
}


function forceBrandName() {
  document.querySelectorAll("a.logo").forEach((el) => {
    el.textContent = "Lost & Found";
  });
}

async function api(path, options) {
  const opts = options || {};
  const headers = Object.assign({}, opts.headers || {});
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (
    !(opts.body instanceof FormData) &&
    opts.body &&
    typeof opts.body === "object"
  ) {
    headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(opts.body);
  }

  const res = await fetch(path, {
    ...opts,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

function toast(message) {
  const el = $("#toast");

  el.hidden = false;
  el.textContent = message;

  clearTimeout(toast._t);

  toast._t = setTimeout(() => {
    el.hidden = true;
  }, 3200);
}

function closeModal() {
  $("#modal").hidden = true;
  $("#modal").classList.remove("image-modal-open");
  $("#modal-body").innerHTML = "";
}

function openModal(title, html) {
  $("#modal").classList.toggle("image-modal-open", title === "Item image");
  $("#modal-title").textContent = title;
  $("#modal-body").innerHTML = html;
  $("#modal").hidden = false;

  const first = $("#modal-body").querySelector(
    "input, textarea, button"
  );

  if (first) {
    first.focus();
  }
}

function confirmAction(title, message) {
  return new Promise((resolve) => {
    openModal(
      title,
      `<p class="muted">${escapeHtml(message)}</p>
       <div class="hero-actions mt">
         <button class="btn" type="button" id="confirm-yes">Confirm</button>
         <button class="btn secondary" type="button" data-close-modal>Cancel</button>
       </div>`
    );

    $("#confirm-yes").onclick = () => {
      closeModal();
      resolve(true);
    };
  });
}

function parseRoute() {
  const raw =
    (location.hash || "#/").replace(/^#/, "") || "/";

  const [pathPart, queryPart] = raw.split("?");

  const parts = pathPart.split("/").filter(Boolean);

  const query = {};

  new URLSearchParams(queryPart || "").forEach((v, k) => {
    query[k] = v;
  });

  return {
    parts,
    query,
    path: "/" + parts.join("/"),
  };
}

function itemImage(item) {
  if (item.image) {
    return `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(
      item.title
    )}" />`;
  }

  return escapeHtml(
    (item.title || "?").slice(0, 1).toUpperCase()
  );
}

function itemCard(item) {
  return `
    <a class="card" href="#/item/${item._id || item.id}">
      <div class="card-media">${itemImage(item)}</div>

      <div class="card-body">
        <span class="pill ${item.type === "lost" ? "type-lost" : ""
    }">
          ${escapeHtml(item.type)}
        </span>

        <h3>${escapeHtml(item.title)}</h3>

        <p class="meta">
          ${escapeHtml(item.category)} ·
          ${escapeHtml(item.location)}
        </p>

        <p class="meta">
          ${formatDate(item.date)} ·
          ${escapeHtml(displayItemStatus(item))}
        </p>
        ${item.type === "found" ? (() => {
          const custody = item.foundCustody || {};
          const holder = custody.holderDetails || {};
          const visibility = String(custody.visibility || "").toLowerCase();
          const verification = String(custody.verificationStatus || "").toLowerCase();
          if (!holder.name || (visibility && visibility !== "public") || (verification && !["verified", "not_required"].includes(verification))) return "";
          const typeLabel = holder.personType === "security" ? "Security Personnel" : holder.personType === "employee" ? "Employee" : holder.personType === "student" ? "Student" : "";
          const idLabel = holder.personType === "student" ? "Enrollment" : holder.personType === "security" ? "Security ID" : "Employee ID";
          const idPart = holder.idNumber ? ` · ${escapeHtml(idLabel)}: ${escapeHtml(holder.idNumber)}` : "";
          return `<p class="meta"><strong>Collect from:</strong> ${escapeHtml(holder.name)}${typeLabel ? ` · ${escapeHtml(typeLabel)}` : ""}${idPart}</p>`;
        })() : ""}
      </div>
    </a>
  `;
}

function publicBrowseItem(item) {
  const id = item._id || item.id;
  const typeLabel = item.type === "lost" ? "Lost" : "Found";
  const status = displayItemStatus(item);
  const location = item.location || "Location not specified";
  const category = item.category || "Other";

  return `
    <a
      class="public-item-row"
      href="#/item/${escapeHtml(id)}"
      aria-label="View details for ${escapeHtml(item.title || "item")}"
    >
      <div class="public-item-thumb">
        ${item.image
          ? `<img src="${escapeHtml(item.image)}" alt="" loading="lazy" />`
          : `<span aria-hidden="true">${escapeHtml((item.title || "?").slice(0, 1).toUpperCase())}</span>`}
      </div>

      <div class="public-item-main">
        <div class="public-item-title-line">
          <span class="pill ${item.type === "lost" ? "type-lost" : ""}">${escapeHtml(typeLabel)}</span>
          <h2>${escapeHtml(item.title || "Untitled item")}</h2>
        </div>

        <div class="public-item-meta">
          <span>${escapeHtml(category)}</span>
          <span class="public-item-dot" aria-hidden="true">·</span>
          <span>${escapeHtml(location)}</span>
          <span class="public-item-dot" aria-hidden="true">·</span>
          <span>${escapeHtml(formatDate(item.date))}</span>
        </div>
      </div>

      <div class="public-item-side">
        <span class="public-item-status">${escapeHtml(status)}</span>
        <span class="public-item-arrow" aria-hidden="true">→</span>
      </div>
    </a>
  `;
}

function heroTicketMarkup(item) {
  if (!item) {
    return `
      <div class="ticket-empty">
        <div class="ripple-wrap" aria-hidden="true">
          <span class="ripple"></span>
          <span class="ripple"></span>
          <span class="ripple"></span>
          <span class="ripple-core"></span>
        </div>

        <p class="ticket-empty-title">No cases yet</p>

        <p class="ticket-empty-sub">
          New lost &amp; found reports will appear here.
        </p>
      </div>
    `;
  }

  return `
    <div class="ticket-topline">
      <small>Case file</small>

      <span class="ticket-status">
        ${escapeHtml(itemPublicStatus(item))}
      </span>
    </div>

    <h3>${escapeHtml(item.title)}</h3>

    <div class="ticket-row">
      <span>Location</span>
      <strong>${escapeHtml(item.location || "—")}</strong>
    </div>

    <div class="ticket-row">
      <span>Category</span>
      <strong>${escapeHtml(item.category || "—")}</strong>
    </div>

    <div class="ticket-row">
      <span>Identity</span>
      <strong>Protected</strong>
    </div>

    <div class="ticket-footer">
      <span>Lost &amp; Found</span>
      <span>Private record</span>
    </div>
  `;
}

function footer() {
  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <a class="logo footer-logo" href="#/">
            <span>Lost &amp; Found</span>
          </a>

          <p class="muted">
            A private way to report, match, and return what matters.
          </p>
        </div>

        <div class="footer-links" aria-label="Footer navigation">
          <a href="#/">Home</a>
          <a href="#/lost">Lost Items</a>
          <a href="#/found">Found Items</a>
          <a href="#/about">About</a>
        </div>
      </div>
    </footer>
  `;
}

function renderNav() {
  forceBrandName();
  const nav = $("#site-nav");
  const box = $("#nav-auth");

  if (!nav || !box) return;

  // #nav-auth may be nested inside #site-nav in the markup. Detach it
  // first so rebuilding the nav links below doesn't destroy it.
  const boxWasInsideNav = nav.contains(box) && box.parentNode === nav;

  if (boxWasInsideNav) {
    nav.removeChild(box);
  }

  if (state.user) {
    // After login: only Dashboard · Report · Profile & Settings · Logout
    const dashHref = getDashboardRoute(state.user);

    nav.innerHTML = `
      <a href="${dashHref}">Dashboard</a>
      <a href="#/report">Report</a>
      <a href="#/profile">Profile &amp; Settings</a>
    `;
  } else {
    // Before login: public navigation
    nav.innerHTML = `
      <a href="#/" data-nav-route="/">Home</a>

      <a href="#/report">
        Report
      </a>

      <a href="#/" data-scroll-target="how-it-works">
        How It Works
      </a>

      <a href="#/about">About</a>
    `;
  }

  if (boxWasInsideNav) {
    nav.appendChild(box);
  }

  if (state.user) {
    box.innerHTML = `
      <a class="nav-cta" href="#" id="nav-logout">Logout</a>
    `;

    const logoutLink = $("#nav-logout", box);

    if (logoutLink) {
      logoutLink.onclick = (event) => {
        event.preventDefault();

        clearSession();

        toast("Signed out.");

        renderNav();

        location.hash = "#/";
      };
    }
  } else {
    box.innerHTML = `
      <a class="nav-cta" href="#/login">Login / SignUp</a>
    `;
  }

  nav.querySelectorAll("[data-scroll-target]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const targetId =
        link.getAttribute("data-scroll-target");

      const currentRoute = parseRoute().path;

      const scrollToTarget = () => {
        const target =
          document.getElementById(targetId);

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      };

      nav.querySelectorAll(".nav-menu").forEach((menu) => {
        menu.classList.remove("open");
      });

      if (currentRoute === "/") {
        scrollToTarget();
        return;
      }

      location.hash = "#/";

      setTimeout(scrollToTarget, 120);
    });
  });

  nav.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    const currentHash = location.hash || "#/";

    const isHome =
      href === "#/" &&
      !a.hasAttribute("data-scroll-target") &&
      (currentHash === "#/" || currentHash === "");

    const isLost =
      href === "#/lost" &&
      currentHash.startsWith("#/lost");

    const isFound =
      href === "#/found" &&
      currentHash.startsWith("#/found");

    const isReport =
      href === "#/report" &&
      currentHash.startsWith("#/report");

    const isDashboard =
      (href === "#/dashboard" ||
        href === "#/security-head" ||
        href === "#/sub-security") &&
      currentHash.startsWith(href);

    const isProfile =
      href === "#/profile" &&
      currentHash.startsWith("#/profile");

    a.classList.toggle(
      "active",
      isHome ||
      isLost ||
      isFound ||
      isReport ||
      isDashboard ||
      isProfile
    );
  });
}

async function refreshUser() {
  const token = getToken();

  if (!token) {
    state.user = null;
    state.unread = 0;
    return;
  }

  try {
    const data = await api("/api/auth/me");

    if (!data.user) {
      clearSession();
      return;
    }

    state.user = data.user;

    try {
      const notes = await api("/api/notifications");
      state.unread = notes.unread || 0;
    } catch (_err) {
      state.unread = 0;
    }
  } catch (_err) {
    clearSession();
  }
}

async function renderHome() {
  $("#app").innerHTML = `
    <div class="wrap home-page">

      <section class="hero home-hero">

        <div class="hero-copy">

          <p class="eyebrow">
            Private Lost &amp; Found
          </p>

          <h1>
            Find What Matters.<br />
            Return What Was Lost.
          </h1>

          <p class="lead">
            Report missing or found items, keep custody information clear,
            and complete returns without exposing personal contact details.
          </p>

          <div class="hero-actions">
            <a
              class="btn"
              href="#/report?type=lost"
            >
              Report Lost Item
            </a>

            <a
              class="btn secondary"
              href="#/report?type=found"
            >
              Report Found Item
            </a>
          </div>

          <div class="hero-note">
            <span
              class="hero-note-mark"
              aria-hidden="true"
            >
              ✓
            </span>

            <span>
              Private contact · Simple matching · Secure claims
            </span>
          </div>

        </div>

        <div
          class="visual-panel"
          aria-label="Example lost and found case"
        >

          <div class="visual-label">
            <span>LIVE CASE VIEW</span>
            <span>LOST & FOUND</span>
          </div>

          <div class="ticket" id="home-ticket">

            <div class="ticket-topline">
              <small>Case file</small>

              <span class="ticket-status">
                &nbsp;
              </span>
            </div>

            <h3>
              Loading…
            </h3>

          </div>

        </div>

      </section>

      <section
        class="home-stats"
        aria-label="Platform statistics"
      >

        <div class="stat">
          <span class="stat-label">
            Lost reports
          </span>

          <b id="home-lost-count">—</b>

          <span class="stat-note">
            Items reported missing
          </span>
        </div>

        <div class="stat">
          <span class="stat-label">
            Found reports
          </span>

          <b id="home-found-count">—</b>

          <span class="stat-note">
            Items waiting for owners
          </span>
        </div>

        <div class="stat">
          <span class="stat-label">
            Resolved
          </span>

          <b id="home-resolved-count">—</b>

          <span class="stat-note">
            Successful returns
          </span>
        </div>

        <div class="stat">
          <span class="stat-label">
            Privacy
          </span>

          <b>Private</b>

          <span class="stat-note">
            Contact details stay protected
          </span>
        </div>

      </section>

      <section
        class="home-section home-process"
        id="how-it-works"
      >

        <div class="section-head home-section-head">

          <div>
            <p class="eyebrow">
              A simple process
            </p>

            <h2>
              How it works
            </h2>
          </div>

          <p class="section-intro">
            Three clear steps from a report to a safe return.
          </p>

        </div>

        <div class="steps">

          <article class="process-card">

            <span class="step-number">
              01
            </span>

            <h3>
              Report
            </h3>

            <p class="muted">
              Create a lost or found report with the details
              that help identify the item.
            </p>

          </article>

          <article class="process-card">

            <span class="step-number">
              02
            </span>

            <h3>
              Match
            </h3>

            <p class="muted">
              Keep reports clear, verify item custody, and complete safe returns.
            </p>

          </article>

          <article class="process-card">

            <span class="step-number">
              03
            </span>

            <h3>
              Return
            </h3>

            <p class="muted">
              Submit proof, communicate privately, and complete
              the return when verified.
            </p>

          </article>

        </div>

      </section>

      <section
        class="home-section"
        id="recent-lost"
      >

        <div class="section-head home-section-head">

          <div>
            <p class="eyebrow">
              Recently reported
            </p>

            <h2>
              Lost items
            </h2>
          </div>

          <a
            class="section-link"
            href="#/lost"
          >
            View all
            <span aria-hidden="true">→</span>
          </a>

        </div>

        <div
          id="home-lost-items"
          class="grid"
        >
          <div class="loading">
            Loading lost items…
          </div>
        </div>

      </section>

      <section
        class="home-section"
        id="recent-found"
      >

        <div class="section-head home-section-head">

          <div>
            <p class="eyebrow">
              Recently recovered
            </p>

            <h2>
              Found items
            </h2>
          </div>

          <a
            class="section-link"
            href="#/found"
          >
            View all
            <span aria-hidden="true">→</span>
          </a>

        </div>

        <div
          id="home-found-items"
          class="grid"
        >
          <div class="loading">
            Loading found items…
          </div>
        </div>

      </section>

      <section
        class="safety home-safety"
        id="safety"
      >

        <div
          class="safety-icon"
          aria-hidden="true"
        >
          +
        </div>

        <div>

          <p class="eyebrow">
            Stay safe
          </p>

          <h2>
            Privacy comes first.
          </h2>

          <p class="muted mt">
            Never publish phone numbers, home addresses, passwords,
            payment details, or other sensitive information in a report.
            Use private messages and claims, and verify identifying
            details before handing an item over.
          </p>

        </div>

        <a
          class="section-link"
          href="#/about"
        >
          Learn more
          <span aria-hidden="true">→</span>
        </a>

      </section>

    </div>

    ${footer()}
  `;

  let lost = {
    items: [],
    total: 0,
  };

  let found = {
    items: [],
    total: 0,
  };

  let resolved = 0;

  try {
    [lost, found] = await Promise.all([
      api("/api/items?type=lost&limit=3"),
      api("/api/items?type=found&limit=3"),
    ]);

    try {
      const all = await api(
        "/api/items?status=resolved&limit=1"
      );

      resolved = all.total || 0;
    } catch (_err) {
      resolved = 0;
    }
  } catch (_err) {
    /* Keep the public landing page usable when item data is unavailable. */
  }

  const lostCount = $("#home-lost-count");
  const foundCount = $("#home-found-count");
  const resolvedCount = $("#home-resolved-count");
  const lostItems = $("#home-lost-items");
  const foundItems = $("#home-found-items");
  const homeTicket = $("#home-ticket");

  if (homeTicket) {
    const featured =
      (lost.items && lost.items[0]) ||
      (found.items && found.items[0]) ||
      null;

    homeTicket.classList.toggle("ticket-has-data", Boolean(featured));
    homeTicket.innerHTML = heroTicketMarkup(featured);
  }

  if (lostCount) {
    lostCount.textContent = lost.total;
  }

  if (foundCount) {
    foundCount.textContent = found.total;
  }

  if (resolvedCount) {
    resolvedCount.textContent = resolved;
  }

  if (lostItems) {
    lostItems.innerHTML = lost.items.length
      ? lost.items.map(itemCard).join("")
      : `<div class="empty">No lost reports yet.</div>`;
  }

  if (foundItems) {
    foundItems.innerHTML = found.items.length
      ? found.items.map(itemCard).join("")
      : `<div class="empty">No found reports yet.</div>`;
  }
}

async function renderBrowse(type) {
  const route = parseRoute();
  const q = route.query;

  q.type = type;
  q.page = q.page || "1";

  const params = new URLSearchParams(q);

  $("#app").innerHTML = `
    <div class="wrap">
      <p class="page-kicker muted">
        ${type === "lost" ? "Missing" : "Recovered"}
      </p>

      <h1 class="page-title">
        ${type === "lost" ? "Lost items" : "Found items"}
      </h1>

      <form class="filters" id="filter-form">

        <label class="field">
          Search

          <input
            name="q"
            value="${escapeHtml(q.q || "")}"
            placeholder="Title, place, details"
          />
        </label>

        <label class="field">
          Category

          <select name="category">
            <option value="">All</option>

            ${CATEGORIES.map(
    (c) =>
      `<option ${q.category === c ? "selected" : ""
      }>${c}</option>`
  ).join("")}
          </select>
        </label>

        <label class="field">
          Location

          <input
            name="location"
            value="${escapeHtml(q.location || "")}"
          />
        </label>

        <label class="field">
          From

          <input
            type="date"
            name="from"
            value="${escapeHtml(q.from || "")}"
          />
        </label>

        <label class="field">
          To

          <input
            type="date"
            name="to"
            value="${escapeHtml(q.to || "")}"
          />
        </label>

        <label class="field">
          Sort

          <select name="sort">

            <option
              value="newest"
              ${q.sort === "newest" || !q.sort
      ? "selected"
      : ""
    }
            >
              Newest
            </option>

            <option
              value="oldest"
              ${q.sort === "oldest" ? "selected" : ""}
            >
              Oldest
            </option>

            <option
              value="date"
              ${q.sort === "date" ? "selected" : ""}
            >
              Event date
            </option>

            <option
              value="title"
              ${q.sort === "title" ? "selected" : ""}
            >
              Title
            </option>

          </select>
        </label>

        <button
          class="btn"
          type="submit"
        >
          Apply
        </button>

      </form>

      <div
        id="browse-results"
        class="loading"
      >
        Loading items…
      </div>
    </div>
  `;

  $("#filter-form").onsubmit = (e) => {
    e.preventDefault();

    const fd = new FormData(e.target);
    const next = { type };

    for (const [k, v] of fd.entries()) {
      if (v) {
        next[k] = v;
      }
    }

    location.hash =
      `#/${type}?${new URLSearchParams(next)}`;
  };

  try {
    const data = await api(
      `/api/items?${params.toString()}`
    );

    const cards = data.items.length
      ? `
        <style id="public-browse-styles">
          .filters .btn[type="submit"]{
            grid-column:1 / -1;
            width:100%;
            min-width:0;
            justify-self:stretch;
          }
          .public-browse-results{
            display:grid;
            gap:12px;
            margin-top:28px;
          }
          .public-item-row{
            display:grid;
            grid-template-columns:72px minmax(0,1fr) auto;
            align-items:center;
            gap:18px;
            width:100%;
            padding:14px 16px 14px 14px;
            border:1px solid var(--line);
            border-radius:18px;
            background:#fff;
            color:inherit;
            text-decoration:none;
            box-sizing:border-box;
            transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease;
          }
          .public-item-row:hover{
            transform:translateY(-2px);
            border-color:#bdbdbd;
            box-shadow:0 12px 28px rgba(0,0,0,.07);
          }
          .public-item-row:focus-visible{
            outline:2px solid #111;
            outline-offset:3px;
          }
          .public-item-thumb{
            width:72px;
            height:72px;
            border:1px solid var(--line);
            border-radius:14px;
            overflow:hidden;
            display:flex;
            align-items:center;
            justify-content:center;
            background:#f7f7f7;
            color:#111;
            font-size:22px;
            font-weight:700;
          }
          .public-item-thumb img{
            width:100%;
            height:100%;
            object-fit:cover;
            display:block;
          }
          .public-item-main{
            min-width:0;
          }
          .public-item-title-line{
            display:flex;
            align-items:center;
            gap:10px;
            min-width:0;
          }
          .public-item-title-line .pill{
            flex:0 0 auto;
          }
          .public-item-title-line h2{
            margin:0;
            min-width:0;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            font-size:18px;
            line-height:1.25;
            letter-spacing:-.02em;
          }
          .public-item-meta{
            display:flex;
            align-items:center;
            flex-wrap:wrap;
            gap:7px;
            margin-top:8px;
            color:#6b6b6b;
            font-size:13px;
            line-height:1.4;
          }
          .public-item-dot{
            color:#aaa;
          }
          .public-item-side{
            display:flex;
            align-items:center;
            gap:14px;
            padding-left:8px;
          }
          .public-item-status{
            display:inline-flex;
            align-items:center;
            min-height:32px;
            padding:0 11px;
            border:1px solid var(--line);
            border-radius:999px;
            background:#fafafa;
            color:#222;
            font-size:12px;
            font-weight:700;
            text-transform:capitalize;
            white-space:nowrap;
          }
          .public-item-arrow{
            display:flex;
            align-items:center;
            justify-content:center;
            width:34px;
            height:34px;
            border:1px solid var(--line);
            border-radius:50%;
            color:#111;
            font-size:17px;
            transition:transform .18s ease, background .18s ease;
          }
          .public-item-row:hover .public-item-arrow{
            transform:translateX(2px);
            background:#111;
            color:#fff;
            border-color:#111;
          }
          .public-browse-count{
            margin:22px 0 0;
            color:#777;
            font-size:13px;
          }
          .public-browse-empty{
            margin-top:28px;
          }
          @media (max-width:760px){
            .public-item-row{
              grid-template-columns:58px minmax(0,1fr);
              gap:13px;
              padding:12px;
            }
            .public-item-thumb{
              width:58px;
              height:58px;
              border-radius:12px;
            }
            .public-item-title-line h2{
              font-size:16px;
            }
            .public-item-side{
              grid-column:2;
              padding-left:0;
              justify-content:space-between;
            }
            .public-item-arrow{
              width:30px;
              height:30px;
            }
          }
        </style>
        <div class="public-browse-results">
          ${data.items.filter((it) => it.type !== "found" || isFoundPubliclyVisible(it)).map(publicBrowseItem).join("")}
        </div>
        <p class="public-browse-count">${data.total} ${type === "lost" ? "lost" : "found"} item${data.total === 1 ? "" : "s"}</p>
      `
      : `<div class="empty public-browse-empty">No items match these filters.</div>`;

    const pages = [];

    for (let i = 1; i <= data.pages; i += 1) {
      const p = new URLSearchParams(q);

      p.set("page", String(i));

      pages.push(`
        <a
          class="btn ${i === data.page ? "" : "secondary"
        }"
          href="#/${type}?${p}"
        >
          ${i}
        </a>
      `);
    }

    $("#browse-results").outerHTML = `
      ${cards}

      <div class="pager">
        ${pages.join("")}
      </div>
    `;
  } catch (err) {
    $("#browse-results").outerHTML = `
      <div class="error-box">
        ${escapeHtml(err.message)}
      </div>
    `;
  }
}

function securityLostCustodyHtml(item) {
  const owner = item.ownerDetails || {};
  const today = new Date();
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const defaultTime = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;
  const studentProgrammes = ["B.Tech", "BBA", "BCA", "B.Com", "BA", "B.Sc", "B.Des", "LLB", "MBA", "MCA", "M.Tech", "M.Sc", "MA", "LLM", "Ph.D.", "Other"];
  const studentDepartments = ["Computer Science & Engineering", "CSE (Artificial Intelligence & Machine Learning)", "Electronics & Communication Engineering", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Business Administration", "Finance", "Marketing", "Human Resources", "Business Analytics", "Operations", "Design", "Law", "Sciences", "Other"];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Other"];
  const employeeRoles = ["Professor / Faculty", "Lecturer", "Assistant Professor", "Associate Professor", "Administrative Staff", "Receptionist", "Finance / Accounts", "HR", "IT / Technical Support", "Security", "Housekeeping / Cleaning", "Library Staff", "Lab Staff", "Admissions", "Student Affairs", "Management", "Other"];
  const workDepartments = ["Administration", "Finance / Accounts", "HR", "Admissions", "Academic Affairs", "Computer / IT", "Library", "Security", "Student Affairs", "Examinations", "Hostel", "Transport", "Facilities", "Maintenance", "Housekeeping / Cleaning", "Reception", "Other"];
  const options = (values, selected) => values.map((value) => `<option value="${escapeHtml(value)}" ${selected === value ? "selected" : ""}>${escapeHtml(value)}</option>`).join("");

  return `
    <section class="security-lost-custody">
      <style>
        .security-lost-custody{
          width:100%;
          max-width:none;
          box-sizing:border-box;
          margin-top:0;
          padding:28px 0 0;
          border-top:1px solid var(--line);
        }
        .security-lost-custody-head{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:18px;
          padding-bottom:18px;
          border-bottom:1px solid var(--line);
        }
        .security-lost-custody-kicker{
          margin:0 0 7px;
          color:#858585;
          font-size:10px;
          font-weight:800;
          letter-spacing:.15em;
        }
        .security-lost-custody-head h2{
          margin:0;
          font-size:24px;
          letter-spacing:-.03em;
        }
        .security-lost-custody-head p:last-child{
          margin:7px 0 0;
          color:#777;
          font-size:13px;
          line-height:1.55;
        }
        .security-lost-custody-badge{
          flex:0 0 auto;
          border:1px solid #111;
          border-radius:999px;
          padding:7px 11px;
          background:#fff;
          color:#111;
          font-size:10px;
          font-weight:800;
          letter-spacing:.05em;
          text-transform:uppercase;
        }
        .security-lost-custody-form{
          display:grid;
          gap:18px;
          padding-top:20px;
        }
        .security-lost-custody-form .field{
          margin:0;
        }
        .security-lost-custody-form input,
        .security-lost-custody-form select,
        .security-lost-custody-form textarea{
          width:100%;
          box-sizing:border-box;
        }
        .security-lost-custody-form select,
        .security-lost-custody-form input{
          min-height:50px;
          border-radius:12px;
        }
        .security-owner-details-wrap{
          padding-top:2px;
        }
        .security-owner-grid{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:18px 20px;
        }
        .security-owner-grid .field{
          min-width:0;
        }
        .security-owner-grid .field input,
        .security-owner-grid .field select{
          margin-top:7px;
        }
        .security-custody-date-time-field{
          grid-column:1 / -1;
          min-width:0;
        }
        .security-custody-field-label{
          display:block;
          margin-bottom:8px;
          font-size:14px;
          font-weight:500;
        }
        .security-custody-date-time{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:18px 20px;
        }
        .security-custody-date-time .field{
          min-width:0;
        }
        .security-lost-custody-form > .btn{
          width:100%;
          min-height:48px;
          border-radius:999px;
          font-weight:700;
        }
        @media (max-width:760px){
          .security-owner-grid{grid-template-columns:1fr;}
          .security-custody-date-time{grid-template-columns:1fr;}
          .security-lost-custody-head{flex-direction:column;}
        }
      </style>

      <div class="security-lost-custody-head">
        <div>
          <p class="security-lost-custody-kicker">SECURITY DESK</p>
          <h2>Update custody</h2>
          <p>Record the current custody status of this lost item.</p>
        </div>
        <span class="security-lost-custody-badge">Security only</span>
      </div>

      <form id="security-lost-custody-form" class="security-lost-custody-form">
        <label class="field">
          Action
          <select name="actionTaken" id="security-custody-action" required>
            <option value="none" ${(item.actionTaken || "none") === "none" ? "selected" : ""}>Not found yet</option>
            <option value="in_department" ${item.actionTaken === "in_department" ? "selected" : ""}>Submitted by someone in department</option>
            <option value="submitted_to_owner" ${item.actionTaken === "submitted_to_owner" ? "selected" : ""}>Submitted to owner</option>
          </select>
        </label>

        <div id="security-owner-details-wrap" class="security-owner-details-wrap" style="display:none;">
          <div class="security-owner-grid">
            <label class="field">
              Name
              <input name="ownerName" id="security-owner-name" maxlength="120" placeholder="Full name of owner" value="${escapeHtml(owner.name || "")}" />
            </label>

            <label class="field">
              Person type
              <select name="personType" id="security-owner-type">
                <option value="">Select person type</option>
                <option value="student" ${owner.personType === "student" ? "selected" : ""}>Student</option>
                <option value="employee" ${owner.personType === "employee" ? "selected" : ""}>Employee</option>
              </select>
            </label>

            <label class="field">
              <span id="security-owner-id-label">Enrollment / Employee ID</span>
              <input name="idNumber" id="security-owner-id" maxlength="80" placeholder="Enrollment number or employee ID" value="${escapeHtml(owner.idNumber || "")}" />
            </label>

            <label class="field" id="security-owner-programme-wrap">
              Programme / Course
              <select name="programme" id="security-owner-programme">
                <option value="">Select programme</option>
                ${options(studentProgrammes, owner.programme || "")}
              </select>
            </label>

            <label class="field" id="security-owner-department-wrap">
              Department / Specialization
              <select name="department" id="security-owner-department">
                <option value="">Select department</option>
                ${options(studentDepartments, owner.department || "")}
              </select>
            </label>

            <label class="field" id="security-owner-year-wrap">
              Year
              <select name="year" id="security-owner-year">
                <option value="">Select year</option>
                ${options(years, owner.year || "")}
              </select>
            </label>

            <label class="field" id="security-owner-role-wrap" style="display:none;">
              Role / Position
              <select name="role" id="security-owner-role">
                <option value="">Select role</option>
                ${options(employeeRoles, owner.role || "")}
              </select>
            </label>

            <label class="field" id="security-owner-work-wrap" style="display:none;">
              Work Department / Area
              <select name="workDepartment" id="security-owner-work">
                <option value="">Select work department</option>
                ${options(workDepartments, owner.workDepartment || "")}
              </select>
            </label>

            <div class="security-custody-date-time-field">
              <span class="security-custody-field-label">Handover date &amp; time</span>
              <div class="security-custody-date-time">
                <label class="field">
                  Date
                  <input type="date" name="handoverDate" id="security-owner-date" value="${escapeHtml(owner.handoverDate || defaultDate)}" />
                </label>
                <label class="field">
                  Time
                  <input type="time" name="handoverTime" id="security-owner-time" value="${escapeHtml(owner.handoverTime || defaultTime)}" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <p id="security-custody-error" class="field-error"></p>
        <button class="btn" type="submit">Save action</button>
      </form>
    </section>
  `;
}

function bindSecurityLostCustody(id) {
  const form = $("#security-lost-custody-form");
  if (!form) return;

  const action = $("#security-custody-action");
  const wrap = $("#security-owner-details-wrap");
  const type = $("#security-owner-type");
  const name = $("#security-owner-name");
  const idNumber = $("#security-owner-id");
  const idLabel = $("#security-owner-id-label");
  const programmeWrap = $("#security-owner-programme-wrap");
  const departmentWrap = $("#security-owner-department-wrap");
  const yearWrap = $("#security-owner-year-wrap");
  const roleWrap = $("#security-owner-role-wrap");
  const workWrap = $("#security-owner-work-wrap");
  const programme = $("#security-owner-programme");
  const department = $("#security-owner-department");
  const year = $("#security-owner-year");
  const role = $("#security-owner-role");
  const work = $("#security-owner-work");
  const date = $("#security-owner-date");
  const time = $("#security-owner-time");

  const sync = () => {
    const ownerAction = action && action.value === "submitted_to_owner";
    if (wrap) wrap.style.display = ownerAction ? "block" : "none";
    const fields = [name, type, idNumber, programme, department, year, role, work, date, time];
    fields.forEach((field) => { if (field) field.required = false; });
    if (!ownerAction) return;
    const isStudent = type && type.value === "student";
    const isEmployee = type && type.value === "employee";
    if (idLabel) idLabel.textContent = isStudent ? "Enrollment Number" : isEmployee ? "Employee ID" : "Enrollment / Employee ID";
    if (name) name.required = true;
    if (type) type.required = true;
    if (idNumber) idNumber.required = true;
    if (date) date.required = true;
    if (time) time.required = true;
    if (programmeWrap) programmeWrap.style.display = isStudent ? "block" : "none";
    if (departmentWrap) departmentWrap.style.display = isStudent ? "block" : "none";
    if (yearWrap) yearWrap.style.display = isStudent ? "block" : "none";
    if (roleWrap) roleWrap.style.display = isEmployee ? "block" : "none";
    if (workWrap) workWrap.style.display = isEmployee ? "block" : "none";
    if (programme) programme.required = isStudent;
    if (department) department.required = isStudent;
    if (year) year.required = isStudent;
    if (role) role.required = isEmployee;
    if (work) work.required = isEmployee;
  };

  sync();
  if (action) action.onchange = sync;
  if (type) type.onchange = sync;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const error = $("#security-custody-error");
    if (error) error.textContent = "";
    const actionTaken = String(fd.get("actionTaken") || "").trim();
    const body = { actionTaken };

    if (actionTaken === "submitted_to_owner") {
      const personType = String(fd.get("personType") || "").trim();
      const ownerDetails = {
        name: String(fd.get("ownerName") || "").trim(), personType,
        idNumber: String(fd.get("idNumber") || "").trim(),
        programme: personType === "student" ? String(fd.get("programme") || "").trim() : "",
        department: personType === "student" ? String(fd.get("department") || "").trim() : "",
        year: personType === "student" ? String(fd.get("year") || "").trim() : "",
        role: personType === "employee" ? String(fd.get("role") || "").trim() : "",
        workDepartment: personType === "employee" ? String(fd.get("workDepartment") || "").trim() : "",
        handoverDate: String(fd.get("handoverDate") || "").trim(),
        handoverTime: String(fd.get("handoverTime") || "").trim(),
      };
      if (!ownerDetails.name || !personType || !ownerDetails.idNumber || !ownerDetails.handoverDate || !ownerDetails.handoverTime) {
        if (error) error.textContent = "Please complete all owner details.";
        return;
      }
      if (personType === "student" && (!ownerDetails.programme || !ownerDetails.department || !ownerDetails.year)) {
        if (error) error.textContent = "Please complete the student programme, department, and year.";
        return;
      }
      if (personType === "employee" && (!ownerDetails.role || !ownerDetails.workDepartment)) {
        if (error) error.textContent = "Please complete the employee role and work department.";
        return;
      }
      body.ownerDetails = ownerDetails;
    }

    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    try {
      const res = await api(`/api/items/set-custody/${encodeURIComponent(id)}`, { method: "PUT", body });
      const saved = res && res.item;
      const savedAction = String((res && res.actionTaken) || (saved && saved.actionTaken) || "").trim();
      if (savedAction !== actionTaken) throw new Error("The selected custody action was not saved correctly. Please try again.");
      toast("Custody action saved.");
      await renderItem(id, true);
    } catch (err) {
      if (error) error.textContent = err.message || "Unable to save action.";
      if (button) button.disabled = false;
    }
  };
}

async function renderItem(id, securityMode = false) {
  const detailStyle = `
    <style id="public-item-detail-styles">
      .public-detail-page{
        max-width:1270px;
        margin:0 auto;
        padding-bottom:64px;
      }
      .public-detail-shell{
        width:100%;
        display:flex;
        flex-direction:column;
        gap:0;
        align-items:stretch;
        padding:28px;
        border:1px solid var(--line);
        border-radius:28px;
        background:#fff;
        box-shadow:0 18px 48px rgba(0,0,0,.055);
        box-sizing:border-box;
      }
      .public-detail-top{
        display:grid;
        grid-template-columns:minmax(0,1fr) minmax(280px,360px);
        gap:40px;
        align-items:start;
        width:100%;
      }
      @media (max-width:900px){
        .public-detail-top{
          grid-template-columns:1fr;
          gap:24px;
        }
        .public-detail-media{
          max-width:100%;
          justify-self:stretch;
        }
      }

      .public-detail-media{
        width:100%;
        max-width:360px;
        aspect-ratio:1 / 1;
        min-height:0;
        height:auto;
        border:1px solid var(--line);
        border-radius:22px;
        background:#f7f7f7;
        overflow:hidden;
        display:flex;
        align-items:center;
        justify-content:center;
        justify-self:end;
        box-shadow:none;
      }
      .public-detail-media img{
        width:100%;
        height:100%;
        min-height:0;
        max-height:none;
        object-fit:contain;
        display:block;
      }
      .public-detail-image-button{
        width:100%;
        height:100%;
        padding:0;
        border:0;
        background:transparent;
        display:flex;
        align-items:center;
        justify-content:center;
        cursor:zoom-in;
      }
      .public-detail-image-button img{
        transition:transform .2s ease;
      }
      .public-detail-image-button:hover img{
        transform:scale(1.025);
      }
      .public-detail-info{
        min-width:0;
        border:0;
        border-radius:0;
        background:transparent;
        padding:8px 0 0;
        box-shadow:none;
        display:flex;
        flex-direction:column;
      }
      .public-detail-topline{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:14px;
        flex-wrap:wrap;
        padding-bottom:18px;
        border-bottom:1px solid var(--line);
      }
      .public-detail-kicker{
        margin:0;
        color:#777;
        font-size:11px;
        font-weight:800;
        letter-spacing:.16em;
        text-transform:uppercase;
      }
      .public-detail-info h1{
        margin:24px 0 10px;
        font-size:clamp(34px,4vw,58px);
        line-height:1;
        letter-spacing:-.05em;
        overflow-wrap:anywhere;
      }
      .public-detail-description{
        margin:0 0 28px;
        color:#666;
        font-size:15px;
        line-height:1.75;
      }
      .public-detail-facts{
        display:block;
        width:100%;
        margin-top:8px;
        border:0;
        border-radius:0;
        overflow:visible;
        background:transparent;
      }
      .public-detail-fact{
        display:grid;
        grid-template-columns:minmax(140px,220px) minmax(0,1fr);
        gap:24px;
        align-items:start;
        padding:15px 0;
        border-top:1px solid var(--line);
        background:transparent;
        min-width:0;
        width:100%;
        box-sizing:border-box;
      }
      .public-detail-fact span{
        display:block;
        margin:0;
        color:#888;
        font-size:10px;
        font-weight:800;
        letter-spacing:.1em;
        text-transform:uppercase;
      }
      .public-detail-fact strong{
        display:block;
        color:#151515;
        font-size:14px;
        line-height:1.55;
        word-break:break-word;
      }
      .public-detail-actions{
        margin-top:24px;
        padding:0;
        display:flex;
        flex-direction:column;
        flex-wrap:nowrap;
        gap:10px;
        width:100% !important;
        max-width:100% !important;
        align-self:stretch;
        box-sizing:border-box;
      }
      .public-detail-actions .btn,
      .public-detail-actions #delete-item-btn,
      .public-detail-actions #resolve-btn,
      .public-detail-actions #claim-btn,
      .public-detail-actions #contact-btn{
        width:100% !important;
        max-width:100% !important;
        min-width:0 !important;
        box-sizing:border-box !important;
        border-radius:999px !important;
        min-height:52px !important;
        justify-content:center !important;
        display:flex !important;
        align-items:center !important;
      }
      .public-detail-signin{
        margin:18px 0 0;
        padding-top:18px;
        border-top:1px solid var(--line);
        color:#777;
        font-size:13px;
      }
      .found-collect-card{
        margin-top:30px;
        padding:24px 0 0;
        border:0;
        border-top:1px solid var(--line);
        border-radius:0;
        background:transparent;
        box-shadow:none;
      }
      .found-collect-head{
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:18px;
        padding-bottom:17px;
        border-bottom:1px solid var(--line);
      }
      .found-detail-kicker{
        margin:0 0 7px;
        color:#858585;
        font-size:10px;
        font-weight:800;
        letter-spacing:.15em;
      }
      .found-collect-head h2{
        margin:0;
        font-size:22px;
        letter-spacing:-.025em;
      }
      .found-collect-sub{
        margin:7px 0 0;
        color:#777;
        font-size:13px;
        line-height:1.55;
      }
      .found-collect-badge{
        flex:0 0 auto;
        border:1px solid #111;
        border-radius:999px;
        padding:7px 10px;
        color:#111;
        background:#fff;
        font-size:10px;
        font-weight:800;
        letter-spacing:.04em;
        text-transform:uppercase;
      }
      .found-collect-grid{
        display:block;
        margin-top:0;
        border:0;
        border-radius:0;
        overflow:visible;
        background:transparent;
      }
      .found-collect-value,
      .found-collect-primary{
        display:grid;
        grid-template-columns:minmax(130px,.42fr) minmax(0,1fr);
        gap:24px;
        align-items:start;
        padding:15px 0;
        border-bottom:1px solid var(--line);
        background:transparent;
      }
      .found-collect-value span{
        display:block;
        margin:0;
        color:#888;
        font-size:10px;
        font-weight:800;
        letter-spacing:.08em;
        text-transform:uppercase;
      }
      .found-collect-value strong{
        display:block;
        color:#151515;
        font-size:14px;
        line-height:1.45;
        word-break:break-word;
      }
      .public-claims-section{
        margin-top:34px;
      }
      .public-claims-section h2{
        margin:0 0 14px;
        font-size:24px;
        letter-spacing:-.03em;
      }
      .public-detail-shell{
        max-width:1270px;
        margin:0 auto;
        min-height:520px;
      }
      .public-detail-info{
        align-self:stretch;
        padding:8px 10px 8px 0;
      }
      .public-detail-media{
        align-self:start;
        margin-top:0;
      }
      .public-detail-fact{
        min-height:52px;
      }
      @media (max-width:980px){
        .public-detail-shell{
          grid-template-columns:minmax(0,1fr) minmax(280px,340px);
          gap:30px;
        }
        .public-detail-media{
          width:min(100%,360px);
        }
      }
      @media (max-width:760px){
        .public-detail-shell{
          grid-template-columns:1fr;
          gap:28px;
          padding:20px;
        }
        .public-detail-media{
          width:min(100%,340px);
          justify-self:center;
          grid-column:1;
          grid-row:1;
        }
        .public-detail-info{
          padding-top:0;
          padding-right:0;
          grid-column:1;
          grid-row:2;
        }
      }
      @media (max-width:560px){
        .public-detail-shell{
          border-radius:22px;
          padding:16px;
        }
        .public-detail-media{
          width:100%;
          border-radius:18px;
        }
        .public-detail-fact,
        .found-collect-value,
        .found-collect-primary{
          grid-template-columns:1fr;
          gap:6px;
        }
        .found-collect-head{
          flex-direction:column;
        }
      }
    </style>
  `;

  $("#app").innerHTML = `
    ${detailStyle}
    <div class="wrap public-detail-page">
      <p class="loading">Loading item…</p>
    </div>
  `;

  try {
    const { item } = await api(`/api/items/${id}`);

    let ownerClaims = [];
    const securityStaff = securityMode || isSecurityStaff(state.user);
    const isOwner =
      state.user &&
      String(state.user.id) === String(item.user && item.user.id);

    if (securityStaff || isOwner) {
      try {
        const data = await api(`/api/claims/item/${id}`);
        ownerClaims = data.claims;
      } catch (_e) {
        ownerClaims = [];
      }
    }

    const postedBy =
      item.user && item.user.name ? item.user.name : "Member";

    const canAct = state.user && !isOwner && !securityStaff;
    const itemDateTime = formatDateTime(item.date, item.time);

    $("#app").innerHTML = `
      ${detailStyle}
      <div class="wrap public-detail-page">
        <div class="public-detail-shell">
          <div class="public-detail-top">
            <article class="public-detail-info">
              <div class="public-detail-topline">
                <span class="pill ${item.type === "lost" ? "type-lost" : ""}">
                  ${escapeHtml(item.type)} · ${escapeHtml(itemPublicStatus(item))}
                </span>
                <p class="public-detail-kicker">ITEM DETAILS</p>
              </div>

              <h1>${escapeHtml(item.title)}</h1>

              <p class="public-detail-description">
                ${escapeHtml(item.description)}
              </p>
            </article>

            <div class="public-detail-media">
              ${item.image
                ? `<button class="public-detail-image-button" id="public-detail-image" type="button" aria-label="Open full-size item image">
                    ${itemImage(item)}
                  </button>`
                : itemImage(item)}
            </div>
          </div>

          <div class="public-detail-facts">
            <div class="public-detail-fact">
              <span>Category</span>
              <strong>${escapeHtml(item.category)}</strong>
            </div>
            <div class="public-detail-fact">
              <span>Location</span>
              <strong>${escapeHtml(item.location)}</strong>
            </div>
            <div class="public-detail-fact">
              <span>Date &amp; time</span>
              <strong>${escapeHtml(itemDateTime)}</strong>
            </div>
            <div class="public-detail-fact">
              <span>Posted by</span>
              <strong>${escapeHtml(postedBy)}</strong>
            </div>
            ${item.identifyingDetails ? `
              <div class="public-detail-fact">
                <span>Identifying details</span>
                <strong>${escapeHtml(item.identifyingDetails)}</strong>
              </div>
            ` : ""}
          </div>

          ${foundCollectFromHtml(item)}

          <div class="public-detail-actions" style="width:100%;max-width:100%;margin:24px 0 0;padding:0;box-sizing:border-box;display:flex;flex-direction:column;align-items:stretch;gap:10px;">
            ${canAct && item.status === "open" && item.type === "found" ? `
              <button class="btn" id="claim-btn" type="button">Submit a claim</button>
            ` : ""}

            ${canAct && item.status === "open" ? `
              <button class="btn secondary" id="contact-btn" type="button">Send a private message</button>
            ` : ""}

            ${(!securityMode && isOwner && item.type === "found" && item.status !== "resolved" && item.status !== "removed") ? `
              <button class="btn secondary" id="resolve-btn" type="button">Mark resolved</button>
            ` : ""}

            ${(isOwner || securityStaff) && item.status !== "removed" ? `
              <button class="btn secondary full" id="delete-item-btn" type="button" style="width:100%;min-width:100%;max-width:none;margin:0;box-sizing:border-box;min-height:52px;border-radius:999px;display:flex;align-items:center;justify-content:center;">Delete report</button>
            ` : ""}
            ${(isOwner || securityStaff) && item.status === "removed" ? `
              <button class="btn secondary full" id="delete-item-btn" type="button" style="width:100%;min-width:100%;max-width:none;margin:0;box-sizing:border-box;min-height:52px;border-radius:999px;display:flex;align-items:center;justify-content:center;">Permanently delete</button>
            ` : ""}
          </div>

          ${!state.user ? `
            <p class="public-detail-signin">
              <a href="#/login">Sign in</a> to claim or message.
            </p>
          ` : ""}
        </div>

        ${securityMode && item.type === "lost" ? securityLostCustodyHtml(item) : ""}

        ${ownerClaims.length ? `
          <section class="public-claims-section">
            <h2>Claims on this item</h2>
            <div class="table-wrap panel">
              <table>
                <thead>
                  <tr>
                    <th>Claimant</th>
                    <th>Reason</th>
                    <th>Proof</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  ${ownerClaims.map((c) => `
                    <tr>
                      <td>${escapeHtml(c.claimant && c.claimant.name)}</td>
                      <td>${escapeHtml(c.reason)}</td>
                      <td>${escapeHtml(c.proof)}</td>
                      <td>${escapeHtml(statusLabel(c.status))}</td>
                      <td>
                        <select data-claim="${c._id}">
                          ${["pending", "under_review", "approved", "rejected", "completed"].map((s) => `
                            <option value="${s}" ${c.status === s ? "selected" : ""}>${statusLabel(s)}</option>
                          `).join("")}
                        </select>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </section>
        ` : ""}
      </div>
      ${footer()}
    `;

    const detailImageButton = $("#public-detail-image");
    if (detailImageButton && item.image) {
      detailImageButton.onclick = () => {
        openModal(
          "Item image",
          `<div class="public-image-lightbox">
             <button class="public-image-close" type="button" data-close-modal aria-label="Close image">×</button>
             <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title || "Item image")}" />
           </div>`
        );
      };
    }

    const claimBtn = $("#claim-btn");
    if (claimBtn) {
      claimBtn.onclick = () => {
        openModal("Submit a claim", `
          <form id="claim-form">
            <label class="field">Why is this yours?<textarea name="reason" required minlength="10"></textarea></label>
            <label class="field mt">Proof / identifying details<textarea name="proof" required minlength="10"></textarea></label>
            <label class="field mt">Message to reporter (optional)<textarea name="message"></textarea></label>
            <button class="btn full mt" type="submit">Submit claim</button>
          </form>
        `);

        $("#claim-form").onsubmit = async (e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          const btn = e.target.querySelector("button");
          btn.disabled = true;
          try {
            await api("/api/claims", {
              method: "POST",
              body: {
                itemId: id,
                reason: fd.get("reason"),
                proof: fd.get("proof"),
                message: fd.get("message"),
              },
            });
            closeModal();
            toast("Claim submitted.");
            renderItem(id);
          } catch (err) {
            btn.disabled = false;
            toast(err.message);
          }
        };
      };
    }

    const contactBtn = $("#contact-btn");
    if (contactBtn) {
      contactBtn.onclick = () => {
        openModal("Private message", `
          <p class="muted">The reporter will receive this in their notifications. Email and phone stay hidden.</p>
          <form id="contact-form">
            <label class="field mt">Message<textarea name="message" required minlength="10"></textarea></label>
            <button class="btn full mt" type="submit">Send</button>
          </form>
        `);

        $("#contact-form").onsubmit = async (e) => {
          e.preventDefault();
          const btn = e.target.querySelector("button");
          btn.disabled = true;
          try {
            await api(`/api/items/${id}/contact`, {
              method: "POST",
              body: { message: new FormData(e.target).get("message") },
            });
            closeModal();
            toast("Message delivered.");
          } catch (err) {
            btn.disabled = false;
            toast(err.message);
          }
        };
      };
    }

    const resolveBtn = $("#resolve-btn");
    if (resolveBtn) {
      resolveBtn.onclick = async () => {
        const ok = await confirmAction("Mark resolved", "This will mark the item as returned/resolved.");
        if (!ok) return;
        try {
          await api(`/api/items/${id}/resolve`, { method: "PUT" });
          toast("Item resolved.");
          renderItem(id);
        } catch (err) {
          toast(err.message);
        }
      };
    }

    const deleteBtn = $("#delete-item-btn");
    if (deleteBtn) {
      deleteBtn.classList.add("full");
      deleteBtn.style.setProperty("width", "100%", "important");
      deleteBtn.style.setProperty("min-width", "100%", "important");
      deleteBtn.style.setProperty("max-width", "none", "important");
      deleteBtn.style.setProperty("margin", "0", "important");
      deleteBtn.style.setProperty("box-sizing", "border-box", "important");
      deleteBtn.style.setProperty("min-height", "52px", "important");
      deleteBtn.style.setProperty("border-radius", "999px", "important");
      deleteBtn.style.setProperty("display", "flex", "important");
      deleteBtn.style.setProperty("align-items", "center", "important");
      deleteBtn.style.setProperty("justify-content", "center", "important");
      const act = deleteBtn.closest(".public-detail-actions");
      if (act) {
        act.style.setProperty("width", "100%", "important");
        act.style.setProperty("max-width", "100%", "important");
        act.style.setProperty("align-items", "stretch", "important");
        act.style.setProperty("padding", "0", "important");
        act.style.setProperty("margin-left", "0", "important");
        act.style.setProperty("margin-right", "0", "important");
      }
      deleteBtn.onclick = async () => {
        const isPermanent = item.status === "removed";
        const ok = await confirmAction(
          isPermanent ? "Permanently delete" : "Delete report",
          isPermanent
            ? "This permanently deletes the report and related claims from the database. This cannot be undone."
            : "This hides the report from public listings."
        );
        if (!ok) return;
        try {
          let res;
          if (isPermanent) {
            res = await api(`/api/items/${encodeURIComponent(id)}/owner-hide`, { method: "POST", body: {} });
          } else {
            res = await api(`/api/items/${encodeURIComponent(id)}`, { method: "DELETE" });
          }
          toast(res && res.permanent ? "Report permanently deleted." : "Report deleted.");
          if (typeof isSecurityStaff === "function" && isSecurityStaff(state.user)) {
            location.hash = isSecurityHead(state.user)
              ? "#/security-head"
              : "#/sub-security";
          } else {
            location.hash = "#/dashboard/overview";
          }
        } catch (err) {
          toast(err.message || "Unable to delete report.");
        }
      };
    }

    if (securityMode && item.type === "lost") {
      bindSecurityLostCustody(id);
    }

    document.querySelectorAll("select[data-claim]").forEach((sel) => {
      sel.onchange = async () => {
        try {
          await api(`/api/claims/${sel.getAttribute("data-claim")}`, {
            method: "PUT",
            body: { status: sel.value },
          });
          toast("Claim updated.");
          renderItem(id);
        } catch (err) {
          toast(err.message);
        }
      };
    });
  } catch (err) {
    $("#app").innerHTML = `
      <div class="wrap">
        <div class="error-box">${escapeHtml(err.message)}</div>
      </div>
    `;
  }
}

function requireAuth() {
  if (state.user) {
    return true;
  }

  location.hash = "#/login";

  toast("Sign in to continue.");

  return false;
}

function renderReport(query) {
  if (!requireAuth()) return;

  const selected =
    query.type === "found"
      ? "found"
      : "lost";

  $("#app").innerHTML = `
    <div class="wrap report-page">

      <div class="form-card wide report-card">

        <h1 class="page-title">
          Report an item
        </h1>

        <p class="muted mt">
          Use accurate details. Do not include personal contact
          information in the description.
        </p>

        <form
          id="report-form"
          class="mt"
        >

          <div
            class="switch mb"
            role="group"
            aria-label="Report type"
          >

            <button
              type="button"
              data-type="lost"
              class="${selected === "lost"
      ? "active"
      : ""
    }"
            >
              Lost
            </button>

            <button
              type="button"
              data-type="found"
              class="${selected === "found"
      ? "active"
      : ""
    }"
            >
              Found
            </button>

          </div>

          <input
            type="hidden"
            name="type"
            value="${selected}"
          />

          <div class="form-grid">

            <label class="field span-2">
              Item name

              <input
                name="title"
                required
                maxlength="120"
              />

              <span
                class="field-error"
                data-for="title"
              ></span>
            </label>

            <label class="field">
              Category

              <select
                name="category"
                required
              >
                <option value="">
                  Select
                </option>

                ${CATEGORIES.map(
      (c) =>
        `<option>${c}</option>`
    ).join("")}
              </select>
            </label>

            <label class="field">
              Location

              <input
                name="location"
                required
                maxlength="160"
              />
            </label>

            <label class="field">
              Date

              <input
                type="date"
                name="date"
                required
              />
            </label>

            <label class="field">
              Time

              <input
                type="time"
                name="time"
              />
            </label>

            <label class="field span-2">
              Description

              <textarea
                name="description"
                required
                minlength="12"
              ></textarea>
            </label>

            <label class="field span-2">
              Additional identifying details

              <textarea
                name="identifyingDetails"
                placeholder="Serial numbers, engravings, unique marks"
              ></textarea>
            </label>

            <label class="field span-2">
              Image

              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
              />
            </label>

            ${selected === "found" ? `
              <div
                id="found-custody-wrap"
                class="span-2"
              >
                <style>
                  #found-custody-wrap{margin-top:8px;padding:22px;border:1px solid #e5e5e5;border-radius:16px;background:#fafafa;}
                  #found-custody-wrap .found-custody-heading{margin:0 0 6px;font-size:17px;}
                  #found-custody-wrap .found-custody-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 20px;margin-top:18px;}
                  #found-custody-wrap .found-custody-field{display:flex;flex-direction:column;gap:8px;min-width:0;}
                  #found-custody-wrap .found-custody-field input,#found-custody-wrap .found-custody-field select{width:100%;height:50px;box-sizing:border-box;}
                  #found-custody-wrap .found-custody-full{grid-column:1/-1;}
                  @media (max-width:700px){#found-custody-wrap .found-custody-grid{grid-template-columns:1fr;}}
                </style>

                <h3 class="found-custody-heading">Item custody</h3>
                <p class="muted" style="margin:0;">Tell us who currently holds the found item. If it was submitted to Security or a university official, Security will verify it before it becomes public.</p>

                <div class="found-custody-grid">
                  <label class="found-custody-field found-custody-full">
                    Submitted to Security / university official?
                    <select name="foundSubmissionMode" id="found-submission-mode" required>
                      <option value="">Select an option</option>
                      <option value="self">No — I am currently holding the item</option>
                      <option value="security">Yes — Submitted to Security / university official</option>
                    </select>
                  </label>

                  <div id="found-holder-details" class="found-custody-full" style="display:none;">
                    <div class="found-custody-grid" style="margin-top:0;">
                      <label class="found-custody-field">
                        <span id="found-holder-name-label">Officer / Security Name</span>
                        <input name="foundHolderName" id="found-holder-name" maxlength="120" placeholder="Full name" />
                      </label>

                      <label class="found-custody-field">
                        <span>Person type</span>
                        <select name="foundHolderType" id="found-holder-type">
                          <option value="">Select person type</option>
                        </select>
                      </label>

                      <label class="found-custody-field">
                        <span id="found-holder-id-label">ID</span>
                        <input name="foundHolderId" id="found-holder-id" maxlength="80" placeholder="Enter ID" />
                      </label>

                      <label class="found-custody-field" id="found-programme-wrap">
                        Programme / Course
                        <select name="foundProgramme" id="found-programme">
                          <option value="">Select programme</option>
                          ${["B.Tech","BBA","BCA","B.Com","BA","B.Sc","B.Des","LLB","MBA","MCA","M.Tech","M.Sc","MA","LLM","Ph.D.","Other"].map((v)=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("")}
                        </select>
                      </label>

                      <label class="found-custody-field" id="found-department-wrap">
                        Department / Specialization
                        <select name="foundDepartment" id="found-department">
                          <option value="">Select department</option>
                          ${["Computer Science & Engineering","CSE (Artificial Intelligence & Machine Learning)","Electronics & Communication Engineering","Electrical Engineering","Mechanical Engineering","Civil Engineering","Business Administration","Finance","Marketing","Human Resources","Business Analytics","Operations","Design","Law","Sciences","Other"].map((v)=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("")}
                        </select>
                      </label>

                      <label class="found-custody-field" id="found-year-wrap">
                        Year
                        <select name="foundYear" id="found-year">
                          <option value="">Select year</option>
                          ${["1st Year","2nd Year","3rd Year","4th Year","5th Year","Other"].map((v)=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("")}
                        </select>
                      </label>

                      <label class="found-custody-field" id="found-role-wrap">
                        Role / Position
                        <select name="foundRole" id="found-role">
                          <option value="">Select role</option>
                          ${["Professor / Faculty", "Lecturer", "Assistant Professor", "Associate Professor", "Administrative Staff", "Receptionist", "Finance / Accounts", "HR", "IT / Technical Support", "Security", "Housekeeping / Cleaning", "Library Staff", "Lab Staff", "Admissions", "Student Affairs", "Management", "Other"].map((v)=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("")}
                        </select>
                      </label>

                      <label class="found-custody-field" id="found-work-wrap">
                        <span id="found-work-label">Department / Area</span>
                        <select name="foundWorkDepartment" id="found-workDepartment">
                          <option value="">Select department / area</option>
                          ${["Administration","Finance / Accounts","HR","Admissions","Academic Affairs","Computer / IT","Library","Security","Student Affairs","Examinations","Hostel","Transport","Facilities","Maintenance","Housekeeping / Cleaning","Reception","Other"].map((v)=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("")}
                        </select>
                      </label>

                      <label class="found-custody-field">
                        Handover / custody date
                        <input type="date" name="foundHandoverDate" id="found-handover-date" />
                      </label>

                      <label class="found-custody-field">
                        Handover / custody time
                        <input type="time" name="foundHandoverTime" id="found-handover-time" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ` : ""}

          </div>

          <p
            id="report-error"
            class="field-error"
          ></p>

          <button
            class="btn mt report-submit"
            type="submit"
          >
            ${selected === "found" ? "Submit found report" : "Publish report"}
          </button>

        </form>

      </div>

    </div>
  `;

  document
    .querySelectorAll(".switch button")
    .forEach((btn) => {
      btn.onclick = () => {
        const nextType = btn.getAttribute("data-type");
        if (nextType === selected) return;
        location.hash = `#/report?type=${nextType}`;
      };
    });

  if (selected === "found") {
    const mode = $("#found-submission-mode");
    const detailsWrap = $("#found-holder-details");
    const holderName = $("#found-holder-name");
    const holderType = $("#found-holder-type");
    const holderId = $("#found-holder-id");
    const holderIdLabel = $("#found-holder-id-label");
    const programmeWrap = $("#found-programme-wrap");
    const departmentWrap = $("#found-department-wrap");
    const yearWrap = $("#found-year-wrap");
    const roleWrap = $("#found-role-wrap");
    const workWrap = $("#found-work-wrap");
    const programme = $("#found-programme");
    const department = $("#found-department");
    const year = $("#found-year");
    const role = $("#found-role");
    const workDepartment = $("#found-workDepartment");
    const workLabel = $("#found-work-label");
    const handoverDate = $("#found-handover-date");
    const handoverTime = $("#found-handover-time");
    const submitButton = document.querySelector("#report-form button[type=submit]");

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    if (holderName && state.user && state.user.name) {
      holderName.value = state.user.name;
    }
    if (handoverDate) handoverDate.value = today;
    if (handoverTime) handoverTime.value = currentTime;

    const securityAreas = [
      "Lost & Found Desk",
      "Main Gate Security",
      "North Gate Security",
      "South Gate Security",
      "Security Office",
      "Security Control Room",
      "Campus Security",
      "Other",
    ];
    const employeeDepartments = [
      "Administration", "Finance / Accounts", "HR", "Admissions", "Academic Affairs",
      "Computer / IT", "Library", "Security", "Student Affairs", "Examinations",
      "Hostel", "Transport", "Facilities", "Maintenance", "Housekeeping / Cleaning",
      "Reception", "Other",
    ];

    const syncFoundCustodyFields = () => {
      const isSelf = mode && mode.value === "self";
      const isSecurity = mode && mode.value === "security";
      const visible = isSelf || isSecurity;

      if (detailsWrap) detailsWrap.style.display = visible ? "block" : "none";
      if (submitButton) {
        submitButton.textContent = isSecurity
          ? "Submit for Security verification"
          : isSelf
            ? "Publish found item"
            : "Submit found report";
      }

      if (holderType) {
        const currentType = holderType.value;
        const options = isSecurity
          ? [
              ["", "Select person type"],
              ["employee", "Employee"],
              ["security", "Security Personnel"],
            ]
          : [
              ["", "Select person type"],
              ["student", "Student"],
              ["employee", "Employee"],
            ];
        holderType.innerHTML = options
          .map(([value, label]) => `<option value="${value}" ${value === currentType ? "selected" : ""}>${label}</option>`)
          .join("");
        if (isSelf && state.user && ["student", "employee"].includes(String(state.user.userType || ""))) {
          holderType.value = state.user.userType;
        }
      }

      const personType = holderType ? holderType.value : "";
      const isStudent = isSelf && personType === "student";
      const isEmployee = personType === "employee";
      const isSecurityPerson = isSecurity && personType === "security";

      if (workLabel) workLabel.textContent = isSecurity ? "Security Department / Area" : "Department / Area";

      if (workDepartment) {
        const currentDepartment = workDepartment.value;
        const optionsList = isSecurity ? securityAreas : employeeDepartments;
        workDepartment.innerHTML = `<option value="">Select department / area</option>${optionsList.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")}`;
        if (optionsList.includes(currentDepartment)) workDepartment.value = currentDepartment;
      }

      if (roleWrap) roleWrap.style.display = isSelf && isEmployee ? "flex" : "none";

      if (holderIdLabel) {
        holderIdLabel.textContent =
          isStudent ? "Enrollment Number" :
            isSecurityPerson ? "Security ID" :
              isEmployee ? "Employee ID" : "ID";
      }

      if (programmeWrap) programmeWrap.style.display = isStudent ? "flex" : "none";
      if (departmentWrap) departmentWrap.style.display = isStudent ? "flex" : "none";
      if (yearWrap) yearWrap.style.display = isStudent ? "flex" : "none";
      if (workWrap) workWrap.style.display = (isEmployee || isSecurityPerson) ? "flex" : "none";

      if (holderName) holderName.required = visible;
      if (holderType) holderType.required = visible;
      if (holderId) holderId.required = visible;
      if (programme) programme.required = isStudent;
      if (department) department.required = isStudent;
      if (year) year.required = isStudent;
      if (role) role.required = isSelf && isEmployee;
      if (workDepartment) workDepartment.required = isEmployee || isSecurityPerson;
      if (handoverDate) handoverDate.required = visible;
      if (handoverTime) handoverTime.required = visible;
    };

    syncFoundCustodyFields();
    if (mode) mode.onchange = syncFoundCustodyFields;
    if (holderType) holderType.onchange = syncFoundCustodyFields;
  }

  $("#report-form").onsubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const errBox = $("#report-error");

    errBox.textContent = "";

    const title =
      form.title.value.trim();

    const description =
      form.description.value.trim();

    if (title.length < 3) {
      errBox.textContent =
        "Enter a clearer item name.";

      return;
    }

    if (description.length < 12) {
      errBox.textContent =
        "Describe the item in at least 12 characters.";

      return;
    }

    const fd = new FormData(form);

    if (selected === "found") {
      const mode = String(fd.get("foundSubmissionMode") || "").trim();
      const personType = String(fd.get("foundHolderType") || "").trim();
      const details = {
        name: String(fd.get("foundHolderName") || "").trim(),
        personType,
        idNumber: String(fd.get("foundHolderId") || "").trim(),
        programme: String(fd.get("foundProgramme") || "").trim(),
        department: String(fd.get("foundDepartment") || "").trim(),
        year: String(fd.get("foundYear") || "").trim(),
        role: String(fd.get("foundRole") || "").trim(),
        workDepartment: String(fd.get("foundWorkDepartment") || "").trim(),
        handoverDate: String(fd.get("foundHandoverDate") || "").trim(),
        handoverTime: String(fd.get("foundHandoverTime") || "").trim(),
      };

      if (!["self", "security"].includes(mode)) {
        errBox.textContent = "Please select who currently holds the found item.";
        return;
      }

      if (!details.name || !personType || !details.idNumber || !details.handoverDate || !details.handoverTime) {
        errBox.textContent = "Please complete all custody details.";
        return;
      }

      if (mode === "self" && !["student", "employee"].includes(personType)) {
        errBox.textContent = "Please select Student or Employee.";
        return;
      }

      if (mode === "security" && !["employee", "security"].includes(personType)) {
        errBox.textContent = "Please select Employee or Security Personnel.";
        return;
      }

      if (mode === "self" && personType === "student" && (!details.programme || !details.department || !details.year)) {
        errBox.textContent = "Please complete the student programme, department, and year.";
        return;
      }

      if (["employee", "security"].includes(personType) && !details.workDepartment) {
        errBox.textContent = "Please select the department / area.";
        return;
      }

      fd.set("foundSubmissionMode", mode);
      fd.set("foundHolderDetails", JSON.stringify(details));
      fd.delete("foundHolderName");
      fd.delete("foundHolderType");
      fd.delete("foundHolderId");
      fd.delete("foundProgramme");
      fd.delete("foundDepartment");
      fd.delete("foundYear");
      fd.delete("foundRole");
      fd.delete("foundWorkDepartment");
      fd.delete("foundHandoverDate");
      fd.delete("foundHandoverTime");
    }

    const btn =
      form.querySelector(
        "button[type=submit]"
      );

    btn.disabled = true;

    try {
      const data = await api(
        "/api/items",
        {
          method: "POST",
          body: fd,
        }
      );

      if (selected === "found") {
        const mode = fd.get("foundSubmissionMode");
        toast(
          mode === "security"
            ? "Found item submitted for Security verification."
            : "Found item published successfully."
        );
      } else {
        toast("Report published.");
      }

      location.hash =
        selected === "found" && fd.get("foundSubmissionMode") === "security"
          ? (isSecurityStaff(state.user) ? getDashboardRoute(state.user) + "/verifications" : "#/dashboard/verifications")
          : `#/item/${data.item._id}`;
    } catch (err) {
      btn.disabled = false;
      errBox.textContent =
        err.message;
    }
  };

}

function renderAuth(mode) {
  const isLogin = mode === "login";

  if (state.user) {
    location.hash =
      getDashboardRoute(state.user);

    return;
  }

  $("#app").innerHTML = `
    <div class="auth-layout">

      <div class="auth-card">

        <h1 class="page-title">
          ${isLogin
      ? "Welcome back"
      : "Create an account"
    }
        </h1>

        <p class="muted mt">
          ${isLogin
      ? "Sign in  or Register to access your portal,"
      : "Register with your Bennett email to report items and submit claims."
    }
        </p>

        <form
          id="auth-form"
          class="mt"
        >

          ${isLogin
      ? ""
      : `
                <label class="field">
                  Name

                  <input
                    name="name"
                    id="auth-name"
                    required
                    maxlength="80"
                    placeholder="Full Name"
                  />
                </label>

                <label class="field mt">
                  I am a

                  <select
                    name="userType"
                    id="auth-userType"
                    required
                  >
                    <option value="">
                      Select your role
                    </option>

                    <option value="student">
                      Student
                    </option>

                    <option value="employee">
                      Employee
                    </option>
                  </select>
                </label>
              `
    }

          <label class="field mt">
            Email

            <input
              type="email"
              name="email"
              id="auth-email"
              required
              placeholder="${isLogin
      ? "Enter your account email"
      : "name@bennett.edu.in"
    }"
            />

            ${!isLogin
      ? `
                  <small
                    class="muted"
                    style="
                      display:block;
                      margin-top:4px;
                      font-size:12px;
                    "
                  >
                    Only @bennett.edu.in email addresses are permitted
                  </small>
                `
      : ""
    }

          </label>

          <label class="field mt">
            Password

            <input
              type="password"
              name="password"
              id="auth-password"
              required
              minlength="8"
              placeholder="••••••••"
            />
          </label>

          ${isLogin
      ? ""
      : `
                <label class="field mt">
                  Confirm password

                  <input
                    type="password"
                    name="confirmPassword"
                    id="auth-confirmPassword"
                    required
                    minlength="8"
                    placeholder="••••••••"
                  />
                </label>
              `
    }

          <p
            id="auth-error"
            class="field-error"
          ></p>

          <button
            class="btn full mt"
            type="submit"
          >
            ${isLogin ? "Login" : "Register"}
          </button>

        </form>

        <p class="muted mt">
  ${isLogin
      ? `No Account ? <a href="#/register">Register</a>`
      : `Already Registered ? <a href="#/login">Login</a>`
    }
</p>

    </div>
  `;

  $("#auth-form").onsubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const fd = new FormData(form);
    const body =
      Object.fromEntries(fd.entries());

    const errBox =
      $("#auth-error");

    const btn =
      form.querySelector(
        "button[type=submit]"
      );

    errBox.textContent = "";

    if (!isLogin) {
      const cleanName =
        String(body.name || "").trim();

      const cleanEmail =
        String(body.email || "")
          .toLowerCase()
          .trim();

      if (cleanName.length < 2) {
        errBox.textContent =
          "Please enter your full name.";

        return;
      }

      if (
        !cleanEmail.endsWith(
          "@bennett.edu.in"
        )
      ) {
        errBox.textContent =
          "Only @bennett.edu.in email addresses are allowed to register.";

        return;
      }

      if (
        !["student", "employee"].includes(
          body.userType
        )
      ) {
        errBox.textContent =
          "Please select whether you are a Student or an Employee.";

        return;
      }

      if (
        body.password !==
        body.confirmPassword
      ) {
        errBox.textContent =
          "Passwords do not match.";

        return;
      }

      body.name = cleanName;
      body.email = cleanEmail;
    } else {
      body.email =
        String(body.email || "")
          .toLowerCase()
          .trim();

      if (!body.email) {
        errBox.textContent =
          "Please enter your email address.";

        return;
      }

      if (!body.password) {
        errBox.textContent =
          "Please enter your password.";

        return;
      }
    }

    btn.disabled = true;

    const originalText =
      btn.textContent;

    btn.textContent = isLogin
      ? "Signing in…"
      : "Creating account…";

    try {
      const data = await api(
        isLogin
          ? "/api/auth/login"
          : "/api/auth/register",
        {
          method: "POST",
          body,
        }
      );

      if (!data.token || !data.user) {
        throw new Error(
          "Login response was incomplete. Please try again."
        );
      }

      const role =
        getEffectiveRole(data.user);

      if (
        ![
          "user",
          "sub_security",
          "security_head",
        ].includes(role)
      ) {
        throw new Error(
          "Your account does not have a valid access level."
        );
      }

      setSession(
        data.token,
        {
          ...data.user,
          role,
        }
      );

      renderNav();

      toast(
        isLogin
          ? "Signed in successfully."
          : "Account created successfully."
      );

      location.hash =
        getDashboardRoute(
          state.user
        );
    } catch (err) {
      btn.disabled = false;
      btn.textContent =
        originalText;

      errBox.textContent =
        err.message;
    }
  };
}

function renderAbout() {
  $("#app").innerHTML = `
    <div class="wrap">

      <h1 class="page-title">
        About
      </h1>

      <p
        class="lead muted mt"
        style="max-width:640px"
      >
        Lost &amp; Found helps people report missing and recovered items,
        verify custody, and complete claims without publishing personal
        contact data.
      </p>

      <div class="steps mt">

        <article
          class="panel"
          style="padding:24px"
        >
          <h3>
            Private by default
          </h3>

          <p class="muted">
            Only first names appear on public reports.
          </p>
        </article>

        <article
          class="panel"
          style="padding:24px"
        >
          <h3>
            Simple matching
          </h3>

          <p class="muted">
            Category, location, date, and shared keywords.
          </p>
        </article>

        <article
          class="panel"
          style="padding:24px"
        >
          <h3>
            Human review
          </h3>

          <p class="muted">
            Owners and admins review claims before a return is completed.
          </p>
        </article>

      </div>

    </div>

    ${footer()}
  `;
}

function miniList(items, empty) {
  if (!items.length) {
    return `<div class="empty">${empty}</div>`;
  }

  return `
    <div class="grid">
      ${items
      .slice(0, 6)
      .map(itemCard)
      .join("")}
    </div>
  `;
}


async function renderItemVerificationsPage(view) {
  if (!requireAuth()) return;

  const role = getEffectiveRole(state.user);
  const securityView = view === "security";
  const allowed = securityView
    ? ["security_head", "sub_security"].includes(role)
    : ["user", "security_head", "sub_security"].includes(role);

  if (!allowed) {
    $("#app").innerHTML = `
      <div class="wrap">
        <div class="error-box">Access required.</div>
      </div>
    `;
    return;
  }

  const backRoute = securityView
    ? (role === "security_head" ? "#/security-head" : "#/sub-security")
    : "#/dashboard";

  const backLabel = securityView ? "Security Dashboard" : "Dashboard";

  $("#app").innerHTML = `
    <div class="wrap verification-page">
      <style>
        .verification-page{max-width:1180px;padding-top:18px;padding-bottom:48px;}
        .verification-hero{position:relative;overflow:hidden;border:1px solid #e7e7e7;border-radius:28px;background:#fff;padding:30px 32px;margin-bottom:20px;box-shadow:0 18px 50px rgba(0,0,0,.06);}
        .verification-hero:after{content:"";position:absolute;width:260px;height:260px;border:1px solid #ededed;border-radius:50%;right:-120px;top:-120px;pointer-events:none;}
        .verification-back{display:inline-flex;align-items:center;gap:8px;text-decoration:none;font-size:13px;font-weight:700;color:#666;margin-bottom:22px;}
        .verification-back:hover{color:#111;}
        .verification-eyebrow{margin:0 0 8px;font-size:11px;letter-spacing:.16em;font-weight:800;color:#777;}
        .verification-title{margin:0;font-size:34px;line-height:1.08;letter-spacing:-.04em;color:#111;}
        .verification-subtitle{max-width:760px;margin:12px 0 0;color:#666;font-size:15px;line-height:1.65;}
        .verification-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:26px;}
        .verification-stat{border:1px solid #e8e8e8;border-radius:18px;padding:17px 18px;background:#fafafa;}
        .verification-stat b{display:block;font-size:27px;line-height:1;margin-bottom:7px;letter-spacing:-.03em;}
        .verification-stat span{font-size:12px;color:#707070;font-weight:700;}
        .verification-toolbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:0 0 16px;}
        .verification-search{flex:1 1 300px;min-width:220px;height:48px;border:1px solid #ddd;border-radius:14px;padding:0 16px;box-sizing:border-box;background:#fff;font:inherit;outline:none;}
        .verification-search:focus{border-color:#111;box-shadow:0 0 0 3px rgba(0,0,0,.06);}
        .verification-filters{display:flex;gap:8px;flex-wrap:wrap;}
        .verification-filter{height:42px;padding:0 14px;border:1px solid #ddd;border-radius:12px;background:#fff;color:#555;font-weight:700;cursor:pointer;}
        .verification-filter.active{background:#111;color:#fff;border-color:#111;}
        .verification-list{display:grid;gap:12px;}
        .verification-card{border:1px solid #e7e7e7;border-radius:20px;background:#fff;overflow:hidden;box-shadow:0 8px 26px rgba(0,0,0,.04);transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease;}
        .verification-card:hover{transform:translateY(-1px);box-shadow:0 14px 34px rgba(0,0,0,.07);border-color:#d9d9d9;}
        .verification-card-main{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:20px;padding:22px 24px;align-items:center;}
        .verification-item-title{margin:0;font-size:18px;letter-spacing:-.02em;}
        .verification-item-title a{color:#111;text-decoration:none;}
        .verification-item-title a:hover{text-decoration:underline;}
        .verification-meta{display:flex;flex-wrap:wrap;gap:7px 16px;margin-top:9px;color:#6d6d6d;font-size:13px;}
        .verification-meta strong{color:#222;}
        .verification-badge{display:inline-flex;align-items:center;gap:7px;width:max-content;padding:7px 10px;border-radius:999px;background:#f2f2f2;color:#222;font-size:11px;font-weight:800;}
        .verification-badge.pending{background:#111;color:#fff;}
        .verification-badge.rejected{background:#ededed;color:#555;}
        .verification-card-side{display:flex;align-items:center;gap:10px;justify-content:flex-end;}
        .verification-action{display:inline-flex;align-items:center;justify-content:center;height:42px;padding:0 15px;border-radius:12px;background:#111;color:#fff;text-decoration:none;font-size:13px;font-weight:800;white-space:nowrap;}
        .verification-action.secondary{background:#fff;color:#111;border:1px solid #ddd;}
        .verification-details{border-top:1px solid #ededed;background:#fafafa;padding:14px 24px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px 18px;}
        .verification-detail-label{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#888;font-weight:800;}
        .verification-detail-value{margin-top:4px;font-size:13px;color:#222;font-weight:700;word-break:break-word;}
        .verification-empty{border:1px dashed #d8d8d8;border-radius:20px;padding:52px 24px;text-align:center;background:#fff;}
        .verification-empty-icon{width:48px;height:48px;border:1px solid #ddd;border-radius:16px;display:grid;place-items:center;margin:0 auto 14px;font-size:20px;}
        .verification-empty h3{margin:0 0 7px;font-size:17px;}
        .verification-empty p{margin:0;color:#777;font-size:13px;}
        .verification-note{margin-top:8px;font-size:12px;color:#777;}
        @media(max-width:850px){.verification-stats{grid-template-columns:repeat(2,minmax(0,1fr));}.verification-card-main{grid-template-columns:1fr;}.verification-card-side{justify-content:flex-start;}.verification-details{grid-template-columns:repeat(2,minmax(0,1fr));}}
        @media(max-width:560px){.verification-hero{padding:23px 20px;border-radius:22px;}.verification-title{font-size:28px;}.verification-stats{grid-template-columns:1fr 1fr;}.verification-details{grid-template-columns:1fr;}.verification-card-main{padding:18px;}.verification-details{padding:14px 18px;}}
      </style>

      <section class="verification-hero">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;">
          <div style="min-width:0;flex:1;">
            <a class="verification-back" href="${backRoute}">← ${backLabel}</a>
            <p class="verification-eyebrow">FOUND ITEMS · ${securityView ? "SECURITY DESK" : "MY REPORTS"}</p>
            <h1 class="verification-title">Item Verifications</h1>
            <p class="verification-subtitle">
              ${securityView
                ? "Review every found-item submission, verify items handed to Security or a university official, and control when they become visible in the public Found Items list."
                : "Track every found item you submitted, including reports waiting for Security verification and items that are already live."
              }
            </p>
          </div>
          ${securityView ? `
            <a class="btn" href="${role === "security_head" ? "#/security-head/submitted-claims" : "#/sub-security/submitted-claims"}" style="flex-shrink:0;white-space:nowrap;border-radius:999px;padding:12px 20px;font-weight:700;">
              Submitted Claims
            </a>
          ` : ""}
        </div>
        <div class="verification-stats" id="verification-stats"></div>
      </section>

      <section>
        <div class="verification-toolbar">
          <input id="verification-search" class="verification-search" type="search" placeholder="Search by item, person, location or category…" autocomplete="off" />
          <div class="verification-filters" id="verification-filters"></div>
        </div>
        <div id="verification-list" class="verification-list">
          <div class="verification-empty"><div class="verification-empty-icon">…</div><h3>Loading verifications</h3><p>Please wait while the records are loaded.</p></div>
        </div>
      </section>
    </div>
  `;

  try {
    const endpoint = securityView
      ? "/api/items?type=found&limit=100&includeUnverified=true"
      : "/api/items?type=found&mine=true&limit=100";
    const data = await api(endpoint);
    const items = Array.isArray(data.items) ? data.items.filter((item) => item.status !== "removed") : [];
    let activeFilter = "all";

    const getStatusKey = (item) => {
      const mode = String(item?.foundCustody?.mode || "").toLowerCase();
      const status = String(item?.foundCustody?.verificationStatus || "").toLowerCase();
      if (mode === "security" && status === "pending") return "pending";
      if (mode === "security" && status === "verified") return "verified";
      if (mode === "security" && status === "rejected") return "rejected";
      if (mode === "self") return "self";
      return "other";
    };

    const counts = {
      all: items.length,
      pending: items.filter((item) => getStatusKey(item) === "pending").length,
      verified: items.filter((item) => getStatusKey(item) === "verified").length,
      self: items.filter((item) => getStatusKey(item) === "self").length,
      rejected: items.filter((item) => getStatusKey(item) === "rejected").length,
    };

    $("#verification-stats").innerHTML = securityView
      ? `
        <div class="verification-stat"><b>${counts.all}</b><span>All found records</span></div>
        <div class="verification-stat"><b>${counts.pending}</b><span>Waiting for verification</span></div>
        <div class="verification-stat"><b>${counts.verified}</b><span>Verified &amp; live</span></div>
        <div class="verification-stat"><b>${counts.rejected}</b><span>Not verified</span></div>
      `
      : `
        <div class="verification-stat"><b>${counts.all}</b><span>My found reports</span></div>
        <div class="verification-stat"><b>${counts.pending}</b><span>Waiting for Security</span></div>
        <div class="verification-stat"><b>${counts.verified}</b><span>Verified &amp; live</span></div>
        <div class="verification-stat"><b>${counts.self}</b><span>Live by self custody</span></div>
      `;

    const filterDefs = securityView
      ? [
          ["all", "All"],
          ["pending", "Pending"],
          ["verified", "Verified"],
          ["rejected", "Not Verified"],
          ["self", "Self Custody"],
        ]
      : [
          ["all", "All"],
          ["pending", "Pending"],
          ["verified", "Verified"],
          ["rejected", "Not Verified"],
          ["self", "Self Custody"],
        ];

    $("#verification-filters").innerHTML = filterDefs.map(([id, label]) => `
      <button type="button" class="verification-filter ${id === "all" ? "active" : ""}" data-verification-filter="${id}">${label}</button>
    `).join("");

    const statusBadge = (item) => {
      const key = getStatusKey(item);
      const label = foundVerificationLabel(item);
      return `<span class="verification-badge ${key === "pending" ? "pending" : key === "rejected" ? "rejected" : ""}">${escapeHtml(label)}</span>`;
    };

    const holderText = (item) => {
      const holder = item?.foundCustody?.holderDetails || {};
      const mode = String(item?.foundCustody?.mode || "").toLowerCase();
      if (mode === "security") return holder.name || "Security / Official";
      if (mode === "self") return holder.name || item?.user?.name || "Reporting user";
      return "—";
    };

    const renderList = () => {
      const query = String($("#verification-search")?.value || "").trim().toLowerCase();
      const visible = items.filter((item) => {
        const statusMatch = activeFilter === "all" || getStatusKey(item) === activeFilter;
        if (!statusMatch) return false;
        const holder = item?.foundCustody?.holderDetails || {};
        const haystack = [item.title, item.category, item.location, item.description, item.user?.name, holder.name, holder.workDepartment].join(" ").toLowerCase();
        return !query || haystack.includes(query);
      });

      visible.sort((a, b) => {
        const rank = (item) => getStatusKey(item) === "pending" ? 0 : getStatusKey(item) === "verified" ? 1 : getStatusKey(item) === "rejected" ? 2 : 3;
        return rank(a) - rank(b) || new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0);
      });

      if (!visible.length) {
        $("#verification-list").innerHTML = `
          <div class="verification-empty">
            <div class="verification-empty-icon">✓</div>
            <h3>No matching verification records</h3>
            <p>${query ? "Try a different search or filter." : securityView ? "There are no found-item verification records yet." : "You have not submitted any found items yet."}</p>
          </div>
        `;
        return;
      }

      $("#verification-list").innerHTML = visible.map((item) => {
        const custody = item.foundCustody || {};
        const holder = custody.holderDetails || {};
        const mode = String(custody.mode || "").toLowerCase();
        const key = getStatusKey(item);
        const isPending = key === "pending";
        const staffBase = role === "sub_security" ? "#/sub-security" : "#/security-head";
        const detailHref = securityView ? `${staffBase}/item/${item.id || item._id}` : `#/item/${item.id || item._id}`;
        const submittedTo = mode === "security" ? "Security / University Official" : mode === "self" ? "Self Custody" : "—";
        const collectFrom = holderText(item);
        const verifiedBy = custody.verifiedByName || "—";
        const action = securityView && isPending
          ? `<a class="verification-action" href="${detailHref}">Review &amp; Verify</a>`
          : `<a class="verification-action secondary" href="${detailHref}">View Details</a>`;

        return `
          <article class="verification-card">
            <div class="verification-card-main">
              <div>
                ${statusBadge(item)}
                <h3 class="verification-item-title" style="margin-top:10px;"><a href="${detailHref}">${escapeHtml(item.title || "Untitled item")}</a></h3>
                <div class="verification-meta">
                  <span><strong>${escapeHtml(item.category || "—")}</strong></span>
                  <span>${escapeHtml(item.location || "—")}</span>
                  <span>${escapeHtml(formatDateTime(item.date, item.time))}</span>
                  ${securityView ? `<span>Reported by <strong>${escapeHtml(item.user?.name || "—")}</strong></span>` : ""}
                </div>
              </div>
              <div class="verification-card-side">${action}</div>
            </div>
            <div class="verification-details">
              <div><div class="verification-detail-label">Submitted To</div><div class="verification-detail-value">${escapeHtml(submittedTo)}</div></div>
              <div><div class="verification-detail-label">Collect From</div><div class="verification-detail-value">${escapeHtml(collectFrom)}</div></div>
              <div><div class="verification-detail-label">${securityView ? "Verification" : "Current State"}</div><div class="verification-detail-value">${escapeHtml(foundVerificationLabel(item))}</div></div>
              <div><div class="verification-detail-label">${key === "verified" ? "Verified By" : "Custody Date"}</div><div class="verification-detail-value">${escapeHtml(key === "verified" ? verifiedBy : holder.handoverDate || formatDate(item.date))}</div></div>
            </div>
            ${custody.verificationNote ? `<div class="verification-note" style="padding:0 24px 16px;">Security note: ${escapeHtml(custody.verificationNote)}</div>` : ""}
          </article>
        `;
      }).join("");
    };

    $("#verification-search").addEventListener("input", renderList);
    document.querySelectorAll("[data-verification-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.getAttribute("data-verification-filter") || "all";
        document.querySelectorAll("[data-verification-filter]").forEach((btn) => btn.classList.toggle("active", btn === button));
        renderList();
      });
    });

    renderList();
  } catch (err) {
    $("#verification-list").innerHTML = `
      <div class="verification-empty">
        <div class="verification-empty-icon">!</div>
        <h3>Unable to load verifications</h3>
        <p>${escapeHtml(err.message || "Please try again.")}</p>
      </div>
    `;
  }
}



async function showSecurityItemActions(itemId) {
  if (!itemId) return;

  try {
    const data = await api(`/api/items/${encodeURIComponent(itemId)}`);
    const item = data.item || data;

    openModal(
      "Manage report",
      `
        <div class="management-panel">
          <h3>${escapeHtml(item.title || item.name || "Item")}</h3>
          <p>Choose an action for this report.</p>
          <div class="modal-actions">
            <button type="button" class="button button-light" data-security-status="resolved" data-item-id="${escapeHtml(itemId)}">
              Mark resolved
            </button>
            <button type="button" class="button button-light" data-security-status="closed" data-item-id="${escapeHtml(itemId)}">
              Close report
            </button>
            <button type="button" class="button button-dark" data-close-modal>
              Cancel
            </button>
          </div>
        </div>
      `
    );
  } catch (error) {
    toast(error.message || "Unable to load report.");
  }
}

// Restored legacy Security Item Verifications management actions.
document.addEventListener("click", async (event) => {
  const manageButton = event.target.closest("[data-security-manage]");
  if (manageButton) {
    const role = getEffectiveRole(state.user);
    if (role !== "security_head" && role !== "sub_security") {
      toast("Security access required.");
      return;
    }
    await showSecurityItemActions(manageButton.getAttribute("data-security-manage"));
    return;
  }

  const actionButton = event.target.closest("[data-security-status]");
  if (!actionButton) return;

  const itemId = actionButton.getAttribute("data-item-id");
  const status = actionButton.getAttribute("data-security-status");
  if (!itemId || !["resolved", "closed"].includes(status)) return;

  try {
    await api(`/api/items/${encodeURIComponent(itemId)}`, {
      method: "PUT",
      body: { status },
    });
    closeModal();
    toast(`Report marked as ${status}.`);
    const hash = window.location.hash;
    if (hash.includes("/security-head/")) {
      await renderSecurityHead("verifications");
    } else if (hash.includes("/sub-security/")) {
      await renderSubSecurity("verifications");
    }
  } catch (error) {
    toast(error.message || "Unable to update report.");
  }
});

async function renderDashboard(tab) {
  if (!requireAuth()) return;

  const role =
    getEffectiveRole(state.user);

  if (role === "security_head") {
    return renderSecurityHead(tab);
  }

  if (role === "sub_security") {
    return renderSubSecurity(tab);
  }

  $("#app").innerHTML = `
    <div class="wrap">
      <p class="loading">
        Loading dashboard…
      </p>
    </div>
  `;

  try {
    const data = await api(
      "/api/users/me/dashboard"
    );

    const current =
      tab || "overview";

    if (current === "verifications") {
      return renderItemVerificationsPage("user");
    }

    const tabs = [
      ["overview", "Overview"],
      ["lost", "My Lost Reports"],
      ["found", "My Found Reports"],
      ["verifications", "Item Verifications"],
      ["claims", "My Claims"],
      ["notifications", "Notifications"],
      ["profile", "Profile"],
    ];

    let body = "";

    if (current === "overview") {
      body = `
        <div class="stats">

          <div class="stat">
            <b>${data.stats.lostReports}</b>
            Lost Reports
          </div>

          <div class="stat">
            <b>${data.stats.foundReports}</b>
            Found Reports
          </div>

          <div class="stat">
            <b>${data.stats.activeClaims}</b>
            Active Claims
          </div>

          <div class="stat">
            <b>${data.stats.resolvedItems}</b>
            Resolved Items
          </div>

        </div>

        <h3>
          Recent lost reports
        </h3>

        ${miniList(
        data.lostReports,
        "You have not reported a lost item."
      )}

        <h3 class="mt">
          Recent found reports
        </h3>

        ${miniList(
        data.foundReports,
        "You have not reported a found item."
      )}
      `;
    } else if (current === "lost") {
      body = miniList(
        data.lostReports,
        "No lost reports yet."
      );
    } else if (current === "found") {
      body = miniList(
        data.foundReports,
        "No found reports yet."
      );
    } else if (current === "verifications") {
      const verificationItems = Array.isArray(data.foundReports)
        ? data.foundReports
        : [];

      body = verificationItems.length
        ? `
          <div class="section-heading-inline">
            <div>
              <p class="eyebrow">FOUND ITEMS</p>
              <h2>Item Verifications</h2>
              <p class="muted">Track whether each found-item report is live or waiting for Security verification.</p>
            </div>
          </div>

          <div class="table-wrap panel">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Verification</th>
                  <th>Submitted To</th>
                  <th>Date &amp; Time</th>
                </tr>
              </thead>
              <tbody>
                ${verificationItems.map((item) => {
                  const mode = String(item?.foundCustody?.mode || "").toLowerCase();
                  const status = foundVerificationLabel(item);
                  const submittedTo = mode === "security" ? "Security / Official" : mode === "self" ? "Self" : "—";
                  return `
                    <tr>
                      <td><a href="#/item/${item.id || item._id}"><strong>${escapeHtml(item.title || "Untitled item")}</strong></a></td>
                      <td>${escapeHtml(status)}</td>
                      <td>${escapeHtml(submittedTo)}</td>
                      <td>${escapeHtml(formatDateTime(item.date, item.time))}</td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        `
        : `
          <div class="empty">
            You have not submitted any found items yet.
          </div>
        `;
    } else if (current === "claims") {
      body = data.claims.length
        ? `
          <div class="table-wrap panel">

            <table>

              <thead>
                <tr>
                  <th>Item</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>

              <tbody>

                ${data.claims
          .map(
            (c) => `
                      <tr>

                        <td>
                          <a
                            href="#/item/${c.item &&
              (c.item._id ||
                c.item)
              }"
                          >
                            ${escapeHtml(
                (c.item &&
                  c.item.title) ||
                "Item"
              )
              }
                          </a>
                        </td>

                        <td>
                          ${escapeHtml(
                statusLabel(
                  c.status
                )
              )}
                        </td>

                        <td>
                          ${formatDate(
                c.createdAt
              )}
                        </td>

                      </tr>
                    `
          )
          .join("")}

              </tbody>

            </table>

          </div>
        `
        : `
          <div class="empty">
            You have not submitted any claims.
          </div>
        `;
    } else if (current === "notifications") {
      body = `
        <div class="hero-actions mb">

          <button
            class="btn secondary"
            id="read-all"
            type="button"
          >
            Mark all read
          </button>

        </div>

        <div class="panel">

          ${data.notifications.length
          ? data.notifications
            .map(
              (n) => `
                      <article
                        class="note ${n.read
                  ? ""
                  : "unread"
                }"
                      >

                        <p>
                          ${escapeHtml(
                  n.message
                )}
                        </p>

                        <p class="meta">

                          ${formatDate(
                  n.createdAt
                )}

                          ·

                          ${escapeHtml(
                  n.type
                )}

                          ${n.link
                  ? ` · <a href="${escapeHtml(
                    n.link
                  )}">
                                  Open
                                </a>`
                  : ""
                }

                          ${n.read
                  ? ""
                  : ` · <button
                                  class="linkish"
                                  data-read="${n._id}"
                                  type="button"
                                >
                                  Mark read
                                </button>`
                }

                        </p>

                      </article>
                    `
            )
            .join("")
          : `<div class="empty">
                  No notifications yet.
                </div>`
        }

        </div>
      `;
    } else {
      body = `
        <form
          id="profile-form"
          class="form-card"
        >

          <label class="field">
            Name

            <input
              name="name"
              value="${escapeHtml(
        state.user.name
      )}"
              required
            />
          </label>

          <label class="field mt">
            Email

            <input
              value="${escapeHtml(
        state.user.email
      )}"
              disabled
            />
          </label>

          <label class="field mt">
            Current password

            <input
              type="password"
              name="currentPassword"
            />
          </label>

          <label class="field mt">
            New password

            <input
              type="password"
              name="newPassword"
              minlength="8"
            />
          </label>

          <p
            id="profile-error"
            class="field-error"
          ></p>

          <div class="hero-actions mt">

            <button
              class="btn"
              type="submit"
            >
              Save profile
            </button>

            <button
              class="btn secondary"
              id="logout-btn"
              type="button"
            >
              Log out
            </button>

          </div>

        </form>
      `;
    }

    $("#app").innerHTML = `
      <div class="wrap">

        <h1 class="page-title">
          Dashboard
        </h1>

        <p class="muted">
          Signed in as
          ${escapeHtml(state.user.name)}
          ·
          <span class="badge-role">
            ${escapeHtml(
      state.user.userType ||
      state.user.role
    )}
          </span>
        </p>

        <nav
          class="dash-nav"
          aria-label="Dashboard"
        >

          ${tabs
        .map(
          ([id, label]) => `
                <a
                  class="btn ${current === id
              ? ""
              : "secondary"
            }"
                  href="#/dashboard/${id}"
                >
                  ${label}

                  ${id ===
              "notifications" &&
              state.unread
              ? ` (${state.unread})`
              : ""
            }
                </a>
              `
        )
        .join("")}

        </nav>

        ${body}

      </div>
    `;

    const readAll =
      $("#read-all");

    if (readAll) {
      readAll.onclick = async () => {
        await api(
          "/api/notifications/read-all",
          {
            method: "PUT",
          }
        );

        state.unread = 0;

        renderDashboard(
          "notifications"
        );
      };
    }

    document
      .querySelectorAll("[data-read]")
      .forEach((btn) => {
        btn.onclick = async () => {
          await api(
            `/api/notifications/${btn.getAttribute(
              "data-read"
            )}/read`,
            {
              method: "PUT",
            }
          );

          renderDashboard(
            "notifications"
          );
        };
      });

    const logout =
      $("#logout-btn");

    if (logout) {
      logout.onclick = () => {
        clearSession();

        toast("Signed out.");

        location.hash = "#/";
      };
    }

    const profile =
      $("#profile-form");

    if (profile) {
      profile.onsubmit =
        async (e) => {
          e.preventDefault();

          const fd =
            new FormData(e.target);

          try {
            const res =
              await api(
                "/api/users/me",
                {
                  method: "PUT",
                  body: {
                    name:
                      fd.get("name"),
                    currentPassword:
                      fd.get(
                        "currentPassword"
                      ),
                    newPassword:
                      fd.get(
                        "newPassword"
                      ),
                  },
                }
              );

            state.user =
              res.user;

            toast(
              "Profile updated."
            );

            renderNav();
          } catch (err) {
            $(
              "#profile-error"
            ).textContent =
              err.message;
          }
        };
    }
  } catch (err) {
    $("#app").innerHTML = `
      <div class="wrap">

        <div class="error-box">
          ${escapeHtml(
      err.message
    )}
        </div>

      </div>
    `;
  }
}

async function renderSecurityHead(tab) {
  if (!requireAuth()) return;

  if (!isSecurityHead(state.user)) {
    $("#app").innerHTML = `
      <div class="wrap">

        <div class="error-box">
          Security Head access required.
        </div>

      </div>
    `;

    return;
  }

  const current =
    tab || "overview";

  if (current === "submitted-claims" || current === "claims-inbox") {
    return renderSubmittedClaimsInbox("security");
  }

  if (current === "verifications") {
    return renderItemVerificationsPage("security");
  }

  if (current === "reports") {
    return renderSecurityHead("verifications");
  }

  // Avoid full-page loading flash when switching tabs inside Security Head
  const existingDash = document.querySelector(".sec-dash");
  if (!existingDash) {
    $("#app").innerHTML = `
      <style id="security-people-table-style">
        .security-people-table table { width:100%; border-collapse:separate; border-spacing:0; }
        .security-people-table th, .security-people-table td { vertical-align:middle; }
        .security-person-actions { white-space:nowrap; }
        .security-pill-action { border-radius:999px !important; min-width:92px; }
        .security-pill-action + .security-pill-action { margin-left:8px; }
      </style>
      <div class="wrap sec-dash">
        <p class="loading">Loading Security Head dashboard…</p>
      </div>
    `;
  }

  try {
    const primaryTabs = [
      ["overview", "Overview"],
      ["lost-items", "All Lost Items"],
      ["found-items", "All Found Items"],
      ["verifications", "Item Verifications"],
    ];

    const secondaryTabs = [
      ["sub-security", "Manage Securities"],
      ["users", "Manage Students"],
      ["claims", "Manage Employees"],
    ];

    const itemsTable = (items, emptyMsg) => {
      if (!items || !items.length) {
        return `<div class="empty">${escapeHtml(emptyMsg)}</div>`;
      }

      return `
        <div class="table-wrap panel">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${items
          .map(
            (item) => `
                    <tr>
                      <td>
                        <a href="#/item/${item._id}">
                          <strong>${escapeHtml(item.title)}</strong>
                        </a>
                      </td>
                      <td>
                        <span class="badge-role">${escapeHtml(item.type)}</span>
                      </td>
                      <td>${escapeHtml(displayItemStatus(item))}</td>
                      <td>${formatDate(item.date)}</td>
                      <td>
                        ${item.status !== "resolved"
                ? `<button class="btn secondary" data-resolve="${item._id}" type="button">Resolve</button>`
                : ""
              }
                        ${item.status !== "removed"
                ? `<button class="btn ghost" data-remove="${item._id}" type="button">Remove</button>`
                : ""
              }
                      </td>
                    </tr>
                  `
          )
          .join("")}
            </tbody>
          </table>
        </div>
      `;
    };

    let body = "";

    if (current === "overview") {
      const { stats } =
        await api(
          "/api/users/stats"
        );

      body = `
        <div class="stats">
          <div class="stat">
            <b>${stats.totalUsers}</b>
            Registered Users
          </div>
          <div class="stat">
            <b>${stats.totalSubSecurities}</b>
            Sub Security Staff
          </div>
          <div class="stat">
            <b>${stats.lostReports}</b>
            Lost Reports
          </div>
          <div class="stat">
            <b>${stats.foundReports}</b>
            Found Reports
          </div>
          <div class="stat">
            <b>${stats.pendingClaims}</b>
            Pending Claims
          </div>
          <div class="stat">
            <b>${stats.resolvedItems}</b>
            Resolved Items
          </div>
        </div>

        <a
          href="#/security-head/submitted-claims"
          class="panel"
          style="display:block;margin-top:18px;padding:22px 24px;border-radius:20px;background:#fff;border:1px solid var(--line,#e5e5e5);text-decoration:none;color:#111;box-shadow:0 10px 28px rgba(0,0,0,.04);"
        >
          <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
            <div>
              <p style="margin:0;font-size:11px;letter-spacing:.12em;font-weight:800;color:#777;text-transform:uppercase;">Inbox</p>
              <h2 style="margin:6px 0 4px;font-size:20px;letter-spacing:-.03em;">Submitted claims for your found reports &amp; Messages for you</h2>
              <p style="margin:0;color:#666;font-size:14px;">Open claims and private messages — select a chat to reply.</p>
            </div>
            <span class="btn secondary" style="pointer-events:none;border-radius:999px;">Open</span>
          </div>
        </a>
      `;
    } else if (
      current === "sub-security"
    ) {
      const subRes =
        await api(
          "/api/users/sub-security"
        );

      body = `
        <div class="sec-toolbar">
          <div>
            <h3>Sub Security Personnel</h3>
            <p class="sec-section-hint">
              Add, enable, or remove officers. Use “Add Securities” above to create a new account.
            </p>
          </div>
        </div>

        ${subRes.users.length
          ? `
              <div class="table-wrap panel">

                <table>

                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    ${subRes.users
            .map((u) => {
              const isDisabled =
                u.status ===
                "disabled" ||
                !u.active;

              return `
                          <tr>

                            <td>
                              <strong>
                                ${escapeHtml(
                u.name
              )}
                              </strong>
                            </td>

                            <td>
                              ${escapeHtml(
                u.email
              )}
                            </td>

                            <td>
                              <span class="${isDisabled
                  ? "badge-status-disabled"
                  : "badge-status-active"
                }">
                                ${isDisabled
                  ? "Disabled"
                  : "Active"
                }
                              </span>
                            </td>

                            <td>

                              <button
                                class="btn secondary"
                                data-sub-toggle="${u.id || u._id}"
                                data-next="${isDisabled
                  ? "active"
                  : "disabled"
                }"
                                type="button"
                              >
                                ${isDisabled
                  ? "Enable"
                  : "Disable"
                }
                              </button>

                              <button
                                class="btn ghost"
                                data-sub-delete="${u.id || u._id}"
                                type="button"
                              >
                                Remove
                              </button>

                            </td>

                          </tr>
                        `;
            })
            .join("")}

                  </tbody>

                </table>

              </div>
            `
          : `
              <div class="empty">
                No Sub Security accounts exist.
                Click "+ Add Sub Security" above to create one.
              </div>
            `
        }
      `;
    } else if (current === "lost-items") {
      const lostRes = await api("/api/items?type=lost&limit=100");
      const rows = (lostRes.items || []).filter((i) => i.status !== "removed");

      body = `
        <div class="sec-toolbar">
          <div>
            <h3>All Lost Items</h3>
            <p class="sec-section-hint">Every lost report on the platform.</p>
          </div>
        </div>
        ${rows.length
          ? `
          <div class="table-wrap panel">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date &amp; Time</th>
                  <th>Action taken</th>
                </tr>
              </thead>
              <tbody>
                ${rows
            .map((item) => {
              const st = lostDisplayStatus(item);
              const act = lostActionLabel(item);
              return `
                      <tr>
                        <td>
                          <a href="#/security-head/item/${item.id || item._id}">
                            <strong>${escapeHtml(item.title)}</strong>
                          </a>
                        </td>
                        <td>${escapeHtml(item.category || "—")}</td>
                        <td>
                          <span class="${st === "Not yet Found" ? "badge-status-disabled" : "badge-status-active"}">
                            ${escapeHtml(st)}
                          </span>
                        </td>
                        <td>${escapeHtml(formatDateTime(item.date, item.time))}</td>
                        <td>${escapeHtml(act)}</td>
                      </tr>
                    `;
            })
            .join("")}
              </tbody>
            </table>
          </div>
        `
          : `<div class="empty">No lost items found.</div>`
        }
      `;
    } else if (current === "found-items") {
      const foundRes = await api("/api/items?type=found&limit=100&includeUnverified=true");
      const rows = (foundRes.items || []).filter((item) => item.status !== "removed");

      body = `
        <div class="sec-toolbar">
          <div>
            <h3>All Found Items</h3>
            <p class="sec-section-hint">Every found report on the platform.</p>
          </div>
        </div>
        ${rows.length
          ? `
          <div class="table-wrap panel">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date &amp; Time</th>
                  <th>Submitted To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${rows
            .map((item) => {
              const custody = item.foundCustody || {};
              const mode = String(custody.mode || "").toLowerCase();
              const status = foundVerificationLabel(item);
              const submittedTo = mode === "security"
                ? (custody.holderDetails?.name || "Security / Official")
                : mode === "self"
                  ? "Self"
                  : "—";
              const pending = String(custody.verificationStatus || "").toLowerCase() === "pending";
              const iid = item.id || item._id;
              return `
                      <tr>
                        <td>
                          <a href="#/security-head/item/${iid}">
                            <strong>${escapeHtml(item.title || "Untitled item")}</strong>
                          </a>
                        </td>
                        <td>${escapeHtml(item.category || "—")}</td>
                        <td>
                          <span class="${pending ? "badge-status-disabled" : "badge-status-active"}">
                            ${escapeHtml(status)}
                          </span>
                        </td>
                        <td>${escapeHtml(formatDateTime(item.date, item.time))}</td>
                        <td>${escapeHtml(submittedTo)}</td>
                        <td>
                          <button class="btn ghost" data-remove="${iid}" type="button">Delete</button>
                        </td>
                      </tr>
                    `;
            })
            .join("")}
              </tbody>
            </table>
          </div>
        `
          : `<div class="empty">No found items found.</div>`
        }
      `;
    } else if (current === "reports") {
      const allItems = await api("/api/items?limit=100");
      body = `
        <div class="sec-toolbar">
          <div>
            <h3>All Reports</h3>
            <p class="sec-section-hint">Combined lost and found items.</p>
          </div>
        </div>
        ${itemsTable(allItems.items, "No reports found.")}
      `;
    } else if (current === "verifications") {
      const foundRes = await api("/api/items?type=found&limit=100&includeUnverified=true");
      const rows = (foundRes.items || []).filter((item) => item.status !== "removed");

      body = `
        <div class="sec-toolbar">
          <div>
            <h3>Item Verifications</h3>
            <p class="sec-section-hint">Review found-item reports submitted to Security or a university official.</p>
          </div>
        </div>
        ${rows.length
          ? `
            <div class="table-wrap panel">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Reported By</th>
                    <th>Submitted To</th>
                    <th>Verification</th>
                    <th>Date &amp; Time</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows.map((item) => {
                    const custody = item.foundCustody || {};
                    const mode = String(custody.mode || "").toLowerCase();
                    const verification = foundVerificationLabel(item);
                    return `
                      <tr>
                        <td><a href="#/security-head/item/${item.id || item._id}"><strong>${escapeHtml(item.title || "Untitled item")}</strong></a></td>
                        <td>${escapeHtml(item.user?.name || "—")}</td>
                        <td>${escapeHtml(mode === "security" ? (custody.holderDetails?.name || "Security / Official") : mode === "self" ? "Self" : "—")}</td>
                        <td>
                          <span class="${custody.verificationStatus === "pending" ? "badge-status-disabled" : "badge-status-active"}">${escapeHtml(verification)}</span>
                        </td>
                        <td>${escapeHtml(formatDateTime(item.date, item.time))}</td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          `
          : `<div class="empty">No found-item verification records found.</div>`
        }
      `;
    } else if (
      current === "claims"
    ) {
      const usersRes = await api("/api/users");
      const employees = (usersRes.users || []).filter((u) => {
        const role = getEffectiveRole(u);
        return role === "user" && String(u.userType || "").toLowerCase() === "employee";
      });

      body = `
        <div class="sec-toolbar">
          <div>
            <h3>Manage Employees</h3>
            <p class="sec-section-hint">Registered employees only.</p>
          </div>
        </div>

        <div class="table-wrap panel security-people-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${employees.length
          ? employees.map((u) => {
              const id = u.id || u._id;
              const isDisabled = u.status === "disabled" || !u.active;
              return `
                <tr>
                  <td><strong>${escapeHtml(u.name || "—")}</strong></td>
                  <td>${escapeHtml(u.email || "—")}</td>
                  <td><span class="badge-role">Employee</span></td>
                  <td>
                    <span class="${isDisabled ? "badge-status-disabled" : "badge-status-active"}">
                      ${isDisabled ? "Disabled" : "Active"}
                    </span>
                  </td>
                  <td class="security-person-actions">
                    <button class="btn secondary security-pill-action" data-user-toggle="${id}" data-value="${isDisabled ? "true" : "false"}" type="button">
                      ${isDisabled ? "Enable" : "Disable"}
                    </button>
                    <button class="btn secondary security-pill-action" data-user-delete="${id}" type="button">Delete</button>
                  </td>
                </tr>
              `;
            }).join("")
          : `<tr><td colspan="5"><div class="empty">No registered employees found.</div></td></tr>`}
            </tbody>
          </table>
        </div>
      `;
    } else if (
      current === "users"
    ) {
      const usersRes = await api("/api/users");
      const students = (usersRes.users || []).filter((u) => {
        const role = getEffectiveRole(u);
        return role === "user" && String(u.userType || "").toLowerCase() === "student";
      });

      body = `
        <div class="sec-toolbar">
          <div>
            <h3>Manage Students</h3>
            <p class="sec-section-hint">Registered students only.</p>
          </div>
        </div>

        <div class="table-wrap panel security-people-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Enrollment</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${students.length
          ? students.map((u) => {
              const id = u.id || u._id;
              const isDisabled = u.status === "disabled" || !u.active;
              const emailLocal = String(u.email || "").split("@")[0];
              const enrollment = u.enrollmentNumber || u.enrollment || u.studentId || emailLocal || "—";
              return `
                <tr>
                  <td><strong>${escapeHtml(u.name || "—")}</strong></td>
                  <td>${escapeHtml(enrollment)}</td>
                  <td><span class="badge-role">Student</span></td>
                  <td>
                    <span class="${isDisabled ? "badge-status-disabled" : "badge-status-active"}">
                      ${isDisabled ? "Disabled" : "Active"}
                    </span>
                  </td>
                  <td class="security-person-actions">
                    <button class="btn secondary security-pill-action" data-user-toggle="${id}" data-value="${isDisabled ? "true" : "false"}" type="button">
                      ${isDisabled ? "Enable" : "Disable"}
                    </button>
                    <button class="btn secondary security-pill-action" data-user-delete="${id}" type="button">Delete</button>
                  </td>
                </tr>
              `;
            }).join("")
          : `<tr><td colspan="5"><div class="empty">No registered students found.</div></td></tr>`}
            </tbody>
          </table>
        </div>
      `;
    } else if (
      current === "profile"
    ) {
      body = `
        <div class="form-card">

          <form id="profile-form">

            <label class="field">
              Name

              <input
                name="name"
                value="${escapeHtml(
        state.user.name
      )}"
                required
              />
            </label>

            <label class="field mt">
              Current password

              <input
                type="password"
                name="currentPassword"
                placeholder="••••••••"
              />
            </label>

            <label class="field mt">
              New password

              <input
                type="password"
                name="newPassword"
                minlength="8"
                placeholder="At least 8 characters"
              />
            </label>

            <p
              id="profile-error"
              class="field-error"
            ></p>

            <div class="hero-actions mt">

              <button
                class="btn"
                type="submit"
              >
                Save Changes
              </button>

              <button
                class="btn secondary"
                id="logout-btn"
                type="button"
              >
                Sign Out
              </button>

            </div>

          </form>

        </div>
      `;
    }

    $("#app").innerHTML = `
      <div class="wrap sec-dash">

        <header class="sec-dash-header">
          <h1 class="page-title">
            Security Head
          </h1>
          <p class="sec-dash-sub">
            Signed in as
            <span>${escapeHtml(state.user.name)}</span>
            · ${escapeHtml(state.user.email)}
          </p>
        </header>

        <nav class="dash-nav sec-nav-primary" aria-label="Reports navigation">
          ${primaryTabs
        .map(
          ([id, label]) => `
                <a
                  class="btn ${current === id ? "" : "secondary"}"
                  href="#/security-head/${id}"
                >
                  ${label}
                </a>
              `
        )
        .join("")}
        </nav>

        <nav class="dash-nav sec-nav-secondary" aria-label="Management navigation">
          <button
            class="btn"
            id="sec-open-add-modal"
            type="button"
          >
            Add Securities
          </button>
          ${secondaryTabs
        .map(
          ([id, label]) => `
                <a
                  class="btn ${current === id ? "" : "secondary"}"
                  href="#/security-head/${id}"
                >
                  ${label}
                </a>
              `
        )
        .join("")}
        </nav>

        ${body}

      </div>

      ${footer()}
    `;

    const addBtn =
      $("#sec-open-add-modal");

    if (addBtn) {
      addBtn.onclick = () => {
        openModal(
          "Add Sub Security",
          `
            <p class="muted mt">
              Create a new Sub Security officer account
              with dedicated credentials.
            </p>

            <form
              id="add-sub-form"
              class="mt"
            >

              <label class="field">
                Name

                <input
                  name="name"
                  id="sub-name"
                  required
                  maxlength="80"
                  placeholder="Officer Name"
                />
              </label>

              <label class="field mt">
                Email

                <input
                  type="email"
                  name="email"
                  id="sub-email"
                  required
                  placeholder="officer@domain.com"
                />
              </label>

              <label class="field mt">
                Password

                <input
                  type="password"
                  name="password"
                  id="sub-password"
                  required
                  minlength="8"
                  placeholder="••••••••"
                />
              </label>

              <p
                id="sub-create-error"
                class="field-error mt"
              ></p>

              <div class="hero-actions mt">

                <button
                  class="btn"
                  type="submit"
                >
                  Create Account
                </button>

                <button
                  class="btn secondary"
                  type="button"
                  data-close-modal
                >
                  Cancel
                </button>

              </div>

            </form>
          `
        );

        $("#add-sub-form").onsubmit =
          async (e) => {
            e.preventDefault();

            const fd =
              new FormData(
                e.target
              );

            const body =
              Object.fromEntries(
                fd.entries()
              );

            const errBox =
              $("#sub-create-error");

            errBox.textContent = "";

            try {
              await api(
                "/api/users/sub-security",
                {
                  method: "POST",
                  body,
                }
              );

              closeModal();

              toast(
                "Sub Security account created."
              );

              renderSecurityHead(
                current === "overview"
                  ? "sub-security"
                  : current
              );
            } catch (err) {
              errBox.textContent =
                err.message;
            }
          };
      }
    }

    document
      .querySelectorAll(
        "[data-sub-toggle]"
      )
      .forEach((btn) => {
        btn.onclick = async () => {
          const id =
            btn.getAttribute(
              "data-sub-toggle"
            );

          const nextStatus =
            btn.getAttribute(
              "data-next"
            );

          try {
            await api(
              `/api/users/sub-security/${id}/status`,
              {
                method: "PUT",
                body: {
                  status:
                    nextStatus,
                },
              }
            );

            toast(
              `Sub Security ${nextStatus === "active"
                ? "enabled"
                : "disabled"
              }.`
            );

            renderSecurityHead(
              "sub-security"
            );
          } catch (err) {
            toast(
              err.message
            );
          }
        };
      });

    document
      .querySelectorAll(
        "[data-sub-delete]"
      )
      .forEach((btn) => {
        btn.onclick = async () => {
          const id =
            btn.getAttribute(
              "data-sub-delete"
            );

          const ok =
            await confirmAction(
              "Remove Sub Security",
              "Are you sure you want to permanently remove this Sub Security account?"
            );

          if (!ok) return;

          try {
            await api(
              `/api/users/sub-security/${id}`,
              {
                method: "DELETE",
              }
            );

            toast(
              "Sub Security account removed."
            );

            renderSecurityHead(
              "sub-security"
            );
          } catch (err) {
            toast(
              err.message
            );
          }
        };
      });

    document
      .querySelectorAll(
        "[data-remove]"
      )
      .forEach((btn) => {
        btn.onclick = async () => {
          const ok =
            await confirmAction(
              "Remove report",
              "This hides the report from public listings."
            );

          if (!ok) return;

          try {
            await api(
              `/api/items/${btn.getAttribute(
                "data-remove"
              )}`,
              {
                method: "DELETE",
              }
            );

            toast(
              "Report removed."
            );

            renderSecurityHead(
              current === "lost-items" ||
                current === "found-items" ||
                current === "verifications" ||
                current === "reports"
                ? current
                : "reports"
            );
          } catch (err) {
            toast(
              err.message
            );
          }
        };
      });

    document
      .querySelectorAll(
        "[data-resolve]"
      )
      .forEach((btn) => {
        btn.onclick = async () => {
          try {
            await api(
              `/api/items/${btn.getAttribute(
                "data-resolve"
              )}/resolve`,
              {
                method: "PUT",
              }
            );

            toast(
              "Marked resolved."
            );

            renderSecurityHead(
              current === "lost-items" ||
                current === "found-items" ||
                current === "verifications" ||
                current === "reports"
                ? current
                : "reports"
            );
          } catch (err) {
            toast(
              err.message
            );
          }
        };
      });

    document
      .querySelectorAll(
        "select[data-claim]"
      )
      .forEach((sel) => {
        sel.onchange = async () => {
          try {
            await api(
              `/api/claims/${sel.getAttribute(
                "data-claim"
              )}`,
              {
                method: "PUT",
                body: {
                  status:
                    sel.value,
                },
              }
            );

            toast(
              "Claim updated."
            );

            renderSecurityHead(
              "claims"
            );
          } catch (err) {
            toast(
              err.message
            );
          }
        };
      });

    document
      .querySelectorAll(
        "[data-user-toggle]"
      )
      .forEach((btn) => {
        btn.onclick = async () => {
          try {
            const active =
              btn.getAttribute(
                "data-value"
              ) === "true";

            await api(
              `/api/users/${btn.getAttribute(
                "data-user-toggle"
              )}`,
              {
                method: "PUT",
                body: {
                  active,
                },
              }
            );

            toast(
              "User status updated."
            );

            renderSecurityHead(current === "claims" ? "claims" : "users");
          } catch (err) {
            toast(
              err.message
            );
          }
        };
      });

    document
      .querySelectorAll(
        "[data-user-delete]"
      )
      .forEach((btn) => {
        btn.onclick = async () => {
          const id = String(btn.getAttribute("data-user-delete") || "").trim();
          if (!id || id === "undefined" || id === "null") {
            toast("Unable to delete: missing user id.");
            return;
          }
          const ok = await confirmAction(
            "Delete account",
            "Permanently delete this user/employee account? This cannot be undone."
          );
          if (!ok) return;
          try {
            try {
              await api(`/api/users/${encodeURIComponent(id)}`, { method: "DELETE" });
            } catch (e1) {
              await api(`/api/users/sub-security/${encodeURIComponent(id)}`, { method: "DELETE" });
            }
            toast("Account deleted.");
            renderSecurityHead(current === "sub-security" ? "sub-security" : current);
          } catch (err) {
            toast(err.message || "Unable to delete account.");
          }
        };
      });

    const logout =
      $("#logout-btn");

    if (logout) {
      logout.onclick = () => {
        clearSession();

        toast(
          "Signed out."
        );

        location.hash = "#/";
      };
    }

    const profile =
      $("#profile-form");

    if (profile) {
      profile.onsubmit =
        async (e) => {
          e.preventDefault();

          const fd =
            new FormData(e.target);

          try {
            const res =
              await api(
                "/api/users/me",
                {
                  method: "PUT",
                  body: {
                    name:
                      fd.get("name"),
                    currentPassword:
                      fd.get(
                        "currentPassword"
                      ),
                    newPassword:
                      fd.get(
                        "newPassword"
                      ),
                  },
                }
              );

            state.user =
              res.user;

            toast(
              "Profile updated."
            );

            renderNav();
          } catch (err) {
            $(
              "#profile-error"
            ).textContent =
              err.message;
          }
        };
    }
  } catch (err) {
    $("#app").innerHTML = `
      <div class="wrap">

        <div class="error-box">
          ${escapeHtml(
      err.message
    )}
        </div>

      </div>
    `;
  }
}

async function renderSubSecurity(tab) {
  if (!requireAuth()) return;

  const role =
    getEffectiveRole(state.user);

  if (
    role !== "sub_security" &&
    role !== "security_head"
  ) {
    $("#app").innerHTML = `
      <div class="wrap">

        <div class="error-box">
          Security access required.
        </div>

      </div>
    `;

    return;
  }

  if (
    role === "security_head"
  ) {
    return renderSecurityHead(
      tab
    );
  }

  const current =
    tab || "lost";

  if (current === "verifications") {
    return renderItemVerificationsPage("security");
  }

  if (current === "submitted-claims" || current === "claims") {
    return renderSubmittedClaimsInbox("security");
  }

  $("#app").innerHTML = `
    <div class="wrap">

      <p class="loading">
        Loading Security Desk…
      </p>

    </div>
  `;

  try {
    const tabs = [
      ["lost", "Lost Reports"],
      ["found", "Found Reports"],
      ["verifications", "Item Verifications"],
      ["claims", "Claims"],
      ["resolved", "Resolved Items"],
      ["notifications", "Notifications"],
      ["profile", "Profile"],
    ];

    let body = "";

    if (current === "lost") {
      const data =
        await api(
          "/api/items?type=lost&limit=50"
        );

      body = `
        <div class="table-wrap panel">

          <table>

            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              ${data.items.length
          ? data.items
            .map(
              (item) => `
                          <tr>

                            <td>
                              <a href="#/item/${item._id}">
                                <strong>
                                  ${escapeHtml(
                item.title
              )}
                                </strong>
                              </a>
                            </td>

                            <td>
                              ${escapeHtml(
                item.category
              )}
                            </td>

                            <td>
                              ${escapeHtml(
                item.location
              )}
                            </td>

                            <td>
                              ${formatDate(
                item.date
              )}
                            </td>

                            <td>
                              ${escapeHtml(
                displayItemStatus(item)
              )}
                            </td>

                            <td>

                              ${item.status !==
                  "resolved"
                  ? `
                                    <button
                                      class="btn secondary"
                                      data-resolve="${item._id}"
                                      type="button"
                                    >
                                      Resolve
                                    </button>
                                  `
                  : "Resolved"
                }

                            </td>

                          </tr>
                        `
            )
            .join("")
          : `
                    <tr>
                      <td
                        colspan="6"
                        class="empty"
                      >
                        No lost reports found.
                      </td>
                    </tr>
                  `
        }

            </tbody>

          </table>

        </div>
      `;
    } else if (
      current === "found"
    ) {
      const data =
        await api(
          "/api/items?type=found&mine=true&limit=50"
        );

      body = `
        <div class="table-wrap panel">

          <table>

            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              ${data.items.length
          ? data.items
            .map(
              (item) => `
                          <tr>

                            <td>
                              <a href="#/item/${item._id}">
                                <strong>
                                  ${escapeHtml(
                item.title
              )}
                                </strong>
                              </a>
                            </td>

                            <td>
                              ${escapeHtml(
                item.category
              )}
                            </td>

                            <td>
                              ${escapeHtml(
                item.location
              )}
                            </td>

                            <td>
                              ${formatDate(
                item.date
              )}
                            </td>

                            <td>
                              ${escapeHtml(
                displayItemStatus(item)
              )}
                            </td>

                            <td>
                              ${item.status !== "resolved"
                  ? `<button class="btn secondary" data-resolve="${item._id}" type="button">Resolve</button>`
                  : "Resolved"
                }
                              ${item.status !== "removed"
                  ? `<button class="btn ghost" data-remove="${item._id}" type="button">Delete</button>`
                  : ""
                }
                            </td>

                          </tr>
                        `
            )
            .join("")
          : `
                    <tr>
                      <td
                        colspan="6"
                        class="empty"
                      >
                        No found reports found.
                      </td>
                    </tr>
                  `
        }

            </tbody>

          </table>

        </div>
      `;
    } else if (current === "verifications") {
      const data = await api("/api/items?type=found&limit=100&includeUnverified=true");
      const rows = (data.items || []).filter((item) => item.status !== "removed");

      body = `
        <div class="sec-toolbar">
          <div>
            <h3>Item Verifications</h3>
            <p class="sec-section-hint">Review found-item reports submitted to Security or a university official.</p>
          </div>
        </div>
        ${rows.length
          ? `
            <div class="table-wrap panel">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Reported By</th>
                    <th>Submitted To</th>
                    <th>Verification</th>
                    <th>Date &amp; Time</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows.map((item) => {
                    const custody = item.foundCustody || {};
                    const mode = String(custody.mode || "").toLowerCase();
                    return `
                      <tr>
                        <td><a href="#/security-head/item/${item.id || item._id}"><strong>${escapeHtml(item.title || "Untitled item")}</strong></a></td>
                        <td>${escapeHtml(item.user?.name || "—")}</td>
                        <td>${escapeHtml(mode === "security" ? (custody.holderDetails?.name || "Security / Official") : mode === "self" ? "Self" : "—")}</td>
                        <td><span class="${custody.verificationStatus === "pending" ? "badge-status-disabled" : "badge-status-active"}">${escapeHtml(foundVerificationLabel(item))}</span></td>
                        <td>${escapeHtml(formatDateTime(item.date, item.time))}</td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          `
          : `<div class="empty">No found-item verification records found.</div>`
        }
      `;
    } else if (
      current === "claims"
    ) {
      const data =
        await api(
          "/api/claims"
        );

      body = `
        <div class="table-wrap panel">

          <table>

            <thead>
              <tr>
                <th>Item</th>
                <th>Claimant</th>
                <th>Reason</th>
                <th>Proof</th>
                <th>Status</th>
                <th>Review</th>
              </tr>
            </thead>

            <tbody>

              ${data.claims.length
          ? data.claims
            .map(
              (c) => `
                          <tr>

                            <td>
                              <a
                                href="#/item/${c.item &&
                c.item._id
                }"
                              >
                                <strong>
                                  ${escapeHtml(
                  (c.item &&
                    c.item.title) ||
                  "Item"
                )}
                                </strong>
                              </a>
                            </td>

                            <td>
                              ${escapeHtml(
                  c.claimant &&
                  (
                    c.claimant.name ||
                    c.claimant.email
                  )
                )}
                            </td>

                            <td>
                              ${escapeHtml(
                  c.reason
                )}
                            </td>

                            <td>
                              ${escapeHtml(
                  c.proof
                )}
                            </td>

                            <td>
                              ${escapeHtml(
                  statusLabel(
                    c.status
                  )
                )}
                            </td>

                            <td>

                              <select
                                data-claim="${c._id}"
                              >

                                ${[
                  "pending",
                  "under_review",
                  "approved",
                  "rejected",
                  "completed",
                ]
                  .map(
                    (s) =>
                      `<option value="${s}" ${c.status ===
                        s
                        ? "selected"
                        : ""
                      }>
                                        ${statusLabel(
                        s
                      )}
                                      </option>`
                  )
                  .join("")}

                              </select>

                            </td>

                          </tr>
                        `
            )
            .join("")
          : `
                    <tr>
                      <td
                        colspan="6"
                        class="empty"
                      >
                        No claims submitted yet.
                      </td>
                    </tr>
                  `
        }

            </tbody>

          </table>

        </div>
      `;
    } else if (
      current === "resolved"
    ) {
      const data =
        await api(
          "/api/items?status=resolved&limit=50"
        );

      body = `
        <div class="table-wrap panel">

          <table>

            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              ${data.items.length
          ? data.items
            .map(
              (item) => `
                          <tr>

                            <td>
                              <a href="#/item/${item._id}">
                                <strong>
                                  ${escapeHtml(
                item.title
              )}
                                </strong>
                              </a>
                            </td>

                            <td>
                              <span class="badge-role">
                                ${escapeHtml(
                item.type
              )}
                              </span>
                            </td>

                            <td>
                              ${escapeHtml(
                item.category
              )}
                            </td>

                            <td>
                              ${escapeHtml(
                item.location
              )}
                            </td>

                            <td>
                              ${escapeHtml(
                displayItemStatus(item)
              )}
                            </td>

                          </tr>
                        `
            )
            .join("")
          : `
                    <tr>
                      <td
                        colspan="5"
                        class="empty"
                      >
                        No resolved items yet.
                      </td>
                    </tr>
                  `
        }

            </tbody>

          </table>

        </div>
      `;
    } else if (
      current === "notifications"
    ) {
      const notes =
        await api(
          "/api/notifications"
        );

      body = `
        <div
          style="
            display:flex;
            justify-content:flex-end;
            margin-bottom:12px;
          "
        >

          <button
            class="btn secondary"
            id="sec-read-all"
            type="button"
          >
            Mark all read
          </button>

        </div>

        <div class="panel">

          ${notes.notifications.length
          ? notes.notifications
            .map(
              (n) => `
                      <div
                        class="note ${n.read
                  ? ""
                  : "unread"
                }"
                      >

                        <div
                          style="
                            display:flex;
                            justify-content:space-between;
                            align-items:flex-start;
                            gap:12px;
                          "
                        >

                          <div>

                            <p>
                              ${escapeHtml(
                  n.message
                )}
                            </p>

                            <p
                              class="muted"
                              style="
                                font-size:12px;
                                margin-top:4px;
                              "
                            >
                              ${formatDate(
                  n.createdAt
                )}
                            </p>

                          </div>

                          ${!n.read
                  ? `
                                <button
                                  class="btn secondary"
                                  data-read="${n._id}"
                                  type="button"
                                >
                                  Mark read
                                </button>
                              `
                  : ""
                }

                        </div>

                      </div>
                    `
            )
            .join("")
          : `<div class="empty">
                  No notifications.
                </div>`
        }

        </div>
      `;
    } else if (
      current === "profile"
    ) {
      body = `
        <div class="form-card">

          <form id="profile-form">

            <label class="field">
              Name

              <input
                name="name"
                value="${escapeHtml(
        state.user.name
      )}"
                required
              />
            </label>

            <label class="field mt">
              Current password

              <input
                type="password"
                name="currentPassword"
                placeholder="••••••••"
              />
            </label>

            <label class="field mt">
              New password

              <input
                type="password"
                name="newPassword"
                minlength="8"
                placeholder="At least 8 characters"
              />
            </label>

            <p
              id="profile-error"
              class="field-error"
            ></p>

            <div class="hero-actions mt">

              <button
                class="btn"
                type="submit"
              >
                Save Changes
              </button>

              <button
                class="btn secondary"
                id="logout-btn"
                type="button"
              >
                Sign Out
              </button>

            </div>

          </form>

        </div>
      `;
    }

    $("#app").innerHTML = `
      <div class="wrap">

        <h1 class="page-title">
          Security Desk
        </h1>

        <p class="muted">
          Sub Security:
          ${escapeHtml(
      state.user.name
    )}
          (${escapeHtml(
      state.user.email
    )})
        </p>

        <nav
          class="dash-nav"
          aria-label="Security Navigation"
        >

          ${tabs
        .map(
          ([id, label]) => `
                <a
                  class="btn ${current === id
              ? ""
              : "secondary"
            }"
                  href="#/sub-security/${id}"
                >
                  ${label}

                  ${id ===
              "notifications" &&
              state.unread
              ? ` (${state.unread})`
              : ""
            }
                </a>
              `
        )
        .join("")}

        </nav>

        ${body}

      </div>
    `;

    document
      .querySelectorAll(
        "[data-resolve]"
      )
      .forEach((btn) => {
        btn.onclick = async () => {
          try {
            await api(
              `/api/items/${btn.getAttribute(
                "data-resolve"
              )}/resolve`,
              {
                method: "PUT",
              }
            );

            toast(
              "Marked resolved."
            );

            renderSubSecurity(
              current
            );
          } catch (err) {
            toast(
              err.message
            );
          }
        };
      });

    document
      .querySelectorAll(
        "[data-remove]"
      )
      .forEach((btn) => {
        btn.onclick = async () => {
          const ok = await confirmAction(
            "Delete report",
            "This hides the report from public listings."
          );
          if (!ok) return;
          try {
            await api(
              `/api/items/${btn.getAttribute("data-remove")}`,
              { method: "DELETE" }
            );
            toast("Report deleted.");
            renderSubSecurity(current);
          } catch (err) {
            toast(err.message || "Unable to delete.");
          }
        };
      });

    document
      .querySelectorAll(
        "select[data-claim]"
      )
      .forEach((sel) => {
        sel.onchange = async () => {
          try {
            await api(
              `/api/claims/${sel.getAttribute(
                "data-claim"
              )}`,
              {
                method: "PUT",
                body: {
                  status:
                    sel.value,
                },
              }
            );

            toast(
              "Claim updated."
            );

            renderSubSecurity(
              "claims"
            );
          } catch (err) {
            toast(
              err.message
            );
          }
        };
      });

    const readAll =
      $("#sec-read-all");

    if (readAll) {
      readAll.onclick =
        async () => {
          try {
            await api(
              "/api/notifications/read-all",
              {
                method: "PUT",
              }
            );

            state.unread = 0;

            renderSubSecurity(
              "notifications"
            );
          } catch (err) {
            toast(
              err.message
            );
          }
        };
    }

    document
      .querySelectorAll(
        "[data-read]"
      )
      .forEach((btn) => {
        btn.onclick = async () => {
          try {
            await api(
              `/api/notifications/${btn.getAttribute(
                "data-read"
              )}/read`,
              {
                method: "PUT",
              }
            );

            renderSubSecurity(
              "notifications"
            );
          } catch (err) {
            toast(
              err.message
            );
          }
        };
      });

    const logout =
      $("#logout-btn");

    if (logout) {
      logout.onclick = () => {
        clearSession();

        toast(
          "Signed out."
        );

        location.hash = "#/";
      };
    }

    const profile =
      $("#profile-form");

    if (profile) {
      profile.onsubmit =
        async (e) => {
          e.preventDefault();

          const fd =
            new FormData(e.target);

          try {
            const res =
              await api(
                "/api/users/me",
                {
                  method: "PUT",
                  body: {
                    name:
                      fd.get("name"),
                    currentPassword:
                      fd.get(
                        "currentPassword"
                      ),
                    newPassword:
                      fd.get(
                        "newPassword"
                      ),
                  },
                }
              );

            state.user =
              res.user;

            toast(
              "Profile updated."
            );

            renderNav();
          } catch (err) {
            $(
              "#profile-error"
            ).textContent =
              err.message;
          }
        };
    }
  } catch (err) {
    $("#app").innerHTML = `
      <div class="wrap">

        <div class="error-box">
          ${escapeHtml(
      err.message
    )}
        </div>

      </div>
    `;
  }
}

async function renderAdmin(tab) {
  return renderSecurityHead(
    tab
  );
}

async function renderProfileSettings() {
  if (!requireAuth()) return;

  // Security Head account is fixed in .env — view only, no edits
  const isHead = isSecurityHead(state.user);
  const locked = isHead ? "disabled" : "";
  const lockedAttr = isHead ? "disabled" : "";
  const hint = isHead
    ? "Security Head account is fixed and cannot be changed."
    : "Update your name or password. Email cannot be changed.";

  $("#app").innerHTML = `
    <div class="wrap">
      <div class="auth-layout" style="min-height:auto;padding:32px 0;background:none;">
        <div class="auth-card form-card wide" style="box-shadow:var(--shadow);">
          <h1 class="page-title">Profile &amp; Settings</h1>
          <p class="muted" style="text-align:center;margin-top:8px;">
            ${hint}
          </p>

          <form id="profile-settings-form" class="mt">
            <label class="field">
              Name
              <input
                name="name"
                value="${escapeHtml(state.user.name)}"
                required
                ${lockedAttr}
              />
            </label>

            <label class="field mt">
              Email
              <input
                value="${escapeHtml(state.user.email)}"
                disabled
              />
            </label>

            <label class="field mt">
              Current password
              <input
                type="password"
                name="currentPassword"
                placeholder="Required only when changing password"
                ${lockedAttr}
              />
            </label>

            <label class="field mt">
              New password
              <input
                type="password"
                name="newPassword"
                minlength="8"
                placeholder="At least 8 characters"
                ${lockedAttr}
              />
            </label>

            <p id="profile-settings-error" class="field-error"></p>

            <div class="profile-actions mt" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
              <button class="btn" type="submit" ${isHead ? "disabled" : ""}>
                Save changes
              </button>
              <a class="btn secondary" href="${getDashboardRoute(state.user)}">
                Back to Dashboard
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  const form = $("#profile-settings-form");

  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();

      // Security Head cannot update profile
      if (isSecurityHead(state.user)) {
        return;
      }

      const fd = new FormData(e.target);
      const errBox = $("#profile-settings-error");
      const btn = form.querySelector('button[type="submit"]');

      if (errBox) errBox.textContent = "";
      if (btn) btn.disabled = true;

      try {
        const res = await api("/api/users/me", {
          method: "PUT",
          body: {
            name: fd.get("name"),
            currentPassword: fd.get("currentPassword"),
            newPassword: fd.get("newPassword"),
          },
        });

        state.user = res.user;

        toast("Profile updated.");
        renderNav();
        renderProfileSettings();
      } catch (err) {
        if (errBox) errBox.textContent = err.message;
        if (btn) btn.disabled = false;
      }
    };
  }
}


async function renderSecurityItemDetail(id) {
  if (!requireAuth()) return;

  const role = getEffectiveRole(state.user);
  if (role !== "security_head" && role !== "sub_security") {
    $("#app").innerHTML = `<div class="wrap"><div class="error-box">Security access required.</div></div>`;
    return;
  }

  $("#app").innerHTML = `
    <div class="wrap public-detail-page">
      <p class="loading">Loading item…</p>
    </div>
  `;

  try {
    const { item } = await api(`/api/items/${encodeURIComponent(id)}`);
    if (!item || item.type !== "found") {
      return renderItem(id, true);
    }

    const foundCustody = item.foundCustody || {};
    const foundVerificationStatus = String(foundCustody.verificationStatus || "").toLowerCase();
    const foundHolder = foundCustody.holderDetails || {};
    const status = foundVerificationLabel(item);
    const custodyMode = foundCustody.mode === "security"
      ? "Submitted to Security / Official"
      : foundCustody.mode === "self"
        ? "Self Custody"
        : "";
    const postedBy = item.user && item.user.name ? item.user.name : "Member";
    const backHref = isSecurityHead(state.user)
      ? "#/security-head/verifications"
      : "#/sub-security/verifications";

    const detailStyle = `
      <style id="security-found-detail-styles">
        .security-found-detail-page{
          max-width:1270px;
          margin:0 auto;
          padding-bottom:64px;
        }
        .security-found-delete-wrap{grid-column:1/-1;width:100%;}
        .security-found-detail-shell{
          width:100%;
          display:grid;
          grid-template-columns:minmax(0,1fr) minmax(300px,380px);
          gap:46px;
          align-items:start;
          padding:28px;
          border:1px solid var(--line);
          border-radius:28px;
          background:#fff;
          box-shadow:0 18px 48px rgba(0,0,0,.055);
          box-sizing:border-box;
        }
        .security-found-detail-info{
          min-width:0;
          padding:8px 0 0;
          display:flex;
          flex-direction:column;
          grid-column:1;
          grid-row:1;
        }
        .security-found-detail-topline{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:14px;
          flex-wrap:wrap;
          padding-bottom:18px;
          border-bottom:1px solid var(--line);
        }
        .security-found-detail-kicker{
          margin:0;
          color:#777;
          font-size:11px;
          font-weight:800;
          letter-spacing:.16em;
          text-transform:uppercase;
        }
        .security-found-detail-info h1{
          margin:24px 0 10px;
          font-size:clamp(34px,4vw,58px);
          line-height:1;
          letter-spacing:-.05em;
          overflow-wrap:anywhere;
        }
        .security-found-detail-description{
          margin:0 0 28px;
          color:#666;
          font-size:15px;
          line-height:1.75;
        }
        .security-found-detail-facts{
          display:block;
          margin-top:0;
          border:0;
          border-radius:0;
          overflow:visible;
          background:transparent;
        }
        .security-found-detail-fact{
          display:grid;
          grid-template-columns:minmax(130px,.42fr) minmax(0,1fr);
          gap:24px;
          align-items:start;
          padding:15px 0;
          border-top:1px solid var(--line);
          background:transparent;
          min-width:0;
        }
        .security-found-detail-fact span,
        .security-found-custody-value span{
          display:block;
          margin:0;
          color:#888;
          font-size:10px;
          font-weight:800;
          letter-spacing:.1em;
          text-transform:uppercase;
        }
        .security-found-detail-fact strong,
        .security-found-custody-value strong{
          display:block;
          color:#151515;
          font-size:14px;
          line-height:1.55;
          word-break:break-word;
        }
        .security-found-detail-media{
          width:min(100%,360px);
          aspect-ratio:1 / 1;
          min-height:0;
          height:auto;
          border:1px solid var(--line);
          border-radius:22px;
          background:#f7f7f7;
          overflow:hidden;
          display:flex;
          align-items:center;
          justify-content:center;
          justify-self:end;
          grid-column:2;
          grid-row:1;
        }
        .security-found-detail-media img{
          width:100%;
          height:100%;
          min-height:0;
          max-height:none;
          object-fit:contain;
          display:block;
        }
        .security-found-detail-image-button{
          width:100%;
          height:100%;
          padding:0;
          border:0;
          background:transparent;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:zoom-in;
        }
        .security-found-detail-image-button img{
          transition:transform .2s ease;
        }
        .security-found-detail-image-button:hover img{
          transform:scale(1.025);
        }
        .security-found-custody{
          grid-column:1 / -1;
          width:100%;
          margin-top:30px;
          padding:24px 0 0;
          border-top:1px solid var(--line);
        }
        .security-found-custody-head{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:18px;
          padding-bottom:17px;
          border-bottom:1px solid var(--line);
        }
        .security-found-custody-kicker{
          margin:0 0 7px;
          color:#858585;
          font-size:10px;
          font-weight:800;
          letter-spacing:.15em;
        }
        .security-found-custody-head h2{
          margin:0;
          font-size:22px;
          letter-spacing:-.025em;
        }
        .security-found-custody-sub{
          margin:7px 0 0;
          color:#777;
          font-size:13px;
          line-height:1.55;
        }
        .security-found-custody-badge{
          flex:0 0 auto;
          border:1px solid #111;
          border-radius:999px;
          padding:7px 10px;
          color:#111;
          background:#fff;
          font-size:10px;
          font-weight:800;
          letter-spacing:.04em;
          text-transform:uppercase;
        }
        .security-found-custody-grid{
          display:block;
          margin-top:0;
        }
        .security-found-custody-value{
          display:grid;
          grid-template-columns:minmax(130px,.42fr) minmax(0,1fr);
          gap:24px;
          align-items:start;
          padding:15px 0;
          border-bottom:1px solid var(--line);
        }
        .security-found-verification-actions{
          display:flex;
          flex-wrap:wrap;
          gap:10px;
          margin-top:20px;
        }
        .security-found-verification-error{
          margin-top:10px;
        }
        .security-found-custody-note{
          padding-top:15px;
          color:#555;
          font-size:13px;
          line-height:1.6;
        }
        @media (max-width:980px){
          .security-found-detail-shell{
            grid-template-columns:minmax(0,1fr) minmax(280px,340px);
            gap:30px;
          }
          .security-found-detail-media{
            width:min(100%,360px);
          }
        }
        @media (max-width:760px){
          .security-found-detail-shell{
            grid-template-columns:1fr;
            gap:28px;
            padding:20px;
          }
          .security-found-detail-media{
            width:min(100%,340px);
            justify-self:center;
            grid-column:1;
            grid-row:1;
          }
          .security-found-detail-info{
            padding-top:0;
            grid-column:1;
            grid-row:2;
          }
        }
        @media (max-width:560px){
          .security-found-detail-shell{
            border-radius:22px;
            padding:16px;
          }
          .security-found-detail-media{
            width:100%;
            border-radius:18px;
          }
          .security-found-detail-fact,
          .security-found-custody-value{
            grid-template-columns:1fr;
            gap:6px;
          }
          .security-found-custody-head{
            flex-direction:column;
          }
        }
      </style>
    `;

    const showCustodyPanel = Boolean(foundHolder.name) || (foundCustody.mode === "security");
    const custodyRows = showCustodyPanel ? `
      <section class="security-found-custody">
        <div class="security-found-custody-head">
          <div>
            <p class="security-found-custody-kicker">COLLECTION DETAILS</p>
            <h2>Collect from</h2>
            <p class="security-found-custody-sub">
              ${escapeHtml(foundCustody.mode === "security"
                ? "The item was handed to Security / a university official."
                : "The item is currently held by the person shown below.")}
            </p>
          </div>
          <span class="security-found-custody-badge">${escapeHtml(status)}</span>
        </div>

        <div class="security-found-custody-grid">
          <div class="security-found-custody-value">
            <span>Submitted to</span>
            <strong>${escapeHtml(foundCustody.mode === "security" ? "Security / University Official" : "Self")}</strong>
          </div>
          <div class="security-found-custody-value">
            <span>Name</span>
            <strong>${escapeHtml(foundHolder.name || "—")}</strong>
          </div>
          <div class="security-found-custody-value">
            <span>Person type</span>
            <strong>${escapeHtml(
              foundHolder.personType === "student"
                ? "Student"
                : foundHolder.personType === "employee"
                  ? "Employee"
                  : foundHolder.personType === "security"
                    ? "Security Personnel"
                    : "—"
            )}</strong>
          </div>
          <div class="security-found-custody-value">
            <span>${escapeHtml(
              foundHolder.personType === "student"
                ? "Enrollment Number"
                : foundHolder.personType === "security"
                  ? "Security ID"
                  : "Employee ID"
            )}</span>
            <strong>${escapeHtml(foundHolder.idNumber || "—")}</strong>
          </div>
          ${foundCustody.mode === "self" && foundHolder.personType === "student" ? `
            <div class="security-found-custody-value">
              <span>Programme / Course</span>
              <strong>${escapeHtml(foundHolder.programme || "—")}</strong>
            </div>
            <div class="security-found-custody-value">
              <span>Department / Specialization</span>
              <strong>${escapeHtml(foundHolder.department || "—")}</strong>
            </div>
            <div class="security-found-custody-value">
              <span>Year</span>
              <strong>${escapeHtml(foundHolder.year || "—")}</strong>
            </div>
          ` : ""}
          ${foundHolder.personType === "employee" ? `
            <div class="security-found-custody-value">
              <span>Role / Position</span>
              <strong>${escapeHtml(foundHolder.role || "—")}</strong>
            </div>
            <div class="security-found-custody-value">
              <span>Work Department / Area</span>
              <strong>${escapeHtml(foundHolder.workDepartment || "—")}</strong>
            </div>
          ` : ""}
          ${foundCustody.mode === "security" ? `
            <div class="security-found-custody-value">
              <span>Department / Area</span>
              <strong>${escapeHtml(foundHolder.workDepartment || "—")}</strong>
            </div>
          ` : ""}
          <div class="security-found-custody-value">
            <span>Custody date</span>
            <strong>${escapeHtml(foundHolder.handoverDate || "—")}</strong>
          </div>
          <div class="security-found-custody-value">
            <span>Custody time</span>
            <strong>${escapeHtml(foundHolder.handoverTime || "—")}</strong>
          </div>
          ${foundCustody.verifiedByName ? `
            <div class="security-found-custody-value">
              <span>Verified by</span>
              <strong>${escapeHtml(foundCustody.verifiedByName)}</strong>
            </div>
          ` : ""}
          ${foundCustody.verifiedAt ? `
            <div class="security-found-custody-value">
              <span>Verified at</span>
              <strong>${escapeHtml(formatDateTime(foundCustody.verifiedAt, ""))}</strong>
            </div>
          ` : ""}
          ${foundCustody.verificationNote ? `
            <div class="security-found-custody-note">${escapeHtml(foundCustody.verificationNote)}</div>
          ` : ""}
        </div>

        ${foundCustody.mode === "security" && foundVerificationStatus === "pending" ? `
          <div class="security-found-verification-actions">
            <button class="btn" id="verify-found-yes" type="button">Yes, item received</button>
            <button class="btn secondary" id="verify-found-no" type="button">No, item not received</button>
          </div>
          <p id="found-verification-error" class="field-error security-found-verification-error"></p>
        ` : ""}
      </section>
    ` : "";

    $("#app").innerHTML = `
      ${detailStyle}
      <div class="wrap security-found-detail-page">
        <p class="sec-section-hint" style="margin:0 0 14px;">
          <a href="${backHref}">← Item Verifications</a>
        </p>

        <div class="security-found-detail-shell">
          <article class="security-found-detail-info">
            <div class="security-found-detail-topline">
              <span class="pill">Found · ${escapeHtml(status)}</span>
              <p class="security-found-detail-kicker">ITEM DETAILS</p>
            </div>

            <h1>${escapeHtml(item.title || "Untitled item")}</h1>

            <p class="security-found-detail-description">
              ${escapeHtml(item.description || "")}
            </p>

            <div class="security-found-detail-facts">
              <div class="security-found-detail-fact">
                <span>Category</span>
                <strong>${escapeHtml(item.category || "—")}</strong>
              </div>
              <div class="security-found-detail-fact">
                <span>Location</span>
                <strong>${escapeHtml(item.location || "—")}</strong>
              </div>
              <div class="security-found-detail-fact">
                <span>Date &amp; time</span>
                <strong>${escapeHtml(formatDateTime(item.date, item.time))}</strong>
              </div>
              <div class="security-found-detail-fact">
                <span>Posted by</span>
                <strong>${escapeHtml(postedBy)}</strong>
              </div>
              <div class="security-found-detail-fact">
                <span>Submitted to</span>
                <strong>${escapeHtml(custodyMode || "—")}</strong>
              </div>
              ${item.identifyingDetails ? `
                <div class="security-found-detail-fact">
                  <span>Identifying details</span>
                  <strong>${escapeHtml(item.identifyingDetails)}</strong>
                </div>
              ` : ""}
            </div>

          </article>

          <div class="security-found-detail-media">
            ${item.image
              ? `<button class="security-found-detail-image-button" id="security-found-detail-image" type="button" aria-label="Open full-size item image">
                  ${itemImage(item)}
                </button>`
              : itemImage(item)}
          </div>

          ${custodyRows}

          ${item.status !== "removed" ? `
            <div class="security-found-delete-wrap" style="grid-column:1 / -1;width:100%;max-width:100%;box-sizing:border-box;margin-top:8px;padding:0;">
              <button class="btn secondary full" id="security-found-delete-btn" type="button" style="width:100%;min-width:100%;max-width:none;margin:0;box-sizing:border-box;min-height:52px;border-radius:999px;display:flex;align-items:center;justify-content:center;">Delete report</button>
            </div>
          ` : ""}
        </div>
      </div>
      ${footer()}
    `;

    const imageButton = $("#security-found-detail-image");
    if (imageButton && item.image) {
      imageButton.onclick = () => {
        openModal(
          "Item image",
          `<div class="public-image-lightbox">
             <button class="public-image-close" type="button" data-close-modal aria-label="Close image">×</button>
             <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title || "Item image")}" />
           </div>`
        );
      };
    }

    const verifyFoundItem = async (decision) => {
      const errorBox = $("#found-verification-error");
      if (errorBox) errorBox.textContent = "";
      const yesButton = $("#verify-found-yes");
      const noButton = $("#verify-found-no");
      if (yesButton) yesButton.disabled = true;
      if (noButton) noButton.disabled = true;

      try {
        await api(`/api/items/verify-found/${encodeURIComponent(id)}`, {
          method: "PUT",
          body: { decision },
        });
        toast(
          decision === "verified"
            ? "Found item verified and published."
            : "Found item was not verified and remains private."
        );
        await renderSecurityItemDetail(id);
      } catch (err) {
        if (errorBox) errorBox.textContent = err.message || "Unable to update verification.";
        if (yesButton) yesButton.disabled = false;
        if (noButton) noButton.disabled = false;
      }
    };

    const verifyYes = $("#verify-found-yes");
    const verifyNo = $("#verify-found-no");
    if (verifyYes) verifyYes.onclick = () => verifyFoundItem("verified");
    if (verifyNo) verifyNo.onclick = () => verifyFoundItem("rejected");

    const foundDeleteBtn = $("#security-found-delete-btn");
    if (foundDeleteBtn) {
      foundDeleteBtn.onclick = async () => {
        const ok = await confirmAction(
          "Delete report",
          "This permanently hides the found report from public listings."
        );
        if (!ok) return;
        try {
          await api(`/api/items/${encodeURIComponent(id)}`, { method: "DELETE" });
          toast("Found report deleted.");
          location.hash = isSecurityHead(state.user)
            ? "#/security-head/found-items"
            : "#/sub-security/found";
        } catch (err) {
          toast(err.message || "Unable to delete report.");
        }
      };
    }
  } catch (err) {
    $("#app").innerHTML = `
      <div class="wrap">
        <div class="error-box">${escapeHtml(err.message)}</div>
        <p class="mt"><a href="${isSecurityHead(state.user) ? "#/security-head/verifications" : "#/sub-security/verifications"}">← Back to Item Verifications</a></p>
      </div>
    `;
  }
}


async function renderSecurityItemRoute(id) {
  if (!requireAuth()) return;
  const role = getEffectiveRole(state.user);
  if (role !== "security_head" && role !== "sub_security") {
    $("#app").innerHTML = `<div class="wrap"><div class="error-box">Security access required.</div></div>`;
    return;
  }
  try {
    const { item } = await api(`/api/items/${encodeURIComponent(id)}`);
    if (item.type === "lost") {
      return renderItem(id, true);
    }
  } catch (_err) {
    // Let the existing security detail renderer show the normal API error.
  }
  return renderSecurityItemDetail(id);
}


async function renderSubmittedClaimsInbox(mode) {
  // Unified Claims + Messages inbox (WhatsApp-style)
  // mode: "security" | "finder"
  if (!requireAuth()) return;

  const role = getEffectiveRole(state.user);
  const isStaff =
    ["security_head", "sub_security", "admin"].includes(role) ||
    (state.user &&
      ["security_head", "sub_security", "admin"].includes(state.user.role));

  if (mode === "security" && !isStaff) {
    $("#app").innerHTML = `<div class="wrap"><div class="error-box">Security access required.</div></div>`;
    return;
  }

  const backHref =
    mode === "security"
      ? role === "sub_security"
        ? "#/sub-security"
        : "#/security-head"
      : "#/dashboard/overview";

  const title = "Submitted claims for your found reports & Messages for you";
  const subtitle =
    mode === "security"
      ? "Claims routed to Security and message threads. Select a row to open the chat and reply."
      : "Claims on your found reports and private messages about your items. Select a row to open the chat and reply.";

  const myId = String((state.user && (state.user.id || state.user._id)) || "");

  $("#app").innerHTML = `
    <div class="wrap claims-inbox-page">
      <style>
        .claims-inbox-page{max-width:1180px;padding:20px 0 56px;}
        .claims-inbox-hero{border:1px solid #e7e7e7;border-radius:28px;background:#fff;padding:28px 30px;margin-bottom:18px;box-shadow:0 18px 50px rgba(0,0,0,.06);}
        .claims-inbox-hero h1{margin:8px 0 0;font-size:28px;letter-spacing:-.04em;line-height:1.15;}
        .claims-inbox-hero p{margin:10px 0 0;color:#666;max-width:780px;line-height:1.6;font-size:14px;}
        .claims-inbox-back{font-size:13px;font-weight:700;color:#666;text-decoration:none;}
        .claims-inbox-back:hover{color:#111;}
        .claims-inbox-shell{display:grid;grid-template-columns:minmax(280px,.95fr) minmax(0,1.15fr);gap:16px;min-height:580px;}
        @media(max-width:900px){.claims-inbox-shell{grid-template-columns:1fr;}}
        .claims-list-panel,.claims-chat-panel{border:1px solid #e7e7e7;border-radius:24px;background:#fff;box-shadow:0 14px 40px rgba(0,0,0,.05);overflow:hidden;display:flex;flex-direction:column;min-height:520px;}
        .claims-list-head,.claims-chat-head{padding:16px 18px;border-bottom:1px solid #eee;font-weight:800;font-size:14px;background:#fff;}
        .claims-list-body{overflow:auto;flex:1;padding:10px;background:#fafafa;}
        .claim-row{display:block;width:100%;text-align:left;border:1px solid transparent;border-radius:16px;padding:14px;margin-bottom:8px;background:#fff;cursor:pointer;font:inherit;color:inherit;box-shadow:0 1px 0 rgba(0,0,0,.03);}
        .claim-row:hover{border-color:#ddd;}
        .claim-row.active{border-color:#111;box-shadow:0 8px 24px rgba(0,0,0,.07);}
        .claim-row-title{font-weight:800;font-size:15px;margin:0 0 6px;}
        .claim-row-meta{font-size:12px;color:#777;display:flex;flex-wrap:wrap;gap:6px;align-items:center;}
        .claim-pill{display:inline-flex;padding:3px 9px;border-radius:999px;border:1px solid #e0e0e0;font-size:11px;font-weight:700;text-transform:capitalize;background:#fff;}
        .claim-pill.tag-claim{background:#111;color:#fff;border-color:#111;}
        .claim-pill.tag-message{background:#fff;color:#111;border-color:#111;}
        .claim-detail{padding:16px 18px;border-bottom:1px solid #f0f0f0;background:#fff;}
        .claim-detail h3{margin:0 0 10px;font-size:17px;}
        .claim-detail dl{margin:0;display:grid;gap:10px;}
        .claim-detail dt{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#888;font-weight:800;}
        .claim-detail dd{margin:3px 0 0;font-size:14px;color:#222;line-height:1.45;word-break:break-word;}
        .claims-chat-thread{flex:1;overflow:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#f3f3f3;}
        .chat-bubble{max-width:82%;padding:10px 13px;border-radius:16px;font-size:14px;line-height:1.45;background:#fff;border:1px solid #eee;box-shadow:0 4px 12px rgba(0,0,0,.04);position:relative;}
        .chat-bubble.mine{align-self:flex-end;background:#111;color:#fff;border-color:#111;}
        .chat-bubble .chat-who{font-size:11px;font-weight:700;opacity:.7;margin-bottom:4px;}
        .chat-bubble .chat-when{font-size:10px;opacity:.55;margin-top:6px;display:flex;align-items:center;gap:8px;}
        .chat-msg-del{border:0;background:none;padding:0;margin-left:auto;font:inherit;font-size:11px;cursor:pointer;color:inherit;opacity:.55;text-decoration:underline;}
        .chat-msg-del:hover{opacity:1;}
        .claims-chat-compose{display:none;gap:8px;padding:12px;border-top:1px solid #eee;background:#fff;}
        .claims-chat-compose.is-open{display:flex;}
        .claims-chat-compose input{flex:1;height:44px;border:1px solid #ddd;border-radius:999px;padding:0 16px;font:inherit;outline:none;}
        .claims-chat-compose input:focus{border-color:#111;}
        .claims-chat-compose button{height:44px;border-radius:999px;padding:0 18px;}
        .claims-empty{padding:48px 20px;text-align:center;color:#888;font-size:14px;line-height:1.5;}
        .inbox-filter{display:flex;gap:8px;padding:10px 12px;border-bottom:1px solid #eee;background:#fff;flex-wrap:wrap;}
        .inbox-filter button{border:1px solid #e5e5e5;background:#fff;border-radius:999px;padding:7px 12px;font:inherit;font-size:12px;font-weight:700;cursor:pointer;}
        .inbox-filter button.active{background:#111;color:#fff;border-color:#111;}
      </style>

      <div class="claims-inbox-hero">
        <a class="claims-inbox-back" href="${backHref}">← Back</a>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(subtitle)}</p>
      </div>

      <div class="claims-inbox-shell">
        <div class="claims-list-panel">
          <div class="claims-list-head">Inbox</div>
          <div class="inbox-filter" id="inbox-filter">
            <button type="button" class="active" data-filter="all">All</button>
            <button type="button" data-filter="claim">Claims</button>
            <button type="button" data-filter="message">Messages</button>
          </div>
          <div class="claims-list-body" id="claims-list-body">
            <div class="claims-empty">Loading…</div>
          </div>
        </div>
        <div class="claims-chat-panel">
          <div class="claims-chat-head" id="claims-chat-head">Select a chat</div>
          <div id="claims-detail"></div>
          <div class="claims-chat-thread" id="claims-chat-thread">
            <div class="claims-empty">Select a claim or message on the left to open the conversation.</div>
          </div>
          <form class="claims-chat-compose" id="claims-chat-form" autocomplete="off">
            <input id="claims-chat-input" type="text" placeholder="Type a message…" maxlength="2000" />
            <button class="btn" type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  `;

  /** @type {{kind:'claim'|'message', id:string, title:string, status:string, who:string, at:any, preview:string, raw:any}[]} */
  let rows = [];
  let filter = "all";
  let selectedKey = null; // "claim:id" | "message:id"
  let active = null; // { kind, data }

  const listEl = $("#claims-list-body");
  const detailEl = $("#claims-detail");
  const threadEl = $("#claims-chat-thread");
  const headEl = $("#claims-chat-head");
  const formEl = $("#claims-chat-form");
  const inputEl = $("#claims-chat-input");

  document.querySelectorAll("#inbox-filter [data-filter]").forEach((btn) => {
    btn.onclick = () => {
      filter = btn.getAttribute("data-filter");
      document.querySelectorAll("#inbox-filter [data-filter]").forEach((b) => {
        b.classList.toggle("active", b === btn);
      });
      renderList();
    };
  });

  function visibleRows() {
    if (filter === "all") return rows;
    return rows.filter((r) => r.kind === filter);
  }

  function renderList() {
    const list = visibleRows();
    if (!list.length) {
      listEl.innerHTML = `<div class="claims-empty">Nothing here yet.<br/>Claims and messages will appear in this list.</div>`;
      return;
    }
    listEl.innerHTML = list
      .map((r) => {
        const key = `${r.kind}:${r.id}`;
        const activeCls = selectedKey === key ? "active" : "";
        let tag;
        if (r.kind === "message") {
          tag = `<span class="claim-pill tag-message">Message</span>`;
        } else if (r.claimRole === "outgoing") {
          tag = `<span class="claim-pill tag-claim">My Claim</span>`;
        } else {
          tag = `<span class="claim-pill tag-claim">Submitted Claim</span>`;
        }
        return `
          <button type="button" class="claim-row ${activeCls}" data-key="${escapeHtml(key)}">
            <p class="claim-row-title">${escapeHtml(r.title)}</p>
            <div class="claim-row-meta">
              ${tag}
              ${r.status ? `<span class="claim-pill">${escapeHtml(r.status)}</span>` : ""}
              <span>${escapeHtml(r.who)}</span>
              <span>·</span>
              <span>${escapeHtml(formatDate(r.at))}</span>
            </div>
            ${r.preview ? `<p style="margin:8px 0 0;font-size:12px;color:#666;line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(r.preview)}</p>` : ""}
          </button>
        `;
      })
      .join("");

    listEl.querySelectorAll("[data-key]").forEach((btn) => {
      btn.onclick = () => openRow(btn.getAttribute("data-key"));
    });
  }

  function renderThread(messages) {
    const msgs = Array.isArray(messages) ? messages : [];
    if (!msgs.length) {
      threadEl.innerHTML = `<div class="claims-empty">No messages yet. Send the first reply below.</div>`;
      return;
    }
    threadEl.innerHTML = msgs
      .map((m) => {
        const fromId = String((m.from && m.from._id) || m.from || "");
        const mine = fromId === myId;
        const msgId = m._id || m.id || "";
        const canDelete = msgId && (mine || isStaff);
        return `
          <div class="chat-bubble ${mine ? "mine" : ""}">
            <div class="chat-who">${escapeHtml(mine ? "You" : m.fromName || "User")}</div>
            <div>${escapeHtml(m.body || "")}</div>
            <div class="chat-when">
              <span>${escapeHtml(m.createdAt ? formatDate(m.createdAt) : "")}</span>
              ${canDelete ? `<button class="chat-msg-del" type="button" data-del-msg="${escapeHtml(msgId)}">Delete</button>` : ""}
            </div>
          </div>
        `;
      })
      .join("");
    threadEl.scrollTop = threadEl.scrollHeight;

    threadEl.querySelectorAll("[data-del-msg]").forEach((btn) => {
      btn.onclick = async () => {
        if (!active) return;
        const messageId = btn.getAttribute("data-del-msg");
        const ok = await confirmAction(
          "Delete message",
          "This deletes the message for everyone in this chat. This cannot be undone."
        );
        if (!ok) return;
        try {
          if (active.kind === "claim") {
            const res = await api(
              `/api/claims/${encodeURIComponent(active.data._id || active.data.id)}/messages/${encodeURIComponent(messageId)}`,
              { method: "DELETE" }
            );
            active.data = res.claim;
            renderThread(res.claim.messages);
          } else {
            const res = await api(
              `/api/items/conversations/${encodeURIComponent(active.data._id || active.data.id)}/messages/${encodeURIComponent(messageId)}`,
              { method: "DELETE" }
            );
            active.data = res.conversation;
            renderThread(res.conversation.messages);
          }
          toast("Message deleted.");
        } catch (err) {
          toast(err.message || "Unable to delete message.");
        }
      };
    });
  }

  function clearChat() {
    headEl.textContent = "Select a chat";
    detailEl.innerHTML = "";
    threadEl.innerHTML = `<div class="claims-empty">Select a claim or message on the left to open the conversation.</div>`;
    formEl.classList.remove("is-open");
    active = null;
    selectedKey = null;
  }

  async function openRow(key) {
    selectedKey = key;
    renderList();
    const [kind, id] = key.split(":");
    threadEl.innerHTML = `<div class="claims-empty">Loading…</div>`;
    formEl.classList.remove("is-open");
    try {
      if (kind === "claim") {
        const res = await api(`/api/claims/${encodeURIComponent(id)}`);
        const c = res.claim;
        active = { kind: "claim", data: c };
        const item = c.item || {};
        const claimant = c.claimant || {};
        const rowMeta = rows.find((r) => r.kind === "claim" && r.id === String(id));
        const roleLabel = rowMeta && rowMeta.claimRole === "outgoing" ? "My Claim Submission" : "Submitted Claim";
        headEl.textContent = item.title || "Claim";
        detailEl.innerHTML = `
          <div class="claim-detail">
            <h3>${escapeHtml(item.title || "Item")}</h3>
            <dl>
              <div><dt>Type</dt><dd>${escapeHtml(roleLabel)}</dd></div>
              <div><dt>Claimant</dt><dd>${escapeHtml(claimant.name || "—")}${claimant.email ? ` · ${escapeHtml(claimant.email)}` : ""}</dd></div>
              <div><dt>Status</dt><dd>${escapeHtml(c.status || "pending")}</dd></div>
              <div><dt>Reason</dt><dd>${escapeHtml(c.reason || "—")}</dd></div>
              <div><dt>Proof</dt><dd>${escapeHtml(c.proof || "—")}</dd></div>
              <div><dt>Routed to</dt><dd>${escapeHtml(c.routingTarget === "security" ? "Security desk" : "Item holder")}</dd></div>
            </dl>
            <button class="btn secondary" id="delete-claim-btn" type="button" style="margin-top:14px;width:100%;border-radius:999px;min-height:44px;">Delete claim</button>
          </div>
        `;
        renderThread(c.messages);
        formEl.classList.add("is-open");
        inputEl.focus();
        const delClaimBtn = $("#delete-claim-btn");
        if (delClaimBtn) {
          delClaimBtn.onclick = async () => {
            const ok = await confirmAction(
              "Delete claim",
              "This permanently deletes the claim and its chat. This cannot be undone."
            );
            if (!ok) return;
            try {
              await api(`/api/claims/${encodeURIComponent(id)}`, { method: "DELETE" });
              toast("Claim deleted.");
              rows = rows.filter((r) => !(r.kind === "claim" && r.id === String(id)));
              selectedKey = null;
              active = null;
              renderList();
              clearChat();
            } catch (err) {
              toast(err.message || "Unable to delete claim.");
            }
          };
        }
      } else {
        const res = await api(`/api/items/conversations/${encodeURIComponent(id)}`);
        const c = res.conversation;
        active = { kind: "message", data: c };
        const others = (c.participants || []).filter(
          (p) => String(p._id || p) !== myId
        );
        const who = others.map((p) => p.name || "User").join(", ") || "Conversation";
        headEl.textContent = c.itemTitle || (c.item && c.item.title) || "Message";
        detailEl.innerHTML = `
          <div class="claim-detail">
            <h3>${escapeHtml(c.itemTitle || (c.item && c.item.title) || "Item")}</h3>
            <dl>
              <div><dt>Type</dt><dd>Private message</dd></div>
              <div><dt>With</dt><dd>${escapeHtml(who)}</dd></div>
            </dl>
            <button class="btn secondary" id="delete-convo-btn" type="button" style="margin-top:14px;width:100%;border-radius:999px;min-height:44px;">Delete conversation</button>
          </div>
        `;
        renderThread(c.messages);
        formEl.classList.add("is-open");
        inputEl.focus();
        const delConvoBtn = $("#delete-convo-btn");
        if (delConvoBtn) {
          delConvoBtn.onclick = async () => {
            const ok = await confirmAction(
              "Delete conversation",
              "This permanently deletes this conversation and all its messages for everyone. This cannot be undone."
            );
            if (!ok) return;
            try {
              await api(`/api/items/conversations/${encodeURIComponent(id)}`, { method: "DELETE" });
              toast("Conversation deleted.");
              rows = rows.filter((r) => !(r.kind === "message" && r.id === String(id)));
              selectedKey = null;
              active = null;
              renderList();
              clearChat();
            } catch (err) {
              toast(err.message || "Unable to delete conversation.");
            }
          };
        }
      }
    } catch (err) {
      toast(err.message || "Unable to open.");
      clearChat();
      renderList();
    }
  }

  formEl.onsubmit = async (e) => {
    e.preventDefault();
    if (!active || !selectedKey) {
      toast("Select a chat first.");
      return;
    }
    const body = (inputEl.value || "").trim();
    if (!body) return;
    const btn = formEl.querySelector("button");
    inputEl.disabled = true;
    if (btn) btn.disabled = true;
    try {
      if (active.kind === "claim") {
        const res = await api(`/api/claims/${encodeURIComponent(active.data._id || active.data.id)}/messages`, {
          method: "POST",
          body: { body },
        });
        active.data = res.claim;
        renderThread(res.claim.messages);
      } else {
        const res = await api(
          `/api/items/conversations/${encodeURIComponent(active.data._id || active.data.id)}/messages`,
          { method: "POST", body: { body } }
        );
        active.data = res.conversation;
        renderThread(res.conversation.messages);
      }
      inputEl.value = "";
      // refresh preview in list
      const row = rows.find((r) => `${r.kind}:${r.id}` === selectedKey);
      if (row) {
        row.preview = body;
        row.at = new Date();
        renderList();
      }
    } catch (err) {
      toast(err.message || "Unable to send.");
    } finally {
      inputEl.disabled = false;
      if (btn) btn.disabled = false;
      inputEl.focus();
    }
  };

  try {
    const tasks = [];
    if (mode === "security") {
      tasks.push(api("/api/claims").catch(() => ({ claims: [] })));
      tasks.push(Promise.resolve({ claims: [] }));
    } else {
      tasks.push(api("/api/claims/on-my-found").catch(() => ({ claims: [] })));
      tasks.push(api("/api/claims/mine").catch(() => ({ claims: [] })));
    }
    tasks.push(api("/api/items/conversations").catch(() => ({ conversations: [] })));

    const [incomingRes, mineRes, convoRes] = await Promise.all(tasks);
    let incoming = Array.isArray(incomingRes.claims) ? incomingRes.claims : [];
    const mine = Array.isArray(mineRes.claims) ? mineRes.claims : [];
    let convos = Array.isArray(convoRes.conversations) ? convoRes.conversations : [];

    // Security must NEVER see user↔user (finder) claims — only department-held claims
    if (mode === "security") {
      incoming = incoming.filter((c) => String(c.routingTarget || "") === "security");
      // Security should not see private message threads they are not part of
      // (API already scopes by participant; keep as-is)
    }

    rows = [];

    incoming.forEach((c) => {
      rows.push({
        kind: "claim",
        claimRole: "incoming",
        id: String(c._id || c.id),
        title: (c.item && c.item.title) || "Claim",
        status: c.status || "pending",
        who: (c.claimant && c.claimant.name) || "Claimant",
        at: c.updatedAt || c.createdAt,
        preview: c.reason || "",
        raw: c,
      });
    });

    mine.forEach((c) => {
      const id = String(c._id || c.id);
      if (rows.some((r) => r.kind === "claim" && r.id === id)) return;
      rows.push({
        kind: "claim",
        claimRole: "outgoing",
        id,
        title: (c.item && c.item.title) || "Claim",
        status: c.status || "pending",
        who: "You submitted",
        at: c.updatedAt || c.createdAt,
        preview: c.reason || "",
        raw: c,
      });
    });

    convos.forEach((c) => {
      const others = (c.participants || []).filter(
        (p) => String(p._id || p) !== myId
      );
      rows.push({
        kind: "message",
        claimRole: "",
        id: String(c._id || c.id),
        title: c.itemTitle || (c.item && c.item.title) || "Message",
        status: "",
        who: others.map((p) => p.name || "User").join(", ") || "User",
        at: c.lastAt || c.updatedAt || c.createdAt,
        preview: c.lastMessage || "",
        raw: c,
      });
    });

    rows.sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0));
    renderList();
    clearChat();
  } catch (err) {
    listEl.innerHTML = `<div class="claims-empty">${escapeHtml(err.message || "Unable to load inbox.")}</div>`;
  }
}


async function router() {
  closeModal();

  $("#site-nav").classList.remove(
    "open"
  );

  $("#nav-toggle").setAttribute(
    "aria-expanded",
    "false"
  );

  await refreshUser();

  renderNav();

  const {
    parts,
    query,
  } = parseRoute();

  const root =
    parts[0] || "";

  if (!root) {
    return renderHome();
  }

  if (root === "lost") {
    return renderBrowse(
      "lost"
    );
  }

  if (root === "found") {
    return renderBrowse(
      "found"
    );
  }

  if (root === "item") {
    return renderItem(
      parts[1]
    );
  }

  if (root === "report") {
    return renderReport(
      query
    );
  }

  if (root === "login") {
    return renderAuth(
      "login"
    );
  }

  if (root === "register") {
    return renderAuth(
      "register"
    );
  }

  if (root === "about") {
    return renderAbout();
  }

  if (root === "profile") {
    return renderProfileSettings();
  }

  if (
    root ===
    "security-head"
  ) {
    if (parts[1] === "item" && parts[2]) {
      return renderSecurityItemRoute(parts[2]);
    }
    if (parts[1] === "submitted-claims") {
      return renderSubmittedClaimsInbox("security");
    }
    if (parts[1] === "verifications") {
      return renderItemVerificationsPage("security");
    }
    return renderSecurityHead(
      parts[1]
    );
  }

  if (
    root ===
    "sub-security"
  ) {
    if (parts[1] === "item" && parts[2]) {
      return renderSecurityItemDetail(parts[2]);
    }
    if (parts[1] === "submitted-claims") {
      return renderSubmittedClaimsInbox("security");
    }
    return renderSubSecurity(
      parts[1]
    );
  }

  if (root === "admin") {
    return renderSecurityHead(
      parts[1]
    );
  }

  if (root === "dashboard") {
    const role =
      getEffectiveRole(
        state.user
      );

    if (
      role ===
      "security_head"
    ) {
      return renderSecurityHead(
        parts[1]
      );
    }

    if (
      role ===
      "sub_security"
    ) {
      return renderSubSecurity(
        parts[1]
      );
    }

if (parts[1] === "found-claims") {
      return renderSubmittedClaimsInbox("finder");
    }
return renderUserPlatform(
  parts[1]
);
  }

  $("#app").innerHTML = `
    <div class="wrap">

      <div class="error-box">
        Page not found.
      </div>

    </div>
  `;
}

document.addEventListener(
  "click",
  (e) => {
    if (
      e.target.closest(
        "[data-close-modal]"
      )
    ) {
      closeModal();
    }
  }
);

document.addEventListener(
  "keydown",
  (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  }
);

$("#nav-toggle").addEventListener(
  "click",
  () => {
    const open =
      $("#site-nav").classList.toggle(
        "open"
      );

    $("#nav-toggle").setAttribute(
      "aria-expanded",
      String(open)
    );
  }
);

applyFinalVisualOverrides();

window.addEventListener(
  "hashchange",
  router
);

router();