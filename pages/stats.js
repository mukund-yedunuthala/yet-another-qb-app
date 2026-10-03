import { getQuestions } from '../js/appwrite.js';
import { updatePageLinks } from '../js/router.js';
import { escHtml, subjectStats } from '../js/utils.js';

export async function renderStats() {
    const content = document.getElementById('app-content');

    content.innerHTML = '<div class="loading">Loading statistics...</div>';

    try {
        const questions = await getQuestions();

        const total = questions.length;
        const learnt = questions.filter(q => q.learnt).length;
        const toLearn = total - learnt;
        const overallProgress = total > 0 ? Math.round((learnt / total) * 100) : 0;

        const subjects = subjectStats(questions);
        for (const key of Object.keys(subjects)) {
            const s = subjects[key];
            s.progress = s.total > 0 ? Math.round((s.learnt / s.total) * 100) : 0;
        }

        let html = `
            <h1>Statistics</h1>

            <h2>Overall Progress</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="number">${total}</div>
                    <div class="label">Total Questions</div>
                </div>
                <div class="stat-card">
                    <div class="number">${learnt}</div>
                    <div class="label">Learnt</div>
                </div>
                <div class="stat-card">
                    <div class="number">${toLearn}</div>
                    <div class="label">To Learn</div>
                </div>
                <div class="stat-card">
                    <div class="number">${overallProgress}%</div>
                    <div class="label">Progress</div>
                </div>
            </div>

            <h2>Subject-wise Breakdown</h2>
            <table class="stats-table">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Total</th>
                        <th>Learnt</th>
                        <th>To Learn</th>
                        <th>Progress</th>
                    </tr>
                </thead>
                <tbody>
        `;

        Object.entries(subjects).forEach(([subject, data]) => {
            html += `
                <tr>
                    <td><strong>${escHtml(subject)}</strong></td>
                    <td>${data.total}</td>
                    <td>${data.learnt}</td>
                    <td>${data.total - data.learnt}</td>
                    <td>${data.progress}%</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        content.innerHTML = html;
        updatePageLinks();

    } catch (error) {
        content.innerHTML = `
            <h1>Statistics</h1>
            <p>Error loading statistics: ${escHtml(error.message)}</p>
        `;
        updatePageLinks();
    }
}
