# main.py
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

from config import Config
from factory import CrewFactory
from utils import get_all_files

def main() -> None:
    # Define os caminhos base
    base_path = Path(__file__).parent

    # Inicializa as configurações
    config = Config(base_path)

    # Inicializa a fábrica de crews
    factory = CrewFactory(config)

    # Define o caminho onde os arquivos Vue estão localizados
    vue_files_dir = Path(
        r"C:\Users\gabri\Downloads\leds-conectafapes-frontend-admin-data-test-develop\leds-conectafapes-frontend-admin-data-test-develop\src\views\conecta-fapes"
    )

    # Itera sobre todos os arquivos no diretório especificado
    for vue_file in get_all_files(vue_files_dir, "*.vue"):
        output_relative_path = vue_file.relative_to(vue_files_dir).with_suffix("")
        output_file_path = Path("outputs") / Path("tests_modular") / output_relative_path

        # Lê o conteúdo do arquivo Vue
        vue_code = vue_file.read_text(encoding="utf-8")

        # Cria o Crew para Cypress
        cypress_crew = factory.create_cypress_crew(vue_code)

        # Executa o Crew do Cypress em paralelo 3 vezes
        with ThreadPoolExecutor(max_workers=3) as executor:
            futures = [executor.submit(cypress_crew.kickoff) for _ in range(3)]
            results = [future.result() for future in futures]

        # Cria e executa o Crew do Manager com os resultados obtidos
        manager_crew = factory.create_manager_crew(results, output_file_path)
        manager_crew.kickoff()

if __name__ == "__main__":
    main()
