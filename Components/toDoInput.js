export class o_toDoInput {
    #element;
    #inputElement;

    constructor($def, $parentObject) {
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

        // Tworzymy wrapper
        this.#element = document.createElement("div");
        this.#element.classList.add("toDoInputWrapper");

        // width
        width !== null && (this.#element.style.width = width);

        // Obsługa Labela
        if (label !== null) {
            const labelElement = document.createElement("label");
            labelElement.innerHTML = label;

            this.#element.appendChild(labelElement);
        }

        // Tworzenie Inputa
        this.#inputElement = document.createElement("input");

        className !== null && (this.#inputElement.classList.add(className));
        idName !== null && (this.#inputElement.setAttribute("id", idName));

        this.#inputElement.type = typeInput;
        valueInput !== null && (this.#inputElement.value = valueInput);
        height !== null && (this.#inputElement.style.height = height);
        placeHolder !== null && (this.#inputElement.placeholder = placeHolder);

        // Zdarzenie onChange
        this.#inputElement.addEventListener("change", (event) => {
            if (owner && typeof dataSource === "string") {
                owner[dataSource] = this.#inputElement.value;
            }
            Action != null && (Action.call(this.#inputElement, event));
        });

        this.#element.appendChild(this.#inputElement);

        //Dodanie całości do parenta
        $parentObject instanceof HTMLElement && ($parentObject.appendChild(this.#element))
    }

    // Zwraca wrapper
    get element() {
        return this.#element;
    }

    get inputElement() {
        return this.#inputElement;
    }
}