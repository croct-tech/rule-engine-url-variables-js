import {NumberType, ObjectType, StringType} from '@croct/plug/sdk/validation';

export const optionsSchema = new ObjectType({
    properties: {
        persistence: new StringType({enumeration: ['page', 'browser', 'tab']}),
        priority: new NumberType({integer: true}),
        prefix: new StringType(),
    },
});
