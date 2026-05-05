import { getQuestions } from '../js/appwrite.js';
import { updatePageLinks } from '../js/router.js';
import { escHtml } from '../js/utils.js';

export async function renderStats() {
    const content = document.getElementById('app-content');

    content.innerHTML = '<div class="loading">Loading statistics...</div>';

    try {
        const questions = await getQuestions();

        const total = questions.length;
        const learnt = questions.filter(q => q.learnt).length;
        const toLearn = total - learnt;
        const overallProgress = total > 0 ? Math.round((learnt / total) * 100) : 0;

        // Group by subject in one pass
        const subjectStats = {};
        for (const q of questions) {
            if (!subjectStats[q.subject]) {
                subjectStats[q.subject] = { total: 0, learnt: 0 };
            }
            subjectStats[q.subject].total++;
            if (q.learnt) subjectStats[q.subject].learnt++;
        }
        for (const key of Object.keys(subjectStats)) {
            const s = subjectStats[key];
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
            <table style="width: 100%; margin-top: 1rem;">
                <thead>
                    <tr>
                        <th style="text-align: left;">Subject</th>
                        <th>Total</th>
                        <th>Learnt</th>
                        <th>To Learn</th>
                        <th>Progress</th>
                    </tr>
                </thead>
                <tbody>
        `;

        Object.entries(subjectStats).forEach(([subject, data]) => {
            html += `
                <tr>
                    <td><strong>${escHtml(subject)}</strong></td>
                    <td style="text-align: center;">${data.total}</td>
                    <td style="text-align: center;">${data.learnt}</td>
                    <td style="text-align: center;">${data.total - data.learnt}</td>
                    <td style="text-align: center;">${data.progress}%</td>
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
