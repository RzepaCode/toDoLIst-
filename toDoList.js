import {o_applicationInfo} from "./applicationInfo.js"

import {o_toDoButton} from "./Components/toDoButton.js"
import {o_toDoSelect} from "./Components/toDoSelect.js";
import {o_toDoInput} from "./Components/toDoInput.js";
import {o_toDoPopUp} from "./Components/toDoPopUp.js";
import {o_toDoLabel} from "./Components/toDoLabel.js";
import {o_toDoTask} from "./Components/toDoTask.js";
import {o_toDoHambugerMenu} from "./Components/toDoHamburgerMenu.js"
import {o_ToDoStorage} from "./toDoLocalStorage.js";

export class o_ToDoList {
    constructor() {
        this.#m_onCreate();
    }

    #m_onCreate() {
        // === wartosci do ownera ===

        // toDoHeader values
        this.$categoryFilterValue = "";
        this.$dateFilterValue = "";
        this.$topicValueTask = "";
        this.$descriptionValueTask = "";

        // task window values
        this.$categoryValueTask = "";
        this.$dateValueTask = "";

        // to do list values
        this.$tasks = this.#m_loadTasks();
        this.$renderedTasks = [];
        this.$checkedTasks = [];

        this.$choosedFont = o_ToDoStorage.get("myToDoChoosedFont");
        this.$primaryAppColor = o_ToDoStorage.get("myToDoPrimaryColor") || window.getComputedStyle(document.body).getPropertyValue("--primary-color");
        document.documentElement.style.setProperty('--app-font-family', this.$choosedFont);
        document.documentElement.style.setProperty('--primary-color',this.$primaryAppColor);
        // ==========================
        // === główny wrapper ===

        const $wrapperToDoList = document.createElement("div");
        $wrapperToDoList.classList.add("wrapperToDoList");

        // ==========================
        // === header listy ===

        const $toDoHeader = document.createElement("div");
        $toDoHeader.classList.add("toDoHeader");

        // --- options button (hamburger) ---
        new o_toDoHambugerMenu({
            className: "optionsButton",
            Action: _ => this.#m_openSettingsPopup()
        }, $toDoHeader)

        // --- category filter ---
        new o_toDoLabel({
            text: "Filtry: "
        },$toDoHeader)

        new o_toDoSelect({
            className: "categoryFilter",
            owner: this,
            dataSource: "$categoryFilterValue",
            options: [{ key: "", value: "Wszystkie" }, ...o_applicationInfo.$categories],
            Action: _ => this.#m_applyFilters()
        }, $toDoHeader)

        // --- date filter ---
        new o_toDoInput({
            typeInput: "date",
            className: "timeFilter",
            owner: this,
            dataSource: "$dateFilterValue",
            Action: _ => this.#m_applyFilters()
        }, $toDoHeader)

        // --- delete checked ---
        new o_toDoLabel({
            text: "Zaznaczone: "
        }, $toDoHeader)

        new o_toDoButton({
            className: "deleteChecked",
            text: "Usuń",
            Action: _ => {
                // Wyciągamy ID zaznaczonych zadań
                const idsToDelete = this.$checkedTasks.map(task => task.id);

                if (idsToDelete.length === 0) return;

                // Usuwamy z lokal storage
                this.$tasks = this.$tasks.filter(task => !idsToDelete.includes(task.id));

                // Usuwamy z DOM tylko te, które są aktualnie wyrenderowane
                this.$renderedTasks.forEach(instance => {
                    idsToDelete.includes(instance.taskData.id) && (instance.element.remove());
                });

                // Czyścimy listę renderowanych instancji z usuniętych elementów
                this.$renderedTasks = this.$renderedTasks.filter(
                    instance => !idsToDelete.includes(instance.taskData.id)
                );

                // Czyszczenie tablicy zaznaczonych i zapis
                this.$checkedTasks = [];
                this.#m_saveTasks();
            }
        }, $toDoHeader)

        $wrapperToDoList.appendChild($toDoHeader);

        // ==========================
        // === Content listy ===

        this.$toDoContent = document.createElement("div");
        this.$toDoContent.classList.add("toDoContent");

        // --- task button (dodawanie) ---
        new o_toDoButton({
            className: "taskButton",
            text: "<span>+</span>",
            Action: _ => this.#m_openTaskPopup()
        }, this.$toDoContent)

        $wrapperToDoList.appendChild(this.$toDoContent);

