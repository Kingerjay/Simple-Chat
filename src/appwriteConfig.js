import { Client, Databases, Account } from 'appwrite';

export const PROJECT_ID = '6779c43c002323527595'
export const DATABASE_ID = '6779c99a0001645dc9cd'
export const COLLECTION_ID_MESSAGES = '6779c9aa002aaedeaa25'

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6779c43c002323527595');

export const databases = new Databases(client); 
export const account =  new Account(client);



export default client;