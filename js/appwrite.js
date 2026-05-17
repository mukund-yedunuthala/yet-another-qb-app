const { Client, Databases, ID, Query } = window.Appwrite;
import { 
    PUBLIC_APPWRITE_ENDPOINT, 
    PUBLIC_APPWRITE_PROJECT_ID,
    PUBLIC_APPWRITE_DATABASE_ID,
    PUBLIC_APPWRITE_TABLE_ID
} from './config.js';

export const client = new Client();

client
    .setEndpoint(PUBLIC_APPWRITE_ENDPOINT) 
    .setProject(PUBLIC_APPWRITE_PROJECT_ID);

export const tablesDB = new Databases(client);
export { ID, Query };
export { PUBLIC_APPWRITE_DATABASE_ID, PUBLIC_APPWRITE_TABLE_ID };

// Question CRUD operations
export async function getQuestions() {
    try {
        const response = await tablesDB.listDocuments(
            PUBLIC_APPWRITE_DATABASE_ID,
            PUBLIC_APPWRITE_TABLE_ID,
            [Query.limit(5000)]
        );
        return response.documents;
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
}

export async function getQuestionsBySubject(subject) {
    try {
        const response = await tablesDB.listDocuments(
            PUBLIC_APPWRITE_DATABASE_ID,
            PUBLIC_APPWRITE_TABLE_ID,
            [Query.equal('subject', subject), Query.limit(5000)]
        );
        return response.documents;
    } catch (error) {
        console.error('Error fetching questions by subject:', error);
        throw error;
    }
}

export async function getLearntQuestions() {
    try {
        const response = await tablesDB.listDocuments(
            PUBLIC_APPWRITE_DATABASE_ID,
            PUBLIC_APPWRITE_TABLE_ID,
            [Query.equal('learnt', true), Query.limit(5000)]
        );
        return response.documents;
    } catch (error) {
        console.error('Error fetching learnt questions:', error);
        throw error;
    }
}

export async function createQuestion(questionData) {
    try {
        return await tablesDB.createDocument(
            PUBLIC_APPWRITE_DATABASE_ID,
            PUBLIC_APPWRITE_TABLE_ID,
            ID.unique(),
            questionData
        );
    } catch (error) {
        console.error('Error creating question:', error);
        throw error;
    }
}

export async function updateQuestion(questionId, questionData) {
    try {
        return await tablesDB.updateDocument(
            PUBLIC_APPWRITE_DATABASE_ID,
            PUBLIC_APPWRITE_TABLE_ID,
            questionId,
            questionData
        );
    } catch (error) {
        console.error('Error updating question:', error);
        throw error;
    }
}

export async function deleteQuestion(questionId) {
    try {
        return await tablesDB.deleteDocument(
            PUBLIC_APPWRITE_DATABASE_ID,
            PUBLIC_APPWRITE_TABLE_ID,
            questionId
        );
    } catch (error) {
        console.error('Error deleting question:', error);
        throw error;
    }
}

export async function markAsLearnt(questionId, learnt) {
    return await updateQuestion(questionId, { learnt });
}

export async function getSubjects() {
    try {
        const questions = await getQuestions();
        // Extract unique subjects
        const subjects = [...new Set(questions.map(q => q.subject))];
        return subjects.sort();
    } catch (error) {
        console.error('Error fetching subjects:', error);
        throw error;
    }
}

export async function getStats() {
    try {
        const questions = await getQuestions();
        const learntQuestions = questions.filter(q => q.learnt);
        const subjects = [...new Set(questions.map(q => q.subject))];
        
        return {
            total: questions.length,
            learnt: learntQuestions.length,
            toLearn: questions.length - learntQuestions.length,
            subjectCount: subjects.length
        };
    } catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
}
