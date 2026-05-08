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

        t.#uniqueName = uniqueName;
        // Jeśli podano nazwę, zapisujemy tę instancję w rejestrze
        t.#uniqueName && (o_toDoPopUp.#instances[t.#uniqueName] = t);

        // Tworzenie struktury okna
        const $floatingWindow = new o_toDoSection(
            {
                className: "floating-window",
                idName: t.#uniqueName,
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