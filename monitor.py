#  Author: J. Kaeppel

from flask import *
import paho.mqtt.client as mqtt
from datetime import datetime
import logging

app = Flask(__name__)

FORMAT = ('%(asctime)-15s %(threadName)-15s '
          '%(levelname)-8s %(module)-15s:%(lineno)-8s %(message)s')
logging.basicConfig(format=FORMAT)
log = logging.getLogger()
log.setLevel(logging.ERROR)
logging.getLogger('werkzeug').setLevel(logging.ERROR)


def on_message(client, userdata, msg):
    client.e3dc = json.loads(msg.payload)
    client.lastTimestamp = datetime.now().strftime("%d.%m.%y %H:%M:%S")


mqttClient = mqtt.Client()
mqttClient.e3dc = None
mqttClient.lastTimestamp = None
mqttClient.connect('mqtt-broker.server.lan')
mqttClient.subscribe('energy/pv/inverter/e3dc/0/all')
mqttClient.on_message = on_message
mqttClient.loop_start()


@app.route('/')
def index():
    if mqttClient.e3dc is None:
        return "No Data yet, reload"
    return render_template('/monitor.html', title='Home', e3dc=mqttClient.e3dc, timestamp=mqttClient.lastTimestamp)


app.run(host='0.0.0.0', port='80', debug=False)
