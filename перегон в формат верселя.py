import os

# Получаем текущую директорию, в которой находится скрипт
current_directory = os.path.dirname(os.path.abspath(__file__))

# Сначала переименовываем файлы с .php.html на .html
for filename in os.listdir(current_directory):
    if ".php.html" in filename:
        new_filename = filename.replace(".php.html", ".html")
        old_path = os.path.join(current_directory, filename)
        new_path = os.path.join(current_directory, new_filename)
        os.rename(old_path, new_path)
        print(f'Renamed: {filename} -> {new_filename}')

# Теперь переименовываем файлы с .htm на .html
for filename in os.listdir(current_directory):
    if filename.endswith(".htm"):
        new_filename = filename[:-4] + ".html"
        old_path = os.path.join(current_directory, filename)
        new_path = os.path.join(current_directory, new_filename)
        os.rename(old_path, new_path)
        print(f'Renamed: {filename} -> {new_filename}')

print("Файлы переименованы! Теперь начинаем замену внутри файлов...")

# Теперь обрабатываем содержимое всех .html файлов
for filename in os.listdir(current_directory):
    if filename.endswith(".html"):
        file_path = os.path.join(current_directory, filename)

        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # Делаем замены
        content = content.replace("index.htm", "/")
        content = content.replace(".php.html", ".html")

        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)

        print(f'Обработан файл: {filename}')

print("Все замены завершены!")