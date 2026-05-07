import { o_toDoSelect } from "./toDoSelect.js"
import { o_toDoButton } from "./toDoButton.js"
import { o_toDoInput } from "./toDoInput.js"
import {o_toDoH} from "./toDoH.js";
import {o_toDoLabel} from "./toDoLabel.js";
import {o_toDoTextArea} from "./toDoTextArea.js"

export class o_toDoSection {
    #element;
    #childrens = [];

    constructor($def = {}, $parentObject) {
        this.#m_onCreate($def, $parentObject);
    }

    #m_onCreate($def, $parentObject) {
        const {
            className = null,
            idName = null,
            width = null,
            height = null,
            content = null
        } = $def;
        const t = this;
        t.#element = document.createElement("div");

        // klasa
        className !== null && (t.#element.classList.add(className));

        // Id
        idName && (t.#element.setAttribute("id", idName));

        // styl: width / height
        width !== null && (t.#element.style.width = width);
        height !== null && (t.#element.style.height = height);

        if ($def.content && Array.isArray($def.content)) {
            $def.content.forEach(childDef => {
                const childIns = t.#pCreateClassByName(childDef.type, childDef, this.#element);

                childIns && (t.#childrens.push(childIns));
            });
        }

        $parentObject instanceof HTMLElement && ($parentObject.appendChild(this.#element));
    }

    #pCreateClassByName(ClassName, ...a) {
        const c = eval(ClassName);
        return new c(...a);
    }


    get element() {
        return this.#element;
    }
}
