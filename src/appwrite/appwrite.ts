import { Client, Account,Storage } from "appwrite";
const client = new Client().setEndpoint("https://cloud.appwrite.io/v1").setProject("673796ec0019869b2ddd")
export const account = new Account(client)
export const storage = new Storage(client)