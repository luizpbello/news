export const apiUrl = "http://localhost:8080";



export function renderLoading() {
    const body = document.querySelector("body");
    const loadingElement = document.createElement("div");
    loadingElement.classList.add("loading");
    loadingElement.innerHTML = `<div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>`;
    body.appendChild(loadingElement);
  }
  
 export  function removeLoading() {
    const loadingElement = document.querySelector(".loading");
    if (loadingElement) {
      loadingElement.remove();
    }
  }