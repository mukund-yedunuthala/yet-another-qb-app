import { getSubjects, getQuestionsBySubject } from '../js/appwrite.js';
import { updatePageLinks } from '../js/router.js';
export async function renderSubjects() {
    const content = document.getElementById('app-content');
    
    content.innerHTML = '<div class="loading">Loading subjects...</div>';
    
    try {
        const subjects = await getSubjects();
        
        if (subjects.length === 0) {
            content.innerHTML = `
                <h1>Subjects</h1>
                <p>No subjects found. <a href="/create" data-navigo>Create your first question</a> to get started.</p>
            `;
            updatePageLinks();
            return;
        }
        
        // Get question counts for each subject
        const subjectsWithCounts = await Promise.all(
            subjects.map(async (subject) => {
                const questions = await getQuestionsBySubject(subject);
                const learntCount = questions.filter(q => q.learnt).length;
                return {
                    name: subject,
                    total: questions.length,
                    learnt: learntCount,
                    toLearn: questions.length - learntCount
                };
            })
        );
        
        let html = `
            <h1>Subjects</h1>
            <p>Browse questions by subject</p>
            
            <div class="subject-grid">
        `;
        
        subjectsWithCounts.forEach(subject => {
            const progress = subject.total > 0 ? Math.round((subject.learnt / subject.total) * 100) : 0;
            
            html += `
                <a href="/questions/${encodeURIComponent(subject.name)}" data-navigo style="text-decoration: none; color: inherit;">
                    <div class="subject-card">
                        <h3>${subject.name}</h3>
                        <div class="count">${subject.total}</div>
                        <p>Total Questions</p>
                        <hr style="margin: 1rem 0;">
                        <p style="margin: 0.5rem 0;">
                            <strong>${subject.learnt}</strong> Learnt | 
                            <strong>${subject.toLearn}</strong> To Learn
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
            <p>Error loading subjects: ${error.message}</p>
        `;
        updatePageLinks();
    }
}
