from module.dbInfo import dbInfo
from bson.objectid import ObjectId
import tools

col = dbInfo.transactionHash(self='')

class transactionInfo:
    def saveTransaction(self):
        try:
            result = col.insert_one({"address": self["address"], "hash": self["hash"], "chainName": self["chainName"], "createdTime": tools.getTimeNow()})

            return result.inserted_id
        except:
            return "failed"


    def getTransactionByHash(self):
        try:
            result = col.find({"hash": self["hash"]})
            transactionList = []
            for i in result:
                transactionList.append({"id": str(i["_id"]), "address": i["address"], "hash": i["hash"], "chainName": i["chainName"], "createdTime": tools.getTimeNow()})
            return transactionList

        except:
            return "failed"
