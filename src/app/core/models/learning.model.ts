export interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  content: ContentBlock[];
  quiz?: QuizQuestion[];
  order: number;
}

export interface ContentBlock {
  type: 'text' | 'code' | 'diagram' | 'interactive' | 'tip' | 'warning' | 'agent-demo';
  content: string;
  language?: string;
  metadata?: Record<string, string>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserProgress {
  oduleId: string;
  lessonId: string;
  completed: boolean;
  quizScore?: number;
  lastAccessed: Date;
}

export interface AgentStep {
  id: number;
  agent: string;
  action: string;
  input: string;
  output: string;
  thinking?: string;
  tools?: string[];
  status: 'pending' | 'running' | 'complete' | 'error';
}
