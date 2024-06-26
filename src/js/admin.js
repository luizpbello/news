import { elements, formElements } from './elements.js';
import {
  apiUrl,
  removeLoading,
  renderLoading,
  clearForm,
  handleAlert,
  getUrlParameter,
  redirectToAdminList,
} from './utils.js';

tinymce.init({
  selector: 'textarea',
  plugins: 'advlist autolink lists link image charmap print preview anchor',
  toolbar:
    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
});

function validateForm() {
  let isValid = true;

  const content = tinymce.activeEditor.getContent();
  const editor = document.querySelector('textarea');

  for (const htmlElement in formElements) {
    const element = formElements[htmlElement];
    if (!element.checkValidity() || content === '') {
      isValid = false;
      element.classList.add('is-invalid');
      element.classList.remove('is-valid');
      editor.classList.add('is-invalid');
      editor.classList.remove('is-valid');
    } else {
      element.classList.remove('is-invalid');
      element.classList.add('is-valid');
      editor.classList.remove('is-invalid');
      editor.classList.add('is-valid');
    }
  }

  return isValid;
}

function handleFormSubmission(callback) {
  return function (e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    renderLoading();
    setTimeout(() => {
      callback();
      removeLoading();
    }, 1000);
  };
}

function collectFormData() {
  const titulo = formElements.title.value;
  const imagem = formElements.image.value;
  const autor = formElements.author.value;
  const conteudo = tinymce.activeEditor.getContent();

  return { titulo, conteudo, imagem, autor };
}

async function createNews() {
  const data = collectFormData();

  try {
    await fetch(`${apiUrl}/index.php?action=add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    clearForm();
    handleAlert('Notícia criada com sucesso', 'success');
  } catch (error) {
    handleAlert('Erro ao criar notícia', 'danger');
  }
}

async function updateNews() {
  const data = collectFormData();
  const newsId = getUrlParameter('newsId');

  try {
    renderLoading();
    const response = await fetch(
      `${apiUrl}/index.php?action=update&id=${newsId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    removeLoading();

    if (response.ok) {
      handleAlert(result.message, 'success');
    } else {
      handleAlert(result.message, 'danger');
    }
  } catch (error) {
    handleAlert('Erro ao atualizar notícia', 'danger');
  }
}

function setFormData(news) {
  formElements.title.value = news.titulo;
  tinymce.get('newsContent').setContent(news.conteudo);

  formElements.image.value = news.imagem;
  formElements.author.value = news.autor;
}

async function initAdminPage() {
  const newsId = getUrlParameter('newsId');
  const isEditing = newsId !== '';
  handleButton(isEditing);

  if (isEditing) {
    renderLoading();
    const news = await getOneData(newsId);
    setFormData(news);
  }
  removeLoading();
}

async function getOneData(id) {
  try {
    const response = await fetch(`${apiUrl}/index.php?action=getOne&id=${id}`);
    const data = await response.json();
    if (data.error) {
      handleAlert('Notícia não encontrada', 'danger');
      redirectToAdminList();
    }
    return data;
  } catch (error) {
    handleAlert('Erro ao buscar notícia', 'danger');
  }
  removeLoading();
}

function handleButton(isEditing) {
  const buttonText = isEditing ? 'Atualizar' : 'Enviar';
  elements.send_form_btn.textContent = buttonText;
  const callback = isEditing ? updateNews : createNews;
  elements.send_form_btn.removeEventListener('click', createNews);
  elements.send_form_btn.removeEventListener('click', updateNews);
  setFormTitle(isEditing);
  elements.send_form_btn.addEventListener(
    'click',
    handleFormSubmission(callback)
  );
}

function setFormTitle(isEditing) {
  const formTitle = isEditing ? 'Atualizar Notícia' : 'Criar Notícia';
  elements.form_title.textContent = formTitle;
}

window.addEventListener('load', initAdminPage);
