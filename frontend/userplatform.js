/*
 * userplatform.js
 * Normal-user dashboard only.
 * Security Head and Sub Security dashboards are not modified here.
 */

window.renderUserPlatform = async function renderUserPlatform(tab) {
  if (!requireAuth("#/dashboard")) return;

  const role =
    typeof getEffectiveRole === "function"
      ? getEffectiveRole(state.user)
      : state.user?.role;

  if (role !== "user") {
    if (typeof navigate === "function") {
      navigate(dashboardRoute());
    } else {
      location.hash = "#/dashboard";
    }
    return;
  }

  const current = tab || "overview";

  const tabs = [
    ["overview", "Overview", "#/dashboard/overview"],
    ["lost", "My Lost Reports", "#/dashboard/lost"],
    ["found", "My Found Reports", "#/dashboard/found"],
    ["claims", "My Claims", "#/dashboard/claims"],
    ["browse-lost", "Browse Lost Items", "#/lost"],
    ["browse-found", "Browse Found Items", "#/found"],
  ];

  $("#app").innerHTML = `
    <div class="wrap sec-dash user-platform">
      <header class="sec-dash-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="sec-dash-sub">
          Signed in as
          <span>${escapeHtml(state.user.name || "User")}</span>
          · ${escapeHtml(state.user.userType || state.user.role || "Student / User")}
        </p>
      </header>

      <nav
        class="dash-nav sec-nav-primary user-platform-nav"
        aria-label="User Dashboard Navigation"
        style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:0;"
      >
        ${tabs
          .map(
            ([id, label, href]) => `
          <a
            class="btn ${current === id ? "" : "secondary"}"
            href="${href}"
            style="width:100%;"
          >
            ${escapeHtml(label)}
          </a>
        `
          )
          .join("")}
      </nav>

      <div id="user-platform-content">
        <div class="loading">Loading dashboard…</div>
      </div>
    </div>

    ${typeof footer === "function" ? footer() : ""}
  `;

  const content = document.getElementById("user-platform-content");
  if (!content) return;

  // Browse tabs navigate to public browse pages
  if (current === "browse-lost") {
    location.hash = "#/lost";
    return;
  }
  if (current === "browse-found") {
    location.hash = "#/found";
    return;
  }

  try {
    const myId = String(
      (state.user && (state.user.id || state.user._id)) || ""
    );

    // Own reports only: mine=true + client-side owner check
    const [data, lostRes, foundRes, onMyFound, mineClaimsRes] = await Promise.all([
      api("/api/users/me/dashboard"),
      api("/api/items?type=lost&mine=true&limit=100"),
      api("/api/items?type=found&mine=true&limit=100"),
      api("/api/claims/on-my-found").catch(() => ({ claims: [] })),
      api("/api/claims/mine").catch(() => ({ claims: [] })),
    ]);
    const foundItemClaims = Array.isArray(onMyFound.claims) ? onMyFound.claims : [];
    const stats = data.stats || {};

    const isMine = (item) => {
      if (!item || !myId) return false;
      const owner =
        (item.user && (item.user.id || item.user._id)) || item.user;
      return String(owner) === myId;
    };

    let lostReports = Array.isArray(lostRes.items)
      ? lostRes.items
      : Array.isArray(data.lostReports)
        ? data.lostReports
        : [];
    let foundReports = Array.isArray(foundRes.items)
      ? foundRes.items
      : Array.isArray(data.foundReports)
        ? data.foundReports
        : [];

    lostReports = lostReports.filter(isMine);
    foundReports = foundReports.filter(isMine);

    // Prefer dedicated /mine endpoint; fall back to dashboard claims
    const claims = Array.isArray(mineClaimsRes.claims) && mineClaimsRes.claims.length
      ? mineClaimsRes.claims
      : Array.isArray(data.claims)
        ? data.claims
        : [];

    const statusText = (item) => {
      if (typeof itemPublicStatus === "function") return itemPublicStatus(item);
      return String(item.status || "open").replace(/_/g, " ");
    };

    // Same list UI as Browse Lost / Browse Found (publicBrowseItem rows)
    const browseListStyles = `
        <style id="user-platform-browse-styles">
          .public-browse-results{
            display:flex;
            flex-direction:column;
            gap:12px;
            margin-top:8px;
          }
          .public-item-row{
            display:grid;
            grid-template-columns:72px minmax(0,1fr) auto;
            gap:16px;
            align-items:center;
            padding:14px 16px;
            border:1px solid var(--line);
            border-radius:18px;
            background:#fff;
            text-decoration:none;
            color:inherit;
            box-shadow:0 10px 28px rgba(0,0,0,.04);
            transition:border-color .15s ease, box-shadow .15s ease, transform .15s ease;
          }
          .public-item-row:hover{
            border-color:#111;
            box-shadow:0 14px 32px rgba(0,0,0,.07);
            transform:translateY(-1px);
          }
          .public-item-row:focus-visible{
            outline:2px solid #111;
            outline-offset:2px;
          }
          .public-item-thumb{
            width:72px;
            height:72px;
            border-radius:14px;
            overflow:hidden;
            background:#f3f3f3;
            display:flex;
            align-items:center;
            justify-content:center;
            flex-shrink:0;
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
            flex-wrap:wrap;
          }
          .public-item-title-line .pill{
            flex-shrink:0;
          }
          .public-item-title-line h2{
            margin:0;
            font-size:18px;
            font-weight:700;
            letter-spacing:-0.02em;
            line-height:1.25;
          }
          .public-item-meta{
            display:flex;
            flex-wrap:wrap;
            align-items:center;
            gap:6px;
            margin-top:6px;
            color:#777;
            font-size:13px;
          }
          .public-item-dot{
            opacity:.7;
          }
          .public-item-side{
            display:flex;
            align-items:center;
            gap:10px;
            padding-left:8px;
          }
          .public-item-status{
            display:inline-flex;
            align-items:center;
            min-height:32px;
            padding:0 12px;
            border:1px solid var(--line);
            border-radius:999px;
            background:#fff;
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
          @media (max-width:760px){
            .public-item-row{
              grid-template-columns:minmax(0,1fr) 48px !important;
              grid-template-areas:"main thumb" "side side" !important;
              gap:10px !important;
              padding:14px 18px 14px 16px !important;
              overflow:hidden !important;
              box-sizing:border-box !important;
            }
            .public-item-main{ grid-area:main !important; min-width:0 !important; }
            .public-item-thumb{
              grid-area:thumb !important;
              width:48px !important;
              height:48px !important;
              border-radius:10px !important;
              border:1.5px solid #111 !important;
              box-sizing:border-box !important;
              margin:0 !important;
              justify-self:end !important;
              overflow:hidden !important;
            }
            .public-item-thumb img{
              width:100% !important;
              height:100% !important;
              object-fit:cover !important;
              display:block !important;
            }
            .public-item-title-line h2{ font-size:16px !important; order:-1 !important; }
            .public-item-side{ grid-area:side !important; padding-left:0 !important; }
            .public-item-arrow{ display:none !important; }
          }
        </style>
    `;

    const myReportRow = (item) => {
      const id = item._id || item.id;
      const typeLabel = item.type === "lost" ? "Lost" : "Found";
      const status =
        typeof displayItemStatus === "function"
          ? displayItemStatus(item)
          : String(item.status || "");
      const location = item.location || "Location not specified";
      const category = item.category || "Other";
      const removed = item.status === "removed";
      const href = `#/item/${escapeHtml(String(id))}`;
      return `
        <div class="public-item-row my-report-row" data-href="${href}" role="link" tabindex="0">
          <div class="public-item-thumb">
            ${item.image
              ? `<img src="${escapeHtml(item.image)}" alt="" loading="lazy" />`
              : `<span aria-hidden="true">${escapeHtml((item.title || "?").slice(0, 1).toUpperCase())}</span>`}
          </div>
          <div class="public-item-main">
            <div class="public-item-title-line">
              <h2>${escapeHtml(item.title || "Untitled item")}</h2>
              <span class="pill ${item.type === "lost" ? "type-lost" : ""}">${escapeHtml(typeLabel)}</span>
              ${removed ? `<span class="pill" style="border-color:#999;color:#666;">Removed</span>` : ""}
            </div>
            <div class="public-item-meta">
              <span>${escapeHtml(category)}</span>
              <span class="public-item-dot" aria-hidden="true">·</span>
              <span>${escapeHtml(location)}</span>
              <span class="public-item-dot" aria-hidden="true">·</span>
              <span>${escapeHtml(typeof formatDate === "function" ? formatDate(item.date) : "")}</span>
              <span class="public-item-dot" aria-hidden="true">·</span>
              <span>${escapeHtml(status)}</span>
            </div>
          </div>
          <div class="public-item-side my-report-actions">
            <a class="btn report-action-open" href="${href}">Open</a>
            ${removed
              ? `<button type="button" class="btn report-action-remove" data-perm-delete="${escapeHtml(String(id))}">Delete</button>`
              : `<button type="button" class="btn report-action-remove" data-soft-delete="${escapeHtml(String(id))}">Remove</button>`}
          </div>
        </div>
      `;
    };

    const renderItems = (items, emptyMessage, kindLabel) => {
      if (!items.length) {
        return `<div class="empty public-browse-empty">${escapeHtml(emptyMessage)}</div>`;
      }
      const rows = items.map(myReportRow).join("");
      const countLabel = kindLabel || "item";
      return `
        ${browseListStyles}
        <div class="public-browse-results" id="user-dash-items">
          ${rows}
        </div>
        <p class="public-browse-count">${items.length} ${countLabel}${items.length === 1 ? "" : "s"}</p>
      `;
    };

    let body = "";

    if (current === "overview") {
      body = `
        <div
          class="stats user-platform-stats"
          style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;"
        >
          <div class="stat">
            <b>${lostReports.length}</b>
            Lost Reports
          </div>
          <div class="stat">
            <b>${foundReports.length}</b>
            Found Reports
          </div>
          <div class="stat">
            <b>${Number(stats.activeClaims || 0)}</b>
            Active Claims
          </div>
          <div class="stat">
            <b>${Number(stats.resolvedItems || 0)}</b>
            Resolved Items
          </div>
        </div>

        <a
          href="#/dashboard/found-claims"
          class="panel"
          style="display:block;margin-top:18px;padding:22px 24px;border-radius:20px;background:#fff;border:1px solid var(--line,#e5e5e5);text-decoration:none;color:#111;box-shadow:0 10px 28px rgba(0,0,0,.04);"
        >
          <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
            <div>
              <p style="margin:0;font-size:11px;letter-spacing:.12em;font-weight:800;color:#777;text-transform:uppercase;">Claims</p>
              <h2 style="margin:6px 0 4px;font-size:20px;letter-spacing:-.03em;">Submitted claims for your found reports & Messages for you</h2>
              <p style="margin:0;color:#666;font-size:14px;">
                ${foundItemClaims.length
                  ? `${foundItemClaims.length} item${foundItemClaims.length === 1 ? "" : "s"} in your claims & messages inbox`
                  : "Claims and messages about your found items appear here"}
              </p>
            </div>
            <span class="btn secondary" style="pointer-events:none;border-radius:999px;">Open</span>
          </div>
        </a>
      `;
    } else if (current === "lost") {
      body = `
        <div class="section-heading-inline">
          <div>
            <p class="eyebrow">MY REPORTS</p>
            <h2>Lost Reports</h2>
          </div>
        </div>
        ${renderItems(
          lostReports,
          "You have not reported any lost items yet.",
          "lost item"
        )}
      `;
    } else if (current === "found") {
      body = `
        <div class="section-heading-inline">
          <div>
            <p class="eyebrow">MY REPORTS</p>
            <h2>Found Reports</h2>
          </div>
        </div>
        ${renderItems(
          foundReports,
          "You have not reported any found items yet.",
          "found item"
        )}
      `;
    } else if (current === "claims") {
      body = claims.length
        ? `
          <div class="section-heading-inline">
            <div>
              <p class="eyebrow">CLAIMS</p>
              <h2>My Claims</h2>
            </div>
          </div>
          <div class="table-wrap panel">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${claims
                  .map((claim) => {
                    const item = claim.item || {};
                    const itemId = item._id || item.id || "";
                    const st =
                      typeof statusLabel === "function"
                        ? statusLabel(claim.status)
                        : claim.status || "Pending";
                    const claimId = claim._id || claim.id || "";
                    return `
                      <tr>
                        <td><strong>${escapeHtml(
                          item.title || "Item"
                        )}</strong></td>
                        <td>${escapeHtml(st)}</td>
                        <td>${escapeHtml(
                          typeof formatDate === "function"
                            ? formatDate(claim.createdAt)
                            : String(claim.createdAt || "")
                        )}</td>
                        <td style="white-space:nowrap;">
                          ${
                            itemId
                              ? `<a class="btn secondary" href="#/item/${encodeURIComponent(
                                  itemId
                                )}" style="border-radius:999px;padding:8px 14px;font-size:13px;">View</a>`
                              : ""
                          }
                          ${
                            claimId
                              ? `<button type="button" class="btn ghost" data-claim-delete="${escapeHtml(
                                  String(claimId)
                                )}" style="border-radius:999px;padding:8px 14px;font-size:13px;margin-left:8px;">Delete</button>`
                              : ""
                          }
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
          <div class="section-heading-inline">
            <div>
              <p class="eyebrow">CLAIMS</p>
              <h2>My Claims</h2>
            </div>
          </div>
          <div class="empty">
            You have not submitted any claims yet. Browse Found Items and use
            <strong>Submit a Claim</strong> on an item that may be yours.
          </div>
        `;
    } else {
      body = `<div class="empty">Page not found.</div>`;
    }

    content.innerHTML = body;
    if (typeof applyFinalVisualOverrides === "function") {
      applyFinalVisualOverrides();
    }

    // Delete my submitted claim
    content.querySelectorAll("[data-claim-delete]").forEach((btn) => {
      btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute("data-claim-delete");
        if (!id) return;
        const ok =
          typeof confirmAction === "function"
            ? await confirmAction(
                "Delete claim",
                "This permanently deletes your claim and its chat. This cannot be undone."
              )
            : window.confirm("Delete this claim permanently?");
        if (!ok) return;
        try {
          await api(`/api/claims/${encodeURIComponent(id)}`, { method: "DELETE" });
          toast("Claim deleted.");
          renderUserPlatform("claims");
        } catch (err) {
          toast(err.message || "Unable to delete claim.");
        }
      };
    });

    // Soft remove (hide from public, keep in My Reports as Removed)
    content.querySelectorAll("[data-soft-delete]").forEach((btn) => {
      btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute("data-soft-delete");
        const ok =
          typeof confirmAction === "function"
            ? await confirmAction("Remove report", "This hides the report from public listings. It will stay in My Reports as Removed.")
            : window.confirm("Remove this report from public listings?");
        if (!ok) return;
        try {
          await api(`/api/items/${encodeURIComponent(id)}`, { method: "DELETE" });
          toast("Report removed from public list.");
          renderUserPlatform(current);
        } catch (err) {
          toast(err.message || "Unable to remove.");
        }
      };
    });

    // Permanent delete (gone from My Reports too)
    content.querySelectorAll("[data-perm-delete]").forEach((btn) => {
      btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute("data-perm-delete");
        const ok =
          typeof confirmAction === "function"
            ? await confirmAction("Permanently delete", "This permanently deletes the report from the database. This cannot be undone.")
            : window.confirm("Permanently delete this report?");
        if (!ok) return;
        try {
          // Hide forever from My Reports (works without hard-delete permission issues)
          await api(`/api/items/${encodeURIComponent(id)}/owner-hide`, { method: "POST", body: {} });

    // Mobile/desktop: whole my-report card opens item (except action buttons)
    document.querySelectorAll(".my-report-row").forEach((row) => {
      row.addEventListener("click", (e) => {
        if (e.target.closest("[data-soft-delete], [data-perm-delete], .report-action-remove, a.report-action-open")) {
          return;
        }
        const href = row.getAttribute("data-href");
        if (href) location.hash = href;
      });
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const href = row.getAttribute("data-href");
          if (href) location.hash = href;
        }
      });
    });

          toast("Report permanently deleted.");
          renderUserPlatform(current);
        } catch (err) {
          toast(err.message || "Unable to delete.");
        }
      };
    });
  } catch (error) {
    content.innerHTML = `
      <div class="error-box">
        ${escapeHtml(error.message || "Unable to load dashboard.")}
      </div>
    `;
  }

  window.scrollTo({ top: 0, behavior: "instant" });
};
