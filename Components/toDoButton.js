export class o_toDoButton {
    #element;
    constructor($def = {}, $parentObject = null) {
        this.#m_onCreate($def, $parentObject);
    }

    #m_onCreate($def, $parentObject){
        const {
            className = null,
            width = null,
            height = null,
            text = null,
            Action = null,
            appendChilds = []
        } = $def;
        const t = this;

        // tworzenie elementu
        t.#element = document.createElement("button");

        // klasa
        className !== null && (t.#element.classList.add(className));

        // styl: width / height
        width !== null && (t.#element.style.width = width);
        height !== null && (t.#element.style.height = height);

        // tekst
        text !== null && (t.#element.innerHTML= text);

        // onClick
        if (typeof Action === "function") {
            this.Action = Action;
            t.#element.addEventListener("click", (event) => {
                this.Action(event);
            });
        }

        // dodawanie podrzędnych objectów
        if (Array.isArray(appendChilds)) {
            appendChilds.forEach(child => {
                if (child instanceof HTMLElement) {
                    this.#element.appendChild(child);
                }
            });
        }

        // dodanie do parenta
        $parentObject instanceof HTMLElement && ($parentObject.appendChild(this.#element));
    }

    get element() {
        return this.#element;
    }
}