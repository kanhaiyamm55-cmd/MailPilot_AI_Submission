
const emails = [
  {
    id: 1, sender: "Sarah Johnson", initials: "SJ",
    email: "sarah@acme.com", subject: "Approval needed: Q4 campaign budget",
    time: "09:42 AM", category: "client", priority: "High",
    preview: "We need your approval on the revised marketing budget before the campaign goes live.",
    body: "Hi,\n\nWe've finalized the revised Q4 marketing campaign budget. The total investment is $18,500, including the new social media campaign and creative production.\n\nCould you review and approve the budget before Wednesday? We need your confirmation to move forward.\n\nBest,\nSarah",
    summary: "Sarah is requesting approval for the revised Q4 marketing campaign budget of $18,500.",
    reason: "Financial approval is a client-level decision. The assistant should not approve budget changes without authorization.",
    action: "Review the budget and confirm whether the proposed campaign investment is approved.",
    reply: "Hi Sarah,\n\nThanks for sharing the revised budget. I've received the proposal and will review the details. I'll get back to you with my approval shortly.\n\nBest regards"
  },
  {
    id: 2, sender: "Michael Chen", initials: "MC",
    email: "michael@designco.com", subject: "Meeting confirmation for Thursday",
    time: "09:15 AM", category: "assistant", priority: "Normal",
    preview: "Just confirming our product design review meeting for Thursday at 2 PM.",
    body: "Hello,\n\nJust checking that our product design review is confirmed for Thursday at 2 PM. Please let me know if the calendar invitation needs to be resent.\n\nThanks,\nMichael",
    summary: "Michael wants to confirm the Thursday 2 PM product design review meeting.",
    reason: "This is routine scheduling communication that the assistant can handle.",
    action: "Confirm the meeting time and update the calendar if necessary.",
    reply: "Hi Michael,\n\nThanks for checking. Thursday at 2 PM is confirmed. The calendar invitation is in place, and we look forward to the discussion.\n\nBest,\nPersonal Assistant"
  },
  {
    id: 3, sender: "Emily Roberts", initials: "ER",
    email: "emily@globalmedia.com", subject: "Partnership proposal - decision required",
    time: "Yesterday", category: "client", priority: "High",
    preview: "We would love to move forward with the partnership. Please confirm your interest.",
    body: "Dear Team,\n\nWe are excited to share our partnership proposal for the upcoming quarter. We believe this collaboration could create significant value for both organizations.\n\nPlease confirm whether you would like to proceed so we can prepare the agreement.\n\nWarm regards,\nEmily",
    summary: "Emily is asking for a decision on a potential business partnership.",
    reason: "Accepting a business partnership is a strategic decision and requires the client's personal approval.",
    action: "Review the partnership opportunity and decide whether to proceed.",
    reply: "Hi Emily,\n\nThank you for considering us for this partnership. We appreciate the opportunity and would like to review the proposal in more detail before confirming our decision.\n\nBest regards"
  },
  {
    id: 4, sender: "David Wilson", initials: "DW",
    email: "david@techsolutions.com", subject: "Invoice receipt and payment update",
    time: "Yesterday", category: "assistant", priority: "Normal",
    preview: "This is to confirm that we have received your invoice. Payment is being processed.",
    body: "Hello,\n\nThis is to confirm that your invoice has been received by our accounts team. The payment is currently being processed and should be completed within the standard payment cycle.\n\nRegards,\nDavid",
    summary: "David confirms receipt of an invoice and shares a routine payment status update.",
    reason: "This is an informational update. The assistant can acknowledge receipt and track payment.",
    action: "Acknowledge the update and add a payment follow-up if needed.",
    reply: "Hi David,\n\nThank you for the update and confirmation. We appreciate you keeping us informed.\n\nBest regards,\nPersonal Assistant"
  },
  {
    id: 5, sender: "Olivia Martinez", initials: "OM",
    email: "olivia@brandstudio.com", subject: "Design assets ready for review",
    time: "Yesterday", category: "assistant", priority: "Normal",
    preview: "The updated brand assets are ready. Please find the review package attached.",
    body: "Hi,\n\nThe updated brand assets are ready for your review. We have included the revised logo concepts, color palette and social media templates in the review package.\n\nLet us know if you need anything else.\n\nOlivia",
    summary: "Olivia has shared the updated brand design assets for review.",
    reason: "The assistant can acknowledge receipt, organize the assets and prepare them for the client's review.",
    action: "Save the assets and share them with the client for final feedback.",
    reply: "Hi Olivia,\n\nThank you for sharing the updated assets. We have received the package and will review it with the team.\n\nBest,\nPersonal Assistant"
  },
  {
    id: 6, sender: "James Taylor", initials: "JT",
    email: "james@northstar.com", subject: "Waiting for your feedback",
    time: "Monday", category: "waiting", priority: "Normal",
    preview: "Following up on the proposal shared earlier. Looking forward to your feedback.",
    body: "Hi,\n\nI wanted to follow up on the proposal I shared last week. Please let me know if you have had a chance to review it.\n\nLooking forward to hearing from you.\n\nBest,\nJames",
    summary: "James is following up on a proposal and is waiting for feedback.",
    reason: "A response is pending. The client should review the proposal before a decision is made.",
    action: "Check the earlier proposal and decide whether a follow-up response is appropriate.",
    reply: "Hi James,\n\nThank you for following up. We are reviewing the proposal and will share an update with you soon.\n\nBest regards"
  }
];

