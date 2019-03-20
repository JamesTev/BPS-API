import requests
import json

url = "http://james-tev.local:3010/api/receive_readings"
d =  [{ "inst_flow": 579.6, "inst_vol": 5395.32, "t_offset": 10 },
  { "inst_flow": 520.6, "inst_vol": 1395.32, "t_offset": 20 }]

# payload = "inst_vol=4.5&inst_flow=310&t_offset=30"
payload = json.dumps(d)
headers = {
    'Content-Type': "application/json",
    'Cache-Control': "no-cache",
    'Postman-Token': "91d1cc96-f9a9-a4c8-498d-b4055ac75aa5"
    }

response = requests.request("POST", url, data=payload, headers=headers)

print(response.text)