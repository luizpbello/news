import { elements } from "./elements.js";
import { apiUrl } from "./utils.js";

function redirectToAdmin() {
  window.location.href = "./admin/list.html";
}

elements.redirectAdmin.addEventListener("click", () => {
  redirectToAdmin();
});

async function handleSearch() {
  const search = elements.search.value;
  const response = await fetch(
    `${apiUrl}/index.php?action=search&titulo=${search}`
  );
  const data = await response.json();
  console.log(data);
}

elements.search_button.addEventListener("click", (e) => {
  e.preventDefault();
  handleSearch();
});
