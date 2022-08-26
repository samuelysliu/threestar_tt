from module.dbInfo import dbInfo
import tools

col = dbInfo.dividendRound(self='')


class dividendRoundInfo:
    def saveDividendRound(self):
        try:
            result = col.insert_one(
                {"roundNumber": self["Round"], "payout": self["payout"], "totalStake": self["totalStake"],
                 "APR": self["APR"], "dividend": self["dividend"], "createdTime": tools.getTimeNow()})
            return result.inserted_id
        except:
            return "failed"

    def getAllRound(self):
        try:
            result = col.find()
            prizeArray = []
            for i in result:
                prizeArray.append(
                    {"id": str(i["_id"]), "roundNumber": i["roundNumber"], "payout": i["payout"],
                     "totalStake": i["totalStake"], "APR": i["APR"],
                     "dividend": i["dividend"], "createdTime": i["createdTime"]})

            return prizeArray

        except:
            return "failed"

    def getLastRound(self):
        try:
            result = col.find().sort("_id", -1).limit(1)
            if int(result.count()) > 0:
                i = result[0]
                return {"id": str(i["_id"]), "roundNumber": i["roundNumber"], "payout": i["payout"],
                        "totalStake": i["totalStake"], "APR": i["APR"],
                        "dividend": i["dividend"], "createdTime": i["createdTime"]}
            else:
                return {"id": 0, "roundNumber": 0, "payout": 0,
                        "totalStake": 0, "APR": 0,
                        "dividend": 0, "createdTime": 0}
        except:
            return "failed"

    def getRoundByNumber(self):
        try:
            result = col.find({"roundNumber": self["roundNumber"]})
            i = result[0]
            return {"id": str(i["_id"]), "roundNumber": i["roundNumber"], "payout": i["payout"],
                    "totalStake": i["totalStake"], "APR": i["APR"],
                    "dividend": i["dividend"], "createdTime": i["createdTime"]}

        except:
            return "failed"
