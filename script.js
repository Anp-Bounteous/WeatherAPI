// ----------------------------
// TO-DO APP CODE (unchanged)
// ----------------------------

const addBtn = document.getElementById("addBtn");
const popup = document.getElementById("popup");
const saveBtn = document.getElementById("saveBtn");
const closeBtn = document.getElementById("closeBtn");

const titleInput = document.getElementById("title");
const descInput = document.getElementById("desc");
const hoursInput = document.getElementById("hours");

const todoList = document.getElementById("todoList");
const progressList = document.getElementById("progressList");
const doneList = document.getElementById("doneList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}

function saveTask() {
  tasks.push({
    title: titleInput.value,
    desc: descInput.value,
    hours: hoursInput.value,
    progress: 0,
    status: "todo"
  });
  popup.style.display = "none";
  titleInput.value = descInput.value = hoursInput.value = "";
  save();
}

function getProgressStyle(p) {
  if (p <= 50) return ["green", `${p}%`];
  if (p <= 75) return ["yellow", `${p}%`];
  if (p <= 100) return ["red", `${p}%`];
  return ["gray", "UNCOMPLETED"];
}

function render() {
  todoList.innerHTML = progressList.innerHTML = doneList.innerHTML = "";

  tasks.forEach((t, i) => {
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `<h3>${t.title}</h3><p>${t.desc}</p><p>Hours: ${t.hours}</p>`;

    if (t.status === "todo") {
      div.innerHTML += `
        <div class="btn-group">
          <button class="start">START</button>
          <button class="delete">DELETE</button>
        </div>`;
      div.querySelector(".start").onclick = () => {
        t.status = "inprogress";
        t.progress = 50;
        save();
      };
      div.querySelector(".delete").onclick = () => {
        tasks.splice(i, 1);
        save();
      };
      todoList.appendChild(div);
    }

    if (t.status === "inprogress") {
      const [color, text] = getProgressStyle(t.progress);
      div.innerHTML += `
        <div class="status ${color}">${text}</div>
        <div class="btn-group">
          <button class="complete">COMPLETED</button>
        </div>`;
      div.querySelector(".complete").onclick = () => {
        t.status = "done";
        t.progress = 100;
        save();
      };
      progressList.appendChild(div);
    }

    if (t.status === "done") {
      div.innerHTML += `
        <div class="status ${t.progress >= 100 ? "red" : "gray"}">
          ${t.progress >= 100 ? "DONE" : "UNCOMPLETED"}
        </div>
        <div class="btn-group">
          <button class="undo">UNDONE</button>
        </div>`;
      div.querySelector(".undo").onclick = () => {
        t.status = "inprogress";
        t.progress = 75;
        save();
      };
      doneList.appendChild(div);
    }
  });
}

addBtn.onclick = () => popup.style.display = "flex";
closeBtn.onclick = () => popup.style.display = "none";
saveBtn.onclick = saveTask;

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.getElementById(btn.dataset.tab).classList.add("active");
  };
});

render();


// ----------------------------
// ASSIGNMENT CODE STARTS HERE
// ----------------------------

// QUESTION 1: Chennai Weather (Callbacks)
function getChennaiWeather(callback) {
  const lat = 13.0827;
  const lon = 80.2707;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  fetch(url)
    .then(res => res.json())
    .then(data => callback(null, data.current_weather))
    .catch(err => callback(err));
}

function question1() {
  getChennaiWeather((err, weather) => {
    if (err) return console.error("Q1 Error:", err);

    console.log("----- QUESTION 1 -----");
    console.log("Chennai Weather (Latest)");
    console.log("Temperature:", weather.temperature + "°C");
    console.log("Wind Speed:", weather.windspeed + " km/h");
    console.log("Wind Direction:", weather.winddirection + "°");
    console.log("Time:", weather.time);
    console.log("----------------------");
  });
}


// QUESTION 2: 3 Cities Weather (Promise.all)
function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  return fetch(url).then(res => res.json());
}

function question2() {
  const cities = [
    { name: "Chennai", lat: 13.0827, lon: 80.2707 },
    { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
    { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
  ];

  Promise.all(cities.map(c => fetchWeather(c.lat, c.lon)))
    .then(results => {
      console.log("----- QUESTION 2 -----");
      console.log("Weather for 3 Cities (Parallel)");

      results.forEach((res, i) => {
        const w = res.current_weather;
        console.log(`${cities[i].name}: Temp ${w.temperature}°C, Wind ${w.windspeed} km/h, Time ${w.time}`);
      });

      console.log("----------------------");
    })
    .catch(err => console.error("Q2 Error:", err));
}


// QUESTION 3: GitHub Profile (Async/Await)
async function question3() {
  const username = "Anp-Bounteous"; // ✅ Your GitHub username
  const url = `https://api.github.com/users/${username}`;

  try {
    const res = await fetch(url);
    const profile = await res.json();

    console.log("----- QUESTION 3 -----");
    console.log("GitHub Profile");
    console.log("Name:", profile.name);
    console.log("Username:", profile.login);
    console.log("Bio:", profile.bio);
    console.log("Public Repos:", profile.public_repos);
    console.log("Followers:", profile.followers);
    console.log("Following:", profile.following);
    console.log("URL:", profile.html_url);
    console.log("----------------------");
  } catch (err) {
    console.error("Q3 Error:", err);
  }
}


// Run all questions automatically when the page loads
question1();
question2();
question3();
