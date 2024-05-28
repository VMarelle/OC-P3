import { isToken } from "./script.js";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export default function modalForm(works) {
  if (isToken) {
    let token = getCookie("token");

    let modal = document.getElementById("myModal");

    modal.innerHTML = "";

    let div = document.createElement("div");
    div.classList.add("modal-content");
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
        const response = await fetch(
          `http://localhost:5678/api/works/${result[0].id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        location.reload();
      });
    });

    div.appendChild(span);
    div.appendChild(title);
    div.appendChild(listImg);
    modal.appendChild(div);
  }

  return null;
}
