from module.dbInfo import dbInfo
from bson.objectid import ObjectId
import tools

col = dbInfo.userPrize(self='')


class userPrizeInfo:
    def saveUserPrize(self):
        result = col.insert_one(
            {"address": self["address"], "prizeId": ObjectId(self["prizeId"]), "chainName": self["chainName"],
             "number": self["number"], "createdTime": tools.getTimeNow()})

        return result.inserted_id
        try:
            result = col.insert_one({"address": self["address"], "prizeId": ObjectId(
                self["prizeId"]), "chainName": self["chainName"], "number": self["number"], "createdTime": tools.getTimeNow()})

            return result.inserted_id
        except:
            return "failed"

    def updateUserPrize(self):
        try:
            col.update_one(self["myquery"], self["newValues"])
            return "success"
        except:
            return "failed"

    def getAllUserPrize(self):
        try:
            result = col.find()
            userPrizeArray = []
            for i in result:
                userPrizeArray.append({"id": str(i["_id"]), "address": i["address"], "prizeId": str(
                    i["prizeId"]), "chainName": i["chainName"], "number": i["number"]})

            return userPrizeArray

        except:
            return "failed"

    def getSpecifyUserPrize(self):
        try:
            result = col.find({"_id": ObjectId(str(self["_id"]))})
            i = result[0]
            return {"id": str(i["_id"]), "address": i["address"], "prizeId": str(i["prizeId"]), "chainName": i["chainName"], "number": i["number"]}

        except:
            return "failed"

    def getUserPrizeByAddress(self):
        try:
            result = col.find({"address": self["address"]})

            userPrizeArray = []
            for i in result:
                userPrizeArray.append(
                    {"id": str(i["_id"]), "address": i["address"], "prizeId": str(i["prizeId"]), "chainName": i["chainName"],
                     "number": i["number"]})

            return userPrizeArray

        except:
            return "failed"
