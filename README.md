# E3DC Monitor
E3DC Webmonitor</br>
Subscribes to data via MQTT</br>

<h3>set MQTT broker address (replace "mqtt.broker.lan")</h3>
<h4>scripts/mqtt.js:</h4>
Line 3: const client = new Paho.Client("mqtt.broker.lan", 8081, "", "e3dcWebmonitor" + new Date().getTime());</br>
<h4>scripts/monitor.py:</h4>
Line 26: mqttClient.connect('mqtt.broker.lan')<br>
<h3>set MQTT topic (replace "energy/pv/inverter/e3dc/0/all")</h3>
<h4>scripts/mqtt.js:</h4>
Line 4: const myTopic = "energy/pv/inverter/e3dc/0/all";<br>
<h4>scripts/monitor.py:</h4>
Line 27: mqttClient.subscribe('energy/pv/inverter/e3dc/0/all')<br>

