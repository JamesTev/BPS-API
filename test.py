import requests
import json

url = "http://james-tev.local:3010/api/receive_readings"
d =  [{ "inst_flow": 82, "inst_vol": 2.2, "t_offset": 10 },
      { "inst_flow": 75, "inst_vol": 5.3, "t_offset": 20 },
      { "inst_flow": 77, "inst_vol": 10.2, "t_offset": 30 },
      { "inst_flow": 95, "inst_vol": 17.2, "t_offset": 40 },
      { "inst_flow": 120, "inst_vol": 23.2, "t_offset": 50 },
      { "inst_flow": 105, "inst_vol": 30.21, "t_offset": 60 },
      { "inst_flow": 82, "inst_vol": 35.61, "t_offset": 70 },
      { "inst_flow": 52, "inst_vol": 40.12, "t_offset": 80 },
      { "inst_flow": 12, "inst_vol": 42, "t_offset": 90 }]

# payload = "inst_vol=4.5&inst_flow=310&t_offset=30"
payload = json.dumps(d)
headers = {
    'Content-Type': "application/json",
    'Cache-Control': "no-cache",
    'Postman-Token': "91d1cc96-f9a9-a4c8-498d-b4055ac75aa5"
    }

response = requests.request("POST", url, data=payload, headers=headers)

print(response.text)