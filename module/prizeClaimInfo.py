from module.dbInfo import dbInfo
from bson.objectid import ObjectId
import tools
import datetime

col = dbInfo.prizeClaim(self='')

class prizeClaimInfo:
    def savePrizeClaim(self):
        try:
            result = col.insert_one({"address": self["address"], "prizeId": self["prizeId"], "createdTime": tools.getTimeNow()})
            return result.inserted_id
        except:
            return "failed"

    def getAllPrizeClaim(self):
        try:
            result = col.find()
            prizeArray = []
            for i in result:
                prizeArray.append({"id": str(i["_id"]), "address": i["address"], "prizeId": i["prizeId"], "createdTime": i["createdTime"]})

            return prizeArray

        except:
            return "failed"

    def getSpecifyPrize(self):
        try:
            result = col.find({"_id": ObjectId(str(i["_id"]))})
            i = result[0]
            return {"id": str(i["_id"]), "address": i["address"], "prizeId": i["prizeId"], "createdTime": i["createdTime"]}

        except:
            return "failed"

    def getTodayClaim(self):
        try:
            now = tools.getTimeNow()
            start = datetime.datetime(now.strftime("%Y"), now.strftime("%m"), now.strftime("%d"), 0, 0, 0)
            end = datetime.datetime(now.strftime("%Y"), now.strftime("%m"), now.strftime("%d"), 23, 59, 59)
            result = col.find({"createdTime":{"$gte": start, "lte": end}})

            todayPrizeClaimArray = []
            for i in result:
                todayPrizeClaimArray.append({"id": str(i["_id"]), "address": i["address"], "prizeId": i["prizeId"], "createdTime": i["createdTime"]})
            return todayPrizeClaimArray
        except:
            return "failed"