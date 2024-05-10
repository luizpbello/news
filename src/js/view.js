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
  console.log(id);
  renderLoading();
  const response = await fetch(`${apiUrl}/index.php?action=getOne&id=${id}`);
  const data = await response.json();
  console.log(data)
  buildView(data);
  removeLoading();
}

function buildView(oneNew) {
  const container = elements.view_container;
  container.innerHTML = "";
  const div = document.createElement("div");
  div.classList.add("row");
  div.innerHTML = `
  <div class="col-12">
  <div class="card mb-3">
      <img src="${
        oneNew.imagem
      }" class="card-img-top" alt="..." style="max-width: 100%; height: 400px;">
      <div class="card-body">
          <h1 class="card-title">${oneNew.titulo}</h1>
          <p class="card-text">${oneNew.conteudo}</p>
          <p class="card-text"><small class="text-muted"><b>Autor:</b> ${
            oneNew.autor
          }</small></p>
          <p class="card-text"><small class="text-muted">${formatDate(
            oneNew.data
          )}</small></p>
      </div>
  </div>
</div>
    `;
  container.appendChild(div);
}

window.onload = () => {
  renderView();
};
