const baseURL = "https://collectionapi.metmuseum.org/public/collection/v1/departments";
const searchURL = "https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=";

export default class Department {
    constructor(sectionID, objectsectionID) {
        this.sectionID = sectionID;
        this.objectsectionID = objectsectionID;

        this.departments = [];
        this.objects = [];
        this.init();
    }

    async init() {
        this.departments = await this.makeRequest(baseURL);
        //this.objects = await this.makeRequest(searchURL + this.departments[0].departmentId);
        this.departments = this.departments.departments;
        this.objects = await this.makeRequest(searchURL + this.departments[0].departmentId + "&q=*");
        //console.log(this.departments[0].departmentId);
        console.log(this.departments);
        console.log(this.objects);

        this.renderList(this.departments);
        //this.clickableList(list);
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

    clickableList(list) {
        const element = document.getElementById(this.sectionID);
        console.log(list);
        element.innerHTML = list.map((item) => `<li>${item.displayName}</li>`).join("");
        element.addEventListener("click", (e) => {
            console.log("hey" + e.target);
            callback(e.target.innerText);
        })
    }

    renderList(list) {
        const element = document.getElementById(this.sectionID);
        element.innerHTML = this.departments.map((department) => `<li>${department.displayName}</li>`).join("");
    }
}