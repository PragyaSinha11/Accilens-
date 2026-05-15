/* ═══════════════════════════════════════════════════════════════════════
   AcciLens — main.js
   ═══════════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════════
   SECTION 1 — EDITABLE DATA
   Update these arrays with your real dataset values before presenting.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Team Members ──────────────────────────────────────────────────────
   Replace name, role, initials, and color for each teammate.           */
const teamMembers = [
  { name: "Your Name",     role: "Data Analysis & Power BI",  initials: "YN", color: "#E63946" },
  { name: "Classmate 2",   role: "Frontend Development",      initials: "C2", color: "#F4A261" },
  { name: "Classmate 3",   role: "Data Collection & Prep",    initials: "C3", color: "#1D9E75" },
  { name: "Classmate 4",   role: "Research & Reporting",      initials: "C4", color: "#a78bfa" },
];

/* ── State-wise Hotspot Data ───────────────────────────────────────────
   Replace accidents, fatalities, injuries with your actual CSV values. */
const stateData = [
  { name: "Tamil Nadu",      accidents: 12543, fatalities: 4218, injuries: 11320, severity: "Fatal",   pct: 100 },
  { name: "Madhya Pradesh",  accidents: 10892, fatalities: 3890, injuries:  9810, severity: "Fatal",   pct: 87  },
  { name: "Uttar Pradesh",   accidents:  9834, fatalities: 3612, injuries:  8900, severity: "Fatal",   pct: 78  },
  { name: "Maharashtra",     accidents:  8723, fatalities: 2941, injuries:  7640, severity: "Serious", pct: 70  },
  { name: "Karnataka",       accidents:  7841, fatalities: 2580, injuries:  6920, severity: "Serious", pct: 63  },
  { name: "Rajasthan",       accidents:  6932, fatalities: 2318, injuries:  6100, severity: "Serious", pct: 55  },
  { name: "Andhra Pradesh",  accidents:  5678, fatalities: 1890, injuries:  4900, severity: "Minor",   pct: 45  },
  { name: "Gujarat",         accidents:  5123, fatalities: 1740, injuries:  4480, severity: "Minor",   pct: 41  },
  { name: "Telangana",       accidents:  4830, fatalities: 1560, injuries:  4200, severity: "Minor",   pct: 39  },
  { name: "West Bengal",     accidents:  4210, fatalities: 1340, injuries:  3780, severity: "Minor",   pct: 34  },
];

/* ── Chart Data ────────────────────────────────────────────────────────
   Replace the arrays inside each chartData entry with your CSV values. */
const chartData = {

  /* Accidents per hour of day (0–23) */
  hour: [
    620, 440, 310, 270, 290, 540, 920, 1340, 1820, 1740, 1680, 1900,
    2140, 2060, 2280, 2540, 2760, 3100, 3210, 2890, 2560, 2100, 1760, 1100
  ],

  /* Severity — keep order: Fatal, Grievous Injury, Minor Injury */
  severity: [34, 41, 25],

  /* Monthly counts — Jan to Dec */
  monthly: [3800, 3200, 4100, 4600, 5200, 4800, 4400, 4900, 5600, 6100, 5800, 4300],

  /* Road type counts — same order as roadLabels below */
  road: [14800, 11200, 9600, 7400, 6200],
  roadLabels: ["National Highway", "State Highway", "City Roads", "District Roads", "Rural Roads"],

  /* Day of week — Mon to Sun */
  dayOfWeek: [6800, 6200, 6500, 6700, 7800, 9100, 8600],

  /* Weather conditions — same order as weatherLabels below */
  weather: [62, 21, 12, 5],
  weatherLabels: ["Clear Weather", "Rainy", "Foggy / Misty", "Other"],
};


/* ═══════════════════════════════════════════════════════════════════════
   SECTION 2 — POWER BI LOADER
   ═══════════════════════════════════════════════════════════════════════ */

function hidePbiLoader() {
  const loader = document.getElementById("pbi-loader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => (loader.style.display = "none"), 600);
  }
}

// Expose to HTML onload attribute
window.hidePbiLoader = hidePbiLoader;


/* ═══════════════════════════════════════════════════════════════════════
   SECTION 3 — CHART.JS SETUP
   ═══════════════════════════════════════════════════════════════════════ */

/* Shared tooltip style reused across all charts */
const tooltipStyle = {
  backgroundColor: "#1a2436",
  titleColor: "#f0f4f8",
  bodyColor: "#8899aa",
  borderColor: "rgba(255,255,255,0.09)",
  borderWidth: 1,
  padding: 10,
  cornerRadius: 8,
};

/* Shared axis tick style */
const axisTick = { color: "#8899aa", font: { size: 11 } };

/* Full shared options object for bar/line charts */
const sharedOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: tooltipStyle,
  },
  scales: {
    x: { grid: { color: "rgba(255,255,255,0.04)" }, ticks: axisTick },
    y: { grid: { color: "rgba(255,255,255,0.06)" }, ticks: axisTick },
  },
};

/* Shared doughnut options builder */
function doughnutOpts(extraCallback) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: { color: "#8899aa", font: { size: 12 }, padding: 14, boxWidth: 12 },
      },
      tooltip: {
        ...tooltipStyle,
        callbacks: { label: extraCallback || ((c) => ` ${c.label}: ${c.parsed}%`) },
      },
    },
  };
}

