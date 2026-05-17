import { getStats, getQuestions } from '../js/appwrite.js';
import { updatePageLinks } from '../js/router.js';

export async function renderHome() {
    const content = document.getElementById('app-content');
    
    content.innerHTML = '<div class="loading">Loading...</div>';
    
    try {
        const stats = await getStats();
        
        content.innerHTML = `
            <h1>Yet Another Question Bank App</h1>
            <p>To organize, manage, and practice MCQ questions.</p>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="number">${stats.total}</div>
                    <div class="label">Total Questions</div>
                </div>
                <div class="stat-card">
                    <div class="number">${stats.learnt}</div>
                    <div class="label">Learnt</div>
                </div>
                <div class="stat-card">
                    <div class="number">${stats.toLearn}</div>
                    <div class="label">To Learn</div>
                </div>
                <div class="stat-card">
                    <div class="number">${stats.subjectCount}</div>
                    <div class="label">Subjects</div>
                </div>
            </div>
            
            <section>
                <h2>Quick Actions</h2>
                <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
                    <a href="/flashcards" data-navigo><button>Practice Flashcards</button></a>
                    <a href="/create" data-navigo><button class="outline">Create Question</button></a>
                    <a href="/subjects" data-navigo><button class="outline">Browse by Subject</button></a>
                    <a href="/stats" data-navigo><button class="outline">View Statistics</button></a>
                    <button class="outline" onclick="exportQuestions()">Export JSON</button>
                </div>
            </section>
        `;
        
        updatePageLinks();

    } catch (error) {
        content.innerHTML = `
            <h1>Yet Another Question Bank App</h1>
            <p>To organize, manage, and practice MCQ questions.</p>
            <p>Get started by creating your first question!</p>
            <a href="/create" data-navigo><button>Create First Question</button></a>
        `;
        
        updatePageLinks();
    }
}

window.exportQuestions = async function() {
    const questions = await getQuestions();
    const json = JSON.stringify(questions, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questions.json';
    a.click();
    URL.revokeObjectURL(url);
};
