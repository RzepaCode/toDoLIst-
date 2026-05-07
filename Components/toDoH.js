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
        const t = this;

        t.#element = document.createElement(`h${hValue}`);
        t.#element.innerText = text;

        $parentObject && ($parentObject.appendChild(t.#element));
    }
}
