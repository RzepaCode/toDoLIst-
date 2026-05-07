export class o_toDoInput {
    #element;
    constructor($def, $parentObject = null) {
        this.#m_onCreate($def, $parentObject);
    }

    #m_onCreate($def, $parentObject){
        const {
            typeInput = null,
            valueInput = null,
            className = null,
            idName = null,
            width = null,
            height = null,
            placeHolder = null,
            Action = null
        } = $def;
        const t = this;

        // tworzenie elementu
        t.#element = document.createElement("input");

        // className
        className !== null && (t.#element.classList.add(className));

        // idName
        idName !== null && (t.#element.setAttribute("id", idName));

        // typ inputa
        typeInput !== null && (t.#element.type = typeInput) || (t.#element.type = "text");
        valueInput !== null && (t.#element.value = valueInput);

        // styl: width / height
        width !== null && (t.#element.style.width = width);
        height !== null && (t.#element.style.height = height);

        // tekst
        placeHolder !== null && (t.#element.placeholder = placeHolder);

        // onChange
        t.Action = Action;
        if(t.Action != null){
            t.#element.addEventListener("change", (event) => {
                t.Action.call(t.#element, event);
            });
        }

        // dodanie do parenta
        $parentObject instanceof HTMLElement && ($parentObject.appendChild(this.#element));
    }

    get element() {
        return this.#element;
    }
}