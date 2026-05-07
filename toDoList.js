import {o_applicationInfo} from "./applicationInfo.js"

import {o_toDoButton} from "./Components/toDoButton.js"
import {o_toDoSelect} from "./Components/toDoSelect.js";
import {o_toDoInput} from "./Components/toDoInput.js";
import {o_toDoPopUp} from "./Components/toDoPopUp.js";
import {o_toDoLabel} from "./Components/toDoLabel.js";
import {o_toDoTask} from "./Components/toDoTask.js";

export class o_ToDoList {
    constructor() {
        this.#m_onCreate();
    }

    #m_onCreate() {
        // === główny wrapper ===

        const $wrapperToDoList = document.createElement("div");
        $wrapperToDoList.setAttribute("id", "wrapperToDoList");

        // ==========================
        // === header listy ===

        const $toDoHeader = document.createElement("div");
        $toDoHeader.classList.add("toDoHeader");

        // --- options button ---
        let $arrayOfBars = [];
        let $i;
        for ($i = 0; $i < 3; $i++) {
            const $span = document.createElement('span');
            $span.classList.add("bar");
            $arrayOfBars.push($span);
        }

        new o_toDoButton({
            className: "optionsButton",
            appendChilds: $arrayOfBars,
            Action: _ => {
                this.#m_openSettingsPopup();
            }
        }, $toDoHeader)

        // --- category filter ---
        new o_toDoLabel({
            text: "Filtry: "
        }, $toDoHeader)

       new o_toDoSelect({
            className: "categoryFilter",
            options: o_applicationInfo.$categories,
            Action: _ => {
                this.#m_applyFilters();
            }
        }, $toDoHeader)

        // --- date filter ---
        new o_toDoInput({
            typeInput: "date",
            className: "timeFilter",
            Action: _ => {
                this.#m_applyFilters();
            }
        }, $toDoHeader)

        // --- delete checked ---

        new o_toDoLabel({
            text: "Zaznaczone: "
        }, $toDoHeader)

        new o_toDoButton({
            className: "deleteChecked",
            text: "Usuń",
            Action: _ => {
                const $allTasks = document.querySelectorAll('.taskContainer');
                const $allTaskLength = $allTasks.length;
                for ($i = 0; $i < $allTaskLength; $i++) {
                    const task = $allTasks[$i];
                    const checkbox = task.querySelector('input[type="checkbox"]');

                    checkbox.checked && (task.remove());
                }
            }
        }, $toDoHeader)

        $wrapperToDoList.appendChild($toDoHeader);
        // ==========================
        // === Content listy ===

        const $toDoContent = document.createElement("div");
        $toDoContent.classList.add("toDoContent");

        // --- task button ---
        new o_toDoButton({
            className: "taskButton",
            text: "<span>+</span>",
            Action: _ => {
                this.#m_openTaskPopup();
            }
        }, $toDoContent)

        $wrapperToDoList.appendChild($toDoContent);
        // ==========================
        document.getElementById("app").appendChild($wrapperToDoList);
    }

    #m_openSettingsPopup() {
        new o_toDoPopUp({
            uniqueName: "Settings",
            content: [
                {
                  type: "o_toDoH",
                  hValue: 2,
                  text: "Ustawienia aplikacji"
                },
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
                        document.documentElement.style.setProperty('--primary-color', this.value);
                        o_applicationInfo.$primaryAppColor = this.value;
                    }
                },
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
                        console.log("Wybrane: " + this.value);
                        document.documentElement.style.setProperty('--app-font-family', this.value);
                        o_applicationInfo.$choosedFont = this.value;
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
                    type: "o_toDoH",
                    hValue: 2,
                    text: "Dodaj nowe zadanie do wykonania",
                },
                // temat
                {
                    type: "o_toDoLabel",
                    text: "Temat"
                },
                {
                    type: "o_toDoInput",
                    idName: "temat"
                },
                // opis
                {
                    type: "o_toDoLabel",
                    text: "Opis"
                },
                {
                    type: "o_toDoTextArea",
                    idName: "opis"
                },
                // kategoria
                {
                    type: "o_toDoLabel",
                    text: "Kategoria"
                },
                {
                    type: "o_toDoSelect",
                    idName: "kategoria",
                    options: o_applicationInfo.$categories
                },
                // data
                {
                    type: "o_toDoLabel",
                    text: "Data"
                },
                {
                    type: "o_toDoInput",
                    typeInput: "date",
                    idName: "data",
                },
                // confirm Button
                {
                    type: "o_toDoButton",
                    className: "confirm-btn",
                    text: "✓",
                    Action: _ => {
                        new o_toDoTask({
                            topic: document.getElementById("temat").value,
                            description: document.getElementById("opis").value,
                            category: document.getElementById("kategoria").value,
                            date: document.getElementById("data").value
                        })
                        this.#m_applyFilters();
                    }
                }
            ]
        })
    }

    #m_applyFilters() {
        const $selectedCategory = document.getElementsByClassName("categoryFilter")[0].value;
        const $selectedDate = document.getElementsByClassName("timeFilter")[0].value;
        const $allTasks = document.querySelectorAll('.taskContainer');

        let $i;
        const $allTasksLength = $allTasks.length;
        for($i = 0; $i < $allTasksLength; $i++ ) {
            const $taskCategory = $allTasks[$i].querySelector('.taskCategory').textContent.trim();
            const $taskTime = $allTasks[$i].querySelector('.taskTime').textContent.trim();

            // Jeśli filtr jest pusty, uznajemy to za "pasujące"
            const $categoryMatches = ($selectedCategory === "" || $taskCategory === $selectedCategory);
            const $dateMatches = ($selectedDate === "" || $taskTime === $selectedDate);

            // Zadanie jest widoczne tylko jeśli kategoria I data pasują
            $categoryMatches && $dateMatches && ($allTasks[$i].style.display = 'flex') || ($allTasks[$i].style.display = 'none');
        }
    }
}
