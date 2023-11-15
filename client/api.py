import requests
import json

BASE_URL = "https://umob.ogin.io/api"

class Api:
    def __init__(self):
        self.token = None

    def get(self, url):
        headers = {}
        if self.token is not None:
            headers = {'Authorization': 'Bearer ' + self.token}
        response = requests.get(url=BASE_URL + url, headers=headers)
        if response.status_code > 299 or response.status_code < 200:
            return False
        
        return json.loads(response.text)

    def post(self, url, body):
        headers = {}
        if self.token is not None:
            headers = {'Authorization': 'Bearer ' + self.token}
        response = requests.post(url=BASE_URL + url, json=body, headers=headers)
        if response.status_code > 299 or response.status_code < 200:
            return False
        
        return json.loads(response.text)
    
    def register(self, name, username, password):
        body = {
            "name": name,
            "username": username,
            "password": password
        }
        response = self.post("/auth/register", body)
        if response is False:
            return False
        self.token = response["token"]
        self.user = response["user"]
        return True
    
    def login(self, username, password):
        body = {
            "username": username,
            "password": password
        }
        response = self.post("/auth/login", body)
        if response is False:
            return False
        self.token = response["token"]
        self.user = response["user"]
        return True
    
    def startGame(self):
        response = self.post("/games", {})
        return response
    
    def answerQuestion(self, gameId, choiceIndex):
        body = {
            "choiceIndex": choiceIndex
        }
        response = self.post("/games/" + str(gameId) + "/answer", body)
        return response
    
    def getMyGames(self):
        response = self.get("/games")
        return response
    
    def getExport(self):
        response = self.get("/games/export")
        return response
    
    def getLeaderboard(self):
        response = self.get("/games/leaderboard")
        return response
