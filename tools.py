import datetime, pytz

def getTimeNow():
    return datetime.datetime.now(pytz.timezone('GMT'))