export class o_toDoLabel {
    #element;
    constructor($def, $parentObject) {
        this.#m_onCreate($def, $parentObject);
    }

    #m_onCreate($def, $parentObject) {
        const {
            width = null,
            height = null,
            text = null,
        } = $def;
        // tworzenie elementu
        this.#element = document.createElement("label");

        // styl: width / height
        width !== null && (this.#element.style.width = width);
        height !== null && (this.#element.style.height = height);

        // tekst
        text !== null && (this.#element.innerHTML= text);

        $parentObject && ($parentObject.appendChild(this.#element));
    }

    get element() {
        return this.#element;
    }
}