import json
from flask import Flask, request, send_from_directory, Response
from flask_restful import Api, Resource
from flask_cors import CORS
from control import threeStar
import os

app = Flask(__name__, static_folder='templates/build')
#CORS(app, resources={r"/.*": {"origins": ["https://three-star.herokuapp.com/"]}})
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
        result = threeStar.game(data['userLuckyNum'])
        return result

class sendPrize(Resource):
    def post(self):
        data = request.get_json()
        result = threeStar.sendPrize(data['winner'], data['point'])

        if result == "success":
            return {"result": "success"}
        else:
            return {"result": "failed"}

"""
class setReward(Resource):
    def post(self):
        try:
            privateKey = request.get_json()['privateKey']
            result = threeStar.setReward(privateKey)
            if result == "failed":
                return Response(
                    json.dumps(
                        {"message": "The method is not allowed for the requested URL.", "code": 400, "status": "FAIL"}),
                    mimetype="application/json",
                    status=400
                )

            else:
                return {"result": result}

        except:
            return Response(
                json.dumps(
                    {"message": "The method is not allowed for the requested URL.", "code": 400, "status": "FAIL"}),
                mimetype="application/json",
                status=400
            )
"""

class getDividendInfo(Resource):
    def get(self):
        dividends, APR, payout = threeStar.getDividendInfo()
        return {"dividends": dividends, "APR": APR, "payout": str(payout)}

api.add_resource(startGame, '/startGame')
api.add_resource(sendPrize, '/sendPrize')
#api.add_resource(setReward, '/mastetSetReward')
api.add_resource(getDividendInfo, '/getDividendInfo')


if __name__ == '__main__':
    app.run(app, debug=True, port=int(os.environ.get("PORT", 5000)))
