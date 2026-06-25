import assert from 'node:assert/strict';
import { test } from 'node:test';

let documents = [];
const calls = [];

class Client {
  setEndpoint(value) {
    this.endpoint = value;
    return this;
  }

  setProject(value) {
    this.project = value;
    return this;
  }
}

class Databases {
  listDocuments(databaseId, tableId, queries) {
    calls.push(['listDocuments', databaseId, tableId, queries]);
    return Promise.resolve({ documents });
  }

  getDocument(databaseId, tableId, documentId) {
    calls.push(['getDocument', databaseId, tableId, documentId]);
    return Promise.resolve({ $id: documentId });
  }

  createDocument(databaseId, tableId, documentId, data) {
    calls.push(['createDocument', databaseId, tableId, documentId, data]);
    return Promise.resolve({ $id: documentId, ...data });
  }

  updateDocument(databaseId, tableId, documentId, data) {
    calls.push(['updateDocument', databaseId, tableId, documentId, data]);
    return Promise.resolve({ $id: documentId, ...data });
  }

  deleteDocument(databaseId, tableId, documentId) {
    calls.push(['deleteDocument', databaseId, tableId, documentId]);
    return Promise.resolve();
  }
}

globalThis.window = {
  Appwrite: {
    Client,
    Databases,
    ID: { unique: () => 'unique-id' },
    Query: { limit: (value) => `limit:${value}` },
  },
};

const appwrite = await import('./appwrite.js');

test('getQuestions requests all documents with the expected limit', async () => {
  calls.length = 0;
  documents = [{ subject: 'Math', learnt: true }];

  assert.deepEqual(await appwrite.getQuestions(), documents);
  assert.deepEqual(calls[0], [
    'listDocuments',
    '__APPWRITE_DATABASE_ID__',
    '__APPWRITE_TABLE_ID__',
    ['limit:5000'],
  ]);
});

test('CRUD helpers call the Appwrite database methods with configured IDs', async () => {
  calls.length = 0;

  await appwrite.getQuestion('q1');
  await appwrite.createQuestion({ question: 'New' });
  await appwrite.updateQuestion('q2', { learnt: true });
  await appwrite.deleteQuestion('q3');
  await appwrite.markAsLearnt('q4', false);

  assert.deepEqual(calls, [
    ['getDocument', '__APPWRITE_DATABASE_ID__', '__APPWRITE_TABLE_ID__', 'q1'],
    ['createDocument', '__APPWRITE_DATABASE_ID__', '__APPWRITE_TABLE_ID__', 'unique-id', { question: 'New' }],
    ['updateDocument', '__APPWRITE_DATABASE_ID__', '__APPWRITE_TABLE_ID__', 'q2', { learnt: true }],
    ['deleteDocument', '__APPWRITE_DATABASE_ID__', '__APPWRITE_TABLE_ID__', 'q3'],
    ['updateDocument', '__APPWRITE_DATABASE_ID__', '__APPWRITE_TABLE_ID__', 'q4', { learnt: false }],
  ]);
});

test('getSubjects and getStats derive values from question documents', async () => {
  documents = [
    { subject: 'Physics', learnt: true },
    { subject: 'Math', learnt: false },
    { subject: 'Math', learnt: true },
  ];

  assert.deepEqual(await appwrite.getSubjects(), ['Math', 'Physics']);
  assert.deepEqual(await appwrite.getStats(), {
    total: 3,
    learnt: 2,
    toLearn: 1,
    subjectCount: 2,
  });
});
