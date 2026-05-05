import { getStats, getQuestions, getSubjects } from '../js/appwrite.js';
import { updatePageLinks } from '../js/router.js';
import { escHtml } from '../js/utils.js';
export async function renderStats() {
    const content = document.getElementById('app-content');
    
    content.innerHTML = '<div class="loading">Loading statistics...</div>';
    
    try {
        const stats = await getStats();
        const questions = await getQuestions();
        const subjects = await getSubjects();
        
        // Calculate subject-wise stats
        const subjectStats = {};
        for (const subject of subjects) {
            const subjectQuestions = questions.filter(q => q.subject === subject);
            const learnt = subjectQuestions.filter(q => q.learnt).length;
            subjectStats[subject] = {
                total: subjectQuestions.length,
                learnt: learnt,
                progress: subjectQuestions.length > 0 ? Math.round((learnt / subjectQuestions.length) * 100) : 0
            };
        }
        
        const overallProgress = stats.total > 0 ? Math.round((stats.learnt / stats.total) * 100) : 0;
        
        let html = `
            <h1>Statistics</h1>
            
            <h2>Overall Progress</h2>
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
            <p>Error loading statistics: ${error.message}</p>
        `;
        updatePageLinks();
    }
}
