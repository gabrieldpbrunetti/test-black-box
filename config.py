# config.py
import yaml
from pathlib import Path
from typing import Dict, Any
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

def read_yaml(path: Path) -> Dict[str, Any]:
    """Lê um arquivo YAML e retorna seu conteúdo como um dicionário."""
    with path.open(encoding="utf-8") as file:
        return yaml.safe_load(file)

class Config:
    """Classe para armazenar configurações do projeto."""

    def __init__(self, base_path: Path):
        self.agents_dict = read_yaml(base_path / "strings" / "agents.yaml")
        self.tasks_dict = read_yaml(base_path / "strings" / "tasks.yaml")
        self.output_examples = read_yaml(base_path / "strings" / "output_examples.yaml")
