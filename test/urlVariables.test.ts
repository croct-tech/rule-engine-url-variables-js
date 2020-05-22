import UrlVariables from '../../src/ext/url-variables/urlVariables';
import {MockContainer} from '../mock/mockContainer';

beforeEach(() => {
    jest.restoreAllMocks();
    window.sessionStorage.clear();
    window.localStorage.clear();
});

describe('A URL variables extension', () => {
    test('should have a name', async () => {
        const extensionFactory = UrlVariables.initialize();

        expect(extensionFactory.getExtensionName()).toBe(UrlVariables.name);
    });

    test('should capture variables from query string parameters', async () => {
        const extensionFactory = UrlVariables.initialize();
        const extension = extensionFactory.create(new MockContainer());

        const queryString = [
            'ignored=value',
            'ct-empty=',
            'ct-null=null',
            'ct-number=99',
            'ct-string="foo"',
            'ct-literal=bar',
            'ct-list[]=first',
            'ct-list[]=second',
            'ct-list[]="third"',
            'ct-single[]=1',
            'ct-literal=overridden',
            'ct-emptyList[]=',
        ];

        await extension.enable(`/something?${queryString.join('&')}`);

        const variables = extension.getVariables();

        expect(Object.keys(variables).length).toBe(8);

        await expect(variables.empty()).resolves.toBe('');
        await expect(variables.null()).resolves.toBeNull();
        await expect(variables.number()).resolves.toBe(99);
        await expect(variables.string()).resolves.toBe('foo');
        await expect(variables.literal()).resolves.toBe('overridden');
        await expect(variables.single()).resolves.toEqual([1]);
        await expect(variables.list()).resolves.toEqual(['first', 'second', 'third']);
        await expect(variables.emptyList()).resolves.toEqual(['']);
    });

    test('should persist variables in memory when persistence is "page"', async () => {
        const container = new MockContainer();
        container.getApplicationStorage = jest.fn();
        container.getSessionStorage = jest.fn();

        const extensionFactory = UrlVariables.initialize('page');
        const extension = extensionFactory.create(container);

        expect(container.getApplicationStorage).not.toHaveBeenCalled();
        expect(container.getSessionStorage).not.toHaveBeenCalled();

        const queryString = [
            'ignored=value',
            'ct-string="foo"',
            'ct-number=99',
            'ct-list=["first","second","third"]',
            'ct-boolean=true',
        ];

        await extension.enable(`/something?${queryString.join('&')}`);

        const variables = extension.getVariables();

        expect(Object.keys(variables).length).toBe(4);

        await expect(variables.string()).resolves.toBe('foo');
        await expect(variables.number()).resolves.toBe(99);
        await expect(variables.list()).resolves.toEqual(['first', 'second', 'third']);
        await expect(variables.boolean()).resolves.toBe(true);
    });

    test('should persist variables in the session storage when persistence is "tab"', async () => {
        const container = new MockContainer();
        container.getApplicationStorage = jest.fn().mockReturnValue(window.sessionStorage);

        // should consider corrupted data as undefined
        window.sessionStorage.setItem('corrupted', 'foo');

        const extensionFactory = UrlVariables.initialize('tab');
        const extension = extensionFactory.create(container);

        const queryString = [
            'ignored=value',
            'ct-string="foo"',
            'ct-number=99',
            'ct-list=["first","second","third"]',
            'ct-boolean=true',
        ];

        await extension.enable(`/something?${queryString.join('&')}`);

        expect(window.sessionStorage.length).toBe(5);
        expect(window.sessionStorage.getItem('corrupted')).toBe('foo');
        expect(window.sessionStorage.getItem('string')).toBe('"foo"');
        expect(window.sessionStorage.getItem('number')).toBe('99');
        expect(window.sessionStorage.getItem('list')).toBe('["first","second","third"]');
        expect(window.sessionStorage.getItem('boolean')).toBe('true');

        const variables = extension.getVariables();

        expect(Object.keys(variables).length).toBe(4);

        await expect(variables.string()).resolves.toBe('foo');
        await expect(variables.number()).resolves.toBe(99);
        await expect(variables.list()).resolves.toEqual(['first', 'second', 'third']);
        await expect(variables.boolean()).resolves.toBe(true);
    });

    test('should persist variables in the local storage when persistence is "browser"', async () => {
        const container = new MockContainer();
        container.getApplicationStorage = jest.fn().mockReturnValue(window.localStorage);

        // should consider corrupted data as undefined
        window.localStorage.setItem('corrupted', 'foo');

        const extensionFactory = UrlVariables.initialize('browser');
        const extension = extensionFactory.create(container);

        const queryString = [
            'ignored=value',
            'ct-string="foo"',
            'ct-number=99',
            'ct-list=["first","second","third"]',
            'ct-boolean=true',
        ];

        await extension.enable(`/something?${queryString.join('&')}`);

        expect(window.localStorage.length).toBe(5);
        expect(window.localStorage.getItem('corrupted')).toBe('foo');
        expect(window.localStorage.getItem('string')).toBe('"foo"');
        expect(window.localStorage.getItem('number')).toBe('99');
        expect(window.localStorage.getItem('list')).toBe('["first","second","third"]');
        expect(window.localStorage.getItem('boolean')).toBe('true');

        const variables = extension.getVariables();

        expect(Object.keys(variables).length).toBe(4);

        await expect(variables.string()).resolves.toBe('foo');
        await expect(variables.number()).resolves.toBe(99);
        await expect(variables.list()).resolves.toEqual(['first', 'second', 'third']);
        await expect(variables.boolean()).resolves.toBe(true);
    });
});