        // ==========================
        // === to do lista do app + tasks ===

        document.getElementById("app").appendChild($wrapperToDoList);

        // Pierwsze renderowanie zadań
        this.#m_applyFilters();
    }


    #m_openSettingsPopup() {
        new o_toDoPopUp({
            uniqueName: "Settings",
            content: [
                {
                    type: "o_toDoH", hValue: 2,
                    text: "Ustawienia aplikacji"
                },
                // --- zmiana koloru ---
                {
                    type: "o_toDoH",
                    text: "Zmień kolor aplikacji"
                },
                {
                    type: "o_toDoInput",
                    typeInput: "color",
                    valueInput: this.$primaryAppColor,
                    width: "50%",
                    height: "60px",
                    Action: function() {
                        this.$primaryAppColor = this.value;
                        document.documentElement.style.setProperty('--primary-color', this.value);
                        o_ToDoStorage.set("myToDoPrimaryColor", this.value);
                    }
                },
                // --- wybór czcionki ---
                {
                    type: "o_toDoH",
                    text: "Wybierz czcionkę aplikacji"
                },
                {
                    type: "o_toDoSelect",
                    width: "50%",
                    height: "50px",
                    options: o_applicationInfo.$appFonts,
                    selectValue: this.$choosedFont,
                    Action: function (){
                        this.$choosedFont = this.value;
                        document.documentElement.style.setProperty('--app-font-family', this.value);
                        o_ToDoStorage.set("myToDoChoosedFont", this.value);
                    }
                }
            ]
        });
    }

    #m_openTaskPopup() {
        new o_toDoPopUp({
            uniqueName: "Task",
            content: [
                {
                    type: "o_toDoH", hValue: 2,
                    text: "Dodaj nowe zadanie"
                },
                // --- pola formularza ---
                {
                    type: "o_toDoInput",
                    owner: this,
                    dataSource: "$topicValueTask",
                    label: "Temat"
                },
                {
                    type: "o_toDoTextArea",
                    label: "Opis",
                    owner: this,
                    dataSource: "$descriptionValueTask"
                },
                {
                    type: "o_toDoSelect",
                    options: o_applicationInfo.$categories,
                    label: "Kategoria",
                    owner: this,
                    dataSource: "$categoryValueTask"
                },
                {
                    type: "o_toDoInput",
                    typeInput: "date",
                    label: "Data",
                    owner: this,
                    dataSource: "$dateValueTask"
                },
                // --- przycisk potwierdzenia ---
                {
                    type: "o_toDoButton",
                    className: "confirmBtn",
                    text: "✓",
                    Action: _ => {
                        const selectedCategory = o_applicationInfo.$categories.find(
                            cat => cat.key === this.$categoryValueTask
                        ) || o_applicationInfo.$categories[0];

                        const newTask = {
                            id: window.crypto.randomUUID(),
                            topic: this.$topicValueTask,
                            description: this.$descriptionValueTask,
                            category: {
                                key: selectedCategory.key,
                                value: selectedCategory.value
                            },
                            date: this.$dateValueTask,
                        };

                        this.$tasks.push(newTask);
                        this.#m_saveTasks();
                        this.#m_applyFilters();
                    }
                }
            ]
        })
    }

    #m_loadTasks() {
        const savedTasks = o_ToDoStorage.get("myToDoTasks");
        return Array.isArray(savedTasks) ? savedTasks : [];
    }

    #m_saveTasks() {
        o_ToDoStorage.set("myToDoTasks", this.$tasks);
    }

    #m_applyFilters() {
        // Czyścimy aktualnie wyrenderowane elementy z DOM
        this.$renderedTasks.forEach(instance => instance.element.remove());
        this.$renderedTasks = [];

        // Filtrujemy dane z tablicy głównej tasks
        const filteredData = this.$tasks.filter(taskData => {
            const catMatches = (this.$categoryFilterValue === "" || taskData.category.key === this.$categoryFilterValue);
            const dateMatches = (this.$dateFilterValue === "" || taskData.date === this.$dateFilterValue);
            return catMatches && dateMatches;
        });

        // Tworzymy nowe obiekty dla pasujących zadań (one same dodadzą się do DOM w constructorze)
        filteredData.forEach(taskObj => {
            const taskInstance = new o_toDoTask({
                ...taskObj,
                owner: this,
                dataSource: "$checkedTasks"
            }, this.$toDoContent);

            this.$renderedTasks.push(taskInstance);
        });
    }
}