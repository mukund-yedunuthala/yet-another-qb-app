const { Client, Databases, ID, Query } = window.Appwrite;
import { 
    PUBLIC_APPWRITE_ENDPOINT, 
    PUBLIC_APPWRITE_PROJECT_ID,
    PUBLIC_APPWRITE_DATABASE_ID,
    PUBLIC_APPWRITE_TABLE_ID
} from './config.js';

const client = new Client();

client
    .setEndpoint(PUBLIC_APPWRITE_ENDPOINT) 
    .setProject(PUBLIC_APPWRITE_PROJECT_ID);

const tablesDB = new Databases(client);

// Question CRUD operations
export async function getQuestions() {
    const response = await tablesDB.listDocuments(
        PUBLIC_APPWRITE_DATABASE_ID,
        PUBLIC_APPWRITE_TABLE_ID,
        [Query.limit(5000)]
    );
    return response.documents;
}

export async function getQuestion(questionId) {
    return await tablesDB.getDocument(
        PUBLIC_APPWRITE_DATABASE_ID,
        PUBLIC_APPWRITE_TABLE_ID,
        questionId
    );
}

export async function createQuestion(questionData) {
    return await tablesDB.createDocument(
        PUBLIC_APPWRITE_DATABASE_ID,
        PUBLIC_APPWRITE_TABLE_ID,
        ID.unique(),
        questionData
    );
}

export async function updateQuestion(questionId, questionData) {
    return await tablesDB.updateDocument(
        PUBLIC_APPWRITE_DATABASE_ID,
        PUBLIC_APPWRITE_TABLE_ID,
        questionId,
        questionData
    );
}

export async function deleteQuestion(questionId) {
    return await tablesDB.deleteDocument(
        PUBLIC_APPWRITE_DATABASE_ID,
        PUBLIC_APPWRITE_TABLE_ID,
        questionId
    );
}

export async function markAsLearnt(questionId, learnt) {
    return await updateQuestion(questionId, { learnt });
}

export async function getSubjects() {
    const questions = await getQuestions();
    return [...new Set(questions.map(q => q.subject))].sort();
}

export async function getStats() {
    const questions = await getQuestions();
    const learnt = questions.filter(q => q.learnt).length;

    return {
        total: questions.length,
        learnt,
        toLearn: questions.length - learnt,
        subjectCount: new Set(questions.map(q => q.subject)).size
    };
}
