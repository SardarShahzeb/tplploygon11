// hash-service.ts
import { pbkdf2, getRandomBytes } from 'dop-wallet-old';
import { Pbkdf2Response } from 'dop-sharedmodels';

export const hashPasswordString = async ({ secret, salt, iterations }): Promise<Pbkdf2Response> => {
    return pbkdf2(secret, salt, iterations);
};

export const setEncryptionKeyFromPassword = async (password: string): Promise<string> => {
    const salt = getRandomBytes(16);
    const [encryptionKey, hashPasswordStored] = await Promise.all([
        hashPasswordString({ secret: password, salt: salt, iterations: 100000 }),
        hashPasswordString({ secret: password, salt: salt, iterations: 1000000 }),
    ]);

    // Here you should use your local storage functions to save the hashPasswordStored and salt
    await Promise.all([
        localStorage.setItem('hashPasswordStored', hashPasswordStored),
        localStorage.setItem('salt', salt),
    ]);

    return encryptionKey;
};

export const getEncryptionKeyFromPassword = async (password: string): Promise<string> => {
    const [storedPasswordHash, storedSalt] = await Promise.all([
        localStorage.getItem('hashPasswordStored'),
        localStorage.getItem('salt'),
    ]);

    const [encryptionKey, hashPassword] = await Promise.all([
        hashPasswordString({ secret: password, salt: storedSalt, iterations: 100000 }),
        hashPasswordString({ secret: password, salt: storedSalt, iterations: 1000000 }),
    ]);

    if (storedPasswordHash !== hashPassword) {
        throw new Error('Incorrect password.');
    }

    return encryptionKey;
};
