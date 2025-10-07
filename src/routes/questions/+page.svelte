<script>
  // Placeholder data - will be replaced with Appwrite data later
  let questions = [
    {
      id: 1,
      subject: 'Mathematics',
      question: 'What is 2 + 2?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 2
    },
    {
      id: 2,
      subject: 'Science',
      question: 'What is the chemical symbol for water?',
      options: ['H2O', 'CO2', 'O2', 'NaCl'],
      correctAnswer: 0
    },
    {
      id: 3,
      subject: 'History',
      question: 'In which year did World War II end?',
      options: ['1943', '1944', '1945', '1946'],
      correctAnswer: 2
    }
  ];

  let searchQuery = '';
  let selectedSubject = 'all';

  // Get unique subjects
  $: subjects = ['all', ...new Set(questions.map(q => q.subject))];

  // Filter questions based on search and subject
  $: filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || q.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });
</script>

<svelte:head>
  <title>Questions - QuizBank</title>
</svelte:head>

<div class="container">
  <div class="page-header">
    <h1 class="page-title">Question Bank</h1>
    <p class="page-subtitle">Browse and manage your questions</p>
  </div>

  <div class="filters">
    <div class="search-box">
      <input
        type="text"
        placeholder="Search questions..."
        bind:value={searchQuery}
        class="search-input"
      />
    </div>

    <div class="filter-box">
      <select bind:value={selectedSubject} class="subject-filter">
        {#each subjects as subject}
          <option value={subject}>
            {subject === 'all' ? 'All Subjects' : subject}
          </option>
        {/each}
      </select>
    </div>
  </div>

  <div class="stats">
    <div class="stat-card">
      <span class="stat-number">{questions.length}</span>
      <span class="stat-label">Total Questions</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">{subjects.length - 1}</span>
      <span class="stat-label">Subjects</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">{filteredQuestions.length}</span>
      <span class="stat-label">Filtered</span>
    </div>
  </div>

  <div class="questions-list">
    {#if filteredQuestions.length === 0}
      <div class="empty-state">
        <p>No questions found. Try adjusting your filters or add some questions!</p>
        <a href="/add" class="btn-primary">Add Your First Question</a>
      </div>
    {:else}
      {#each filteredQuestions as question (question.id)}
        <div class="question-card">
          <div class="question-header">
            <span class="subject-badge">{question.subject}</span>
            <span class="question-id">#{question.id}</span>
          </div>
          <h3 class="question-text">{question.question}</h3>
          <div class="options-list">
            {#each question.options as option, index}
              <div class="option" class:correct={index === question.correctAnswer}>
                <span class="option-letter">{String.fromCharCode(65 + index)}</span>
                <span class="option-text">{option}</span>
                {#if index === question.correctAnswer}
                  <span class="correct-badge">✓</span>
                {/if}
              </div>
            {/each}
          </div>
          <div class="question-actions">
            <button class="btn-secondary">Edit</button>
            <button class="btn-danger">Delete</button>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .page-subtitle {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
  }

  /* Filters */
  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .search-box {
    flex: 1;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
  }

  .search-input:focus {
    outline: none;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .filter-box {
    min-width: 200px;
  }

  .subject-filter {
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: box-shadow 0.3s ease;
  }

  .subject-filter:focus {
    outline: none;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  /* Stats */
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #667eea;
  }

  .stat-label {
    font-size: 0.9rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Questions List */
  .questions-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .question-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .question-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .subject-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .question-id {
    color: #999;
    font-size: 0.9rem;
  }

  .question-text {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 8px;
    transition: background 0.3s ease;
  }

  .option.correct {
    background: rgba(102, 126, 234, 0.1);
    border: 1px solid rgba(102, 126, 234, 0.3);
  }

  .option-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: white;
    border-radius: 50%;
    font-weight: 600;
    color: #667eea;
    font-size: 0.9rem;
  }

  .option-text {
    flex: 1;
    color: #555;
  }

  .correct-badge {
    color: #667eea;
    font-weight: 700;
    font-size: 1.2rem;
  }

  .question-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  /* Buttons */
  .btn-primary,
  .btn-secondary,
  .btn-danger {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    display: inline-block;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-secondary {
    background: #f0f0f0;
    color: #555;
  }

  .btn-secondary:hover {
    background: #e0e0e0;
  }

  .btn-danger {
    background: #fee;
    color: #c33;
  }

  .btn-danger:hover {
    background: #fdd;
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .empty-state p {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 1.5rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .filters {
      flex-direction: column;
    }

    .filter-box {
      min-width: 100%;
    }

    .page-title {
      font-size: 2rem;
    }

    .question-actions {
      flex-direction: column;
    }

    .btn-secondary,
    .btn-danger {
      width: 100%;
    }
  }
</style>
