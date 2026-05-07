export class o_toDoTextArea {
    #element;
    constructor($def, $parentObject) {
        this.#m_onCreate($def, $parentObject)
    }

    #m_onCreate($def, $parentObject) {
        const {
            className = null,
            idName = null,
            width = null,
            height = null,
            text = null,
        } = $def;
        const t = this;
        t.#element = document.createElement("textarea");

        // klasa
        className !== null && (t.#element.classList.add(className));

        // Id
        idName && (t.#element.setAttribute("id", idName));

        // styl: width / height
        width !== null && (t.#element.style.width = width);
        height !== null && (t.#element.style.height = height);

        // text
        text !== null && (t.#element.innerText = text);

        $parentObject instanceof HTMLElement && ($parentObject.appendChild(this.#element));
    }
}