import json
from flask import Flask, request, send_from_directory, redirect
from flask_restful import Api, Resource
from flask_cors import CORS
from control.threeStar import threeStar
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='templates/build')

CORS(app, resources={r"/api/.*": {"origins": [os.getenv("REACT_APP_APIPATH")]}})
CORS(app, resources={r"/bsc/.*": {"origins": [os.getenv("REACT_APP_APIPATH")]}})
CORS(app, resources={r"/master/.*": {"origins": ["192.168.100.10"]}})
#CORS(app)


app.config['CORS_HEADERS'] = 'Content-Type'
app.config['PROPAGATE_EXCEPTIONS'] = True
api = Api(app)


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')



@app.before_request
def before_request():
    if not request.is_secure:
        return redirect(request.url.replace('http://', 'https://'))


class startGame(Resource):
    def __init__(self):
        self.threeStar = threeStar("thunderCore")
    def post(self):
        data = request.get_json()
        result = self.threeStar.game(data)
        return result


class starGame_bsc(Resource):
    def __init__(self):
        self.threeStar = threeStar("bsc")
    def post(self):
        data = request.get_json()
        result = self.threeStar.game(data)
        return result


class withdrawThreeStar(Resource):
    def __init__(self):
        self.threeStar = threeStar("thunderCore")
    def post(self):
        result = self.threeStar.withdrawThreeStar(request.get_json())
        return result


class withdrawThreeStar_bsc(Resource):
    def __init__(self):
        self.threeStar = threeStar("bsc")
    def post(self):
        result = self.threeStar.withdrawThreeStar(request.get_json())
        return result


class getDividendInfo(Resource):
    def __init__(self):
        self.threeStar = threeStar("thunderCore")
    def get(self):
        dividends, APR, payout, totalStake, roundNumber = self.threeStar.getDividendInfo()
        return {"dividends": dividends, "APR": APR, "payout": str(payout), "totalStake": totalStake, "roundNumber": roundNumber}


class getDividendInfo_bsc(Resource):
    def __init__(self):
        self.threeStar = threeStar("bsc")
    def get(self):
        dividends, APR, payout, totalStake, roundNumber = self.threeStar.getDividendInfo()
        return {"dividends": dividends, "APR": APR, "payout": str(payout), "totalStake": totalStake, "roundNumber": roundNumber}


class claimPrize(Resource):
    def __init__(self):
        self.threeStar = threeStar("thunderCore")
    def get(self):
        prizeType = request.args.get("prizeType")
        address = request.args.get("address")
        result = self.threeStar.canClaimBool(prizeType, address)
        return {"result": result}

    def post(self):
        data = request.get_json()
        result = self.threeStar.claimPrize(data)
        return {"result": result}


class claimPrize_bsc(Resource):
    def __init__(self):
        self.threeStar = threeStar("bsc")
    def get(self):
        prizeType = request.args.get("prizeType")
        address = request.args.get("address")
        result = self.threeStar.canClaimBool(prizeType, address)
        return {"result": result}

    def post(self):
        data = request.get_json()
        result = self.threeStar.claimPrize(data)
        return {"result": result}


class userPrizeList(Resource):
    def __init__(self):
        self.threeStar = threeStar("thunderCore")
    def get(self):
        playerAddress = request.args.get("playerAddress")
        result = self.threeStar.getUserPrizeList(playerAddress)
        return {"result": result}


class userPrizeList_bsc(Resource):
    def __init__(self):
        self.threeStar = threeStar("bsc")
    def get(self):
        playerAddress = request.args.get("playerAddress")
        result = self.threeStar.getUserPrizeList(playerAddress)
        return result


class lastRound(Resource):
    def __init__(self):
        self.threeStar = threeStar("thunderCore")
    def get(self):
        result = self.threeStar.getLastRound()
        return result


class lastRound_bsc(Resource):
    def __init__(self):
        self.threeStar = threeStar("bsc")
    def get(self):
        result = self.threeStar.getLastRound()
        return result


api.add_resource(startGame, '/api/startGame')
api.add_resource(getDividendInfo, '/api/getDividendInfo')
api.add_resource(withdrawThreeStar, '/master/withdraw')
api.add_resource(claimPrize, '/api/claimPrize')
api.add_resource(userPrizeList, '/api/userPrizeList')
api.add_resource(lastRound, '/api/lastRound')

api.add_resource(starGame_bsc, '/bsc/startGame')
api.add_resource(getDividendInfo_bsc, '/bsc/getDividendInfo')
api.add_resource(withdrawThreeStar_bsc, '/master/withdraw_bsc')
api.add_resource(claimPrize_bsc, '/bsc/claimPrize')
api.add_resource(userPrizeList_bsc, '/bsc/userPrizeList')
api.add_resource(lastRound_bsc, '/bsc/lastRound')

if __name__ == '__main__':
    app.run(app, debug=True, port=int(os.environ.get("PORT", 5000)))
