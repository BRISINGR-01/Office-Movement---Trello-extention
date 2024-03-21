window.addEventListener("load", () => {
	setTimeout(hideRandomTask, 2_000);

	check();
});

const serverIP = "http://localhost:3000";
const subscription = new EventSource(serverIP + "/subscribe");

subscription.addEventListener("message", (e) => {
	unhide(e.data);
});

window.navigation.addEventListener("navigate", () => setTimeout(check, 100));

const doneTasks = [];
const hiddenTasks = [];

let allTasks = [];

function check() {
	if (shouldDisplayMap()) {
		const el = hiddenTasks.find(
			([el, p]) => el.href === window.location.href
		)[0];
		const image = document.createElement("img");
		image.src = serverIP + "/img";
		image.id = "image";

		const i = setInterval(() => {
			const container = [
				...document.getElementsByClassName("window-module"),
			].find((el) => el.className === "window-module");
			if (!container) return;

			clearInterval(i);
			container.appendChild(image);
			const title = document.querySelectorAll(".mod-card-back-title")[0];
			title.id = "title";
			title.value = el.innerText;
		}, 100);
	}
}

function shouldDisplayMap() {
	return (
		window.location.pathname.startsWith("/c") &&
		hiddenTasks.find(([el, p]) => el.href === window.location.href)
	);
}

function hideRandomTask() {
	allTasks = [...document.querySelectorAll("a[data-testid=card-name")].filter(
		(el) => !el.dataset.id
	);

	const el = allTasks[11];
	fetch(`${serverIP}/data?id=1`)
		.then((res) => res.json())
		.then((res) => {
			el.dataset.hiddenName = el.innerText;
			el.innerText = res.task;
			el.dataset.taskId = res.id;
		});

	el.style.transition = "all 1s ease-in-out";
	const p = el.parentNode.parentNode;
	p.style.transition = "all 1s ease-in-out";
	hiddenTasks.push([el, p]);
	setRandomGradient([el, p]);
}

function getRandomColor() {
	return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

// Function to set a random gradient background
function setRandomGradient([el, p]) {
	const color1 = getRandomColor();
	p.style.background = color1;
	el.style.color = isHexTooLight(color1) ? "black" : "white";
}

function unhide(id) {
	const el = document.querySelector(`a[data-task-id="${id}"]`);
	hiddenTasks.splice(
		hiddenTasks.findIndex(([task, p]) => {
			const found = task?.dataset.taskId === el.dataset.taskId;
			if (found) {
				p.style.background = "#22272b";
				el.style.color = "#b6c2cf";

				if (shouldDisplayMap()) {
					document.getElementById("image").remove();
					const title = document.getElementById("title");
					title.value = el.innerText = el.dataset.hiddenName;
				}
			}
		}),
		1
	);
}

setInterval(() => {
	hiddenTasks.forEach(setRandomGradient);
}, 2000);

const hexToRgb = (hex) =>
	((value) =>
		value.length === 3
			? value.split("").map((c) => parseInt(c.repeat(2), 16))
			: value.match(/.{1,2}/g).map((v) => parseInt(v, 16)))(
		hex.replace("#", "")
	);

const isHexTooLight = (hexColor) =>
	(([r, g, b]) => (r * 299 + g * 587 + b * 114) / 1000 > 155)(
		hexToRgb(hexColor)
	);
