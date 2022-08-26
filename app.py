import json
from flask import Flask, request, send_from_directory, Response
from flask_restful import Api, Resource
from flask_cors import CORS
from control import threeStar_tt, threeStar_bsc
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='templates/build')
<<<<<<< HEAD
CORS(app, resources={r"/api/.*": {"origins": [os.getenv("REACT_APP_APIPATH")]}})
CORS(app, resources={r"/bsc/.*": {"origins": [os.getenv("REACT_APP_APIPATH")]}})
CORS(app, resources={r"/master/.*": {"origins": ["192.168.100.10"]}})
#CORS(app)
=======
CORS(app, resources={"/api/.*": {"origins": [os.getenv("REACT_APP_APIPATH")]}})
CORS(app, resources={"/bsc/.*": {"origins": [os.getenv("REACT_APP_APIPATH")]}})
CORS(app, resources={"/master/.*": {"origins": ["192.168.100.10"]}})
# CORS(app)
>>>>>>> 1886b53b321086f3682f986e073ca54d5fc18699

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['PROPAGATE_EXCEPTIONS'] = True
api = Api(app)


# Serve React App
@ app.route('/', defaults={'path': ''})
@ app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


class startGame(Resource):
    def post(self):
        data = request.get_json()
        result = threeStar_tt.game(data)
        return result


class starGame_bsc(Resource):
    def post(self):
        data = request.get_json()
        result = threeStar_bsc.game_bsc(data)
        return result


class withdrawThreeStar(Resource):
    def post(self):
        result = threeStar_tt.withdrawThreeStar(request.get_json())
        return result


class withdrawThreeStar_bsc(Resource):
    def post(self):
        result = threeStar_bsc.withdrawThreeStar_bsc(request.get_json())
        return result


class getDividendInfo(Resource):
    def get(self):
        dividends, APR, payout = threeStar_tt.getDividendInfo()
        return {"dividends": dividends, "APR": APR, "payout": str(payout)}


class getDividendInfo_bsc(Resource):
    def get(self):
        dividends, APR, payout = threeStar_bsc.getDividendInfo_bsc()
        return {"dividends": dividends, "APR": APR, "payout": str(payout)}


class claimPrize(Resource):
    def get(self):
        prizeType = request.args.get("prizeType")
        address = request.args.get("address")
        result = threeStar_tt.canClaimBool(prizeType, address)
        return {"result": result}

    def post(self):
        data = request.get_json()
        result = threeStar_tt.claimPrize(data)
        return {"result": result}

<<<<<<< HEAD
=======

class claimPrize_bsc(Resource):
    def get(self):
        prizeType = request.args.get("prizeType")
        address = request.args.get("address")
        result = threeStar_bsc.canClaimBool_bsc(prizeType, address)
        return {"result": result}

    def post(self):
        data = request.get_json()
        result = threeStar_bsc.claimPrize_bsc(data)
        return {"result": result}


class userPrizeList(Resource):
    def get(self):
        playerAddress = request.args.get("playerAddress")
        result = threeStar_tt.getUserPrizeList(playerAddress)
        return {"result": result}


class userPrizeList_bsc(Resource):
    def get(self):
        playerAddress = request.args.get("playerAddress")
        result = threeStar_bsc.getUserPrizeList(playerAddress)
        return result


class lastRound(Resource):
    def get(self):
        result = threeStar_tt.getLastRound()
        return result


class lastRound_bsc(Resource):
    def get(self):
        result = threeStar_bsc.getLastRound()
        return result
>>>>>>> 1886b53b321086f3682f986e073ca54d5fc18699


api.add_resource(startGame, '/api/startGame')
api.add_resource(getDividendInfo, '/api/getDividendInfo')
api.add_resource(withdrawThreeStar, '/master/withdraw')
api.add_resource(claimPrize, '/api/claimPrize')

api.add_resource(starGame_bsc, '/bsc/startGame')
api.add_resource(getDividendInfo_bsc, '/bsc/getDividendInfo')
api.add_resource(withdrawThreeStar_bsc, '/master/withdraw_bsc')

if __name__ == '__main__':
    app.run(app, debug=True, port=int(os.environ.get("PORT", 5000)))
