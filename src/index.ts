import engine from '@croct/plug-rule-engine/plugin';
import {ExtensionArguments} from '@croct/plug-rule-engine/extension';
import UrlVariablesExtension from './extension';
import {LocalStore, PageStore, VariableStore} from './store';
import {optionsSchema} from './schemas';

export type Options = {
    persistence?: 'page' | 'browser' | 'tab',
    priority?: number,
    prefix?: string,
};

declare module '@croct/plug-rule-engine/plugin' {
    export interface ExtensionConfigurations {
        urlVariables?: Options | boolean;
    }
}

engine.extend('urlVariables', ({options, sdk}: ExtensionArguments<Options>) => {
    optionsSchema.validate(options);

    return new UrlVariablesExtension(
        ((): VariableStore => {
            switch (options.persistence) {
                case 'page':
                    return new PageStore();

                case 'browser':
                    return new LocalStore(sdk.getBrowserStorage());

                default:
                case 'tab':
                    return new LocalStore(sdk.getTabStorage());
            }
        })(),
        options.prefix ?? 'ct-',
        options.priority ?? 256,
    );
});