/* ── 1. Accidents by Hour of Day ────────────────────────────────────── */
new Chart(document.getElementById("chartHour"), {
  type: "bar",
  data: {
    labels: [
      "00","01","02","03","04","05","06","07","08","09","10","11",
      "12","13","14","15","16","17","18","19","20","21","22","23"
    ],
    datasets: [{
      data: chartData.hour,
      backgroundColor: (ctx) => {
        const v = ctx.parsed.y;
        if (v > 3000) return "#E63946";
        if (v > 2400) return "#F4A261";
        return "rgba(255,255,255,0.11)";
      },
      borderRadius: 4,
    }],
  },
  options: {
    ...sharedOpts,
    plugins: {
      ...sharedOpts.plugins,
      tooltip: {
        ...tooltipStyle,
        callbacks: { label: (c) => ` ${c.parsed.y.toLocaleString()} accidents` },
      },
    },
  },
});

/* ── 2. Severity Distribution ───────────────────────────────────────── */
new Chart(document.getElementById("chartSeverity"), {
  type: "doughnut",
  data: {
    labels: ["Fatal", "Grievous Injury", "Minor Injury"],
    datasets: [{
      data: chartData.severity,
      backgroundColor: ["#E63946", "#F4A261", "#1D9E75"],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  },
  options: doughnutOpts(),
});

/* ── 3. Monthly Accident Trend ──────────────────────────────────────── */
new Chart(document.getElementById("chartMonth"), {
  type: "line",
  data: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets: [{
      label: "Accidents",
      data: chartData.monthly,
      borderColor: "#E63946",
      backgroundColor: "rgba(230,57,70,0.09)",
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#E63946",
      pointRadius: 3,
      pointHoverRadius: 6,
      borderWidth: 2,
    }],
  },
  options: sharedOpts,
});

/* ── 4. Accidents by Road Type (horizontal bar) ─────────────────────── */
new Chart(document.getElementById("chartRoad"), {
  type: "bar",
  data: {
    labels: chartData.roadLabels,
    datasets: [{
      data: chartData.road,
      backgroundColor: ["#E63946","#f0636d","#F4A261","#5DCAA5","rgba(255,255,255,0.11)"],
      borderRadius: 5,
    }],
  },
  options: { ...sharedOpts, indexAxis: "y" },
});

/* ── 5. Accidents by Day of Week ────────────────────────────────────── */
new Chart(document.getElementById("chartDay"), {
  type: "bar",
  data: {
    labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    datasets: [{
      data: chartData.dayOfWeek,
      backgroundColor: (ctx) => {
        const v = ctx.parsed.y;
        if (v > 8500) return "#E63946";
        if (v > 7500) return "#F4A261";
        return "rgba(255,255,255,0.11)";
      },
      borderRadius: 5,
    }],
  },
  options: sharedOpts,
});

/* ── 6. Weather Condition Impact ────────────────────────────────────── */
new Chart(document.getElementById("chartWeather"), {
  type: "doughnut",
  data: {
    labels: chartData.weatherLabels,
    datasets: [{
      data: chartData.weather,
      backgroundColor: ["rgba(255,255,255,0.12)", "#378ADD", "#8899aa", "#F4A261"],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  },
  options: doughnutOpts(),
});


/* ═══════════════════════════════════════════════════════════════════════
   SECTION 4 — BUILD HOTSPOT TABLE
   ═══════════════════════════════════════════════════════════════════════ */

function buildTable() {
  const tbody = document.getElementById("hotspot-tbody");

  stateData.forEach((s, i) => {
    const dotClass   = s.severity === "Fatal" ? "sev-f" : s.severity === "Serious" ? "sev-s" : "sev-m";
    const barColor   = s.severity === "Fatal" ? "#E63946" : s.severity === "Serious" ? "#F4A261" : "#1D9E75";
    const barWidth   = Math.round(s.pct * 0.55);
    const trendIcon  = i < 3 ? "▲" : i < 6 ? "→" : "▼";
    const trendColor = i < 3 ? "#f08088" : i < 6 ? "#F4A261" : "#1D9E75";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="color:var(--muted);font-weight:500">${i + 1}</td>
      <td style="font-weight:500">${s.name}</td>
      <td>${s.accidents.toLocaleString()}</td>
      <td style="color:#f08088">${s.fatalities.toLocaleString()}</td>
      <td style="color:#F4A261">${s.injuries.toLocaleString()}</td>
      <td>
        <span class="sev-dot ${dotClass}"></span>${s.severity}
      </td>
      <td>
        <div class="bar-wrap">
          <div class="mini-bar" style="width:${barWidth}px; background:${barColor};"></div>
          <span style="color:${trendColor}; font-size:13px; font-weight:600;">${trendIcon}</span>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

buildTable();


/* ═══════════════════════════════════════════════════════════════════════
   SECTION 5 — BUILD TEAM CARDS
   ═══════════════════════════════════════════════════════════════════════ */

function buildTeam() {
  const grid = document.getElementById("team-grid");

  teamMembers.forEach((m) => {
    const card = document.createElement("div");
    card.className = "team-card";
    card.innerHTML = `
      <div class="avatar" style="background:${m.color}22; color:${m.color};">${m.initials}</div>
      <div class="team-name">${m.name}</div>
      <div class="team-role">${m.role}</div>
    `;
    grid.appendChild(card);
  });
}

buildTeam();


/* ═══════════════════════════════════════════════════════════════════════
   SECTION 6 — SCROLL REVEAL  (IntersectionObserver)
   ═══════════════════════════════════════════════════════════════════════ */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
