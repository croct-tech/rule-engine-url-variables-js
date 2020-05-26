import engine from '@croct/plug-rule-engine/plugin';
import {ExtensionFactory} from '@croct/plug-rule-engine/extension';
import {PluginSdk} from '@croct/plug/plugin';
import UrlVariablesExtension from '../src/extension';
import {LocalStore, PageStore} from '../src/store';
import '../src';

afterAll(() => {
    jest.restoreAllMocks();
});

beforeEach(() => {
    (LocalStore as jest.Mock).mockClear();
    (PageStore as jest.Mock).mockClear();
    (UrlVariablesExtension as jest.Mock).mockClear();
    window.localStorage.clear();
    window.sessionStorage.clear();
});

jest.mock('../src/store');

jest.mock('@croct/plug-rule-engine/plugin', () => ({
    default: {
        extend: jest.fn(),
    },
    __esModule: true,
}));

jest.mock('../src/extension', () => {
    const actual = jest.requireActual('../src/extension');

    return {
        ...actual,
        default: jest.fn(),
        __esModule: true,
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
            expect.any(LocalStore),
            'ct-',
            256,
        );
    });

    test('should store variables using the specified persistence strategy', () => {
        expect(engine.extend).toBeCalledWith('urlVariables', expect.anything());

        const [, factory]: [string, ExtensionFactory] = (engine.extend as jest.Mock).mock.calls[0];

        const sdk: Partial<PluginSdk> = {
            getBrowserStorage: () => window.localStorage,
            getTabStorage: () => window.sessionStorage,
        };

        factory({options: {persistence: 'page'}, sdk: sdk as PluginSdk});

        expect(PageStore).toHaveBeenCalled();

        factory({options: {persistence: 'tab'}, sdk: sdk as PluginSdk});

        expect(LocalStore).toHaveBeenCalledWith(window.sessionStorage);

        factory({options: {persistence: 'browser'}, sdk: sdk as PluginSdk});

        expect(LocalStore).toHaveBeenCalledWith(window.localStorage);
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
        [{}],
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
