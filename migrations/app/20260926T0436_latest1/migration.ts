#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/97d8d2efdb742858bf44d6a35996a98d6902373ede663eee9e2baabef6599cdb/contract';
import endContract from '../../snapshots/97d8d2efdb742858bf44d6a35996a98d6902373ede663eee9e2baabef6599cdb/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  createCollection,
  createIndex,
} from '@prisma/orm-mongo/target/migration';

class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      createCollection('chatSession', {
        validator: {
          $jsonSchema: {
            additionalProperties: false,
            bsonType: 'object',
            properties: {
              _id: { bsonType: 'objectId' },
              createdAt: { bsonType: 'date' },
              name: { bsonType: 'string' },
              updatedAt: { bsonType: 'date' },
              userId: { bsonType: 'objectId' },
            },
            required: ['_id', 'createdAt', 'name', 'updatedAt', 'userId'],
          },
        },
        validationLevel: 'strict',
        validationAction: 'error',
      }),
      createCollection('chats', {
        validator: {
          $jsonSchema: {
            additionalProperties: false,
            bsonType: 'object',
            properties: {
              _id: { bsonType: 'objectId' },
              chatSessionId: { bsonType: 'objectId' },
              content: { bsonType: 'string' },
              createdAt: { bsonType: 'date' },
              role: { bsonType: 'string' },
              updatedAt: { bsonType: 'date' },
            },
            required: ['_id', 'chatSessionId', 'content', 'createdAt', 'role', 'updatedAt'],
          },
        },
        validationLevel: 'strict',
        validationAction: 'error',
      }),
      createCollection('uploadedPdf', {
        validator: {
          $jsonSchema: {
            additionalProperties: false,
            bsonType: 'object',
            properties: {
              _id: { bsonType: 'objectId' },
              createdAt: { bsonType: 'date' },
              documentId: { bsonType: 'string' },
              fileName: { bsonType: 'string' },
              key: { bsonType: 'string' },
              updatedAt: { bsonType: 'date' },
              userId: { bsonType: 'objectId' },
            },
            required: ['_id', 'createdAt', 'documentId', 'fileName', 'key', 'updatedAt', 'userId'],
          },
        },
        validationLevel: 'strict',
        validationAction: 'error',
      }),
      createCollection('user', {
        validator: {
          $jsonSchema: {
            additionalProperties: false,
            bsonType: 'object',
            properties: {
              _id: { bsonType: 'objectId' },
              createdAt: { bsonType: 'date' },
              email: { bsonType: 'string' },
              googleId: { bsonType: 'string' },
              image: { bsonType: ['null', 'string'] },
              name: { bsonType: ['null', 'string'] },
              updatedAt: { bsonType: 'date' },
            },
            required: ['_id', 'createdAt', 'email', 'googleId', 'updatedAt'],
          },
        },
        validationLevel: 'strict',
        validationAction: 'error',
      }),
      createIndex('user', [{ direction: 1, field: 'email' }], { unique: true }),
      createIndex('user', [{ direction: 1, field: 'googleId' }], { unique: true }),
    ];
  }
}

export default M;
MigrationCLI.run(import.meta.url, M);
