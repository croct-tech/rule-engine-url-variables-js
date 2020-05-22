import {VariableMap} from '@croct/plug-rule-engine/context';
import {Extension} from '@croct/plug-rule-engine/extension';
import {Variables, VariableStore} from './store';

export default class UrlVariableExtension implements Extension {
    private readonly store: VariableStore;

    private readonly prefix: string;

    private readonly priority: number;

    public constructor(storage: VariableStore, prefix: string, priority: number) {
        this.store = storage;
        this.prefix = prefix;
        this.priority = priority;
    }

    public getPriority(): number {
        return this.priority;
    }

    public enable(path: string): void {
        for (const [variable, value] of Object.entries(this.getQueryStringVariables(path))) {
            this.store.setVariable(variable, value);
        }
    }

    public getVariables(): VariableMap {
        const variables: VariableMap = {};

        for (const [variable, value] of Object.entries(this.store.getVariables())) {
            if (value !== undefined) {
                variables[variable] = (): Promise<any> => Promise.resolve(value);
            }
        }

        return variables;
    }

    private getQueryStringVariables(path: string): Variables {
        const url = new URL(path, 'https://host');
        const variables: Variables = {};

        url.searchParams.forEach((value, parameter) => {
            if (!parameter.startsWith(this.prefix)) {
                return;
            }

            let variable = parameter.substring(this.prefix.length);
            let currentValue;

            try {
                currentValue = JSON.parse(value);
            } catch {
                currentValue = value;
            }

            if (variable.endsWith('[]')) {
                variable = variable.substring(0, variable.length - '[]'.length);
                currentValue = [...(variables[variable] ?? []), currentValue];
            }

            variables[variable] = currentValue;
        });

        return variables;
    }
}
