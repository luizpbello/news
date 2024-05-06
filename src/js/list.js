import { elements } from "./elements.js";
import { apiUrl, removeLoading, renderLoading, handleAlert, redirectWithIdParam } from "./utils.js";

elements.create_btn.addEventListener("click", () => {
  window.location.href = "admin.html";
});

elements.redirect_home.addEventListener("click", () => {
  window.location.href = "/";
});

async function listNews() {
  renderLoading();
  const response = await fetch(`${apiUrl}/index.php?action=list`);
  const data = await response.json();
  buildTableBody(data);
  removeLoading();
}

function buildTableBody(news) {
  const tbody = elements.tbody;
  tbody.innerHTML = "";
  news.forEach((news, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${news.id}</td>
            <td>${news.titulo}</td>
            <td>${news.data}</td>
            <td>${news.autor}</td>
            <td>
                <button class="btn btn-primary" id="edit-news" onclick="editNews(${
                  news.id
                })">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                 </button>
                <button class="btn btn-danger" onclick="deleteNews(${news.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" class="align-middle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

window.editNews = function (id) {
  redirectWithIdParam("admin",id);
};

window.deleteNews = function (id) {
  deleteNewsById(id);
};

async function deleteNewsById(id) {
  renderLoading();

  try {
    await fetch(`${apiUrl}/index.php?action=delete&id=${id}`, {
      method: "DELETE",
    });
    handleAlert(`Notícia de ID ${id} exlcuida com sucesso`, "success");
    listNews();
  } catch (error) {
    handleAlert("Erro ao deletar notícia", "danger");
  } finally {
    removeLoading();
  }
}

window.onload = function () {
  listNews();
};
