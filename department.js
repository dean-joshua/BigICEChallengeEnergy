const baseURL = "https://collectionapi.metmuseum.org/public/collection/v1/departments";
const searchURL = "https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=";

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

        // get the objects based on a departmentID
        this.objects = await this.makeRequest(searchURL + this.departments[0].departmentId + "&q=*");

        // test the returns
        console.log(this.departments);
        console.log(this.objects);

        //this.renderList(this.departments);
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

    departmentSelected(departmentId){

    }

    renderList(list) {
        const element = document.getElementById(this.ulID);
        element.innerHTML = this.departments.map((department) => `<li>${department.displayName}</li>`).join("");
    }
}