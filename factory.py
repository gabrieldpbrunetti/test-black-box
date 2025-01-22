# factory.py
import copy
from pathlib import Path
from typing import List
from typing import Dict, Any

from crewai import Agent, Task, Crew, LLM, Process

from config import Config

class CrewFactory:
    """Fábrica para criar diferentes tipos de Crew."""

    def __init__(self, config: Config):
        self.config = config
        self.llm_low_temp = LLM(model="gemini/gemini-1.5-flash", temperature=0.0)
        self.llm_high_temp = LLM(model="gemini/gemini-1.5-flash", temperature=0.2)

    def create_agent(self, agent_key: str, llm: LLM) -> Agent:
        """Cria um agente com base na chave fornecida e no LLM especificado."""
        agent_info = self.config.agents_dict[agent_key]
        return Agent(
            role=agent_info["role"],
            goal=agent_info["goal"],
            backstory=agent_info["backstory"],
            llm=llm
        )

    def create_task(self, task_key: str, agent: Agent, context: List[Task] = None, tasks_dict: Dict[str, Any] = None) -> Task:
        """Cria uma tarefa com base na chave fornecida, agente, contexto e dicionário de tarefas."""
        if tasks_dict is None:
            tasks_dict = self.config.tasks_dict
        task_info = tasks_dict[task_key]
        return Task(
            description=task_info["description"],
            expected_output=task_info["expected_output"],
            agent=agent,
            context=context
        )

    def create_cypress_crew(self, vue_code: str) -> Crew:
        """Cria um Crew para operações relacionadas ao Cypress."""
        # Cria uma cópia profunda dos dicionários para evitar modificações no original
        tasks_dict = copy.deepcopy(self.config.tasks_dict)

        # Atualiza as descrições das tarefas com o código Vue e exemplos de saída
        for task_key in ["cypress_write", "cypress_review"]:
            task = tasks_dict[task_key]
            output_example = self.config.output_examples[task["output_example"]]
            task["description"] = task["description"].format(vue_code=vue_code) + output_example

        # Inicializa os agentes
        cypress_writer = self.create_agent("cypress_writer", self.llm_high_temp)
        cypress_reviewer = self.create_agent("cypress_reviewer", self.llm_low_temp)

        # Inicializa as tarefas usando a cópia modificada de tasks_dict
        cypress_write = self.create_task("cypress_write", cypress_writer, tasks_dict=tasks_dict)
        cypress_review = self.create_task("cypress_review", cypress_reviewer, context=[cypress_write], tasks_dict=tasks_dict)

        return Crew(
            agents=[cypress_writer, cypress_reviewer],
            tasks=[cypress_write, cypress_review],
            process=Process.sequential,
            verbose=True
        )

    def create_manager_crew(self, results: List[str], output_path: Path) -> Crew:
        """Cria um Crew para gerenciar os resultados das operações anteriores."""
        # Cria uma cópia profunda dos dicionários para evitar modificações no original
        tasks_dict = copy.deepcopy(self.config.tasks_dict)

        # Atualiza a descrição da tarefa final com os resultados
        manager_task = tasks_dict["final_task"]
        manager_task["description"] = manager_task["description"].format(*results)

        # Inicializa o agente manager
        manager = self.create_agent("manager", self.llm_low_temp)

        # Inicializa a tarefa final usando a cópia modificada de tasks_dict
        final_task = Task(
            description=manager_task["description"],
            expected_output=manager_task["expected_output"],
            output_file=str(output_path.with_suffix(".cy.js")),
            agent=manager
        )

        return Crew(
            agents=[manager],
            tasks=[final_task],
            process=Process.sequential
        )
