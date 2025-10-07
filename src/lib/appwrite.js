import { Client, TablesDB, ID } from 'appwrite';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';

export const client = new Client();

client
    .setEndpoint(PUBLIC_APPWRITE_ENDPOINT) 
    .setProject(PUBLIC_APPWRITE_PROJECT_ID);

export const tablesDB = new TablesDB(client);
export { ID };
export { PUBLIC_APPWRITE_DATABASE_ID, PUBLIC_APPWRITE_TABLE_ID } from '$env/static/public';