export class o_toDoTextArea {
    #element; // To będzie nasz wrapper (div)
    #textAreaElement;

    constructor($def, $parentObject) {
        this.#m_onCreate($def, $parentObject)
    }

    #m_onCreate($def, $parentObject) {
        const {
            owner = null,
            dataSource = null,
            className = null,
            idName = null,
            width = null,
            height = null,
            text = null,
            label = null
        } = $def;

        // Wrapper
        this.#element = document.createElement("div");

        // wrapper
        width !== null && (this.#element.style.width = width);

        // Label
        if (label !== null) {
            const labelElement = document.createElement("label");
            labelElement.innerHTML = label;
            this.#element.appendChild(labelElement);
        }

        // TextArea
        this.#textAreaElement = document.createElement("textarea");

        this.#textAreaElement.addEventListener("change", () => {
            if (owner && typeof dataSource === "string") {
                owner[dataSource] = this.#textAreaElement.value;
            }
        });

        // klasa i Id
        className !== null && (this.#textAreaElement.classList.add(className));
        idName && (this.#textAreaElement.setAttribute("id", idName));

        // Wysokość przypisujemy do pola tekstowego
        height !== null && (this.#textAreaElement.style.height = height);

        // Szerokość 100%, aby wypełniał wrappera
        this.#textAreaElement.style.width = "100%";

        // Wstawianie tekstu
        text !== null && (this.#textAreaElement.value = text);

        // Dodanie textarea do wrappera
        this.#element.appendChild(this.#textAreaElement);

        // Dodanie wrappera do parenta
        $parentObject instanceof HTMLElement && ($parentObject.appendChild(this.#element));
    }

    get element() {
        return this.#element;
    }
}