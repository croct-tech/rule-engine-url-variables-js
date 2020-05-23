import UrlVariableExtension from '../src/extension';
import {PageStore} from '../src/store';

beforeEach(() => {
    jest.restoreAllMocks();
});

describe('A URL variables extension', () => {
    test('should capture variables from query string parameters', async () => {
        const extension = new UrlVariableExtension(new PageStore(), 'ct-', 0);

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

    test('should provide its priority', () => {
        const extension = new UrlVariableExtension(new PageStore(), 'ct-', 1);

        expect(extension.getPriority()).toBe(1);
    });

    test('should persist variables in the specified store', async () => {
        const store = new PageStore();
        const extension = new UrlVariableExtension(store, 'ct-', 0);

        await extension.enable('/something?ct-foo="bar"');

        const variables = store.getVariables();

        expect(Object.keys(variables).length).toBe(1);
        expect(variables.foo).toBe('bar');
    });
});
