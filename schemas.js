export const TodoSchema = {
    name: 'Todo',
    properties: {
        _id: 'int',
        text: 'string',
        completed: 'bool',
    },
    primaryKey: '_id',
};