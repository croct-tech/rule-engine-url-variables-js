import {JsonValue} from '@croct/plug/sdk/json';

export type Variables = {[key: string]: JsonValue};

export interface VariableStore {
    getVariables(): Variables;

    setVariable(name: string, value: JsonValue): void;
}

export class PageStore implements VariableStore {
    private readonly storage: Variables = {};

    public getVariables(): Variables {
        return this.storage;
    }

    public setVariable(name: string, value: JsonValue): void {
        this.storage[name] = value;
    }
}

export class LocalStore implements VariableStore {
    private readonly storage: Storage;

    public constructor(storage: Storage) {
        this.storage = storage;
    }

    public getVariables(): Variables {
        const variables: {[key: string]: JsonValue} = {};
        for (let index = 0; index < this.storage.length; index++) {
            const key = this.storage.key(index) as string;
            const value = this.getVariable(key);

            if (value !== undefined) {
                variables[key] = value;
            }
        }

        return variables;
    }

    private getVariable(name: string): JsonValue | undefined {
        const json = this.storage.getItem(name);

        if (json !== null) {
            try {
                return JSON.parse(json);
            } catch {
                // suppress
            }
        }

        return undefined;
    }

    public setVariable(name: string, value: JsonValue): void {
        this.storage.setItem(name, JSON.stringify(value));
    }
}
