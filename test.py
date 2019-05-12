import requests
import json

url = "http://james-tev.local:3010/api/receive_readings"
d =  [{"f":9.828,"v":1.12644,"t":0},{"f":9.6768,"v":2.709,"t":10},{"f":9.6768,"v":4.3218,"t":20},{"f":9.828,"v":5.95224,"t":30},{"f":9.828,"v":7.59024,"t":40},{"f":9.828,"v":9.22572,"t":50},{"f":9.828,"v":10.8612,"t":60},{"f":9.828,"v":12.49668,"t":70},{"f":9.828,"v":14.13468,"t":80},{"f":9.979199,"v":15.77268,"t":90},{"f":9.828,"v":17.41068,"t":100},{"f":9.828,"v":19.05372,"t":110},{"f":9.828,"v":20.69424,"t":120},{"f":9.6768,"v":22.32972,"t":130},{"f":9.828,"v":23.97276,"t":140},{"f":9.828,"v":25.6032,"t":150},{"f":9.6768,"v":27.23364,"t":160},{"f":9.828,"v":28.86408,"t":170},{"f":9.979199,"v":30.50712,"t":180},{"f":9.979199,"v":32.15772,"t":190},{"f":9.828,"v":33.80832,"t":200},{"f":9.6768,"v":35.44884,"t":210},{"f":9.828,"v":37.08432,"t":220},{"f":9.828,"v":38.72484,"t":230},{"f":9.979199,"v":40.3704,"t":240},{"f":9.979199,"v":42.01596,"t":250},{"f":9.979199,"v":43.66908,"t":260},{"f":9.828,"v":45.31716,"t":270},{"f":9.979199,"v":46.96776,"t":280},{"f":9.828,"v":48.61836,"t":290},{"f":9.979199,"v":50.27148,"t":300},{"f":9.828,"v":51.91956,"t":310},{"f":9.979199,"v":53.57016,"t":320},{"f":9.828,"v":55.21068,"t":330},{"f":9.2232,"v":56.83104,"t":340},{"f":7.4088,"v":58.17672,"t":350},{"f":7.1064,"v":59.35356,"t":360},{"f":7.1064,"v":60.5304,"t":370},{"f":7.1064,"v":61.71228,"t":380},{"f":7.1064,"v":62.88912,"t":390},{"f":6.9552,"v":64.06092,"t":400},{"f":6.9552,"v":65.23272,"t":410},{"f":6.9552,"v":66.40452,"t":420},{"f":6.9552,"v":67.57884,"t":430},{"f":6.9552,"v":68.7582,"t":440},{"f":7.1064,"v":69.94008,"t":450},{"f":7.1064,"v":71.12196,"t":460},{"f":6.9552,"v":72.2988,"t":470},{"f":7.1064,"v":73.47564,"t":480},{"f":7.1064,"v":74.655,"t":490},{"f":7.1064,"v":75.83184,"t":500},{"f":0,"v":76.18464,"t":510}]

# payload = ""v"=4.5&"f"=310&"t"=30"
payload = json.dumps(d)
headers = {
    'Content-Type': "application/json",
    'Cache-Control': "no-cache",
    'Postman-Token': "91d1cc96-f9a9-a4c8-498d-b4055ac75aa5"
    }

response = requests.request("POST", url, data=payload, headers=headers)

print(response.text)