import requests
import matplotlib.pyplot as plt

reading_endpoint = "http://localhost:3010/bps/get_reading_set/"
res = requests.get(reading_endpoint+str(2), timeout=5).json()
flow_readings = []
time = []

for obj in res:
    flow_readings.append(float(obj["inst_flow_rate"]))
    time.append(float(obj["t_offset"]))

print(time)
plt.plot(flow_readings, time)
plt.xlabel('time [s]')
plt.ylabel('flow rate [ml/s]')