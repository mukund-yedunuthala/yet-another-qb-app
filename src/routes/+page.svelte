<script>
</script>

<svelte:head>
  <title>QuizBank - Your Personal Question Bank</title>
</svelte:head>

<div class="container">
  <div class="hero">
    <h1 class="hero-title">Welcome to QuizBank</h1>
    <p class="hero-subtitle">Your personal question bank for efficient learning</p>
    
    <div class="hero-actions">
      <a href="/questions" class="btn-primary">Browse Questions</a>
      <a href="/add" class="btn-secondary">Add Question</a>
    </div>
  </div>

  <div class="features">
    <div class="feature-card">
      <div class="feature-icon">📚</div>
      <h3 class="feature-title">Organize Questions</h3>
      <p class="feature-description">Keep all your questions organized by subject and easily searchable</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">✏️</div>
      <h3 class="feature-title">Quick Addition</h3>
      <p class="feature-description">Add new questions with multiple choice answers and explanations</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">🎯</div>
      <h3 class="feature-title">Flashcard Mode</h3>
      <p class="feature-description">Practice with interactive flashcards to reinforce your learning</p>
    </div>
  </div>

  <div class="stats-overview">
    <div class="stat-item">
      <div class="stat-value">0</div>
      <div class="stat-label">Total Questions</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">0</div>
      <div class="stat-label">Subjects</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">0</div>
      <div class="stat-label">Study Sessions</div>
    </div>
  </div>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  /* Hero Section */
  .hero {
    text-align: center;
    padding: 4rem 2rem;
    margin-bottom: 4rem;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    color: white;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .hero-subtitle {
    font-size: 1.3rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 2rem;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-primary,
  .btn-secondary {
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-block;
  }

  .btn-primary {
    background: white;
    color: #667eea;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid white;
    backdrop-filter: blur(10px);
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  /* Features Section */
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
  }

  .feature-card {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .feature-title {
    font-size: 1.3rem;
    color: #333;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .feature-description {
    color: #666;
    line-height: 1.6;
  }

  /* Stats Overview */
  .stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    background: rgba(255, 255, 255, 0.95);
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .stat-item {
    text-align: center;
    padding: 1rem;
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    font-size: 0.9rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1rem;
    }

    .hero {
      padding: 2rem 1rem;
    }

    .features {
      grid-template-columns: 1fr;
    }
  }
</style>
