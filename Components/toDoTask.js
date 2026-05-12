import { o_toDoH } from "./toDoH.js";
import { o_toDoInput } from "./toDoInput.js";

export class o_toDoTask {
    #element;
    taskData;

    constructor($def) {
        this.taskData = $def;
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

        if (!$parentObject) return;

        t.#element = this.#createDiv("taskContainer");
        t.#element.style.display = "flex";

        const categoryData = (category && category.key !== undefined) ? category : { key: "others", value: "inne" };

        const $taskCheckSection = this.#createDiv("taskCheckSection", t.#element);
        new o_toDoInput({
            typeInput: "checkbox",
            className: "taskCheckbox"
        }, $taskCheckSection);

        const $taskInfoSection = this.#createDiv("taskInfoSection", t.#element);
        new o_toDoH({ hValue: 3, text: this.#getValue(topic, "brak tematu") }, $taskInfoSection);

        const $descriptionContainer = document.createElement("p");
        $descriptionContainer.innerText = this.#getValue(description, "brak opisu");
        $taskInfoSection.appendChild($descriptionContainer);

        const $taskMetaSection = this.#createDiv("taskMetaSection", t.#element);
        const $taskCategory = this.#createDiv("taskCategory", $taskMetaSection);
        $taskCategory.innerText = categoryData.value;

        const $taskTime = this.#createDiv("taskTime", $taskMetaSection);
        const finalDate = this.#getValue(date, "brak daty");
        $taskTime.innerText = finalDate;

        const colorClass = this.#getDateClass(finalDate);
        colorClass && ($taskTime.classList.add(colorClass));

        $parentObject.prepend(t.#element);
    }

    #getValue(val, fallback) {
        return (val === null || val === undefined || val === "") ? fallback : val;
    }

    #createDiv(className, parent = null) {
        const div = document.createElement("div");
        div.classList.add(className);
        if (parent) parent.appendChild(div);
        return div;
    }

    #getDateClass(dateStr) {
        if (dateStr === "brak daty") return null;
        const taskDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        taskDate.setHours(0, 0, 0, 0);
        const diffInDays = (taskDate - today) / (1000 * 60 * 60 * 24);
        if (diffInDays < 0) return "red";
        if (diffInDays <= 2) return "orange";
        return "green";
    }

    get element() { return this.#element; }
}