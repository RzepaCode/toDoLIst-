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
        const t = this;

        // tworzenie elementu
        t.#element = document.createElement("label");

        // styl: width / height
        width !== null && (t.#element.style.width = width);
        height !== null && (t.#element.style.height = height);

        // tekst
        text !== null && (t.#element.innerHTML= text);

        $parentObject && ($parentObject.appendChild(t.#element));
    }

    get element() {
        return this.#element;
    }
}