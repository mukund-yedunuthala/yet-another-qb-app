# Yet Another QB App

A modern, elegant personal question bank application for efficient learning and knowledge management. Built with SvelteKit and Appwrite.

![Yet Another QB App Banner](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![Appwrite](https://img.shields.io/badge/Appwrite-F02E65?style=for-the-badge&logo=appwrite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

## Features

- **Question Management**: Create, organize, and browse multiple-choice questions by subject
- **Flashcard Mode**: Interactive study sessions with randomized questions
- **Smart Learning**: Mark questions as learned and track progress
- **Search & Filter**: Quickly find questions by subject or keywords
- **Modern UI**: Clean, responsive design with smooth animations
- **Personal Use**: Secure, cloud-based storage with Appwrite

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- An Appwrite account (free at [cloud.appwrite.io](https://cloud.appwrite.io))

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/mukund-yedunuthala/yet-another-qb-app.git
    cd yet-another-qb-app
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```


3. **Set up Appwrite**

    Create a new project in your Appwrite Console, then:

    - Create a database (ID: `quizbank`)
    - Create a table (ID: `questions`)
    - Add the following columns:

    | Column Name    | Type    | Size | Required | Default | Array |
    |----------------|---------|------|----------|---------|-------|
    | question       | String  | 1000 | Yes      | -       | No    |
    | optionA        | String  | 500  | Yes      | -       | No    |
    | optionB        | String  | 500  | Yes      | -       | No    |
    | optionC        | String  | 500  | Yes      | -       | No    |
    | optionD        | String  | 500  | Yes      | -       | No    |
    | correctAnswer  | Integer | -    | Yes      | -       | No    |
    | subject        | String  | 100  | Yes      | -       | No    |
    | explanation    | String  | 2000 | No       | -       | No    |
    | learnt         | Boolean | -    | Yes      | false   | No    |

    - Set table permissions to **Any** for Create, Read, Update, Delete

4. **Configure environment variables**

    Create a `.env` file in the project root:
    
        PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
        PUBLIC_APPWRITE_PROJECT_ID=your_project_id
        PUBLIC_APPWRITE_DATABASE_ID=your_db_id
        PUBLIC_APPWRITE_TABLE_ID=your_table_id

5. **Run the development server**

        npm run dev


6. **Open your browser**

    Navigate to [http://localhost:5173](http://localhost:5173)

## Usage

### Adding Questions

1. Click "Add Question" in the navigation menu
2. Fill in the question text and four answer options
3. Select the correct answer
4. Add a subject/category
5. Optionally add an explanation
6. Click "Add Question"

### Browsing Questions

- View all questions on the Questions page
- Use the search bar to find specific questions
- Filter by subject using the dropdown
- Click to expand and view explanations

### Flashcard Study Mode

1. Click "Flashcards" in the navigation menu
2. Configure study settings:
- Toggle "Skip questions marked as learnt"
- Toggle "Show explanations after answering"
3. Click "Start Studying"
4. Select an answer and click "Check Answer"
5. Mark questions as learnt when confident
6. Track your session statistics in real-time


## Technology Stack

- **Frontend**: [SvelteKit](https://kit.svelte.dev/) - Modern, reactive framework
- **Backend**: [Appwrite](https://appwrite.io/) - Open-source BaaS

## Design Language

QuizBank features a modern, clean design with:

- **Purple gradient theme** (#667eea to #764ba2)
- **Card-based layouts** with subtle shadows and hover effects
- **Smooth transitions** for an engaging user experience
- **Responsive design** that works on desktop and mobile
- **Semantic HTML** for accessibility

## Environment Variables

| Variable                        | Description                           |
|---------------------------------|---------------------------------------|
| `PUBLIC_APPWRITE_ENDPOINT`      | Appwrite API endpoint URL             |
| `PUBLIC_APPWRITE_PROJECT_ID`    | Your Appwrite project ID              |
| `PUBLIC_APPWRITE_DATABASE_ID`   | Database ID    |
| `PUBLIC_APPWRITE_TABLE_ID`      | Table ID       |

## Building for Production

Build the application
        
    npm run build

Preview the production build locally

    npm run preview


The built application can be deployed to any Node.js hosting platform or adapted for static hosting.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [SvelteKit](https://kit.svelte.dev/)
- [Appwrite](https://appwrite.io/)

## Contact

Project Link: [https://github.com/mukund-yedunuthala/yet-another-qb-app.git](https://github.com/mukund-yedunuthala/yet-another-qb-app.git)

---

