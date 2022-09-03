const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://root:root@xchange.o9mgkrq.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const database = "finance";

const findMany = async (collection, query) => {
    try {
        await client.connect();
        const teamRepo = client.db(database).collection(collection);
        return await teamRepo.find(query).toArray();
    }
    catch (err){
        console.error(err);
    }
      finally {
        await client.close();
      }
}

const findOne = async(collection, query) => {
    try {
        await client.connect();
        const teamRepo = client.db(database).collection(collection);
        return await teamRepo.findOne(query);
    }
    catch (err){
        console.error(err);
    }
      finally {
        await client.close();
      }
}

const insertOne = async(collection, record) => {
    try {
        await client.connect();
        const teamRepo = client.db(database).collection(collection);
        return await teamRepo.insertOne(record);
    }
    catch (err){
        console.error(err);
    }
      finally {
        await client.close();
      }
}

const insertMany = async(collection, records) => {
    try {
        await client.connect();
        const teamRepo = client.db(database).collection(collection);
        return await teamRepo.insertMany(records);
    }
    catch (err){
        console.error(err);
    }
      finally {
        await client.close();
      }
}

const updateOne = async(collection, query, record) => {
    try {
        await client.connect();
        const teamRepo = client.db(database).collection(collection);
        return await teamRepo.updateOne(query, record);
    }
    catch (err){
        console.error(err);
    }
      finally {
        await client.close();
      }
}

const deleteOne = async(collection, query) => {
    try {
        await client.connect();
        const teamRepo = client.db(database).collection(collection);
        return await teamRepo.deleteOne(query);
    }
    catch (err){
        console.error(err);
    }
      finally {
        await client.close();
      }
}


exports.findMany = findMany;
exports.findOne = findOne;
exports.insertOne = insertOne;
exports.insertMany = insertMany;
exports.deleteOne = deleteOne;
exports.updateOne = updateOne;


