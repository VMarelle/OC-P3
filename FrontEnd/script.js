/* import MyClass from "./js/MyClass.js"; */

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

async function DOMFactory(works) {
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

DOMFilter();
logCategories();
DOMFactory(await logWorks());
