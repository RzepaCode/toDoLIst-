export class o_toDoSelect {
    #element;
    #selectElement;

    constructor($def, $parentObject) {
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

        // wrapper
        this.#element = document.createElement("div");

        // width
        width !== null && (this.#element.style.width = width);

        //Label
        if (label !== null) {
            const labelElement = document.createElement("label");
            labelElement.innerHTML = label;

            idName && (labelElement.setAttribute("for", idName));
            this.#element.appendChild(labelElement);
        }

        // Tworzenie elementu select
        this.#selectElement = document.createElement("select");

        // klasa
        className !== null && (this.#selectElement.classList.add(className));

        // idName
        idName !== null && (this.#selectElement.setAttribute("id", idName));

        // styl: height (width na 100% aby wypełnił wrapper)
        height !== null && (this.#selectElement.style.height = height);
        this.#selectElement.style.width = "100%";

        // Wypełnianie opcjami
        if (Array.isArray(options)) {
            options.forEach(opt => {
                const option = document.createElement("option");

                const val = opt.key !== undefined ? opt.key : (opt.value !== undefined ? opt.value : opt);
                const lab = opt.value !== undefined ? opt.value : (opt.label !== undefined ? opt.label : opt);

                option.value = val;
                option.textContent = lab;
                this.#selectElement.appendChild(option);
            });
        }

        // wartość selecta przy tworzeniu
        selectValue !== null && (this.#selectElement.value = selectValue);

        this.Action = Action;
        this.#selectElement.addEventListener("change", (event) => {
            if (owner && typeof dataSource === "string") {
                owner[dataSource] = this.#selectElement.value;
            }
            (this.Action != null) && (this.Action.call(this.#selectElement, event));
        });

        // Dodanie selecta do wrappera
        this.#element.appendChild(this.#selectElement);

        // Dodawanie do rodzica
        $parentObject instanceof HTMLElement && ($parentObject.appendChild(this.#element));
    }

    get element() {
        return this.#element;
    }
}