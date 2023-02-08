import { MongoClient } from 'mongodb'


export async function getConnection(){
  return  (await MongoClient.connect(process.env.MONGOURI))
}