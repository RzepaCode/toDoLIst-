import {o_applicationInfo} from "./applicationInfo.js"

import {o_toDoButton} from "./Components/toDoButton.js"
import {o_toDoSelect} from "./Components/toDoSelect.js";
import {o_toDoInput} from "./Components/toDoInput.js";
import {o_toDoPopUp} from "./Components/toDoPopUp.js";
import {o_toDoLabel} from "./Components/toDoLabel.js";
import {o_toDoTask} from "./Components/toDoTask.js";
import {o_toDoHambugerMenu} from "./Components/toDoHamburgerMenu.js"

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
        this.$renderedTasks = [];

        // ==========================
        // === główny wrapper ===

        const $wrapperToDoList = document.createElement("div");
        $wrapperToDoList.setAttribute("id", "wrapperToDoList");

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
                const selectedTasks = this.$renderedTasks.filter(instance => {
                    const checkbox = instance.element.querySelector('input[type="checkbox"]');
                    return checkbox && checkbox.checked;
                });

                selectedTasks.forEach(instance => instance.element.remove());

                this.$renderedTasks = this.$renderedTasks.filter(instance => {
                    return selectedTasks.includes(instance) === false;
                });

                o_applicationInfo.$tasks = this.$renderedTasks.map(instance => instance.taskData);
                o_applicationInfo.saveTasks();
            }
        }, $toDoHeader)

        $wrapperToDoList.appendChild($toDoHeader);

        // ==========================
        // === Content listy ===

        const $toDoContent = document.createElement("div");
        $toDoContent.classList.add("toDoContent");

        // --- task button (dodawanie) ---
        new o_toDoButton({
            className: "taskButton",
            text: "<span>+</span>",
            Action: _ => this.#m_openTaskPopup()
        }, $toDoContent)

        $wrapperToDoList.appendChild($toDoContent);

        // ==========================
        // === to do lista do app + tasks ===

        document.getElementById("app").appendChild($wrapperToDoList);

        o_applicationInfo.$tasks.forEach(taskObj => {
            const taskInstance = new o_toDoTask(taskObj);
            this.$renderedTasks.push(taskInstance);
        });
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
                    valueInput: o_applicationInfo.$primaryAppColor,
                    width: "50%",
                    height: "60px",
                    Action: function() {
                        o_applicationInfo.$primaryAppColor = this.value;
                        document.documentElement.style.setProperty('--primary-color', this.value);
                        localStorage.setItem("myToDoPrimaryColor", this.value);
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
                    selectValue: o_applicationInfo.$choosedFont,
                    Action: function (){
                        o_applicationInfo.$choosedFont = this.value;
                        document.documentElement.style.setProperty('--app-font-family', this.value);
                        localStorage.setItem("myToDoChoosedFont", this.value);
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
                    className: "confirm-btn",
                    text: "✓",
                    Action: _ => {
                        const selectedCategory = o_applicationInfo.$categories.find(
                            cat => cat.key === this.$categoryValueTask
                        ) || o_applicationInfo.$categories[0];

                        const newTask = {
                            topic: this.$topicValueTask,
                            description: this.$descriptionValueTask,
                            category: {
                                key: selectedCategory.key,
                                value: selectedCategory.value
                            },
                            date: this.$dateValueTask
                        };

                        o_applicationInfo.$tasks.push(newTask);
                        o_applicationInfo.saveTasks();

                        const taskInstance = new o_toDoTask(newTask);
                        this.$renderedTasks.push(taskInstance);
                        this.#m_applyFilters();
                    }
                }
            ]
        })
    }

    #m_applyFilters() {
        this.$renderedTasks.forEach((taskInstance) => {
            const taskData = taskInstance.taskData;

            // Logika sprawdzania dopasowania filtrów
            const catMatches = (this.$categoryFilterValue === "" || taskData.category.key === this.$categoryFilterValue);
            const dateMatches = (this.$dateFilterValue === "" || taskData.date === this.$dateFilterValue);

            // Ukrywanie lub pokazanie elementu w DOM
            taskInstance.element.style.display = (catMatches && dateMatches) && ('flex') || ('none');
        });
    }
}