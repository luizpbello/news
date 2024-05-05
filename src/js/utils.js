/*
https://uniasselvinews.000webhostapp.com/index.php?action=add

https://uniasselvinews.000webhostapp.com/index.php?action=list

https://uniasselvinews.000webhostapp.com/index.php?action=search&titulo={titulo}
*/
import {formElements} from "./elements.js";
export const apiUrl = "https://uniasselvinews.000webhostapp.com";



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

  export function handleAlert(message, type) {
    const body = document.querySelector("body");
    body.insertAdjacentHTML(
      "beforebegin",
      `<div id="snack" class="alert alert-${type}  d-flex align-items-center" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="px-2">
        ${message}
        </div>
       </div>`
    );
    setTimeout(() => {
      const snack = document.getElementById("snack");
      if (snack) {
        snack.remove();
      }
    }, 3000);
  }

  export function clearForm() {
    formElements.title.value = "";
    tinymce.activeEditor.setContent("");
    formElements.image.value = "";
    formElements.author.value = "";
    const form = document.getElementById("newsForm");
    form.classList.remove("was-validated");
  }
  