const baseURL = "https://collectionapi.metmuseum.org/public/collection/v1/departments";
const searchURL = "https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=";
const objectUrl = "https://collectionapi.metmuseum.org/public/collection/v1/objects/";

export default class Department {
    constructor(ulID, objectsectionID, loadingId) {
        this.ulID = ulID;
        this.objectsectionID = objectsectionID;
        this.loadingId = loadingId;

        this.outputElement = document.getElementById(objectsectionID);
        this.departmentElement = document.getElementById(ulID);
        this.loadingElement = document.getElementById(loadingId);

        this.departments = [];
        this.objects = [];
        this.objetIds = [];
        this.init();
    }

    async init() {

        this.outputElement.style.display = "none";
        this.loadingElement.style.display = "block";

        // get the departIds
        this.departments = await this.makeRequest(baseURL);
        this.departments = this.departments.departments;

        this.outputElement.style.display = "initial";
        this.loadingElement.style.display = "none";


        // test the returns
        console.log(this.departments);
        console.log(this.objects);

        this.clickableList(this.departments, this.ulID, this.departmentSelected.bind(this));
    }

    async getObjects()
    {
        this.departments.map((item) => {})
    }

    async makeRequest(url) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return await response.json();
            } else {
                const error = await response.text();
                throw new Error(error);
            }
        } catch (err) {
            console.log(err);
        }
    }

    clickableList(list, elementId, callback) {
        const element = document.getElementById(this.ulID);
        console.log(list);
        element.innerHTML = list.map((item) => `<li>${item.displayName}</li>`).join("");
        element.addEventListener("click", (e) => {
            console.log("hey" + e.target);
            callback(e.target.innerText);
        })
    }

    async departmentSelected(departmentName){
        console.log(departmentName);
        try {
            const department = this.departments.find((item) => item.displayName === departmentName);
            if (!department) {
                throw new Error("Department not found");
            }

            this.outputElement.innerHTML = this.pageTemplate();
            this.outputElement.querySelector(".department-name").innerHTML = department.displayName;

            // Get a list of object Ids
            const objects = await this.makeRequest(searchURL + department.departmentId + "&q=*");
            const objectIds = objects.objectIDs;

            // reduce the list to size 20
            objectIds.length = 20;

            // Convert the objectIds into urls and display them
            const artwork = await this.getListDetails(objectIds);
            this.renderList(artwork, this.artworkTemplate, ".department-artwork");

        } catch (err) {
            console.log(err);
        }
    }

    async getListDetails(list) {
        //Promise.all(listOfPromises)
        const details = await Promise.all(list.map((url) => this.makeRequest(objectUrl + url)));
        //console.log(details);
        return details;
    }

    pageTemplate() {
        return `<h2 class='department-name'></h2>
        <p class='crawl'></p>
        <section class='Artwork'>
            <h3>Artwork</h3>
            <ul class='detail-list department-artwork'></ul>
        </section>
        `;
    }

    artworkTemplate(artwork){
        return`
        <li>
            <h4 class='art-name'>${artwork.title}</h4>
            <img class='art-img' src='${artwork.primaryImageSmall}'>
            <p>Artist Name:${artwork.artistDisplayName}</p>
            <p>Culture:${artwork.culture}</p>
        </li>
        `;
    }

    renderList(list, template, outputId){
        const element = document.querySelector(outputId);
        element.innerHTML = "";
        const htmlString = list.map((item)=>template(item));
        element.innerHTML = htmlString.join("");
    }
}