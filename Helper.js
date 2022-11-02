const baseURL = "https://collectionapi.metmuseum.org/public/collection/v1/objects";

export default class Helper{
    constructor(sectionID){
        this.sectionID = sectionID;

        this.art = [];
        this.init();
    }

    async init(){
        this.art = await this.makeRequest(baseURL);
        // this.art = this.people.results;
        console.log(this.art);

        // const element = document.getElementById(this.sectionID);
        // element.innerHTML = this.people.map((people) => `<li>${people.name}</li>`).join("");
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
}