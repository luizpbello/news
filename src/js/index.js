import { elements } from "./elements.js";
import {
  apiUrl,
  renderLoading,
  removeLoading,
  formatDate,
  trimNewContent,
  redirectWithIdParam,
} from "./utils.js";

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

async function listNews() {
  renderLoading();
  const response = await fetch(`${apiUrl}/index.php?action=list`);
  const data = await response.json();

  if (data.length === 0) {
    renderEmptyNews();
  } else {
    renderNews(data);
  }
  removeLoading();
}

function renderNews(news) {
  const newsContainer = elements.news_container;
  newsContainer.innerHTML = "";
  news.forEach((news, index) => {
    const div = document.createElement("div");
    div.classList.add("col-12", "col-md-4");
    div.innerHTML = `
      <div class="card mb-3">
          <img src="${news.imagem}" class="card-img-top" alt="...">
          <div class="card-body">
              <h5 class="card-title">${news.titulo}</h5>
              <p class="card-text">${trimNewContent(news.conteudo)}</p>
              <p class="card-text"><small class="text-muted"><b>Autor:</b> ${
                news.autor
              }</small></p>
              <p class="card-text"><small class="text-muted">${formatDate(
                news.data
              )}</small></p>
              <button class="btn btn-dark" id="read-news-${index}">Ler notícia</button>
          </div>
      </div>
    `;
    newsContainer.appendChild(div);

  });
  const readNews = document.querySelectorAll("[id^=read-news]");
  readNews.forEach((news, index) => {
    news.addEventListener("click", () => {
      redirectWithIdParam("view/view", index);
    });
  })
}

function renderEmptyNews() {
  const newsContainer = elements.news_container;
  newsContainer.innerHTML = `
  <div class="col-12 text-center">
  <div class="col-12 d-flex justify-content-center align-items-center mb-3">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
      </svg>
  </div>
  <h3>Nenhuma notícia encontrada</h3>
  <button class="btn btn-dark" id="create-news">Criar notícia</button>
</div>

  `;
  const createNews = document.getElementById("create-news");
  createNews.addEventListener("click", () => {
    window.location.href = "./admin/admin.html";
  });
}

elements.search_button.addEventListener("click", (e) => {
  e.preventDefault();
  handleSearch();
});




window.onload = () => {
  listNews();
};
