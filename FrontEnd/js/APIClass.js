import DOMClass from "./DOMClass.js"

export default class APIClass extends DOMClass{
    // Public field declarations
    // publicField = 0;
    // Public Static field declarations
    // static staticField = 0;
    // Private field declarations
    // #privateField = 0;
    // Private Static field declarations
    // static #privateStaticField = 0;
    #works_endpoint = "http://localhost:5678/api/works"
    #categories_endpoint = "http://localhost:5678/api/categories"



    constructor(props) {
        super()
        props && Object.assign(this,props)
        console.log(this)
    }
    


    getWorks(param) {
        /*
        console.log(param)
        console.log(param||this.#works_endpoint)
        fetch(param||this.#works_endpoint)
            .then((r) => r.json())
            .then(this.renderWorksCards)
            .catch((error) => {
                console.error("Erreur lors de la récupération des données :", error)
            })
        */
    }
    
    getCategories(param) {
        /*
        console.log(param)
        console.log(param||this.#categories_endpoint)
        fetch(param||this.#categories_endpoint)
        .then((r) => r.json())
        .then(this.renderFilterGallery)

        .catch((error) => {
            console.error("Erreur lors de la récupération des catégories :")
        })
        */
    }
    
    
    
}
// const chose = new DOMClass()