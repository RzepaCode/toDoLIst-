export class o_toDoSelect {
    #element;
    constructor($def = {}, $parentObject = null) {
        this.#m_onCreate($def, $parentObject);
    }

    #m_onCreate($def, $parentObject) {
        const {
            className = null,
            idName = null,
            width = null,
            height = null,
            options = [],
            selectValue = null,
            Action = null
        } = $def;

        const t = this;

        // Tworzenie elementu select
        t.#element = document.createElement("select");

        // klasa
        className !== null && (t.#element.classList.add(className));

        // idName
        idName !== null && (t.#element.setAttribute("id", idName));

        // styl: width / height
        width !== null && (t.#element.style.width = width);
        height !== null && (t.#element.style.height = height);

        // Wypełnianie opcjami
        if (Array.isArray(options)) {
            options.forEach(opt => {
                const option = document.createElement("option");

                const val = (opt.value !== undefined && opt.value !== null) ? opt.value : opt;
                const lab = (opt.label !== undefined && opt.label !== null) ? opt.label : opt;

                option.value = val;
                option.textContent = lab;
                t.#element.appendChild(option);
            });
        }

        // wartość selecta przy tworzeniu
        selectValue !== null && (t.#element.value = selectValue);

        t.Action = Action;
        if(t.Action != null){
            t.#element.addEventListener("change", (event) => {
                t.Action.call(t.#element, event);
            });
        }

        // Dodawanie do rodzica, jeśli został podany
        $parentObject instanceof HTMLElement && ($parentObject.appendChild(this.#element));
    }

    get element() {
        return this.#element;
    }
}