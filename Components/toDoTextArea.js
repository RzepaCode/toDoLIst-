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

        const t = this;

        // Wrapper
        t.#element = document.createElement("div");

        // wrapper
        width !== null && (t.#element.style.width = width);

        // Label
        if (label !== null) {
            const labelElement = document.createElement("label");
            labelElement.innerHTML = label;
            t.#element.appendChild(labelElement);
        }

        // TextArea
        t.#textAreaElement = document.createElement("textarea");

        t.#textAreaElement.addEventListener("change", () => {
            if (owner && typeof dataSource === "string") {
                owner[dataSource] = t.#textAreaElement.value;
            }
        });

        // klasa i Id
        className !== null && (t.#textAreaElement.classList.add(className));
        idName && (t.#textAreaElement.setAttribute("id", idName));

        // Wysokość przypisujemy do pola tekstowego
        height !== null && (t.#textAreaElement.style.height = height);

        // Szerokość 100%, aby wypełniał wrappera
        t.#textAreaElement.style.width = "100%";

        // Wstawianie tekstu
        text !== null && (t.#textAreaElement.value = text);

        // Dodanie textarea do wrappera
        t.#element.appendChild(t.#textAreaElement);

        // Dodanie wrappera do parenta
        $parentObject instanceof HTMLElement && ($parentObject.appendChild(t.#element));
    }

    get element() {
        return this.#element;
    }
}