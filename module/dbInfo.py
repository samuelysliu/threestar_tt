import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()
conn = MongoClient(os.getenv('mongoDB'))

db = conn[os.getenv('dbName')]

class dbInfo:
    #all prize list
    def prize(self):
        col = db["prize"]
        return col

    #all prize claim history
    def prizeClaim(self):
        col = db["prizeClaim"]
        return col

    #user have prize
    def userPrize(self):
        col = db["userPrize"]
        return col

    def transactionHash(self):
        col = db["transactionHash"]
        return col

    def dividendRound(self):
        col = db["dividendRound"]
        return col

    def dividendRound_bsc(self):
        col = db["dividendRound_bsc"]
        return col