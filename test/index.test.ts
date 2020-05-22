import engine from '@croct/plug-rule-engine/plugin';
import {ExtensionFactory} from '@croct/plug-rule-engine/extension';
import {PluginSdk} from '@croct/plug/plugin';
import UrlVariablesExtension from '../src/extension';
import {LocalStore, PageStore, VariableStore} from '../src/store';
import {Options} from '../src';

afterAll(() => {
    jest.restoreAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
});

jest.mock('@croct/plug-rule-engine/plugin', () => ({
    default: {
        extend: jest.fn(),
    },
}));

jest.mock('../src/extension', () => {
    const actual = jest.requireActual('../src/extension');

    return {
        ...actual,
        default: jest.fn(),
    };
});

describe('An URL variables extension installer', () => {
    test('should register the extension with default options', () => {
        expect(engine.extend).toBeCalledWith('urlVariables', expect.anything());

        const [, factory]: [string, ExtensionFactory] = (engine.extend as jest.Mock).mock.calls[0];

        const sdk: Partial<PluginSdk> = {
            getBrowserStorage: () => window.localStorage,
            getTabStorage: () => window.sessionStorage,
        };

        factory({options: {}, sdk: sdk as PluginSdk});

        expect(UrlVariablesExtension).toBeCalledTimes(1);

        expect(UrlVariablesExtension).toBeCalledWith(
            new LocalStore(window.localStorage),
            'ct-',
            256,
        );
    });

    test.each<[string, VariableStore, string, number]>([
        [
            'page',
            new PageStore(),
            'foo-',
            1,
        ],
        [
            'tab',
            new LocalStore(window.sessionStorage),
            'foo-',
            1,
        ],
        [
            'browser',
            new LocalStore(window.localStorage),
            'foo-',
            1,
        ],
    ])('should register the extension with given options', (
        persistence: 'page' | 'browser' | 'tab',
        store: VariableStore,
        prefix: string,
        priority: number,
    ) => {
        expect(engine.extend).toBeCalledWith('urlVariables', expect.anything());

        const [, factory]: [string, ExtensionFactory] = (engine.extend as jest.Mock).mock.calls[0];

        const sdk: Partial<PluginSdk> = {
            getBrowserStorage: () => window.localStorage,
            getTabStorage: () => window.sessionStorage,
        };

        const options: Options = {
            persistence: persistence,
            priority: priority,
            prefix: prefix,
        };

        factory({options: options, sdk: sdk as PluginSdk});

        expect(UrlVariablesExtension).toBeCalledTimes(1);

        expect(UrlVariablesExtension).toBeCalledWith(store, prefix, priority);
    });

    test.each<[any, string]>([
        [
            {persistence: 1},
            "Expected value of type string at path '/persistence', actual integer.",
        ],
        [
            {persistence: 'foo'},
            "Unexpected value at path '/persistence', expecting 'page', 'browser' or 'tab', found 'foo'.",
        ],
        [
            {priority: 'foo'},
            "Expected value of type integer at path '/priority', actual string.",
        ],
        [
            {prefix: 1},
            "Expected value of type string at path '/prefix', actual integer.",
        ],
    ])('should reject definitions %p', (definitions: any, error: string) => {
        const [, factory]: [string, ExtensionFactory] = (engine.extend as jest.Mock).mock.calls[0];

        const sdk: Partial<PluginSdk> = {
            getBrowserStorage: () => window.localStorage,
            getTabStorage: () => window.sessionStorage,
        };

        function create(): void {
            factory({options: definitions, sdk: sdk as PluginSdk});
        }

        expect(create).toThrow(error);
    });

    test.each<[any]>([
        [{persistence: 'page'}],
        [{persistence: 'tab'}],
        [{persistence: 'browser'}],
        [{priority: 1}],
        [{prefix: 'foo-'}],
    ])('should accept definitions %p', (definitions: any) => {
        const [, factory]: [string, ExtensionFactory] = (engine.extend as jest.Mock).mock.calls[0];

        const sdk: Partial<PluginSdk> = {
            getBrowserStorage: () => window.localStorage,
            getTabStorage: () => window.sessionStorage,
        };

        function create(): void {
            factory({options: definitions, sdk: sdk as PluginSdk});
        }

        expect(create).not.toThrowError();
    });
});
