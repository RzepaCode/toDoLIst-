export class o_ToDoStorage {
    static get(key) {
        const data = localStorage.getItem(key);
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch (error) {
            return data;
        }
    }

    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static remove(key) {
        localStorage.removeItem(key);
    }
}