import { renderHome } from '../pages/home.js';
import { renderQuestions } from '../pages/questions.js';
import { renderCreate } from '../pages/create.js';
import { renderSubjects } from '../pages/subjects.js';
import { renderStats } from '../pages/stats.js';
import { renderFlashcards } from '../pages/flashcards.js';

// Initialize Navigo router
const router = new Navigo('/');

// Function to update page links after content changes
export function updatePageLinks() {
    router.updatePageLinks();
}

// Define routes
export function initRouter() {
    router
        .on('/', () => {
            renderHome();
        })
        .on('/flashcards', () => {
            renderFlashcards();
        })
        .on('/flashcards/:subject', ({ data }) => {
            renderFlashcards(data.subject);
        })
        .on('/questions', () => {
            renderQuestions();
        })
        .on('/questions/:subject', ({ data }) => {
            renderQuestions(data.subject);
        })
        .on('/create', () => {
            renderCreate();
        })
        .on('/edit/:id', ({ data }) => {
            renderCreate(data.id);
        })
        .on('/subjects', () => {
            renderSubjects();
        })
        .on('/stats', () => {
            renderStats();
        })
        .on('/about', () => {
            renderAbout();
        })
        .on('/imprint', () => {
            renderImprint();
        })
        .on('/privacy', () => {
            renderPrivacy();
        })
        .resolve();
}

function renderAbout() {
    const content = document.getElementById('app-content');
    content.innerHTML = `
        <h1>About</h1>
        <p>Yet Another Question Bank App helps you organize and manage your MCQ question collections efficiently.</p>
        
        <h2>Features</h2>
        <ul>
            <li>Create multiple choice questions with 4 options</li>
            <li>Organize questions by subject</li>
            <li>Mark questions as learnt to track progress</li>
            <li>Add explanations for better understanding</li>
            <li>Practice with interactive flashcards</li>
            <li>View statistics and progress</li>
        </ul>
        
        <h2>Technology</h2>
        <ul>
            <li>Frontend: Oat UI (ultra-lightweight semantic UI)</li>
            <li>Backend: Appwrite (cloud database)</li>
            <li>Routing: Navigo</li>
        </ul>
        
        <h2>Version</h2>
        <p>Version 2.0.0 - February 2026</p>
    `;
    updatePageLinks();
}

function renderImprint() {
    const content = document.getElementById('app-content');
    content.innerHTML = `
        <h1>Imprint</h1>
        
        <h2>Information according to legal requirements</h2>
        
        <p><strong>Publisher:</strong><br>
        Mukund Yedunuthala<br>
        Hyderabad<br>
        Telangana<br>
        India</p>
        
        <p><strong>Contact:</strong><br>
        Email: mukundkash1997@gmx.net</p>
        
        <h2>Responsible for content</h2>
        <p>Mukund Yedunuthala</p>
        
        <h2>Disclaimer</h2>
        <p>The content of this application is provided for informational purposes only. 
        While the information is kept accurate and up-to-date, there exist no 
        representations or warranties of any kind about the completeness, accuracy, 
        reliability, or availability of the content.</p>
    `;
    updatePageLinks();
}

function renderPrivacy() {
    const content = document.getElementById('app-content');
    content.innerHTML = `
        <h1>Privacy Policy</h1>
        
        <p><em>Last updated: February 14, 2026</em></p>
        
        <h2>Data Collection</h2>
        <p>This application stores your questions and related data using Appwrite cloud services. 
        The following data is collected and stored:</p>
        <ul>
            <li>Question content and answers</li>
            <li>Subject categorization</li>
            <li>Learning progress (learnt status)</li>
            <li>Theme preferences (stored locally in your browser)</li>
        </ul>
        
        <h2>Data Storage</h2>
        <p>The data is stored securely in Appwrite's cloud infrastructure.
        Access to your individual question content is not available. All data is associated with an 
        Appwrite account.</p>
        
        <h2>Local Storage</h2>
        <p>Browser local storage is used to save your theme preference (dark/light mode). 
        This data never leaves the device.</p>
        
        <h2>Third-Party Services</h2>
        <p>This application uses the following third-party services:</p>
        <ul>
            <li><strong>Appwrite:</strong> Backend database and storage</li>
            <li><strong>CDN Services:</strong> For loading Oat UI and libraries</li>
        </ul>
        
        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
            <li>Access your data at any time through the application</li>
            <li>Delete your questions individually or in bulk</li>
        </ul>
        
        <h2>Data Security</h2>
        <p>We implement appropriate security measures to protect your data. However, 
        no method of transmission over the internet is 100% secure.</p>
        
        <h2>Contact</h2>
        <p>If you have questions about this privacy policy, please contact at 
        mukundkash1997@gmx.net.</p>
    `;
    updatePageLinks();
}

export { router };
