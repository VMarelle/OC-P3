import { isToken, logDelete, getCookie } from "./script.js";

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

  let addPhoto = document.createElement("button");
  addPhoto.innerHTML = "Ajouter une photo";
  addPhoto.classList.add("addBtn");

  modalHeader.appendChild(span);
  div.appendChild(modalHeader);
  div.appendChild(title);
  div.appendChild(listImg);
  div.appendChild(line);
  div.appendChild(addPhoto);
  modal.appendChild(div);

  addPhoto.addEventListener("click", function handler(event) {
    modalAddPicture(works);
    addPhoto.removeEventListener("click", handler);
    addPhoto.classList.add("off");
  });
}

function modalAddPicture(works) {
  console.log(works);
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
  let btnPic = document.createElement("div");
  btnPic.classList.add("btnPic");
  let picIcon = document.createElement("span");
  picIcon.classList.add("picIcon", "fa-regular", "fa-image");
  let addFile = document.createElement("input");
  addFile.type = "file";
  addFile.setAttribute("id", "fileUpload");
  let ajouterPhoto = document.createElement("label");
  ajouterPhoto.setAttribute("for", "fileUpload");
  ajouterPhoto.classList.add("custom");
  ajouterPhoto.innerHTML = "+ Ajouter photo";
  let requirements = document.createElement("p");
  requirements.innerHTML = "jpg, png : 4mo max";
  let titleLabel = document.createElement("label");
  titleLabel.innerHTML = "Titre";
  let titleForm = document.createElement("input");
  titleForm.type = "text";
  let categoriesLabel = document.createElement("label");
  categoriesLabel.innerHTML = "Catégorie";
  let categoriesSelect = document.createElement("select");
  categoriesSelect.setAttribute("id", "batchSelect");

  let cat = [];

  works.forEach((el) => {
    if (!cat.includes(el.category.name)) {
      cat.push(el.category.name);
    }
  });

  cat.forEach((el) => {
    let selectOption = document.createElement("option");
    selectOption.value = el;
    selectOption.text = el;
    categoriesSelect.appendChild(selectOption);
  });

  let addPhoto = document.querySelector(".addBtn");
  addPhoto.innerHTML = "Valider";
  addPhoto.classList.add("off");

  /*
  1. CSS DU FORMULAIRE AJOUT DE PHOTO
  2. VERIFICATION DES INPUT AVANT L'ENVOIS DU FORMULAIRE 
  3. L'event du bouton submit ne fait rien dans le cas OU les input ne sont pas correct:
    3.a. Fonction 1 Un fichier qui n'est pas au bon format (PNG JPG JPEG) et dépasse 4Mo
    3.b. Fonction 2 Pas de titre ou titre de moins de 3 caractères
    3.c. Fonction 3 La catégorie choisis n'existe pas
  4. On attache un event au bouton submit
  5. Le CSS du bouton se modifie une fois toutes les vérifications passées
  6. On vérifie une nouvelle fois les input dans l'event avant d'envoyer la requête au back-end
  7. Fonction de requête semblable aux précédentes pour l'envois des données 
     BIEN REGARDER LE SWAGGER POUR CONNAITRE LE FORMAT DES DONNEES DEMANDE PAR LE BACK END!!!!!!
  */

  let newFile = (event) => {
    let target = event.target || event;
    let fileTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (
      target?.files[0]?.size > 4194304 &&
      fileTypes.includes(target?.files[0]?.type)
    ) {
      alert("fichier pas bon là");
      return false;
    } else if (target.files && target.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        console.log(e.target);
      };
      reader.readAsDataURL(target.files[0]);
    }

    return true;
  };

  addFile.addEventListener("change", newFile);

  let isTitle = (event) => {
    let target = event.target || event;
    if (target.value.length <= 3) {
      alert("titre trop court");
      return false;
    }
    return true;
  };

  titleForm.addEventListener("change", isTitle);

  let selection = (event) => {
    let target = event.target || event;
    if (!cat.includes(target.value)) {
      return false;
    }
    return true;
  };
  categoriesSelect.addEventListener("change", selection);
  addPhoto.addEventListener("mouseenter", function (event) {
    if (
      newFile(addFile) === true &&
      isTitle(titleForm) === true &&
      selection(categoriesSelect) === true
    ) {
      addPhoto.classList.remove("off");
    }
  });

  addPhoto.addEventListener("click", function logNew() {
    let token = getCookie("token");
    if (
      newFile(addFile) === true &&
      isTitle(titleForm) === true &&
      selection(categoriesSelect) === true &&
      token
    ) {
      const file = addFile.files[0];
      const title = titleForm.value;
      const category = categoriesSelect.value;

      fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrl: file,
          title: title,
          category: category,
        }),
      });
    }
  });

  modalHeader.appendChild(previous);
  btnPic.appendChild(picIcon);
  btnPic.appendChild(addFile);
  btnPic.appendChild(ajouterPhoto);
  btnPic.appendChild(requirements);
  formAdd.appendChild(btnPic);
  formAdd.appendChild(titleLabel);
  formAdd.appendChild(titleForm);
  formAdd.appendChild(categoriesLabel);
  formAdd.appendChild(categoriesSelect);
  listImg.appendChild(formAdd);
}

export default function modalForm(works) {
  if (isToken) {
    modalGallery(works);
  }

  return null;
}
