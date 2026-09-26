#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/644460758d1b590ebeba1e747d0854a215358f5276900ebb704d176326540370/contract';
import endContract from '../../snapshots/644460758d1b590ebeba1e747d0854a215358f5276900ebb704d176326540370/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/97d8d2efdb742858bf44d6a35996a98d6902373ede663eee9e2baabef6599cdb/contract';
import startContract from '../../snapshots/97d8d2efdb742858bf44d6a35996a98d6902373ede663eee9e2baabef6599cdb/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, collMod } from '@prisma/orm-mongo/target/migration';

class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      collMod(
        'chats',
        {
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
        },
        {
          id: 'validator.chats.update',
          label: 'Update validator on chats',
          operationClass: 'destructive',
        },
      ),
    ];
  }
}

export default M;
MigrationCLI.run(import.meta.url, M);
