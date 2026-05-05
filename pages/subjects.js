import { getQuestions } from '../js/appwrite.js';
import { updatePageLinks } from '../js/router.js';
import { escHtml } from '../js/utils.js';

export async function renderSubjects() {
    const content = document.getElementById('app-content');

    content.innerHTML = '<div class="loading">Loading subjects...</div>';

    try {
        const questions = await getQuestions();

        // Group by subject in one pass
        const subjectMap = {};
        for (const q of questions) {
            if (!subjectMap[q.subject]) {
                subjectMap[q.subject] = { total: 0, learnt: 0 };
            }
            subjectMap[q.subject].total++;
            if (q.learnt) subjectMap[q.subject].learnt++;
        }

        const subjects = Object.keys(subjectMap).sort();

        if (subjects.length === 0) {
            content.innerHTML = `
                <h1>Subjects</h1>
                <p>No subjects found. <a href="/create" data-navigo>Create your first question</a> to get started.</p>
            `;
            updatePageLinks();
            return;
        }

        let html = `
            <h1>Subjects</h1>
            <p>Browse questions by subject</p>

            <div class="subject-grid">
        `;

        subjects.forEach(name => {
            const { total, learnt } = subjectMap[name];
            const toLearn = total - learnt;
            const progress = total > 0 ? Math.round((learnt / total) * 100) : 0;

            html += `
                <a href="/questions/${encodeURIComponent(name)}" data-navigo style="text-decoration: none; color: inherit;">
                    <div class="subject-card">
                        <h3>${escHtml(name)}</h3>
                        <div class="count">${total}</div>
                        <p>Total Questions</p>
                        <hr style="margin: 1rem 0;">
                        <p style="margin: 0.5rem 0;">
                            <strong>${learnt}</strong> Learnt |
                            <strong>${toLearn}</strong> To Learn
                        </p>
                        <p style="color: var(--primary); margin: 0.5rem 0;">
                            ${progress}% Progress
                        </p>
                    </div>
                </a>
            `;
        });

        html += '</div>';
        content.innerHTML = html;
        updatePageLinks();
    } catch (error) {
        content.innerHTML = `
            <h1>Subjects</h1>
            <p>Error loading subjects: ${escHtml(error.message)}</p>
        `;
        updatePageLinks();
    }
}
