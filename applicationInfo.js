export class o_applicationInfo{
    static $categories = [
        {key: "freeTime", value: "Czas wolny"},
        {key: "school", value: "Szkoła"},
        {key: "job", value: "Praca"},
        {key: "house", value: "Dom"},
        {key: "others", value: "Inne"}
    ];

    static $appFonts = [
        {key: "sans-serif", value: "Sans serif"},
        {key: "serif", value: "Serif"},
        {key: "Arial", value: "Arial"},
        {key: "Calibri", value: "Calibri"},
        {key: "Comic Sans Ms", value: "Comic Sans Ms"},
        {key: "Courier New", value: "Courier New"},
    ];

    static $choosedFont = localStorage.getItem("myToDoChoosedFont");

    static $primaryAppColor = localStorage.getItem("myToDoPrimaryColor") || window.getComputedStyle(document.body).getPropertyValue("--primary-color");

    static $tasks = o_applicationInfo.loadTasks();

    static loadTasks() {
        const savedTasks = localStorage.getItem("myToDoTasks");
        if(savedTasks) return JSON.parse(savedTasks);
        return [
            {
                topic: "Pierwsze zadanie",
                description: "Dodaj swoje pierwsze zadanie a mnie potem usuń!",
                category: this.$categories[0],
                date: ""
            }
        ];
    }

    static saveTasks() {
        localStorage.setItem("myToDoTasks", JSON.stringify(this.$tasks));
    }
}

// ustawianie wartości zapamiętanych przez local storage
document.documentElement.style.setProperty('--app-font-family', o_applicationInfo.$choosedFont);
document.documentElement.style.setProperty('--primary-color', o_applicationInfo.$primaryAppColor);

window.o_applicationInfo = o_applicationInfo;