from flask import Flask
from flask_restful import Resource, Api
from flask_restful.reqparse import RequestParser
from flask_pymongo import PyMongo

#Create Flask App
app = Flask(__name__)

#Configure DB settings
app.config['MONGO_DBNAME'] = "water_pollution"
app.config['MONGO_URI'] = "mongodb://159.89.170.247:27017/water_pollution"

#Create a mongo instance
mongo = PyMongo(app)

#Create an api instance
api = Api(app) #prefix = '/api'

#Create JSON Parser
dataParser = RequestParser(bundle_errors=True)

dataParser.add_argument("dev_id")
dataParser.add_argument("payload_fields", type=dict)
dataParser.add_argument("metadata", type=dict)

payloadParser = RequestParser()
payloadParser.add_argument("DO", type=int, location='payload_fields')
payloadParser.add_argument("hum", type=int, location='payload_fields')
payloadParser.add_argument("temp", type=int, location='payload_fields')
payloadParser.add_argument("turbidity", type=int, location='payload_fields')

metadataParser = RequestParser()
metadataParser.add_argument("time", location='metadata')


#Create Resource for data
class waterData(Resource):
    def get(self):
        data = mongo.db.data
        output = []
        for q in data.find().sort("_id",-1).limit(15):
	    output.append({'date' : q['date'],'time' : q['time'],'hum' : q['hum'],'temp' : q['temp'],'turbidity' : q['turbidity'],'DO' : q['DO']})
        return output

    def post(self):
        request = dataParser.parse_args()
        payload = payloadParser.parse_args(req=request)
        metaData = metadataParser.parse_args(req=request)
        dateTimeStr = metaData['time']
        dateTime = dateTimeStr.split("T")
        date = dateTime[0]
        time = dateTime[1].split(".")[0]
        new_data = {
            'dev_id' : request['dev_id'],
            'DO' : payload['DO'],
	    'hum' : payload['hum'],
	    'temp' : payload['temp'],
	    'turbidity' : payload['turbidity'],
            'date' : date,
            'time' : time
        }
        data = mongo.db.data
        post_id = data.insert(new_data)
        post_inserted = data.find_one({'_id' : post_id})
        new_data = {
            'dev_id' : post_inserted['dev_id'],
            'DO' : post_inserted['DO'],
	    'hum' : post_inserted['hum'],
	    'temp' : post_inserted['temp'],
	    'turbidity' : post_inserted['turbidity'],
	    'date' : post_inserted['date'],
            'time' : post_inserted['time']
        }
        return { "success":True, "data":new_data }, 201

#Add the resource to the API
api.add_resource(waterData, "/data")

if __name__ == "__main__":
    app.run()

