from module.dbInfo import dbInfo
from bson.objectid import ObjectId
import tools

col = dbInfo.prize(self='')

class prizeInfo:
    def savePrize(self):
        try:
            result = col.insert_one({"name": self["name"], "info": self["info"], "createdTime": tools.getTimeNow()})
            return result.inserted_id
        except:
            return "failed"

    def getAllPrize(self):
        try:
            result = col.find()
            prizeArray = []
            for i in result:
                prizeArray.append({"id": str(i["_id"]), "name": i["name"], "info": i["info"]})

            return prizeArray

        except:
            return "failed"

    def getSpecifyPrize(self):
        try:
            result = col.find({"_id": ObjectId(str(self["_id"]))})
            i = result[0]
            return {"id": str(i["_id"]), "name": i["name"], "info": i["info"]}

        except:
            return "failed"

    def getPrizeByName(self):
        try:
            result = col.find({"name": self["name"]})
            i = result[0]
            return {"id": str(i["_id"]), "name": i["name"], "info": i["info"]}

        except:
            return "failed"