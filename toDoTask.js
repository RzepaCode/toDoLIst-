import { o_toDoH } from "./toDoH.js";
import { o_toDoInput } from "./toDoInput.js";

export class o_toDoTask {
    #element;
    #taskData;
    #isChecked;
    constructor($def, $parentObject) {
        const {owner, dataSource, ...pureData} = $def;
        this.#taskData = pureData;

        this.#m_onCreate($def, $parentObject);
    }

    #m_onCreate($def, $parentObject) {
        const {
            owner,
            dataSource,
            id,
            topic,
            description,
            categoryKey,
            date,
        } = $def;

        const t = this;
        this.#isChecked = !!(owner && owner[dataSource]);
        // Tworzenie głównego kontenera
        t.#element = document.createElement("div");
        t.#element.classList.add("taskContainer");
        t.#element.style.display = "flex";

        // Checkbox
        const $taskCheckSection = document.createElement("div");
        $taskCheckSection.classList.add("taskCheckSection");
        t.#element.appendChild($taskCheckSection);

        const myCheckBoxElement = new o_toDoInput({
            typeInput: "checkbox",
            className: "taskCheckbox",
            Action: function() {
                if(!owner) return;
                t.#isChecked = !t.#isChecked;
                t.#isChecked && (owner[dataSource] = true) || (delete owner[dataSource]);
            }
        }, $taskCheckSection);

        myCheckBoxElement.inputElement.checked = t.#isChecked;

        // Sekcja Informacyjna
        const $taskInfoSection = document.createElement("div");
        $taskInfoSection.classList.add("taskInfoSection");
        t.#element.appendChild($taskInfoSection);

        // naglowek
        new o_toDoH({
            hValue: 3,
            text: this.#m_getValue(topic, "brak tematu")
        }, $taskInfoSection);

        // Tworzenie paragrafu z opisem
        const $descriptionContainer = document.createElement("p");
        $descriptionContainer.innerText = this.#m_getValue(description, "brak opisu");
        $taskInfoSection.appendChild($descriptionContainer);

        // kategoria i czas
        const $taskMetaSection = document.createElement("div");
        $taskMetaSection.classList.add("taskMetaSection");
        t.#element.appendChild($taskMetaSection);

        // Kontener kategorii
        const $taskCategory = document.createElement("div");
        $taskCategory.classList.add("taskCategory");
        const foundCategory = o_applicationInfo.$categories.find(cat => cat.key === categoryKey);
        $taskCategory.innerText = foundCategory ? foundCategory.value : "Inne";
        $taskMetaSection.appendChild($taskCategory);

        // Kontener daty
        const $taskTime = document.createElement("div");
        $taskTime.classList.add("taskTime");
        const finalDate = this.#m_getValue(date, "brak daty");
        $taskTime.innerText = finalDate;
        $taskMetaSection.appendChild($taskTime);

        // Nadawanie koloru w zależności od terminu (red/orange/green)
        const colorClass = this.#m_getDateClass(finalDate);
        colorClass && ($taskTime.classList.add(colorClass));

        // Dodanie gotowego zadania na samą górę listy
        $parentObject.prepend(t.#element);
    }

    #m_getValue(val, fallback) {
        return (val === null || val === undefined || val === "") ? fallback : val;
    }

    #m_getDateClass(dateStr) {
        if (dateStr === "brak daty") return null;

        const taskDate = new Date(dateStr);
        const today = new Date();

        // Zerowanie godzin dla dokładnego porównania dni
        today.setHours(0, 0, 0, 0);
        taskDate.setHours(0, 0, 0, 0);

        const diffInDays = (taskDate - today) / (1000 * 60 * 60 * 24);

        if (diffInDays < 0) return "red";
        if (diffInDays <= 2) return "orange";
        return "green";
    }

    m_destroy(){
        this.element.remove();
    }

    get element() {
        return this.#element;
    }

    get id() {
        return this.#taskData.id;
    }

}