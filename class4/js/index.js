const users = [
	{
		name: "芝浦 紫",
		age: 12,
		gender: "female",
		genderIdentity: "female",
		lastExamScore: 631,
	},
	{
		name: "芝浦 青",
		age: 13,
		gender: "female",
		genderIdentity: "gay",
		lastExamScore: 586,
	},
	{
		name: "芝浦 緑",
		age: 16,
		gender: "female",
		genderIdentity: "female",
		lastExamScore: 516,
	},
	{
		name: "芝浦 銅鑼介",
		age: 32,
		gender: "male",
		genderIdentity: "gay",
		lastExamScore: 448,
	},
	{
		name: "芝浦 顔介",
		age: 31,
		gender: "male",
		genderIdentity: "male",
		lastExamScore: 514,
	},
	{
		name: "芝浦 太郎",
		age: 34,
		gender: "female",
		genderIdentity: "male",
		lastExamScore: 598,
	},
	{
		name: "芝浦 次郎",
		age: 36,
		gender: "male",
		genderIdentity: "male",
		lastExamScore: 514,
	},
	{
		name: "芝浦 三郎",
		age: 40,
		gender: "female",
		genderIdentity: "male",
		lastExamScore: 598,
	},
	{
		name: "芝浦 虎乱",
		age: 78,
		gender: "male",
		genderIdentity: "male",
		lastExamScore: 689,
	},
	{
		name: "芝浦 淳也",
		age: 11,
		gender: "male",
		genderIdentity: "male",
		lastExamScore: 476,
	},
];

const listTitleKeys = [
	"name",
	"age",
	"gender",
	"genderIdentity",
	"lastExamScore",
];

const usersListElement = document.querySelector(".users_list>tbody");
if (usersListElement === null) {
	console.error(".users_list の取得ができません!");
}

function createListRowElement(user) {
	const elem = document.createElement("tr");
	elem.setAttribute("class", "users_list_items");

	for (const key of listTitleKeys) {
		const child = document.createElement(key === "name" ? "th" : "td");
		child.textContent = `${user[key]}`;
		elem.appendChild(child);
	}
	return elem;
}

let searchText = "";

function renderList() {
	while (usersListElement.firstChild) {
		usersListElement.firstChild.remove();
	}

	const filtered = users.filter(user => {
		for (const key in user) {
			if (String(user[key]).includes(searchText)) {
				return true;
			}
		}
		return false;
	});
	filtered.forEach(user => {
		usersListElement.appendChild(createListRowElement(user));
	});
}

renderList();

const serachBox = document.querySelector("#search_users");
serachBox.addEventListener("input", event => {
	searchText = event.target.value || "";
	renderList();
});