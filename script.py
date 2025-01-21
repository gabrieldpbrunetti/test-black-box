from crewai import Agent, Task, Crew, LLM, Process
from typing import Dict, List, Any
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor
import os
import yaml

load_dotenv()

def read_yaml(path: str) -> Dict[str, Any]:
    with open(path, encoding="utf-8") as file:
        return yaml.safe_load(file)

#region cypress crew
def cypress_crew(vue_code: str) -> Crew:
    agents_dict: Dict[str, Dict] = read_yaml(r"strings\agents.yaml")
    tasks_dict: Dict[str, Dict] = read_yaml(r"strings\tasks.yaml")
    output_examples = read_yaml(r"strings\output_examples.yaml")

    # region init llm
    llm_low_temp: LLM = LLM(
        model="gemini/gemini-1.5-flash",
        temperature=0.0
    )

    llm_high_temp: LLM = LLM(
        model="gemini/gemini-1.5-flash",
        temperature=0.2
    )
    # endregion

    # region format description and concat output examples
    tasks_dict["cypress_write"]["description"] = \
        tasks_dict["cypress_write"]["description"].format(vue_code=vue_code) \
        + output_examples[tasks_dict["cypress_write"]["output_example"]]
    
    tasks_dict["cypress_review"]["description"] = \
        tasks_dict["cypress_review"]["description"].format(vue_code=vue_code) \
        + output_examples[tasks_dict["cypress_review"]["output_example"]]
    # endregion


    # region init agents and tasks
    # cypress write
    cypress_writer_dict: Dict[str, Dict] = agents_dict["cypress_writer"]
    cypress_writer: Agent = Agent(
        role=cypress_writer_dict["role"],
        goal=cypress_writer_dict["goal"],
        backstory=cypress_writer_dict["backstory"],
        llm=llm_high_temp
    )

    cypress_write_dict: Dict[str, Dict] = tasks_dict["cypress_write"]
    cypress_write: Task = Task(
        description=cypress_write_dict["description"],
        expected_output=cypress_write_dict["expected_output"],
        agent=cypress_writer
    )
    ###

    # cypress review
    cypress_reviewer_dict: Dict[str, Dict] = agents_dict["cypress_reviewer"]
    cypress_reviewer: Agent = Agent(
        role=cypress_reviewer_dict["role"],
        goal=cypress_reviewer_dict["goal"],
        backstory=cypress_reviewer_dict["backstory"],
        llm=llm_low_temp,
    )

    cypress_review_dict: Dict[str, Dict] = tasks_dict["cypress_review"]
    cypress_review: Task = Task(
        description=cypress_review_dict["description"],
        expected_output=cypress_review_dict["expected_output"],
        agent=cypress_reviewer,
        context=[cypress_write]
    )
    #

    # endregion

    agents: List[Agent] = [cypress_writer, cypress_reviewer]
    tasks: List[Task] = [cypress_write, cypress_review]

    return Crew(
        agents=agents,
        tasks=tasks,
        process=Process.sequential,
        verbose=True
    )
# endregion 

# region manager crew
def manager_crew(results: List[str], output_path: str) -> str:
    
    agents_dict: Dict[str, Dict] = read_yaml(r"strings\agents.yaml")
    tasks_dict: Dict[str, Dict] = read_yaml(r"strings\tasks.yaml")

    llm: LLM = LLM(
        model="gemini/gemini-1.5-flash",
        temperature=0.0
    )

    manager_task_dict: Dict[str, Any] = tasks_dict["final_task"]
    manager_task_dict["description"] = \
        manager_task_dict["description"].format(results[0], results[1], results[2])
    
    manager_dict: Dict[str, Any] = agents_dict["manager"]
    manager: Agent = Agent(
        role=manager_dict["role"],
        goal=manager_dict["goal"],
        backstory=manager_dict["backstory"],
        llm=llm
    )

    final_task: Task = Task(
        description=manager_task_dict["description"],
        expected_output=manager_task_dict["expected_output"],
        output_file=fr"tests\{output_path}.cy.js",
        agent=manager
    )

    agents: List[Agent] = [manager]
    tasks: List[Task] = [final_task]

    return Crew(
        agents=agents,
        tasks=tasks,
        process=Process.sequential
    )
# endregion


# region main function
def main() -> None:
    # open vue code
    path: str = r"C:\Users\gabri\Downloads\leds-conectafapes-frontend-admin-data-test-develop\leds-conectafapes-frontend-admin-data-test-develop\src\views\conecta-fapes"
    for root, _, files in os.walk(path):
        for file in files:
            path = os.path.join(root, file)
            output_path = path.split("conecta-fapes", 1)[-1]

            with open(path, encoding="utf-8") as vue_file:
                vue_code = vue_file.read()
            # run cypress crew parallel
            crew_cypress: Crew = cypress_crew(vue_code)
            with ThreadPoolExecutor() as executor:
                runs = [executor.submit(crew_cypress.kickoff) for _ in range(3)]
                results = [run.result() for run in runs]
            #
            
            crew_manager: Crew = manager_crew(results, output_path)
            crew_manager.kickoff()


if __name__ == "__main__":
    main()