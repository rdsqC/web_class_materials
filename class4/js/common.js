export function count_down(m) {
	console.log(m + "...");
	if (0 < m) setTimeout(() => count_down(m - 1), 1000);
}