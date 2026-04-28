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

    // Playground — General
    'playground.badge': 'LEARN BY DOING',
    'playground.title': 'Agent Orchestration Playground',
    'playground.subtitle': 'Explore how AI agents think, plan, and collaborate. Choose a mode below to visualize patterns, run guided simulations, or build your own workflows.',

    // Playground — Tabs
    'playground.tab_explorer': 'Pattern Explorer',
    'playground.tab_explorer_hint': 'Compare orchestration patterns visually',
    'playground.tab_simulator': 'Agent Simulator',
    'playground.tab_simulator_hint': 'Watch agents work step-by-step',
    'playground.tab_builder': 'Build Your Own',
    'playground.tab_builder_hint': 'Chain agents into workflows',

    // Playground — Tab Intros
    'playground.explorer_intro': 'Select any orchestration pattern to see an animated diagram of how it works, real code examples, and guidance on when to use it.',
    'playground.simulator_intro': 'Run a simulated agent on a task and watch each step. Enable Guided Mode for a coach that explains the agent\'s decisions in plain language.',
    'playground.builder_intro': 'Add components from the palette to build a workflow. Connect agents, tools, and conditions visually, then generate the orchestration code.',

    // Playground — Pattern Explorer
    'playground.select_pattern': 'Select Pattern',
    'playground.when_to_use': 'When to use this pattern',
    'playground.code_example': 'Code Example',
    'playground.copy': 'Copy',
    'playground.copied': 'Copied!',
    'playground.replay': 'Replay',

    // Pattern Names & Descriptions
    'playground.pattern_single': 'Single Agent',
    'playground.pattern_plan-execute': 'Plan & Execute',
    'playground.pattern_hierarchical': 'Hierarchical (Multi-Agent)',
    'playground.pattern_react': 'ReAct (Reasoning + Acting)',
    'playground.pattern_plan': 'Plan & Execute',
    'playground.pattern_desc_single': 'One agent handles everything — reasoning, tool use, and responding — in a single loop. Simple, effective for straightforward tasks.',
    'playground.pattern_desc_plan-execute': 'First create a complete plan, then execute each step sequentially. If a step fails, re-plan. Great for complex multi-step tasks.',
    'playground.pattern_desc_hierarchical': 'A manager agent delegates tasks to specialist agents (planner, coder, tester). Each specialist is expert in their domain.',
    'playground.pattern_desc_react': 'The agent explicitly alternates between Thought, Action, and Observation. Each cycle refines understanding before the next action.',

    // Pattern Steps
    'playground.step_receive': 'Receive Task',
    'playground.step_receive_desc': 'Agent receives the user request',
    'playground.step_reason': 'Reason',
    'playground.step_reason_desc': 'Analyze what needs to be done',
    'playground.step_tool': 'Use Tools',
    'playground.step_tool_desc': 'Call tools to gather info or act',
    'playground.step_respond': 'Respond',
    'playground.step_respond_desc': 'Return the final result',
    'playground.step_plan': 'Create Plan',
    'playground.step_plan_desc': 'Design a full strategy first',
    'playground.step_decompose': 'Decompose',
    'playground.step_decompose_desc': 'Break into ordered steps',
    'playground.step_execute': 'Execute Steps',
    'playground.step_execute_desc': 'Run each step sequentially',
    'playground.step_validate': 'Validate',
    'playground.step_validate_desc': 'Check results after each step',
    'playground.step_adapt': 'Adapt',
    'playground.step_adapt_desc': 'Re-plan if something fails',
    'playground.step_orchestrate': 'Orchestrate',
    'playground.step_orchestrate_desc': 'Manager coordinates the team',
    'playground.step_delegate': 'Delegate',
    'playground.step_delegate_desc': 'Assign sub-tasks to specialists',
    'playground.step_specialist': 'Specialist Work',
    'playground.step_specialist_desc': 'Each agent does their expertise',
    'playground.step_aggregate': 'Aggregate',
    'playground.step_aggregate_desc': 'Combine results from all agents',
    'playground.step_thought': 'Thought',
    'playground.step_thought_desc': 'Reason about what to do next',
    'playground.step_action': 'Action',
    'playground.step_action_desc': 'Choose and execute a tool',
    'playground.step_observation': 'Observation',
    'playground.step_observation_desc': 'Analyze tool output',
    'playground.step_loop': 'Loop',
    'playground.step_loop_desc': 'Repeat until task is solved',

    // Use Cases
    'playground.usecase_single_1': 'Simple coding tasks like fixing a bug or adding a feature',
    'playground.usecase_single_2': 'Quick lookups, file edits, and one-shot operations',
    'playground.usecase_single_3': 'Tasks where one agent has all the context it needs',
    'playground.usecase_plan_1': 'Multi-file refactoring or migration projects',
    'playground.usecase_plan_2': 'Tasks with dependencies between steps',
    'playground.usecase_plan_3': 'When you need a clear audit trail of what was done',
    'playground.usecase_hier_1': 'Large features requiring planning, coding, and testing',
    'playground.usecase_hier_2': 'Projects needing different expertise (security, performance)',
    'playground.usecase_hier_3': 'When parallel work by specialists saves time',
    'playground.usecase_react_1': 'Debugging unknown issues that need investigation',
    'playground.usecase_react_2': 'Exploratory tasks where the path isn\'t clear upfront',
    'playground.usecase_react_3': 'When you want transparent, explainable reasoning',

    // Playground — Simulator
    'playground.config': 'Configuration',
    'playground.guided_mode': 'Guided Mode',
    'playground.recommended': 'REC',
    'playground.pattern': 'Agent Pattern',
    'playground.tools': 'Available Tools',
    'playground.model': 'Model',
    'playground.model_opus': 'Claude Opus 4 (Best quality)',
    'playground.model_sonnet': 'Claude Sonnet 4 (Fast)',
    'playground.model_haiku': 'Claude Haiku 4 (Fastest)',
    'playground.speed': 'Simulation Speed',
    'playground.metrics': 'Execution Metrics',
    'playground.steps': 'Steps',
    'playground.tool_calls': 'Tool Calls',
    'playground.tokens': 'Tokens (est.)',
    'playground.cost': 'Cost (est.)',
    'playground.pattern_label': 'Pattern',
    'playground.tool_usage': 'Tool Usage',
    'playground.input_placeholder': 'Describe a task for the agent (e.g., \'Fix the login bug in auth.ts\')',
    'playground.run': 'Run',
    'playground.try': 'Try:',
    'playground.example_1': 'Fix the login bug in auth.ts',
    'playground.example_2': 'Add pagination to the users API',
    'playground.example_3': 'Review PR #42 for security issues',
    'playground.example_4': 'Create tests for payment service',
    'playground.task_complete': 'Task completed in {steps} steps using {tools} tool calls (~{tokens} tokens).',

    // Simulator Roles
    'playground.role_user': 'User',
    'playground.role_agent': 'Agent',
    'playground.role_system': 'System',
    'playground.thinking': 'THINKING:',

    // Empty States
    'playground.empty_title': 'Ready to simulate',
    'playground.empty_desc': 'Type a task below or click one of the example tasks. The agent will process it step by step so you can see how it thinks.',

    // Coach Messages
    'playground.coach': 'Learning Coach',
    'playground.coach_waiting': 'Run a simulation to see guided explanations of each step here.',
    'playground.coach_start': 'The simulation is starting! Watch how the agent breaks down the task and decides which tools to use.',
    'playground.coach_summary': 'Simulation complete! This was the {pattern} pattern. Try switching to a different pattern and running the same task to compare approaches.',

    // Coach — Single Agent
    'playground.coach_single_1': 'SINGLE AGENT: One agent handles everything. It reasons about the task, picks tools, acts, and loops until done. Simple but effective.',
    'playground.coach_single_2': 'The agent\'s first move is usually to search for context. Good agents gather information before making changes.',
    'playground.coach_single_3': 'Notice: the agent reads files BEFORE writing. This "read first" pattern prevents blind edits and is a best practice.',
    'playground.coach_single_4': 'Now the agent writes code. It applies what it learned from reading to make targeted, informed changes.',
    'playground.coach_single_5': 'Always verify! The agent runs tests to confirm its changes work. This "code then verify" loop is fundamental.',
    'playground.coach_single_done': 'The single agent completed everything itself. This works well for focused tasks. For bigger projects, consider multi-agent patterns.',

    // Coach — Plan & Execute
    'playground.coach_plan_1': 'PLAN & EXECUTE: Notice the agent creates a FULL PLAN before doing anything. This prevents wasted effort.',
    'playground.coach_plan_2': 'The plan has numbered steps with clear goals. Each step has implicit success criteria the agent will check.',
    'playground.coach_plan_exec': 'Now executing the plan step by step. The system tracks which step we\'re on — this is the "execute" phase.',
    'playground.coach_plan_3': 'After reading files, the agent validates its plan still makes sense. If it discovered something unexpected, it would re-plan.',
    'playground.coach_plan_4': 'Testing is a plan step, not an afterthought. In Plan & Execute, verification is built into the plan itself.',
    'playground.coach_plan_done': 'All plan steps completed! The power of this pattern: clear audit trail, predictable execution, and the ability to re-plan on failure.',

    // Coach — Hierarchical
    'playground.coach_hier_1': 'HIERARCHICAL: A manager (orchestrator) agent coordinates multiple specialist agents. Like a tech lead managing a team.',
    'playground.coach_hier_2': 'The orchestrator DELEGATES rather than doing work itself. Its job is coordination and quality control.',
    'playground.coach_hier_3': 'The Planner Agent creates the roadmap. It specializes in breaking down tasks — it doesn\'t write code.',
    'playground.coach_tool_search': 'Tools are used by whichever agent needs them. The orchestrator decides WHO uses which tools.',
    'playground.coach_tool_read': 'The specialist agent reads files relevant to its task. Each agent has a focused scope.',
    'playground.coach_hier_4': 'The Coder Agent focuses ONLY on implementation. Specialization leads to higher quality output.',
    'playground.coach_hier_5': 'A separate Tester Agent verifies the code. Having different agents for coding and testing prevents blind spots.',
    'playground.coach_hier_done': 'Multiple specialists completed the task as a team! This pattern shines for large, multi-domain tasks.',

    // Coach — ReAct
    'playground.coach_react_1': 'REACT: The agent explicitly shows its reasoning. Each step follows: Thought (reason) > Action (do) > Observation (learn).',
    'playground.coach_react_2': 'OBSERVATION phase: The agent analyzes what it learned from the tool. This explicit reflection step is what makes ReAct special.',
    'playground.coach_react_3': 'Each action is chosen based on the previous observation. The agent builds understanding incrementally.',
    'playground.coach_react_4': 'KEY MOMENT: The Thought phase is where the agent connects observations to insights. This is the "reasoning" in ReAct.',
    'playground.coach_react_5': 'Even after writing a fix, the agent observes the result. In ReAct, you never assume — you always verify.',
    'playground.coach_react_done': 'ReAct completed! Notice how every decision was explainable. This transparency makes ReAct ideal for debugging and auditing.',

    // Playground — Builder
    'playground.components': 'Components',
    'playground.palette_hint': 'Click a component to add it to your workflow pipeline.',
    'playground.node_trigger': 'Trigger',
    'playground.node_desc_trigger': 'Starts the workflow',
    'playground.node_agent': 'Agent',
    'playground.node_desc_agent': 'AI agent that reasons and acts',
    'playground.node_tool': 'Tool',
    'playground.node_desc_tool': 'External tool or API call',
    'playground.node_condition': 'Condition',
    'playground.node_desc_condition': 'Branch based on a rule',
    'playground.node_output': 'Output',
    'playground.node_desc_output': 'Return the final result',
    'playground.workflow_canvas': 'Workflow Canvas',
    'playground.clear': 'Clear',
    'playground.generate_code': 'Generate Code',
    'playground.canvas_empty': 'Your workflow is empty',
    'playground.canvas_empty_hint': 'Click components on the left to build a pipeline',
    'playground.configure_node': 'Configure Node',
    'playground.node_name': 'Display Name',
    'playground.agent_model': 'Model',
    'playground.agent_role': 'Role',
    'playground.role_general': 'General',
    'playground.role_planner': 'Planner',
    'playground.role_coder': 'Coder',
    'playground.role_reviewer': 'Reviewer',
    'playground.role_tester': 'Tester',
    'playground.tool_type': 'Tool Type',
    'playground.condition_expr': 'Condition Expression',
    'playground.generated_code': 'Generated Code',
    'playground.output_empty': 'Add components and click "Generate Code" to see the orchestration code.',
    'playground.detected_pattern': 'Detected Pattern',
    'playground.detected_desc_single': 'Your workflow uses a single agent — the simplest orchestration pattern.',
    'playground.detected_desc_plan-execute': 'Multiple agents with conditions suggest a Plan & Execute pattern.',
    'playground.detected_desc_hierarchical': 'Three or more agents indicate a hierarchical multi-agent orchestration.',
    'playground.detected_desc_react': 'An agent with multiple tools and conditions matches the ReAct pattern.',

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

    // Advanced Modules
    'mod.taor-pattern.title': 'TAOR Pattern',
    'mod.taor-pattern.desc': 'Think-Act-Observe-Repeat — the core reasoning loop that makes AI agents accurate',
    'mod.langchain.title': 'LangChain',
    'mod.langchain.desc': 'Build chains, agents, tools, and memory with the LangChain framework',
    'mod.langgraph.title': 'LangGraph',
    'mod.langgraph.desc': 'Stateful multi-agent orchestration with conditional routing and cycles',
    'mod.mcp-deep-dive.title': 'MCP Servers',
    'mod.mcp-deep-dive.desc': 'Model Context Protocol — architecture, custom servers, and composition',
    'mod.rag.title': 'RAG',
    'mod.rag.desc': 'Retrieval-Augmented Generation for grounded, accurate AI responses',
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

    // Playground — General
    'playground.badge': 'APRENDE HACIENDO',
    'playground.title': 'Laboratorio de Orquestación de Agentes',
    'playground.subtitle': 'Explora cómo los agentes de IA piensan, planifican y colaboran. Elige un modo para visualizar patrones, ejecutar simulaciones guiadas o construir tus propios flujos.',

    // Playground — Tabs
    'playground.tab_explorer': 'Explorador de Patrones',
    'playground.tab_explorer_hint': 'Compara patrones de orquestación visualmente',
    'playground.tab_simulator': 'Simulador de Agentes',
    'playground.tab_simulator_hint': 'Observa agentes trabajar paso a paso',
    'playground.tab_builder': 'Construye el Tuyo',
    'playground.tab_builder_hint': 'Encadena agentes en flujos de trabajo',

    // Playground — Tab Intros
    'playground.explorer_intro': 'Selecciona cualquier patrón de orquestación para ver un diagrama animado de cómo funciona, ejemplos de código reales y cuándo usarlo.',
    'playground.simulator_intro': 'Ejecuta un agente simulado en una tarea y observa cada paso. Activa el Modo Guiado para un coach que explique las decisiones del agente.',
    'playground.builder_intro': 'Agrega componentes desde la paleta para construir un flujo. Conecta agentes, herramientas y condiciones visualmente, luego genera el código.',

    // Playground — Pattern Explorer
    'playground.select_pattern': 'Seleccionar Patrón',
    'playground.when_to_use': 'Cuándo usar este patrón',
    'playground.code_example': 'Ejemplo de Código',
    'playground.copy': 'Copiar',
    'playground.copied': '¡Copiado!',
    'playground.replay': 'Repetir',

    // Pattern Names & Descriptions
    'playground.pattern_single': 'Agente Único',
    'playground.pattern_plan-execute': 'Planificar y Ejecutar',
    'playground.pattern_hierarchical': 'Jerárquico (Multi-Agente)',
    'playground.pattern_react': 'ReAct (Razonamiento + Acción)',
    'playground.pattern_plan': 'Planificar y Ejecutar',
    'playground.pattern_desc_single': 'Un agente maneja todo — razonamiento, uso de herramientas y respuesta — en un solo bucle. Simple y efectivo para tareas directas.',
    'playground.pattern_desc_plan-execute': 'Primero crea un plan completo, luego ejecuta cada paso secuencialmente. Si un paso falla, re-planifica. Ideal para tareas complejas.',
    'playground.pattern_desc_hierarchical': 'Un agente gerente delega tareas a agentes especialistas (planificador, programador, tester). Cada especialista es experto en su dominio.',
    'playground.pattern_desc_react': 'El agente alterna explícitamente entre Pensamiento, Acción y Observación. Cada ciclo refina la comprensión antes de la siguiente acción.',

    // Pattern Steps
    'playground.step_receive': 'Recibir Tarea',
    'playground.step_receive_desc': 'El agente recibe la solicitud del usuario',
    'playground.step_reason': 'Razonar',
    'playground.step_reason_desc': 'Analizar qué se necesita hacer',
    'playground.step_tool': 'Usar Herramientas',
    'playground.step_tool_desc': 'Llamar herramientas para obtener info o actuar',
    'playground.step_respond': 'Responder',
    'playground.step_respond_desc': 'Devolver el resultado final',
    'playground.step_plan': 'Crear Plan',
    'playground.step_plan_desc': 'Diseñar una estrategia completa primero',
    'playground.step_decompose': 'Descomponer',
    'playground.step_decompose_desc': 'Dividir en pasos ordenados',
    'playground.step_execute': 'Ejecutar Pasos',
    'playground.step_execute_desc': 'Ejecutar cada paso secuencialmente',
    'playground.step_validate': 'Validar',
    'playground.step_validate_desc': 'Verificar resultados después de cada paso',
    'playground.step_adapt': 'Adaptar',
    'playground.step_adapt_desc': 'Re-planificar si algo falla',
    'playground.step_orchestrate': 'Orquestar',
    'playground.step_orchestrate_desc': 'El gerente coordina al equipo',
    'playground.step_delegate': 'Delegar',
    'playground.step_delegate_desc': 'Asignar sub-tareas a especialistas',
    'playground.step_specialist': 'Trabajo Especialista',
    'playground.step_specialist_desc': 'Cada agente hace su especialidad',
    'playground.step_aggregate': 'Agregar',
    'playground.step_aggregate_desc': 'Combinar resultados de todos los agentes',
    'playground.step_thought': 'Pensamiento',
    'playground.step_thought_desc': 'Razonar sobre qué hacer después',
    'playground.step_action': 'Acción',
    'playground.step_action_desc': 'Elegir y ejecutar una herramienta',
    'playground.step_observation': 'Observación',
    'playground.step_observation_desc': 'Analizar la salida de la herramienta',
    'playground.step_loop': 'Bucle',
    'playground.step_loop_desc': 'Repetir hasta resolver la tarea',

    // Use Cases
    'playground.usecase_single_1': 'Tareas simples de código como corregir un bug o agregar una función',
    'playground.usecase_single_2': 'Búsquedas rápidas, ediciones de archivos y operaciones únicas',
    'playground.usecase_single_3': 'Tareas donde un agente tiene todo el contexto que necesita',
    'playground.usecase_plan_1': 'Refactorización o migración de múltiples archivos',
    'playground.usecase_plan_2': 'Tareas con dependencias entre pasos',
    'playground.usecase_plan_3': 'Cuando necesitas un registro claro de lo que se hizo',
    'playground.usecase_hier_1': 'Funcionalidades grandes que requieren planificación, código y pruebas',
    'playground.usecase_hier_2': 'Proyectos que necesitan diferente experiencia (seguridad, rendimiento)',
    'playground.usecase_hier_3': 'Cuando el trabajo paralelo de especialistas ahorra tiempo',
    'playground.usecase_react_1': 'Depuración de problemas desconocidos que necesitan investigación',
    'playground.usecase_react_2': 'Tareas exploratorias donde el camino no está claro de antemano',
    'playground.usecase_react_3': 'Cuando quieres razonamiento transparente y explicable',

    // Playground — Simulator
    'playground.config': 'Configuración',
    'playground.guided_mode': 'Modo Guiado',
    'playground.recommended': 'REC',
    'playground.pattern': 'Patrón de Agente',
    'playground.tools': 'Herramientas Disponibles',
    'playground.model': 'Modelo',
    'playground.model_opus': 'Claude Opus 4 (Mejor calidad)',
    'playground.model_sonnet': 'Claude Sonnet 4 (Rápido)',
    'playground.model_haiku': 'Claude Haiku 4 (Más rápido)',
    'playground.speed': 'Velocidad de Simulación',
    'playground.metrics': 'Métricas de Ejecución',
    'playground.steps': 'Pasos',
    'playground.tool_calls': 'Llamadas a Herramientas',
    'playground.tokens': 'Tokens (est.)',
    'playground.cost': 'Costo (est.)',
    'playground.pattern_label': 'Patrón',
    'playground.tool_usage': 'Uso de Herramientas',
    'playground.input_placeholder': 'Describe una tarea para el agente (ej: \'Corregir el bug de login en auth.ts\')',
    'playground.run': 'Ejecutar',
    'playground.try': 'Prueba:',
    'playground.example_1': 'Corregir el bug de login en auth.ts',
    'playground.example_2': 'Agregar paginación a la API de usuarios',
    'playground.example_3': 'Revisar PR #42 por problemas de seguridad',
    'playground.example_4': 'Crear tests para el servicio de pagos',
    'playground.task_complete': 'Tarea completada en {steps} pasos usando {tools} llamadas a herramientas (~{tokens} tokens).',

    // Simulator Roles
    'playground.role_user': 'Usuario',
    'playground.role_agent': 'Agente',
    'playground.role_system': 'Sistema',
    'playground.thinking': 'PENSANDO:',

    // Empty States
    'playground.empty_title': 'Listo para simular',
    'playground.empty_desc': 'Escribe una tarea abajo o haz clic en uno de los ejemplos. El agente la procesará paso a paso para que veas cómo piensa.',

    // Coach Messages
    'playground.coach': 'Coach de Aprendizaje',
    'playground.coach_waiting': 'Ejecuta una simulación para ver explicaciones guiadas de cada paso aquí.',
    'playground.coach_start': '¡La simulación está comenzando! Observa cómo el agente descompone la tarea y decide qué herramientas usar.',
    'playground.coach_summary': '¡Simulación completa! Este fue el patrón {pattern}. Prueba cambiar a un patrón diferente y ejecutar la misma tarea para comparar.',

    // Coach — Single Agent
    'playground.coach_single_1': 'AGENTE ÚNICO: Un agente maneja todo. Razona sobre la tarea, elige herramientas, actúa y repite hasta terminar.',
    'playground.coach_single_2': 'El primer movimiento del agente suele ser buscar contexto. Los buenos agentes recopilan información antes de hacer cambios.',
    'playground.coach_single_3': 'Nota: el agente lee archivos ANTES de escribir. Este patrón "leer primero" previene ediciones a ciegas.',
    'playground.coach_single_4': 'Ahora el agente escribe código. Aplica lo que aprendió leyendo para hacer cambios informados y precisos.',
    'playground.coach_single_5': '¡Siempre verificar! El agente ejecuta pruebas para confirmar que sus cambios funcionan. Este ciclo es fundamental.',
    'playground.coach_single_done': 'El agente único completó todo solo. Funciona bien para tareas enfocadas. Para proyectos más grandes, considera patrones multi-agente.',

    // Coach — Plan & Execute
    'playground.coach_plan_1': 'PLANIFICAR Y EJECUTAR: Nota que el agente crea un PLAN COMPLETO antes de hacer nada. Esto previene esfuerzo desperdiciado.',
    'playground.coach_plan_2': 'El plan tiene pasos numerados con objetivos claros. Cada paso tiene criterios de éxito implícitos que el agente verificará.',
    'playground.coach_plan_exec': 'Ahora ejecutando el plan paso a paso. El sistema rastrea en qué paso estamos — esta es la fase de "ejecutar".',
    'playground.coach_plan_3': 'Después de leer archivos, el agente valida que su plan aún tiene sentido. Si descubriera algo inesperado, re-planificaría.',
    'playground.coach_plan_4': 'Las pruebas son un paso del plan, no algo secundario. En Planificar y Ejecutar, la verificación es parte del plan mismo.',
    'playground.coach_plan_done': '¡Todos los pasos del plan completados! El poder de este patrón: registro claro, ejecución predecible y capacidad de re-planificar.',

    // Coach — Hierarchical
    'playground.coach_hier_1': 'JERÁRQUICO: Un agente gerente (orquestador) coordina múltiples agentes especialistas. Como un líder técnico dirigiendo un equipo.',
    'playground.coach_hier_2': 'El orquestador DELEGA en vez de hacer el trabajo. Su rol es coordinación y control de calidad.',
    'playground.coach_hier_3': 'El Agente Planificador crea la hoja de ruta. Se especializa en descomponer tareas — no escribe código.',
    'playground.coach_tool_search': 'Las herramientas las usa el agente que las necesite. El orquestador decide QUIÉN usa qué herramientas.',
    'playground.coach_tool_read': 'El agente especialista lee archivos relevantes para su tarea. Cada agente tiene un alcance enfocado.',
    'playground.coach_hier_4': 'El Agente Programador se enfoca SOLO en la implementación. La especialización lleva a mayor calidad.',
    'playground.coach_hier_5': 'Un Agente Tester separado verifica el código. Tener diferentes agentes para codificar y probar previene puntos ciegos.',
    'playground.coach_hier_done': '¡Múltiples especialistas completaron la tarea en equipo! Este patrón brilla para tareas grandes y multi-dominio.',

    // Coach — ReAct
    'playground.coach_react_1': 'REACT: El agente muestra su razonamiento explícitamente. Cada paso sigue: Pensamiento (razonar) > Acción (hacer) > Observación (aprender).',
    'playground.coach_react_2': 'Fase de OBSERVACIÓN: El agente analiza lo que aprendió de la herramienta. Este paso de reflexión explícita es lo que hace especial a ReAct.',
    'playground.coach_react_3': 'Cada acción se elige basada en la observación anterior. El agente construye comprensión incrementalmente.',
    'playground.coach_react_4': 'MOMENTO CLAVE: La fase de Pensamiento es donde el agente conecta observaciones con insights. Este es el "razonamiento" en ReAct.',
    'playground.coach_react_5': 'Incluso después de escribir un arreglo, el agente observa el resultado. En ReAct, nunca se asume — siempre se verifica.',
    'playground.coach_react_done': '¡ReAct completado! Nota cómo cada decisión fue explicable. Esta transparencia hace a ReAct ideal para depuración y auditoría.',

    // Playground — Builder
    'playground.components': 'Componentes',
    'playground.palette_hint': 'Haz clic en un componente para agregarlo a tu flujo de trabajo.',
    'playground.node_trigger': 'Disparador',
    'playground.node_desc_trigger': 'Inicia el flujo de trabajo',
    'playground.node_agent': 'Agente',
    'playground.node_desc_agent': 'Agente IA que razona y actúa',
    'playground.node_tool': 'Herramienta',
    'playground.node_desc_tool': 'Herramienta externa o llamada API',
    'playground.node_condition': 'Condición',
    'playground.node_desc_condition': 'Ramificar según una regla',
    'playground.node_output': 'Salida',
    'playground.node_desc_output': 'Devolver el resultado final',
    'playground.workflow_canvas': 'Lienzo del Flujo',
    'playground.clear': 'Limpiar',
    'playground.generate_code': 'Generar Código',
    'playground.canvas_empty': 'Tu flujo de trabajo está vacío',
    'playground.canvas_empty_hint': 'Haz clic en componentes a la izquierda para construir una cadena',
    'playground.configure_node': 'Configurar Nodo',
    'playground.node_name': 'Nombre',
    'playground.agent_model': 'Modelo',
    'playground.agent_role': 'Rol',
    'playground.role_general': 'General',
    'playground.role_planner': 'Planificador',
    'playground.role_coder': 'Programador',
    'playground.role_reviewer': 'Revisor',
    'playground.role_tester': 'Tester',
    'playground.tool_type': 'Tipo de Herramienta',
    'playground.condition_expr': 'Expresión de Condición',
    'playground.generated_code': 'Código Generado',
    'playground.output_empty': 'Agrega componentes y haz clic en "Generar Código" para ver el código de orquestación.',
    'playground.detected_pattern': 'Patrón Detectado',
    'playground.detected_desc_single': 'Tu flujo usa un solo agente — el patrón de orquestación más simple.',
    'playground.detected_desc_plan-execute': 'Múltiples agentes con condiciones sugieren un patrón de Planificar y Ejecutar.',
    'playground.detected_desc_hierarchical': 'Tres o más agentes indican una orquestación jerárquica multi-agente.',
    'playground.detected_desc_react': 'Un agente con múltiples herramientas y condiciones coincide con el patrón ReAct.',

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

    // Advanced Modules
    'mod.taor-pattern.title': 'Patrón TAOR',
    'mod.taor-pattern.desc': 'Pensar-Actuar-Observar-Repetir — el ciclo de razonamiento que hace precisos a los agentes',
    'mod.langchain.title': 'LangChain',
    'mod.langchain.desc': 'Construye cadenas, agentes, herramientas y memoria con el framework LangChain',
    'mod.langgraph.title': 'LangGraph',
    'mod.langgraph.desc': 'Orquestación multi-agente con estado, rutas condicionales y ciclos',
    'mod.mcp-deep-dive.title': 'Servidores MCP',
    'mod.mcp-deep-dive.desc': 'Model Context Protocol — arquitectura, servidores custom y composición',
    'mod.rag.title': 'RAG',
    'mod.rag.desc': 'Generación Aumentada por Recuperación para respuestas precisas y fundamentadas',
  }
};
