import {LocalStore, PageStore} from '../src/store';

beforeEach(() => {
    jest.restoreAllMocks();
    window.localStorage.clear();
});

describe('A page store', () => {
    test('should persist variables', () => {
        const store = new PageStore();

        expect(store.getVariables().foo).toBeUndefined();

        store.setVariable('foo', 'bar');

        expect(store.getVariables().foo).toBe('bar');
    });
});

describe('A local store', () => {
    test('should persist variables in given storage in json format', () => {
        const store = new LocalStore(window.localStorage);

        expect(store.getVariables().foo).toBeUndefined();
        expect(store.getVariables().bar).toBeUndefined();
        expect(window.localStorage.foo).toBeUndefined();
        expect(window.localStorage.bar).toBeUndefined();

        store.setVariable('foo', 1);

        expect(store.getVariables().foo).toBe(1);
        expect(store.getVariables().bar).toBeUndefined();
        expect(window.localStorage.foo).toBe('1');
        expect(window.localStorage.bar).toBeUndefined();
    });

    test('cannot provide a value if it is an invalid JSON', () => {
        const store = new LocalStore(window.localStorage);

        window.localStorage.setItem('foo', '{');

        expect(window.localStorage.foo).toBe('{');
        expect(store.getVariables().foo).toBeUndefined();
    });
});
