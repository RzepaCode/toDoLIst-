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
        const t = this;

        if (uniqueName && o_toDoPopUp.#instances[uniqueName]) {
            console.warn(`PopUp o nazwie "${uniqueName}" jest już otwarty.`);
            return o_toDoPopUp.#instances[uniqueName];
        }

        this.#uniqueName = uniqueName;
        // Jeśli podano nazwę, zapisujemy tę instancję w rejestrze
        this.#uniqueName && (o_toDoPopUp.#instances[this.#uniqueName] = this);

        // Tworzenie struktury okna
        const $floatingWindow = new o_toDoSection(
            {
                className: "floating-window",
                content: [
                    {
                        type: "o_toDoButton",
                        className: "close-btn",
                        text: "X",
                        Action: _ => {
                            t.destroy();
                        },
                    },
                    ...(Array.isArray(content) ? content : [content])
                ]
            },
            document.body
        );

        t.#element = $floatingWindow.element;

        // Logika przesuwania okna
        const $tagsToIgnore = ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'];
        let $isDragging = false;
        let $offsetX, $offsetY;

        t.#element.addEventListener('mousedown', ($event) => {
            if ($tagsToIgnore.includes($event.target.tagName)) return;

            $isDragging = true;

            $offsetX = $event.clientX - t.#element.offsetLeft;
            $offsetY = $event.clientY - t.#element.offsetTop;
        });

        const handleMouseMove = ($event) => {
            if (!$isDragging) return;

            // Obliczanie nowej pozycji
            let $newX = $event.clientX - $offsetX;
            let $newY = $event.clientY - $offsetY;

            // Ograniczenie do granic okna
            const $maxX = window.innerWidth - t.#element.offsetWidth;
            const $maxY = window.innerHeight - t.#element.offsetHeight;

            $newX = Math.max(0, Math.min($newX, $maxX));
            $newY = Math.max(0, Math.min($newY, $maxY));

            t.#element.style.left = $newX + 'px';
            t.#element.style.top = $newY + 'px';
        };

        const handleMouseUp = () => {
            $isDragging = false;
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    destroy() {
        if (this.#uniqueName) {
            delete o_toDoPopUp.#instances[this.#uniqueName];
        }

        if (this.#element) {
            this.#element.remove();
        }
    }

    get element() {
        return this.#element;
    }
}