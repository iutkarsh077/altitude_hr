#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/644460758d1b590ebeba1e747d0854a215358f5276900ebb704d176326540370/contract';
import endContract from '../../snapshots/644460758d1b590ebeba1e747d0854a215358f5276900ebb704d176326540370/contract.json' with { type: 'json' };
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
              candidates: {
                bsonType: 'array',
                items: {
                  additionalProperties: false,
                  bsonType: 'object',
                  properties: {
                    candidateName: { bsonType: 'string' },
                    documentId: { bsonType: 'string' },
                    downloadUrl: { bsonType: 'string' },
                    fileName: { bsonType: 'string' },
                    headline: { bsonType: 'string' },
                    matchScore: { bsonType: 'int' },
                    relevantExperience: { bsonType: 'array', items: { bsonType: 'string' } },
                    skills: { bsonType: 'array', items: { bsonType: 'string' } },
                    summary: { bsonType: 'string' },
                  },
                  required: [
                    'candidateName',
                    'documentId',
                    'downloadUrl',
                    'fileName',
                    'headline',
                    'matchScore',
                    'relevantExperience',
                    'skills',
                    'summary',
                  ],
                },
              },
              chatSessionId: { bsonType: 'objectId' },
              content: { bsonType: 'string' },
              createdAt: { bsonType: 'date' },
              role: { bsonType: 'string' },
              updatedAt: { bsonType: 'date' },
            },
            required: [
              '_id',
              'candidates',
              'chatSessionId',
              'content',
              'createdAt',
              'role',
              'updatedAt',
            ],
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
