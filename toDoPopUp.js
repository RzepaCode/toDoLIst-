import { o_toDoSection } from "./toDoSection.js";

export class o_toDoPopUp {
    #element;
    #uniqueName;
    static #instances = {};

    constructor($def) {
        this.#m_onCreate($def);
    }

    #m_onCreate($def) {
        const {
            content = [],
            uniqueName = null
        } = $def;

        if (uniqueName && o_toDoPopUp.#instances[uniqueName]) {
            console.warn(`PopUp o nazwie "${uniqueName}" jest już otwarty.`);
            return o_toDoPopUp.#instances[uniqueName];
        }

        this.#uniqueName = uniqueName;
        this.#uniqueName && (o_toDoPopUp.#instances[this.#uniqueName] = this);

        // Tworzenie struktury okna
        const $floatingWindow = new o_toDoSection(
            {
                className: "floatingWindow",
                content: [
                    {
                        type: "o_toDoButton",
                        className: "closeBtn",
                        text: "X",
                        Action: _ => {
                            this.m_destroy();
                        },
                    },
                    ...(Array.isArray(content) ? content : [content])
                ]
            },
            document.body
        );

        this.#element = $floatingWindow.element;

        // Logika przesuwania okna
        const $tagsToIgnore = ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'];
        let $isDragging = false;
        let $offsetX, $offsetY;

        this.#element.addEventListener('mousedown', ($event) => {
            if ($tagsToIgnore.includes($event.target.tagName)) return;

            $isDragging = true;

            $offsetX = $event.clientX - this.#element.offsetLeft;
            $offsetY = $event.clientY - this.#element.offsetTop;
        });

        const handleMouseMove = ($event) => {
            if (!$isDragging) return;

            // Obliczanie nowej pozycji
            let $newX = $event.clientX - $offsetX;
            let $newY = $event.clientY - $offsetY;

            // Ograniczenie do granic okna
            const $maxX = window.innerWidth - this.#element.offsetWidth;
            const $maxY = window.innerHeight - this.#element.offsetHeight;

            $newX = Math.max(0, Math.min($newX, $maxX));
            $newY = Math.max(0, Math.min($newY, $maxY));

            this.#element.style.left = $newX + 'px';
            this.#element.style.top = $newY + 'px';
        };

        const handleMouseUp = () => {
            $isDragging = false;
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    m_destroy() {
        this.#uniqueName && (delete o_toDoPopUp.#instances[this.#uniqueName]);
        this.#element && (this.#element.remove());
    }

    get element() {
        return this.#element;
    }
}