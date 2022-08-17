import json
from flask import Flask, request, send_from_directory, Response
from flask_restful import Api, Resource
from flask_cors import CORS
from control import threeStar
import os

app = Flask(__name__, static_folder='templates/build')
# CORS(app, resources={r"/api/.*": {"origins": ["https://three-star.herokuapp.com/"]}})
# CORS(app, resources={r"/bsc/.*": {"origins": ["https://three-star.herokuapp.com/"]}})
CORS(app, resources={r"/master/.*": {"origins": ["192.168.100.19"]}})
CORS(app)

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


class startGame(Resource):
    def post(self):
        data = request.get_json()
        result = threeStar.game(data)
        return result


class starGame_bsc(Resource):
    def post(self):
        data = request.get_json()
        result = threeStar.game_bsc(data)
        return result


class withdrawThreeStar(Resource):
    def post(self):
        result = threeStar.withdrawThreeStar(request.get_json())
        return result

class withdrawThreeStar_bsc(Resource):
    def post(self):
        result = threeStar.withdrawThreeStar_bsc(request.get_json())
        return result


class getDividendInfo(Resource):
    def get(self):
        dividends, APR, payout = threeStar.getDividendInfo()
        return {"dividends": dividends, "APR": APR, "payout": str(payout)}

class getDividendInfo_bsc(Resource):
    def get(self):
        dividends, APR, payout = threeStar.getDividendInfo_bsc()
        return {"dividends": dividends, "APR": APR, "payout": str(payout)}

api.add_resource(startGame, '/api/startGame')
api.add_resource(getDividendInfo, '/api/getDividendInfo')
api.add_resource(withdrawThreeStar, '/master/withdraw')

api.add_resource(starGame_bsc, '/bsc/startGame')
api.add_resource(getDividendInfo_bsc, '/bsc/getDividendInfo')
api.add_resource(withdrawThreeStar_bsc, '/master/withdraw_bsc')

if __name__ == '__main__':
    app.run(app, debug=True, port=int(os.environ.get("PORT", 5000)))
