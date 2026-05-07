import { o_toDoH } from "./toDoH.js";
import { o_toDoInput } from "./toDoInput.js";

export class o_toDoTask {
    #element;
    constructor($def) {
        this.#m_onCreate($def);
    }

    #m_onCreate($def) {
        const {
            topic = null,
            description = null,
            category = null,
            date = null
        } = $def;

        const t = this;
        const $parentObject = document.getElementsByClassName("toDoContent")[0];

        //  Kontener główny
        t.#element = this.#createDiv("taskContainer");
        t.#element.style.display = "flex";

        // Sekcja Checkbox
        const $taskCheckSection = this.#createDiv("taskCheckSection");
        t.#element.appendChild($taskCheckSection);

        new o_toDoInput({
            typeInput: "checkbox", className: "taskCheckbox"
        }, $taskCheckSection);

        // Sekcja Info
        const $taskInfoSection = this.#createDiv("taskInfoSection");
        t.#element.appendChild($taskInfoSection);

        t.topic = this.#getValue(topic, "brak tematu");
        new o_toDoH({
            hValue: 3, text: t.topic
        }, $taskInfoSection);

        const $descriptionContainer = document.createElement("p");
        t.description = this.#getValue(description, "brak opisu");
        $descriptionContainer.innerText = t.description;
        $taskInfoSection.appendChild($descriptionContainer);

        // Sekcja Meta (Kategoria i Data)
        const $taskMetaSection = this.#createDiv("taskMetaSection");
        t.#element.appendChild($taskMetaSection);

        // Kategoria
        const $taskCategory = this.#createDiv("taskCategory");
        $taskMetaSection.appendChild($taskCategory);
        t.category = this.#getValue(category, "brak kategorii");
        $taskCategory.innerText = t.category;

        // Data (Z logiką kolorów)
        const $taskTime = this.#createDiv("taskTime");
        $taskMetaSection.appendChild($taskTime);
        t.date = this.#getValue(date, "brak daty");
        $taskTime.innerText = t.date;

        // dodawanie klasy koloru
        const colorClass = this.#getDateClass(t.date);
        colorClass && ($taskTime.classList.add(colorClass));

        $parentObject.prepend(t.#element);
    }


    #getValue(val, fallback) {
        return (val === null || val === undefined || val === "") ? fallback : val;
    }

    #createDiv(className, parent) {
        const div = document.createElement("div");
        div.classList.add(className);
        parent && (parent.appendChild(div));
        return div;
    }

    #getDateClass(dateStr) {
        if (dateStr === "brak daty") return null;

        const taskDate = new Date(dateStr);
        const today = new Date();

        // Resetujemy godziny, minuty i sekundy, żeby porównywać tylko dni kalendarzowe
        today.setHours(0, 0, 0, 0);
        taskDate.setHours(0, 0, 0, 0);

        // Obliczamy różnicę w milisekundach i zamieniamy na dni
        const diffInMs = taskDate - today;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        if (diffInDays < 0) return "red";
        if (diffInDays <= 2) return "orange";
        return "green";
    }

    get element() {
        return this.#element;
    }
}