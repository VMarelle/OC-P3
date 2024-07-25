/* import MyClass from "./js/MyClass.js"; */
import modalForm from "./modal.js";

function isToken() {
  return document.cookie
    .split(";")
    .some((item) => item.trim().startsWith("token="));
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

async function logDelete(id) {
  let token = getCookie("token");

  if (token) {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status == 204) DOMFactory(await logWorks());

    return response.status;
  }
}

async function postWork(data) {
  let token = getCookie("token");
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  const res = await response.json();
  DOMFactory(await logWorks());
  return res;
}

async function logWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  return works;
}

async function logCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  return categories;
}

function DOMFactory(works) {
  let gallery = document.querySelector(".gallery");

  gallery.innerHTML = "";

  works.forEach((element) => {
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    img.src = element.imageUrl;
    img.alt = element.title;
    let figCaption = document.createElement("figcaption");
    figCaption.innerHTML = element.title;
    figure.appendChild(img);
    figure.appendChild(figCaption);
    gallery.appendChild(figure);
  });
}

async function DOMFilter() {
  const works = await logWorks();
  const categories = await logCategories();

  if (isToken()) {
    return;
  }

  let filter = document.querySelector(".filter");
  let tous = document.createElement("div");

  categories.forEach((element) => {
    let category = document.createElement("div");

    category.innerHTML = element.name;
    category.classList.add("button");

    category.addEventListener("click", function (event) {
      let target = event.target;

      let button = document.querySelectorAll(".button");
      button.forEach((el) => {
        el.classList.remove("selected");
      });

      target.classList.add("selected");

      const result = works.filter(
        (el) => el.category.name === target.innerText
      );
      DOMFactory(result);
    });

    filter.appendChild(category);
  });

  tous.addEventListener("click", function (event) {
    let target = event.target;

    let button = document.querySelectorAll(".button");
    button.forEach((el) => {
      el.classList.remove("selected");
    });

    target.classList.add("selected");
    DOMFactory(works);
  });

  tous.classList.add("button");
  tous.innerHTML = "Tous";
  filter.insertBefore(tous, filter.firstChild);
}

function editorMode() {
  if (isToken()) {
    document.getElementById("edit").style.display = "block";
    document.getElementById("modify").style.display = "block";
  }
}

function logout() {
  if (isToken()) {
    let login = document.getElementById("login");
    login.innerHTML = "logout";
    login.addEventListener("click", function (event) {
      document.cookie = "token= ; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      location.reload();
    });
  }
}

async function modify() {
  let modal = document.getElementById("myModal");
  let btn = document.getElementById("modify");
  let span = document.getElementsByClassName("close");
  let addPhoto = document.getElementById("addPhoto");
  let addPhotoForm = document.getElementById("addPhotoForm");
  let modalContent = document.querySelector(".modal-content");

  btn.onclick = async function () {
    const works = await logWorks();
    modal.style.display = "block";
    modalForm(works);
  };

  let cb = function () {
    modal.style.display = "none";
    addPhotoForm.style.display = "none";
    modalContent.style.display = "block";
  };
}

isToken();
logout();
editorMode();
DOMFilter();
logCategories();
DOMFactory(await logWorks());
modify();

export { isToken, logDelete, getCookie, postWork, logWorks };
