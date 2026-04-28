import { Injectable, signal, computed } from '@angular/core';

export type Lang = 'en' | 'es';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly STORAGE_KEY = 'ai-academy-lang';
  readonly currentLang = signal<Lang>(this.loadLang());

  private loadLang(): Lang {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return (stored === 'es' || stored === 'en') ? stored : 'en';
  }

  setLang(lang: Lang) {
    this.currentLang.set(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
  }

  toggle() {
    this.setLang(this.currentLang() === 'en' ? 'es' : 'en');
  }

  t(key: string): string {
    const lang = this.currentLang();
    return translations[lang]?.[key] ?? translations['en']?.[key] ?? key;
  }
}

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.playground': 'Playground',
    'nav.progress': 'My Progress',
    'nav.lessons_done': 'Lessons Done',

    // Dashboard
    'dashboard.title': 'AI & Agent Orchestration Academy',
    'dashboard.subtitle': 'Master Claude Opus, agent patterns, and autonomous development — from basics to production',
    'dashboard.modules': 'Modules',
    'dashboard.lessons': 'Lessons',
    'dashboard.completed': 'Completed',
    'dashboard.learning_path': 'Learning Path',
    'dashboard.quick_start': 'Quick Start',
    'dashboard.quick_ai_title': 'New to AI?',
    'dashboard.quick_ai_desc': 'Start with the Foundations module to understand LLMs and prompting',
    'dashboard.quick_ai_link': 'Start Learning →',
    'dashboard.quick_build_title': 'Ready to Build?',
    'dashboard.quick_build_desc': 'Jump to Agent Architecture to build your first autonomous agent',
    'dashboard.quick_build_link': 'Build an Agent →',
    'dashboard.quick_play_title': 'Try it Live',
    'dashboard.quick_play_desc': 'Use the interactive Playground to simulate agent orchestration',
    'dashboard.quick_play_link': 'Open Playground →',
    'dashboard.lessons_suffix': 'lessons',

    // Module detail
    'module.back': '← Back to Dashboard',

    // Lesson
    'lesson.back_to': '← Back to',
    'lesson.mark_complete': 'Mark as Complete ✓',
    'lesson.completed': '✓ Lesson Completed',
    'lesson.knowledge_check': 'Knowledge Check',
    'lesson.complete_lesson': 'Complete Lesson ✓',
    'lesson.score': 'Score',
    'lesson.excellent': 'Excellent work! You\'ve mastered this lesson.',
    'lesson.review': 'Review the material and try again to improve your score.',
    'lesson.copy': 'Copy',
    'lesson.copied': '✓ Copied',
    'lesson.run_demo': '▶ Run Demo:',
    'lesson.sections': 'sections',
    'lesson.quiz': 'Quiz',

    // Playground
    'playground.title': 'Agent Orchestration Playground',
    'playground.subtitle': 'Simulate how AI agents process tasks, use tools, and collaborate',
    'playground.config': 'Configuration',
    'playground.pattern': 'Agent Pattern',
    'playground.pattern_single': 'Single Agent',
    'playground.pattern_plan': 'Plan & Execute',
    'playground.pattern_hierarchical': 'Hierarchical (Multi-Agent)',
    'playground.pattern_react': 'ReAct (Reasoning + Acting)',
    'playground.tools': 'Available Tools',
    'playground.model': 'Model',
    'playground.model_opus': 'Claude Opus 4 (Best quality)',
    'playground.model_sonnet': 'Claude Sonnet 4 (Fast)',
    'playground.model_haiku': 'Claude Haiku 4 (Fastest)',
    'playground.max_steps': 'Max Steps',
    'playground.metrics': 'Execution Metrics',
    'playground.steps': 'Steps',
    'playground.tool_calls': 'Tool Calls',
    'playground.tokens': 'Tokens (est.)',
    'playground.cost': 'Cost (est.)',
    'playground.pattern_label': 'Pattern',
    'playground.tool_usage': 'Tool Usage',
    'playground.input_placeholder': 'Describe a task for the agent (e.g., \'Create a REST API for user management\')',
    'playground.run': 'Run',
    'playground.try': 'Try:',
    'playground.example_1': 'Fix the login bug in auth.ts',
    'playground.example_2': 'Add pagination to the users API',
    'playground.example_3': 'Review PR #42 for security issues',
    'playground.example_4': 'Create tests for payment service',
    'playground.task_complete': '✅ Task completed in {steps} steps using {tools} tool calls (~{tokens} tokens).',

    // Progress
    'progress.title': 'My Learning Progress',
    'progress.subtitle': 'Track your journey through AI & Agent Orchestration',
    'progress.lessons_completed': 'Lessons Completed',
    'progress.total_lessons': 'Total Lessons',
    'progress.overall': 'Overall Progress',
    'progress.modules_mastered': 'Modules Mastered',
    'progress.breakdown': 'Module Breakdown',
    'progress.complete': 'complete',
    'progress.continue': 'Continue',
    'progress.review': 'Review',
    'progress.reset': 'Reset All Progress',
    'progress.reset_confirm': 'Are you sure you want to reset all progress? This cannot be undone.',

    // Tools
    'tool.read_file': 'Read File',
    'tool.write_file': 'Write File',
    'tool.run_shell': 'Run Shell',
    'tool.search_code': 'Search Code',
    'tool.jira': 'Jira',
    'tool.git': 'Git',
    'tool.database': 'Database',
    'tool.http': 'HTTP Request',

    // Modules
    'mod.foundations.title': 'AI Foundations',
    'mod.foundations.desc': 'Understand LLMs, prompting, and how Claude Opus thinks',
    'mod.agent-basics.title': 'Agent Architecture',
    'mod.agent-basics.desc': 'Build autonomous AI agents that plan, execute, and iterate',
    'mod.orchestration.title': 'Multi-Agent Orchestration',
    'mod.orchestration.desc': 'Coordinate multiple agents for complex workflows',
    'mod.advanced.title': 'Advanced Patterns',
    'mod.advanced.desc': 'Production-grade agent systems with MCP, memory, and evaluation',
    'mod.real-world.title': 'Real-World Automation',
    'mod.real-world.desc': 'Complete automation recipes your team can use today',
  },
  es: {
    // Navigation
    'nav.dashboard': 'Inicio',
    'nav.playground': 'Laboratorio',
    'nav.progress': 'Mi Progreso',
    'nav.lessons_done': 'Lecciones Completadas',

    // Dashboard
    'dashboard.title': 'Academia de IA y Orquestación de Agentes',
    'dashboard.subtitle': 'Domina Claude Opus, patrones de agentes y desarrollo autónomo — desde lo básico hasta producción',
    'dashboard.modules': 'Módulos',
    'dashboard.lessons': 'Lecciones',
    'dashboard.completed': 'Completadas',
    'dashboard.learning_path': 'Ruta de Aprendizaje',
    'dashboard.quick_start': 'Inicio Rápido',
    'dashboard.quick_ai_title': '¿Nuevo en IA?',
    'dashboard.quick_ai_desc': 'Comienza con el módulo de Fundamentos para entender LLMs y prompting',
    'dashboard.quick_ai_link': 'Comenzar →',
    'dashboard.quick_build_title': '¿Listo para Construir?',
    'dashboard.quick_build_desc': 'Salta a Arquitectura de Agentes para construir tu primer agente autónomo',
    'dashboard.quick_build_link': 'Crear un Agente →',
    'dashboard.quick_play_title': 'Pruébalo en Vivo',
    'dashboard.quick_play_desc': 'Usa el Laboratorio interactivo para simular orquestación de agentes',
    'dashboard.quick_play_link': 'Abrir Laboratorio →',
    'dashboard.lessons_suffix': 'lecciones',

    // Module detail
    'module.back': '← Volver al Inicio',

    // Lesson
    'lesson.back_to': '← Volver a',
    'lesson.mark_complete': 'Marcar como Completada ✓',
    'lesson.completed': '✓ Lección Completada',
    'lesson.knowledge_check': 'Verificación de Conocimiento',
    'lesson.complete_lesson': 'Completar Lección ✓',
    'lesson.score': 'Puntuación',
    'lesson.excellent': '¡Excelente trabajo! Has dominado esta lección.',
    'lesson.review': 'Revisa el material e intenta de nuevo para mejorar tu puntuación.',
    'lesson.copy': 'Copiar',
    'lesson.copied': '✓ Copiado',
    'lesson.run_demo': '▶ Ejecutar Demo:',
    'lesson.sections': 'secciones',
    'lesson.quiz': 'Quiz',

    // Playground
    'playground.title': 'Laboratorio de Orquestación de Agentes',
    'playground.subtitle': 'Simula cómo los agentes de IA procesan tareas, usan herramientas y colaboran',
    'playground.config': 'Configuración',
    'playground.pattern': 'Patrón de Agente',
    'playground.pattern_single': 'Agente Único',
    'playground.pattern_plan': 'Planificar y Ejecutar',
    'playground.pattern_hierarchical': 'Jerárquico (Multi-Agente)',
    'playground.pattern_react': 'ReAct (Razonamiento + Acción)',
    'playground.tools': 'Herramientas Disponibles',
    'playground.model': 'Modelo',
    'playground.model_opus': 'Claude Opus 4 (Mejor calidad)',
    'playground.model_sonnet': 'Claude Sonnet 4 (Rápido)',
    'playground.model_haiku': 'Claude Haiku 4 (Más rápido)',
    'playground.max_steps': 'Pasos Máximos',
    'playground.metrics': 'Métricas de Ejecución',
    'playground.steps': 'Pasos',
    'playground.tool_calls': 'Llamadas a Herramientas',
    'playground.tokens': 'Tokens (est.)',
    'playground.cost': 'Costo (est.)',
    'playground.pattern_label': 'Patrón',
    'playground.tool_usage': 'Uso de Herramientas',
    'playground.input_placeholder': 'Describe una tarea para el agente (ej: \'Crear una API REST para gestión de usuarios\')',
    'playground.run': 'Ejecutar',
    'playground.try': 'Prueba:',
    'playground.example_1': 'Corregir el bug de login en auth.ts',
    'playground.example_2': 'Agregar paginación a la API de usuarios',
    'playground.example_3': 'Revisar PR #42 por problemas de seguridad',
    'playground.example_4': 'Crear tests para el servicio de pagos',
    'playground.task_complete': '✅ Tarea completada en {steps} pasos usando {tools} llamadas a herramientas (~{tokens} tokens).',

    // Progress
    'progress.title': 'Mi Progreso de Aprendizaje',
    'progress.subtitle': 'Sigue tu avance en IA y Orquestación de Agentes',
    'progress.lessons_completed': 'Lecciones Completadas',
    'progress.total_lessons': 'Total de Lecciones',
    'progress.overall': 'Progreso General',
    'progress.modules_mastered': 'Módulos Dominados',
    'progress.breakdown': 'Desglose por Módulo',
    'progress.complete': 'completo',
    'progress.continue': 'Continuar',
    'progress.review': 'Repasar',
    'progress.reset': 'Reiniciar Todo el Progreso',
    'progress.reset_confirm': '¿Estás seguro de que quieres reiniciar todo el progreso? Esta acción no se puede deshacer.',

    // Tools
    'tool.read_file': 'Leer Archivo',
    'tool.write_file': 'Escribir Archivo',
    'tool.run_shell': 'Ejecutar Shell',
    'tool.search_code': 'Buscar Código',
    'tool.jira': 'Jira',
    'tool.git': 'Git',
    'tool.database': 'Base de Datos',
    'tool.http': 'Petición HTTP',

    // Modules
    'mod.foundations.title': 'Fundamentos de IA',
    'mod.foundations.desc': 'Comprende los LLMs, el prompting y cómo piensa Claude Opus',
    'mod.agent-basics.title': 'Arquitectura de Agentes',
    'mod.agent-basics.desc': 'Construye agentes de IA autónomos que planifican, ejecutan e iteran',
    'mod.orchestration.title': 'Orquestación Multi-Agente',
    'mod.orchestration.desc': 'Coordina múltiples agentes para flujos de trabajo complejos',
    'mod.advanced.title': 'Patrones Avanzados',
    'mod.advanced.desc': 'Sistemas de agentes para producción con MCP, memoria y evaluación',
    'mod.real-world.title': 'Automatización Real',
    'mod.real-world.desc': 'Recetas de automatización completas que tu equipo puede usar hoy',
  }
};
