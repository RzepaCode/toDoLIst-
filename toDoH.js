export class o_toDoH {
    #element;
    constructor($def, $parentObject) {
        this.#m_onCreate($def, $parentObject)
    }

    #m_onCreate($def, $parentObject) {
        const {
            hValue = 4,
            text = null
        } = $def;

        this.#element = document.createElement(`h${hValue}`);
        this.#element.innerText = text;

        $parentObject && ($parentObject.appendChild(this.#element));
    }
}
