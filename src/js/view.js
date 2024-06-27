import { elements } from "./elements.js";
import {
  apiUrl,
  renderLoading,
  removeLoading,
  formatDate,
  getUrlParameter,
} from "./utils.js";

elements.redirect_home.addEventListener("click", () => {
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    window.location.href = "../../index.html";
  } else {
    window.location.href = "https://luizpbello.github.io/news/";
  }
});


async function renderView() {
  const id = getUrlParameter("newsId");
  renderLoading();
  const response = await fetch(`${apiUrl}/index.php?action=getOne&id=${id}`);
  const data = await response.json();
  buildView(data);
  removeLoading();
}

function buildView(oneNew) {
  const container = document.getElementById("view-container");
  container.innerHTML = "";
  const div = document.createElement("div");
  div.classList.add("row", "w-100"); 
  div.innerHTML = `
    <div class="col-12 col-md-8 offset-md-2"> <!-- Centralizar no meio -->
      <div class="card mb-3">
        <img src="${oneNew.imagem}" class="card-img-top" alt="..." style="width: 100%; height: 300px; object-fit: fill;">
        <hr>
        <div class="card-body d-flex flex-column">
          <h1 class="card-title">${oneNew.titulo}</h1>
          <p class="card-text flex-grow-1">${oneNew.conteudo}</p>
          <p class="card-text"><small class="text-muted"><b>Autor:</b> ${oneNew.autor}</small></p>
          <p class="card-text"><small class="text-muted"><b>Publicado em:</b> ${formatDate(oneNew.data)}</small></p>
        </div>
      </div>
    </div>
  `;
  container.appendChild(div);
}



window.onload = () => {
  renderView();
};
