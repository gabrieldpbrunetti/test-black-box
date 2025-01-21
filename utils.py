# utils.py
from pathlib import Path

def get_all_files(directory: Path, pattern: str = "*.*") -> list:
    """Retorna uma lista de todos os arquivos que correspondem ao padrão no diretório."""
    return list(directory.rglob(pattern))
