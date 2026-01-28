const { MongoClient, ObjectId } = require('mongodb');

class DB {
    constructor() {
        this.url = 'mongodb://127.0.0.1:27017';
        this.client = new MongoClient(this.url);
        this.db = null;
    }

    async connect() {
        if (!this.db) {
            await this.client.connect();
            this.db = this.client.db('BSTU');
            console.log('Connected to MongoDB');
        }
        return this.db;
    }

    async GetRecordsByTableName(tableName) {
        const db = await this.connect();
        return db.collection(tableName).find({}).toArray();
    }

    async GetRecord(tableName, filter) {
        const db = await this.connect();
        const record = await db.collection(tableName).findOne(filter);
        if (!record) throw 'Record not found';
        return record;
    }

    async InsertRecords(tableName, uniqueField, fields) {
        const db = await this.connect();
        const exists = await db.collection(tableName).findOne({
            [uniqueField]: fields[uniqueField]
        });
        if (exists) throw 'This document already exists';

        await db.collection(tableName).insertOne(fields);
        return fields;
    }

    // ✅ ВАЖНО: метод из твоего условия
    UpdateRecords(tableName, id, fields) {
        return this.connect()
            .then(async db => {
                console.log('Update ID:', id);

                if (!id) {
                    throw 'Wrong ID';
                }

                // ❗ удаляем _id перед update
                delete fields._id;

                // проверяем существование
                await this.GetRecord(tableName, { _id: new ObjectId(id) });

                // обновляем
                await db.collection(tableName).updateOne(
                    { _id: new ObjectId(id) },
                    { $set: fields }
                );

                // возвращаем обновлённый документ
                return this.GetRecord(tableName, { _id: new ObjectId(id) });
            });
    }

    async DeleteRecord(tableName, id) {
        const db = await this.connect();
        const record = await this.GetRecord(tableName, { _id: new ObjectId(id) });
        await db.collection(tableName).deleteOne({ _id: new ObjectId(id) });
        return record;
    }
}

module.exports = DB;
