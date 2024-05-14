/* import MyClass from "./js/MyClass.js"; */

async function logWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  return works;
}

async function logCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  console.log(categories);
}

async function DOMFactory() {
  const works = await logWorks();
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

logCategories();

DOMFactory();
