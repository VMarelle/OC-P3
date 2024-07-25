import { isToken, logDelete, getCookie, postWork, logWorks } from "./script.js";

async function modalGallery(works) {
  works = works || (await logWorks());

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
      modalGallery();
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

async function modalAddPicture(works) {
  works = works || (await logWorks());
  let modalHeader = document.querySelector(".modalHeader");
  let previous = document.createElement("span");
  previous.classList.add("previous");
  previous.innerHTML = "&larr;";
  previous.addEventListener("click", function (event) {
    modalGallery();
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

  let imgPreview = document.createElement("img");
  imgPreview.setAttribute("id", "imgPreview");
  imgPreview.src = "";
  imgPreview.alt = "prévisualisation de l'image";

  let ajouterPhoto = document.createElement("label");
  ajouterPhoto.setAttribute("for", "fileUpload");
  ajouterPhoto.classList.add("custom");
  ajouterPhoto.innerHTML = "+ Ajouter photo";

  let requirements = document.createElement("p");
  requirements.innerHTML = "jpg, png : 4mo max";

  let titleLabel = document.createElement("label");
  titleLabel.innerHTML = "Titre";
  titleLabel.classList.add("titre");

  let titleForm = document.createElement("input");
  titleForm.type = "text";

  let categoriesLabel = document.createElement("label");
  categoriesLabel.innerHTML = "Catégorie";
  categoriesLabel.classList.add("titre");

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

  let newFile = (event) => {
    let target = event.target || event;
    let fileTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (
      target?.files[0]?.size > 4194304 &&
      !fileTypes.includes(target?.files[0]?.type)
    ) {
      alert("fichier pas bon là");
      return false;
    } else if (target.files && target.files[0]) {
      let reader = new FileReader();
      reader.onload = function (e) {
        imgPreview.src = e.target.result;
        imgPreview.style.display = "block";
        picIcon.style.display = "none";
        ajouterPhoto.style.display = "none";
        requirements.style.display = "none";
      };
      reader.readAsDataURL(target.files[0]);
      return true;
    }
  };

  addFile.addEventListener("change", newFile);

  let isTitle = (event) => {
    let target = event.target || event;
    if (target.value.length <= 3) {
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
  formAdd.addEventListener("change", function (event) {
    if (newFile(addFile) && isTitle(titleForm) && selection(categoriesSelect)) {
      addPhoto.classList.remove("off");
    }
  });

  addPhoto.addEventListener("click", async () => {
    let token = getCookie("token");
    let resetBtnPic = document.querySelector(".btnPic");

    if (
      newFile(addFile) &&
      isTitle(titleForm) &&
      selection(categoriesSelect) &&
      token
    ) {
      const file = addFile.files[0];
      const title = titleForm.value;
      const category = categoriesSelect.value;

      let categoryId = works.find((el) => {
        return category === el.category.name;
      });

      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", categoryId.categoryId);
      formData.append("image", file);

      const response = await postWork(formData);
      modalAddPicture();
    }
  });

  if (!modalHeader.querySelector(".previous"))
    modalHeader.appendChild(previous);
  btnPic.appendChild(picIcon);
  btnPic.appendChild(addFile);
  btnPic.appendChild(imgPreview);
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
