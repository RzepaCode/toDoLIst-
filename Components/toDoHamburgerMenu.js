export class o_toDoHambugerMenu {
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

        // Tworzenie barów
        let $i;
        for ($i = 0; $i < 3; $i++) {
            const $span = document.createElement('span');
            $span.classList.add("bar");
            t.#element.appendChild($span);
        }

        // dodanie do parenta
        $parentObject instanceof HTMLElement && ($parentObject.appendChild(this.#element));
    }

    get element() {
        return this.#element;
    }
}