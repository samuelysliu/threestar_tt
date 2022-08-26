from module.dbInfo import dbInfo
import tools


class dividendRoundInfo:
    def __init__(self, chain):
        if chain == "thunderCore":
            self.col = dbInfo.dividendRound(self='')
        elif chain == "bsc":
            self.col = dbInfo.dividendRound_bsc(self='')

    def saveDividendRound(self, roundInfo):
        try:
            result = self.col.insert_one(
                {"roundNumber": roundInfo["roundNumber"], "payout": roundInfo["payout"],
                 "totalStake": float(roundInfo["totalStake"]), "APR": roundInfo["APR"],
                 "dividend": roundInfo["dividend"], "createdTime": tools.getTimeNow()})
            return result.inserted_id
        except:
            return "failed"

    def getAllRound(self):
        try:
            result = self.col.find()
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
            cursorLen = self.col.count_documents({})
            if cursorLen > 0:
                result = self.col.find().sort("_id", -1).limit(1)
                i = result[0]
                return {"id": str(i["_id"]), "roundNumber": i["roundNumber"], "payout": i["payout"],
                        "totalStake": round(i["totalStake"], 5), "APR": i["APR"],
                        "dividend": round(float(i["dividend"]), 5), "createdTime": i["createdTime"]}
            else:
                return {"id": 0, "roundNumber": 0, "payout": 0,
                        "totalStake": 0, "APR": 0,
                        "dividend": 0, "createdTime": 0}
        except:
            return {"id": 0, "roundNumber": 0, "payout": 0,
                    "totalStake": 0, "APR": 0,
                    "dividend": 0, "createdTime": 0}

    def getRoundByNumber(self):
        try:
            result = self.col.find({"roundNumber": self["roundNumber"]})
            i = result[0]
            return {"id": str(i["_id"]), "roundNumber": i["roundNumber"], "payout": i["payout"],
                    "totalStake": i["totalStake"], "APR": i["APR"],
                    "dividend": i["dividend"], "createdTime": i["createdTime"]}

        except:
            return "failed"