const accounts = [
  {name:"Primary Workspace", email:"assistant@workspace.demo", provider:"Workspace", symbol:"M"},
  {name:"Business Inbox", email:"business@workspace.demo", provider:"Business", symbol:"B"}
];

let selectedId = null;
let toastTimer;

const $ = id => document.getElementById(id);
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));

function notify(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function getBadge(category) {
  if (category === "client") return '<span class="type-badge badge-client">CLIENT REPLY</span>';
  if (category === "waiting") return '<span class="type-badge badge-waiting">AWAITING RESPONSE</span>';
  return '<span class="type-badge badge-assistant">ASSISTANT CAN HANDLE</span>';
}

function updateStats() {
  $("totalEmails").textContent = String(emails.length).padStart(2,"0");
  $("clientReplies").textContent = String(emails.filter(e => e.category === "client").length).padStart(2,"0");
  $("assistantReplies").textContent = String(emails.filter(e => e.category === "assistant").length).padStart(2,"0");
  $("waitingCount").textContent = String(emails.filter(e => e.category === "waiting").length).padStart(2,"0");
  $("inboxCount").textContent = emails.length;
  $("attentionCount").textContent = emails.filter(e => e.category === "client").length;
}

function showView(view) {
  document.querySelectorAll(".view").forEach(el => el.classList.remove("active-view"));
  const target = $(view + "View");
  if (target) target.classList.add("active-view");
  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
  const titles = {overview:"Overview",inbox:"Smart Inbox",attention:"Client Attention",accounts:"Email Accounts"};
  $("pageTitle").textContent = titles[view] || "Overview";
  $("sidebar").classList.remove("open");
  if (view === "inbox") renderInbox();
  if (view === "attention") renderAttention();
  if (view === "accounts") renderAccounts();
}

function renderPriority() {
  const list = emails.filter(e => e.category === "client").slice(0,4);
  $("priorityList").innerHTML = list.length ? list.map(e => `
    <div class="priority-item" data-open="${e.id}">
      <div class="email-avatar">${escapeHTML(e.initials)}</div>
      <div class="priority-info"><strong>${escapeHTML(e.sender)}</strong><p>${escapeHTML(e.subject)}</p></div>
      <span class="priority-time">${escapeHTML(e.time)}</span>
    </div>`).join("") : '<p class="no-results">No priority emails right now.</p>';
}

function renderInbox() {
  const search = $("searchInput").value.toLowerCase().trim();
  const filter = $("filterSelect").value;
  const filtered = emails.filter(e => {
    const matches = [e.sender,e.email,e.subject,e.preview].join(" ").toLowerCase().includes(search);
    return matches && (filter === "all" || e.category === filter);
  });
  $("emailList").innerHTML = filtered.length ? filtered.map(e => `
    <div class="email-row ${selectedId === e.id ? "selected" : ""}" data-open="${e.id}">
      <div class="email-avatar">${escapeHTML(e.initials)}</div>
      <div class="email-row-main">
        <div class="email-row-head"><strong>${escapeHTML(e.sender)}</strong><time>${escapeHTML(e.time)}</time></div>
        <h4>${escapeHTML(e.subject)}</h4>
        <p>${escapeHTML(e.preview)}</p>
        ${getBadge(e.category)}
      </div>
    </div>`).join("") : '<p class="no-results">No matching emails found. Try another search.</p>';
}

function renderDetail(id) {
  const e = emails.find(item => item.id === id);
  if (!e) return;
  selectedId = id;
  renderInbox();
  $("emailDetail").innerHTML = `
    <div class="detail-top">
      <div><h3>${escapeHTML(e.subject)}</h3><p>${escapeHTML(e.sender)} · ${escapeHTML(e.email)}</p><p class="detail-meta">Received ${escapeHTML(e.time)}</p></div>
      ${getBadge(e.category)}
    </div>
    <div class="detail-body">${escapeHTML(e.body).replace(/\n/g,"<br>")}</div>
    <div class="ai-analysis">
      <h4>✦ AI INSIGHTS & RECOMMENDATION</h4>
      <div class="analysis-line"><small>EMAIL SUMMARY</small><p>${escapeHTML(e.summary)}</p></div>
      <div class="analysis-line"><small>WHO SHOULD RESPOND?</small><p>${e.category === "client" ? "Client should respond personally." : e.category === "waiting" ? "Awaiting client feedback." : "Assistant can handle this email."}</p></div>
      <div class="analysis-line"><small>WHY THIS DECISION?</small><p>${escapeHTML(e.reason)}</p></div>
      <div class="analysis-line"><small>NEXT BEST ACTION</small><p>${escapeHTML(e.action)}</p></div>
      <div class="analysis-line"><small>DEMO CONFIDENCE</small><p>Illustrative classification · Sample data</p></div>
    </div>
    <div class="reply-box">
      <label for="replyText">SUGGESTED REPLY · EDIT BEFORE USING</label>
      <textarea id="replyText">${escapeHTML(e.reply)}</textarea>
      <div class="detail-actions">
        <button class="primary-button" id="copyReply">Copy suggested reply</button>
        <button class="secondary-button" id="markHandled">Mark reviewed</button>
      </div>
    </div>`;
  $("copyReply").addEventListener("click", () => copyReply());
  $("markHandled").addEventListener("click", () => notify("Email marked as reviewed in this demo."));
}

async function copyReply() {
  const text = $("replyText").value;
  try {
    await navigator.clipboard.writeText(text);
    notify("Suggested reply copied!");
  } catch {
    $("replyText").select();
    try {
      document.execCommand("copy");
      notify("Suggested reply copied!");
    } catch {
      notify("Please select and copy the reply manually.");
    }
  }
}

function renderAttention() {
  const list = emails.filter(e => e.category === "client");
  $("attentionList").innerHTML = list.length ? list.map(e => `
    <article class="attention-card">
      <div class="email-avatar">${escapeHTML(e.initials)}</div>
      <div class="attention-content">
        ${getBadge(e.category)}
        <h3>${escapeHTML(e.subject)}</h3>
        <p>${escapeHTML(e.sender)} · ${escapeHTML(e.email)}</p>
        <p>${escapeHTML(e.summary)}</p>
        <p><strong>Recommended:</strong> ${escapeHTML(e.action)}</p>
        <button class="text-button" data-open="${e.id}">Review email →</button>
      </div>
    </article>`).join("") : '<p class="no-results">No emails need personal attention.</p>';
}

function renderAccounts() {
  $("accountGrid").innerHTML = accounts.map(a => `
    <article class="account-card">
      <div class="account-logo">${escapeHTML(a.symbol)}</div>
      <div class="account-info"><strong>${escapeHTML(a.name)}</strong><p>${escapeHTML(a.email)}</p></div>
      <span class="connected">● Demo</span>
    </article>`).join("");
}

function openEmail(id) {
  showView("inbox");
  renderDetail(Number(id));
}

document.addEventListener("click", event => {
  const nav = event.target.closest("[data-view]");
  if (nav) showView(nav.dataset.view);
  const go = event.target.closest("[data-go]");
  if (go) showView(go.dataset.go);
  const open = event.target.closest("[data-open]");
  if (open) openEmail(open.dataset.open);
});

$("searchInput").addEventListener("input", renderInbox);
$("filterSelect").addEventListener("change", renderInbox);
$("menuButton").addEventListener("click", () => $("sidebar").classList.toggle("open"));
$("notificationButton").addEventListener("click", () => notify("You are all caught up!"));
$("addEmailButton").addEventListener("click", () => {
  const id = Math.max(0,...emails.map(e => e.id)) + 1;
  emails.unshift({
    id, sender:"Alex Morgan", initials:"AM", email:"alex@sample.com",
    subject:"New project update", time:"Just now", category:"assistant",
    priority:"Normal", preview:"A new sample project update has arrived.",
    body:"Hello,\n\nHere is a quick update on the project. The latest progress is ready for review.\n\nBest,\nAlex",
    summary:"A sample project update has been received.",
    reason:"This is a routine update that the assistant can organize and acknowledge.",
    action:"Review the update and prepare a response if necessary.",
    reply:"Hi Alex,\n\nThank you for the update. We have received your message and will review it.\n\nBest regards"
  });
  updateStats();
  renderInbox();
  renderPriority();
  notify("New demo email added!");
});
$("connectButton").addEventListener("click", () => {
  const name = prompt("Enter a demo account name:");
  if (!name || !name.trim()) return;
  accounts.push({name:name.trim(),email:name.trim().toLowerCase().replace(/\s+/g,".")+"@demo.local",provider:"Demo",symbol:name.trim()[0].toUpperCase()});
  renderAccounts();
  notify("Demo account added!");
});

updateStats();
renderPriority();
renderInbox();
renderAccounts();
