import {customAlphabet, nanoid} from 'nanoid';

// we use here dependencie "nanoid": "^3.3.1",

// create 6 characters long poll ID
export const createPollID = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6
);


// creates 21 characters long user ID
export const createUserID = () => nanoid();

// creates 8 characters long user ID
export const createNominationID = () => nanoid(8);