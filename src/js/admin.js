import { elements } from "./elements.js";
import { apiUrl, removeLoading, renderLoading, clearForm, handleAlert } from "./utils.js";


tinymce.init({
  selector: "textarea",
  plugins: "advlist autolink lists link image charmap print preview anchor",
  toolbar:
    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
});

function validateForm() {
  const content = tinymce.activeEditor.getContent();
  const textarea = document.querySelector("textarea");
  const form = document.getElementById("newsForm");

  

  if (!form.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  }

  form.classList.add("was-validated");

  return form.checkValidity();
}

function handleFormSubmission(callback) {
  return function (e) {
    e.preventDefault();
    if (!validateForm()) return;
    
    renderLoading();    
    setTimeout(() => {
      callback();    
      removeLoading(); 
    }, 1000);
  };
}

function collectFormData() {
  const titulo = document.getElementById("newsTitle").value;
  const imagem = document.getElementById("imageURL").value;
  const autor = document.getElementById("newsAuthor").value;
  const conteudo =  tinymce.activeEditor.getContent();

  return { titulo, conteudo, imagem, autor};
}

async function createNews() {
  const data = collectFormData();
 try {
    const response = await fetch(`${apiUrl}/index.php?action=add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const news = await response.json();
    clearForm()
    handleAlert("Notícia criada com sucesso", "success");
  } catch (error) {    
    handleAlert("Erro ao criar notícia", "danger");
  } 
  
}

async function updateNews() {
  const data = collectFormData();
  const newsId = getUrlParameter("newsId");

  try {
    const response = await fetch(`${apiUrl}/index.php?action=update&id=${newsId}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json(); 

    if (response.ok) {
      handleAlert(result.message, "success");
    } else {
      handleAlert(result.message, "danger");
    }
  } catch (error) {
    handleAlert("Erro ao atualizar notícia", "danger"); 
  }
}

function setFormData(news) {
  document.getElementById("newsTitle").value = news.titulo;
  tinymce.get("newsContent").setContent(news.conteudo);

  document.getElementById("imageURL").value = news.imagem;
  document.getElementById("newsAuthor").value = news.autor;

}

async function initAdminPage() {
  const newsId = getUrlParameter("newsId");
  const isEditing = newsId !== "";
  handleButton(isEditing);

  if (isEditing) {
    renderLoading();
    const news = await getOneData(newsId);
    setFormData(news);
  }  removeLoading();

}

async function getOneData(id) {
  const data = await fetch(`${apiUrl}/index.php?action=getOne&id=${id}`).then((response) => response.json());
  return data
}

function handleButton(isEditing) {
  const buttonText = isEditing ? "Atualizar" : "Enviar";
  elements.send_form_btn.textContent = buttonText;
  const callback = isEditing ? updateNews : createNews;
  elements.send_form_btn.removeEventListener("click", createNews);
  elements.send_form_btn.removeEventListener("click", updateNews);
  elements.send_form_btn.addEventListener("click", handleFormSubmission(callback));
}



function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}




window.addEventListener("load", initAdminPage);
