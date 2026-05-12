export class o_toDoInput {
    #element; 
    #inputElement;

    constructor($def, $parentObject = null) {
        this.#m_onCreate($def, $parentObject);
    }

    #m_onCreate($def, $parentObject) {
        const {
            owner = null,
            dataSource = null,
            typeInput = "text",
            valueInput = null,
            className = null,
            idName = null,
            width = null,
            height = null,
            placeHolder = null,
            label = null,
            Action = null
        } = $def;

        const t = this;

        // Tworzymy wrapper
        t.#element = document.createElement("div");
        t.#element.classList.add("todo-input-wrapper");

        // width
        width !== null && (t.#element.style.width = width);

        // Obsługa Labela
        if (label !== null) {
            const labelElement = document.createElement("label");
            labelElement.innerHTML = label;

            t.#element.appendChild(labelElement);
        }

        // Tworzenie Inputa
        t.#inputElement = document.createElement("input");

        className !== null && (t.#inputElement.classList.add(className));
        idName !== null && (t.#inputElement.setAttribute("id", idName));

        t.#inputElement.type = typeInput;
        valueInput !== null && (t.#inputElement.value = valueInput);
        height !== null && (t.#inputElement.style.height = height);
        placeHolder !== null && (t.#inputElement.placeholder = placeHolder);

        // Zdarzenie onChange
        t.#inputElement.addEventListener("change", (event) => {
            if (owner && typeof dataSource === "string") {
                owner[dataSource] = t.#inputElement.value;
            }
            (Action != null) && (Action.call(t.#inputElement, event));
        });

        t.#element.appendChild(t.#inputElement);

        //Dodanie całości do parenta
        $parentObject instanceof HTMLElement && ($parentObject.appendChild(t.#element))
    }

    // Zwraca wrapper
    get element() {
        return this.#element;
    }
}