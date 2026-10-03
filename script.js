// ---------- Widget za brzu dijagnozu ----------
const devices = {
  "PC / Prijenosnik": {
    "Ne uključuje se": ["Vjerojatno kvar napajanja ili baterije", "1–2 dana", "30–90 €"],
    "Jako spor": ["Vjerojatno stari tvrdi disk ili previše programa pri pokretanju. Nadogradnja na SSD rješava većinu slučajeva.", "Isti dan", "40–110 €"],
    "Pregrijava se / bučan ventilator": ["Nakupljena prašina i osušena termalna pasta", "Isti dan", "25–45 €"],
    "Plavi ekran / rušenje sustava": ["Neispravan RAM, upravljački programi ili disk pred kvarom", "1–2 dana", "35–80 €"]
  },
  "Android mobitel": {
    "Razbijen ekran": ["Zamjena ekrana. Vaši podaci ostaju netaknuti.", "2–4 sata", "50–150 €"],
    "Baterija se brzo prazni": ["Istrošena baterija. Zamjena vraća cjelodnevno trajanje.", "1 sat", "30–60 €"],
    "Ne puni se": ["Prljav ili oštećen priključak za punjenje", "1–2 sata", "25–55 €"],
    "Oštećenje vodom": ["Potrebno je potpuno čišćenje i pregled matične ploče", "2–3 dana", "40–120 €"]
  },
  "Tablet": {
    "Razbijen ekran": ["Zamjena stakla i dodirne ploče", "1 dan", "60–140 €"],
    "Zamrznut / petlja pokretanja": ["Softverski reset ili ponovna instalacija firmwarea", "Isti dan", "20–40 €"],
    "Ne puni se": ["Problem s priključkom za punjenje ili baterijom", "1 dan", "30–70 €"]
  },
  "Ostalo / nisam siguran": {
    "Oporavak podataka": ["Pokušavamo vratiti datoteke s diskova, mobitela i SD kartica", "1–3 dana", "50–150 €"],
    "Virus / skočni prozori": ["Uklanjanje zlonamjernog softvera i postavljanje zaštite", "Isti dan", "30–60 €"],
    "Postavljanje i pomoć": ["Wi-Fi, pisači, postavljanje novog uređaja ili edukacija", "1–2 sata", "20–40 €"]
  }
};

const deviceBox = document.getElementById("deviceChips");
const symptomBox = document.getElementById("symptomChips");
const result = document.getElementById("result");
let currentDevice = null;

function makeChip(label, onClick, parent) {
  const b = document.createElement("button");
  b.className = "chip";
  b.textContent = label;
  b.addEventListener("click", () => {
    parent.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    b.classList.add("active");
    onClick();
  });
  parent.appendChild(b);
}

function showSymptoms(device) {
  currentDevice = device;
  symptomBox.innerHTML = "";
  result.innerHTML = '<p class="result-empty">Sada odaberite problem.</p>';
  Object.keys(devices[device]).forEach(s =>
    makeChip(s, () => showResult(s), symptomBox)
  );
}

function showResult(symptom) {
  const [cause, time, price] = devices[currentDevice][symptom];
  result.innerHTML = `
    <h3>${symptom}</h3>
    <p>${cause}</p>
    <dl>
      <div><dt>Vrijeme popravka</dt><dd>${time}</dd></div>
      <div><dt>Raspon cijene</dt><dd>${price}</dd></div>
    </dl>`;
  result.classList.remove("pop");
  void result.offsetWidth; // ponovno pokreni animaciju
  result.classList.add("pop");
}

Object.keys(devices).forEach(d => makeChip(d, () => showSymptoms(d), deviceBox));

// ---------- Usluge ----------
const services = [
  { icon: "🖥️", title: "Popravak i sklapanje PC-a", text: "Popravci hardvera, sklapanje po mjeri i čista instalacija Windowsa.", type: "pc" },
  { icon: "💻", title: "Ekrani i baterije za prijenosnike", text: "Zamjena ekrana, baterija, tipkovnica i šarki.", type: "pc" },
  { icon: "⚡", title: "Nadogradnja SSD-a i RAM-a", text: "Neka vam stari računalo ponovno radi kao novo.", type: "pc" },
  { icon: "📱", title: "Popravak Android ekrana", text: "Samsung, Xiaomi, Huawei, Google i ostali.", type: "android" },
  { icon: "🔋", title: "Baterija i punjenje", text: "Nove baterije i popravak priključka za punjenje.", type: "android" },
  { icon: "🔓", title: "Softver i ažuriranja", text: "Spor mobitel, petlje pokretanja, resetiranje i prijenos podataka.", type: "android" },
  { icon: "🛡️", title: "Uklanjanje virusa", text: "Čišćenje zaraženih uređaja i postavljanje prave zaštite.", type: "other" },
  { icon: "💾", title: "Oporavak podataka", text: "Spašavamo fotografije i datoteke s pokvarenih uređaja.", type: "other" },
  { icon: "🌐", title: "Pomoć s mrežom i pisačima", text: "Slab Wi-Fi signal, usmjerivači i postavljanje pisača.", type: "other" }
];

const grid = document.getElementById("serviceGrid");
services.forEach(s => {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.type = s.type;
  card.innerHTML = `<div class="icon">${s.icon}</div><h3>${s.title}</h3><p>${s.text}</p>`;
  grid.appendChild(card);
});

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    const f = tab.dataset.filter;
    grid.querySelectorAll(".card").forEach(c =>
      c.classList.toggle("hide", f !== "all" && c.dataset.type !== f)
    );
  });
});

// ---------- Brojači statistike ----------
const counters = document.querySelectorAll("[data-count]");
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString("hr-HR");
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    observer.unobserve(el);
  });
}, { threshold: .6 });
counters.forEach(c => observer.observe(c));

// ---------- Obrazac i obavijest ----------
const toast = document.getElementById("toast");
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("message").value.trim();
  const error = document.getElementById("formError");

  if (!name || !msg) { error.textContent = "Unesite svoje ime i opišite problem."; return; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { error.textContent = "Unesite ispravnu e-mail adresu."; return; }

  error.textContent = "";
  e.target.reset();
  showToast(`Upit je poslan. Javit ćemo vam se uskoro, ${name}.`);
});

document.getElementById("year").textContent = new Date().getFullYear();