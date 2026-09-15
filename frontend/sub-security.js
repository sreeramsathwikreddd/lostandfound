(function () {
  "use strict";

  function escape(value) {
    if (typeof window.escapeHtml === "function") {
      return window.escapeHtml(value == null ? "" : String(value));
    }
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function roleOf(user) {
    if (typeof window.getEffectiveRole === "function") {
      return window.getEffectiveRole(user);
    }
    return user && user.role ? user.role : "";
  }

  function formatDateValue(value) {
    if (typeof window.formatDateTime === "function") {
      return window.formatDateTime(value, "");
    }
    if (typeof window.formatDate === "function") {
      return window.formatDate(value);
    }
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-GB");
  }

  function itemId(item) {
    return item && (item._id || item.id);
  }

  function statusForLost(item) {
    if (typeof window.lostDisplayStatus === "function") {
      return window.lostDisplayStatus(item);
    }
    if (typeof window.displayItemStatus === "function") {
      return window.displayItemStatus(item);
    }
    return item && item.status ? item.status : "—";
  }

  function actionForLost(item) {
    if (typeof window.lostActionLabel === "function") {
      return window.lostActionLabel(item);
    }
    if (item && item.actionTaken === "submitted_to_owner") return "Submitted to owner";
    if (item && item.actionTaken === "in_department") return "Submitted in department";
    return "Not found yet";
  }

  function verificationLabel(item) {
    if (typeof window.foundVerificationLabel === "function") {
      return window.foundVerificationLabel(item);
    }
    const custody = (item && item.foundCustody) || {};
    if (custody.mode === "security" && custody.verificationStatus === "pending") return "Pending verification";
    if (custody.mode === "security" && custody.verificationStatus === "verified") return "Verified & live";
    if (custody.mode === "security" && custody.verificationStatus === "rejected") return "Not verified";
    if (custody.mode === "self") return "Live — self custody";
    return "Pending";
  }

  function nav(current) {
    const tabs = [
      ["overview", "Overview"],
      ["lost-items", "All Lost Items"],
      ["found-items", "All Found Items"],
      ["verifications", "Item Verifications"],
      ["submitted-claims", "Claims & Messages"],
    ];

    return `
      <nav class="dash-nav sec-nav-primary sub-security-nav" aria-label="Sub Security Navigation">
        ${tabs.map(([id, label]) => `
          <a class="btn ${current === id ? "" : "secondary"}" href="#/sub-security/${id}">
            ${label}
          </a>
        `).join("")}
      </nav>
    `;
  }

  function loading() {
    return `
      <div class="wrap sec-dash sub-security-dash">
        <p class="loading">Loading Sub Security dashboard…</p>
      </div>
    `;
  }

  async function renderSubSecurityPortal(tab) {
    if (typeof window.requireAuth === "function" && !window.requireAuth()) return;

    let user = null;

    try {
      if (typeof window.api === "function") {
        const me = await window.api("/api/auth/me");
        user = me && me.user ? me.user : null;
      }
    } catch (_err) {
      user = null;
    }

    if (!user && typeof window.getCurrentUser === "function") {
      user = window.getCurrentUser();
    }

    if (roleOf(user) !== "sub_security") {
      if (typeof window.renderSecurityHead === "function" && roleOf(user) === "security_head") {
        return window.renderSecurityHead(tab);
      }

      const app = document.querySelector("#app");
      if (app) {
        app.innerHTML = `
          <div class="wrap sec-dash sub-security-dash">
            <div class="error-box">Sub Security access required.</div>
          </div>
        `;
      }
      return;
    }

    const current = tab || "overview";
    if (current === "verifications") {
      if (typeof window.renderItemVerificationsPage === "function") {
        return window.renderItemVerificationsPage("security");
      }
    }
    if (current === "submitted-claims" || current === "claims" || current === "claims-inbox") {
      if (typeof window.renderSubmittedClaimsInbox === "function") {
        return window.renderSubmittedClaimsInbox("security");
      }
    }

    const app = document.querySelector("#app");
    if (!app) return;

    app.innerHTML = loading();

    try {
      const statsResponse = await window.api("/api/users/stats");
      const stats = statsResponse && statsResponse.stats ? statsResponse.stats : {};
      let body = "";

      if (current === "overview") {
        const itemsResponse = await window.api("/api/items?limit=100");
        const items = Array.isArray(itemsResponse.items) ? itemsResponse.items.filter((item) => item.status !== "removed") : [];
        const lost = items.filter((item) => item.type === "lost").length;
        const found = items.filter((item) => item.type === "found").length;
        const pending = items.filter((item) => {
          const custody = item.foundCustody || {};
          return item.type === "found" && custody.mode === "security" && String(custody.verificationStatus || "").toLowerCase() === "pending";
        }).length;

        body = `
          <div class="stats sub-security-stats">
            <div class="stat"><b>${Number(stats.totalUsers || 0)}</b>Registered Users</div>
            <div class="stat"><b>${lost}</b>Lost Reports</div>
            <div class="stat"><b>${found}</b>Found Reports</div>
            <div class="stat"><b>${pending}</b>Pending Verifications</div>
          </div>

          <a href="#/sub-security/submitted-claims" class="panel" style="display:block;margin-top:20px;padding:22px 24px;border-radius:20px;background:#fff;border:1px solid var(--line,#e5e5e5);text-decoration:none;color:#111;box-shadow:0 10px 28px rgba(0,0,0,.04);">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
              <div>
                <p style="margin:0;font-size:11px;letter-spacing:.12em;font-weight:800;color:#777;text-transform:uppercase;">Inbox</p>
                <h2 style="margin:6px 0 4px;font-size:20px;letter-spacing:-.03em;">Submitted claims for your found reports &amp; Messages for you</h2>
                <p style="margin:0;color:#666;font-size:14px;">Claims and messages routed to Security. Open to reply.</p>
              </div>
              <span class="btn secondary" style="pointer-events:none;border-radius:999px;">Open</span>
            </div>
          </a>
        `;
      } else if (current === "lost-items") {
        const response = await window.api("/api/items?type=lost&limit=100");
        const rows = Array.isArray(response.items) ? response.items.filter((item) => item.status !== "removed") : [];

        body = `
          <div class="sec-toolbar">
            <div>
              <h3>All Lost Items</h3>
              <p class="sec-section-hint">Every active lost report on the platform.</p>
            </div>
          </div>

          ${rows.length ? `
            <div class="table-wrap panel sub-security-table-wrap">
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
                  ${rows.map((item) => {
                    const id = itemId(item);
                    const status = statusForLost(item);
                    return `
                      <tr>
                        <td><a href="#/sub-security/item/${escape(id)}"><strong>${escape(item.title || "Untitled item")}</strong></a></td>
                        <td>${escape(item.category || "—")}</td>
                        <td><span class="${status === "Not yet Found" ? "badge-status-disabled" : "badge-status-active"}">${escape(status)}</span></td>
                        <td>${escape(typeof window.formatDateTime === "function" ? window.formatDateTime(item.date, item.time) : formatDateValue(item.date))}</td>
                        <td>${escape(actionForLost(item))}</td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          ` : `<div class="empty">No lost items found.</div>`}
        `;
      } else if (current === "found-items") {
        const response = await window.api("/api/items?type=found&limit=100");
        const rows = Array.isArray(response.items) ? response.items.filter((item) => item.status !== "removed") : [];

        body = `
          <div class="sec-toolbar">
            <div>
              <h3>All Found Items</h3>
              <p class="sec-section-hint">Every found report on the platform.</p>
            </div>
          </div>

          ${rows.length ? `
            <div class="table-wrap panel sub-security-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date &amp; Time</th>
                    <th>Submitted To</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows.map((item) => {
                    const custody = item.foundCustody || {};
                    const mode = String(custody.mode || "").toLowerCase();
                    const status = verificationLabel(item);
                    const id = itemId(item);
                    const submittedTo = mode === "security"
                      ? (custody.holderDetails?.name || "Security / Official")
                      : mode === "self"
                        ? "Self"
                        : "—";
                    const pending = String(custody.verificationStatus || "").toLowerCase() === "pending";
                    return `
                      <tr>
                        <td><a href="#/sub-security/item/${escape(id)}"><strong>${escape(item.title || "Untitled item")}</strong></a></td>
                        <td>${escape(item.category || "—")}</td>
                        <td><span class="${pending ? "badge-status-disabled" : "badge-status-active"}">${escape(status)}</span></td>
                        <td>${escape(typeof window.formatDateTime === "function" ? window.formatDateTime(item.date, item.time) : formatDateValue(item.date))}</td>
                        <td>${escape(submittedTo)}</td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          ` : `<div class="empty">No found items found.</div>`}
        `;
      } else {
        return renderSubSecurityPortal("overview");
      }

      app.innerHTML = `
        <div class="wrap sec-dash sub-security-dash">
          <header class="sec-dash-header">
            <h1 class="page-title">Sub Security</h1>
            <p class="sec-dash-sub">
              Signed in as <span>${escape((user && user.name) || "Sub Security")}</span>
              · ${escape((user && user.email) || "")}
            </p>
          </header>

          ${nav(current)}

          <main class="sub-security-content ${current === "overview" ? "" : "sec-dash-content-card"}">
            ${body}
          </main>
        </div>
        ${typeof window.footer === "function" ? window.footer() : ""}
      `;
    } catch (error) {
      app.innerHTML = `
        <div class="wrap sec-dash sub-security-dash">
          <div class="error-box">${escape(error && error.message ? error.message : "Unable to load Sub Security dashboard.")}</div>
        </div>
      `;
    }
  }

  window.renderSubSecurity = renderSubSecurityPortal;
  window.renderSubSecurityPortal = renderSubSecurityPortal;

  const currentPath = () => {
    const raw = String(location.hash || "#/" ).replace(/^#/, "");
    return raw.split("?")[0];
  };

  if (currentPath().startsWith("/sub-security")) {
    window.setTimeout(() => {
      if (typeof window.router === "function") {
        window.router();
      } else {
        renderSubSecurityPortal((currentPath().split("/")[2] || "overview"));
      }
    }, 150);
  }
})();