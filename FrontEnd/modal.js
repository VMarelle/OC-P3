import { isToken, logDelete } from "./script.js";

function modalGallery(works) {
  let modal = document.getElementById("myModal");

  modal.innerHTML = "";

  let div = document.createElement("div");
  div.classList.add("modal-content");
  let modalHeader = document.createElement("div");
  modalHeader.classList.add("modalHeader");
  let span = document.createElement("span");
  span.classList.add("close");
  span.innerHTML = "&times;";

  let title = document.createElement("h2");
  title.innerText = "Galerie photo";

  let listImg = document.createElement("div");
  listImg.classList.add("galleryToDelete");

  works.forEach((element) => {
    let figure = document.createElement("figure");
    figure.classList.add("imgToDelete");
    let img = document.createElement("img");
    img.src = element.imageUrl;
    let remove = document.createElement("span");
    remove.classList.add("remove", "fa-solid", "fa-trash-can");
    figure.appendChild(img);
    figure.appendChild(remove);
    listImg.appendChild(figure);
  });

  span.onclick = function (event) {
    modal.innerHTML = "";
    modal.style.display = "none";
  };

  modal.onclick = function (event) {
    event.stopPropagation();
    modal.innerHTML = "";
    modal.style.display = "none";
  };

  div.onclick = function (e) {
    e.stopPropagation();
  };

  listImg.childNodes.forEach((element) => {
    element.children[1].addEventListener("click", async function (event) {
      let result = works.filter(
        (el) => el.imageUrl === element.children[0].src
      );
      const response = await logDelete(result[0].id);
      location.reload();
    });
  });
  let line = document.createElement("div");
  line.classList.add("grandLine");

  let addPhoto = document.createElement("input");
  addPhoto.type = "submit";
  addPhoto.value = "Ajouter une photo";
  addPhoto.classList.add("addBtn");

  modalHeader.appendChild(span);
  div.appendChild(modalHeader);
  div.appendChild(title);
  div.appendChild(listImg);
  div.appendChild(line);
  div.appendChild(addPhoto);
  modal.appendChild(div);

  addPhoto.addEventListener("click", function (event) {
    modalAddPicture(works);
  });
}

function modalAddPicture(works) {
  let modalHeader = document.querySelector(".modalHeader");
  let previous = document.createElement("span");
  previous.classList.add("previous");
  previous.innerHTML = "&larr;";
  previous.addEventListener("click", function (event) {
    modalGallery(works);
  });
  let title = document.querySelector(".modal-content > h2");
  title.innerHTML = "Ajout photo";
  let listImg = document.querySelector(".galleryToDelete");
  listImg.innerHTML = "";
  let formAdd = document.createElement("form");
  formAdd.setAttribute("id", "addPhotoForm");
  let addFile = document.createElement("input");
  addFile.type = "file";
  let titleLabel = document.createElement("label");
  titleLabel.innerHTML = "Titre";
  let titleForm = document.createElement("input");
  titleForm.type = "text";
  let categoriesLabel = document.createElement("label");
  categoriesLabel.innerHTML = "Catégorie";
  let selectCategory = document.createElement("select");
  let optionCategory = document.createElement();

  modalHeader.appendChild(previous);
}

export default function modalForm(works) {
  if (isToken) {
    modalGallery(works);
  }

  return null;
}
