import { MongoClient, ServerApiVersion } from 'mongodb'

export async function getConnection(){
    const url = "";
  return  (await MongoClient.connect(url))
}