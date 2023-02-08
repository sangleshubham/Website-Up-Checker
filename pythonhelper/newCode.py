import urllib
import requests
from concurrent.futures.thread import ThreadPoolExecutor
import pymongo



client = pymongo.MongoClient("MONGOURI")
db = client.test

mydb = client.nodeexpressproject
mycol = mydb["proxyList"]

data = requests.get("https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all").content

proxyList  = str(data).split("\\r\\n")[:-1]
workingProxy = []


def sentToMongo(obj):
    mycol.insert_one(obj)
    
    
def get_location(ip_address):
    response = requests.get(f'https://ipapi.co/{ip_address}/json/').json()
    location_data = {
        "ip": ip_address,
        "city": response.get("city"),
        "region": response.get("region"),
        "country": response.get("country_name")
    }
    return location_data

    
def getIpLocation(ip):
    return get_location(ip)
    pass

def is_bad_proxy(pip):    
    try:        
        proxy_handler = urllib.request.ProxyHandler({'http': pip})        
        opener = urllib.request.build_opener(proxy_handler)
        opener.addheaders = [('User-agent', 'Mozilla/5.0')]
        urllib.request.install_opener(opener)        
        sock=urllib.request.urlopen('http://www.google.com')  
    except urllib.error.HTTPError as e:
        return e.code
    except Exception as detail:
        return 1
    print(f"Found {pip}")
    data = getIpLocation(pip.split(':')[0])
    data["port"] = pip.split(':')[1]
    sentToMongo(data)
    workingProxy.append(pip)


with ThreadPoolExecutor(max_workers=100) as executor:
    for item in proxyList:
        executor.submit(is_bad_proxy , item)
        