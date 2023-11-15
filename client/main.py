import json
import inquirer
import os
from datetime import datetime
from api import Api

api = Api()

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def print_header(title):
    char_count=72
    clear_screen()
    print('-' * char_count)
    print(title.center(char_count - 2, ' ').center(char_count, '|'))
    print('-' * char_count)

def welcome_page():
    print_header('Welcome to UMob game')
    action = inquirer.list_input("Do you have an account?", choices=['Login', 'Register'])
    if action == "Login":
        login_page()
    else:
        register_page()

def login_page():
    print_header('Login')
    username = inquirer.text("Enter your username")
    password = inquirer.password("Enter your password")
    result = api.login(username, password)
    if result:
        home_page()
    else:
        handle_failed_login()

def register_page():
    print_header('Register')
    username = inquirer.text("Enter your username")
    password = inquirer.password("Enter your password")
    result = api.register(username, password)
    if result:
        home_page()
    else:
        handle_failed_registration()

def handle_failed_login():
    print("\n")
    action = inquirer.confirm("Login failed! Do you want to try again?", default=True)
    if action:
        login_page()
    else:
        welcome_page()

def handle_failed_registration():
    print("\n")
    action = inquirer.confirm("Registration failed! Do you want to try again?", default=True)
    if action:
        register_page()
    else:
        welcome_page()

def home_page():
    print_header('Home')
    print('* Leaderboard *')
    print_leaderboard()
    print('\n* Your top games *')
    print_user_games()
    print('\n')

    action = inquirer.list_input("What do you want to do?", choices=['Play', 'Export'])
    if action == "Play":
        play_page()
    else:
        export_page()

def export_page():
    print_header('Export')
    
    dir_path = os.path.dirname(os.path.realpath(__file__))
    file_path = os.path.join(dir_path, "export.json")
    questions = [
        inquirer.Path("file_path", message="Where to save?", default=file_path, path_type=inquirer.Path.FILE)
    ]
    answers = inquirer.prompt(questions)
    file_path = answers["file_path"]
    
    result = api.getExport()
    with open(file_path, 'w') as outfile:
        json.dump(result, outfile, indent=4)
    print("Exported successfully!")
    
    action = inquirer.confirm("Go back to home?", default=True)
    if action:
        home_page()

def print_leaderboard():
    result = api.getLeaderboard()
    for game in result:
        user = str(game["user"]).ljust(8, ' ')
        score = str(game["score"]).rjust(4, ' ')
        print((user + ' -> ' + score))

def print_user_games():
    result = api.getMyGames()
    for game in result:
        dt_object = datetime.strptime(game["createdAt"], "%Y-%m-%dT%H:%M:%S.%fZ")
        created_at = dt_object.strftime("%m/%d %H:%M")
        score = str(game["score"]).rjust(4, ' ')
        print((created_at + ' -> ' + score))

def play_page():
    print_header('Play')

    result = api.startGame()
    game = result["game"]
    game_id = game["id"]
    next_question = result["nextQuestion"]

    while True:
        print_header('Play')
        if game["status"] == "finished":
            print_game_result(game)
            break

        print_game_status(game["score"], next_question["questionOrder"], game["questionCount"], result["remainingTime"])
        choice = inquirer.list_input(next_question["title"], choices=next_question["choices"])
        choice_index = next_question["choices"].index(choice)
        result = api.answerQuestion(game_id, choice_index)
        game = result["game"]
        next_question = result["nextQuestion"]
    
    action = inquirer.confirm("Go back to home?", default=True)
    if action:
        home_page()

def print_game_result(game):
    print("\n")
    if game["score"] > 0:
        print("YOU WON!".center(72, ' '))
    else:
        print("YOU LOST!".center(72, ' '))
    print("\n")
    print(("You scored " + str(game["score"]) + " points.").center(72, ' '))
    print("\n")

def print_game_status(score, question_order, question_count, remaining_time):
    score = (" Score: " + str(score)).ljust(24, ' ')
    progress = (str(question_order + 1) + "/" + str(question_count) + " ").center(24, ' ')
    remaining_time = ("Time: " + str(remaining_time) + " s ").rjust(24, ' ')
    print(score + progress + remaining_time)
    print("\n")

if __name__ == "__main__":
    welcome_page()
