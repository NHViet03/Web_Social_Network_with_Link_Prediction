
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://21520400:hoangphuc2003@dreamerdb.d0krlb2.mongodb.net/?retryWrites=true&w=majority&appName=DreamerDB"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))


db = client.test

userCollection = db['users']
postCollection = db['posts']
reportCollection = db['reports']
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)