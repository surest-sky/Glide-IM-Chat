import { initLen, avatar, wordLen } from './enum';
const { faker } = require('@faker-js/faker');

const getMessageId = () => {
    return 2;
};

const getMessage = () => {
    return faker.lorem.paragraph(Math.round(Math.random() * wordLen));
};

const getInitMessages = () => {
    return '2'
        .repeat(initLen)
        .split('')
        .map(() => mockMessage());
};

const mockMessage = () => {
    const id = getMessageId();
    const message = getMessage();
    return { message, id, avatar };
};

export { mockMessage, getInitMessages, getMessage };
