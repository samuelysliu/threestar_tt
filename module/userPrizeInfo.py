from module.dbInfo import dbInfo
from bson.objectid import ObjectId
import tools

col = dbInfo.userPrize(self='')

class userPrizeInfo:
    def saveUserPrize(self):
        try:
            result = col.insert_one({"address": self["name"], "prizeId": self["info"], "number": self["number"] ,"createdTime": tools.getTimeNow()})

            return result.inserted_id
        except:
            return "failed"

    def getAllUserPrize(self):
        try:
            result = col.find()
            prizeArray = []
            for i in result:
                prizeArray.append({"id": str(i["_id"]), "address": i["name"], "prizeId": i["info"], "number": i["number"]})

            return prizeArray

        except:
            return "failed"

    def getSpecifyUserPrize(self):
        try:
            result = col.find({"_id": ObjectId(str(self["_id"]))})
            i = result[0]
            return {"id": str(i["_id"]), "address": i["name"], "prizeId": i["info"], "number": i["number"]}

        except:
            return "failed"