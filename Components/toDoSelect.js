export class o_toDoSelect {
    #element;
    #selectElement;

    constructor($def, $parentObject = null) {
        this.#m_onCreate($def, $parentObject);
    }

    #m_onCreate($def, $parentObject) {
        const {
            owner = null,
            dataSource = null,
            className = null,
            idName = null,
            width = null,
            height = null,
            options = [],
            selectValue = null,
            Action = null,
            label = null
        } = $def;

        const t = this;

        // wrapper
        t.#element = document.createElement("div");

        // width
        width !== null && (t.#element.style.width = width);

        //Label
        if (label !== null) {
            const labelElement = document.createElement("label");
            labelElement.innerHTML = label;
            if (idName) labelElement.setAttribute("for", idName);
            t.#element.appendChild(labelElement);
        }

        // Tworzenie elementu select
        t.#selectElement = document.createElement("select");

        // klasa
        className !== null && (t.#selectElement.classList.add(className));

        // idName
        idName !== null && (t.#selectElement.setAttribute("id", idName));

        // styl: height (width na 100% aby wypełnił wrapper)
        height !== null && (t.#selectElement.style.height = height);
        t.#selectElement.style.width = "100%";

        // Wypełnianie opcjami
        if (Array.isArray(options)) {
            options.forEach(opt => {
                const option = document.createElement("option");

                const val = opt.key !== undefined ? opt.key : (opt.value !== undefined ? opt.value : opt);
                const lab = opt.value !== undefined ? opt.value : (opt.label !== undefined ? opt.label : opt);

                option.value = val;
                option.textContent = lab;
                t.#selectElement.appendChild(option);
            });
        }

        // wartość selecta przy tworzeniu
        selectValue !== null && (t.#selectElement.value = selectValue);

        t.Action = Action;
        t.#selectElement.addEventListener("change", (event) => {
            if (owner && typeof dataSource === "string") {
                owner[dataSource] = t.#selectElement.value;
            }
            (t.Action != null) && (t.Action.call(t.#selectElement, event));
        });

        // Dodanie selecta do wrappera
        t.#element.appendChild(t.#selectElement);

        // Dodawanie do rodzica
        $parentObject instanceof HTMLElement && ($parentObject.appendChild(t.#element));
    }

    get element() {
        return this.#element;
    }
}