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
        this.$checkedState = {};

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
                // Pobieramy ID elementów do usunięcia
                const idsToDelete = Object.keys(this.$checkedState)
                if (idsToDelete.length === 0) return;

                // Usuwamy z głównej tablicy danych
                this.$tasks = this.$tasks.filter(task => !idsToDelete.includes(task.id));

                // Czyścimy obiekt stanów (bo te zadania już nie istnieją)
                this.$checkedState = {};

                this.#m_saveTasks();
                this.#m_applyFilters();
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
                // Wewnątrz #m_openSettingsPopup:
                {
                    type: "o_toDoInput",
                    typeInput: "color",
                    owner: this,
                    dataSource: "$primaryAppColor",
                    width: "50%",
                    height: "60px",
                    Action: () => {
                        document.documentElement.style.setProperty('--primary-color', this.$primaryAppColor);
                        o_ToDoStorage.set("myToDoPrimaryColor", this.$primaryAppColor);
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
                    owner: this,
                    dataSource: "$choosedFont",
                    options: o_applicationInfo.$appFonts,
                    Action: ()=> {
                        document.documentElement.style.setProperty('--app-font-family', this.$choosedFont);
                        o_ToDoStorage.set("myToDoChoosedFont", this.$choosedFont);
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
                        const newTask = {
                            id: window.crypto.randomUUID(),
                            topic: this.$topicValueTask,
                            description: this.$descriptionValueTask,
                            categoryKey: this.$categoryValueTask || o_applicationInfo.$categories[0].key,
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
        this.$renderedTasks.forEach(instance => instance.m_destroy());
        this.$renderedTasks = [];

        // Filtrujemy dane z tablicy głównej tasks
        const filteredData = this.$tasks.filter(taskData => {
            const catMatches = (this.$categoryFilterValue === "" || taskData.categoryKey === this.$categoryFilterValue);
            const dateMatches = (this.$dateFilterValue === "" || taskData.date === this.$dateFilterValue);
            return catMatches && dateMatches;
        });

        // Tworzymy nowe obiekty dla pasujących zadań (one same dodadzą się do DOM w constructorze)
        filteredData.forEach(taskData => {
            const taskInstance = new o_toDoTask({
                ...taskData,
                owner: this.$checkedState,
                dataSource: taskData.id
            }, this.$toDoContent);

            this.$renderedTasks.push(taskInstance);
        });
    }
}