export class o_toDoButton {
    #element;
    constructor($def, $parentObject = null) {
        this.#m_onCreate($def, $parentObject);
    }

    #m_onCreate($def, $parentObject){
        const {
            className = null,
            width = null,
            height = null,
            text = null,
            Action = null,
        } = $def;

        // tworzenie elementu
        this.#element = document.createElement("button");

        // klasa
        className !== null && (this.#element.classList.add(className));

        // styl: width / height
        width !== null && (this.#element.style.width = width);
        height !== null && (this.#element.style.height = height);

        // tekst
        text !== null && (this.#element.innerHTML= text);

        // onClick
        if (typeof Action === "function") {
            this.Action = Action;
            this.#element.addEventListener("click", (event) => {
                this.Action(event);
            });
        }

        // dodanie do parenta
        $parentObject instanceof HTMLElement && ($parentObject.appendChild(this.#element));
    }

    get element() {
        return this.#element;
    }
}