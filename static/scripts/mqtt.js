//  Author: J. Kaeppel

const client = new Paho.Client("mqtt.broker.lan", 8081, "", "e3dcWebmonitor" + new Date().getTime());
const myTopic = "energy/pv/inverter/e3dc/0/all";

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
client.connect({ onSuccess: onConnect });

let count = 0;
function onConnect() {
  console.log("onConnect");
  client.subscribe(myTopic);
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
  client.connect({ onSuccess: onConnect });
}

function setInnerHtml(id, data) {
	document.getElementById(id).innerText = data
}

function setText(id, data) {
	document.getElementById(id).textContent  = data
	document.getElementById(id).style.fill  = '#f1ebdf'	
}

function setVisible(id, flag) {
	document.getElementById(id).style.visibility = flag?'visible':'hidden';
}
function setHeight(id, height) {
	document.getElementById(id).style.height = height;
}

function onMessageArrived(message) {
  let data = JSON.parse(message.payloadString);
  additionalWb = false;
  anyWbAvailable = false;
  for (const [i, wb] of data.wallbox.wallboxes.entries()) {
	  setVisible("wb0"+i, wb.available);
	  anyWbAvailable |= wb.available;
	  if(i>0) {
		  additionalWb |= wb.available;
	  }
	}
  setVisible("gWALLBOX", additionalWb);

  setVisible("batt25", data.battery.soc > 0);
  setVisible("batt50", data.battery.soc > 25);
  setVisible("batt75", data.battery.soc > 50);
  setVisible("batt100", data.battery.soc > 75);

  setVisible("g4173", data.battery.power < 0);
  setVisible("g4173-9", data.battery.power >= 0);
  setVisible("g4173-98", data.energy.houseConsumption < 0);
  setVisible("g4173-9-3", data.energy.houseConsumption >= 0);
  setVisible("g4173-4", data.pv.pvPower < 0);
  setVisible("g4173-9-7", data.pv.pvPower >= 0);  
  setVisible("g4173-6", (data.wallbox.power > 0) && anyWbAvailable);
  setVisible("g4173-9-75", (data.wallbox.power <= 0) && anyWbAvailable);  
  setVisible("g4173-0", data.energy.gridPower < 0);
  setVisible("g4173-9-71", data.energy.gridPower >= 0);  
  setVisible("g4173-6-7", data.pv.extPower > 0);
  setVisible("g4173-9-75-4", data.pv.extPower <= 0);
  setHeight("auta", 200 - (data.energy.ownConsumption * 2))
  setHeight("soc", 200 - (data.energy.selfSufficiency * 2))

  setText("tspan4336", Math.abs(data.pv.pvPower)+" W");
  setText("tspan4336-9", Math.abs(data.pv.extPower)+" W");
  setText("tspan4336-3", Math.abs(data.energy.gridPower)+" W");
  setText("battext", Math.abs(data.battery.power)+" W");
  setText("tspan4336-82", Math.abs(data.energy.houseConsumption)+" W");
  setText("ak12", Math.abs(data.energy.selfSufficiency)+" %");
  setText("es12", Math.abs(data.energy.ownConsumption)+" %");
  
  setInnerHtml("IDSOLAR", data.pv.pvPower);
  setInnerHtml("IDEXTPM", data.pv.extPower);
  setInnerHtml("IDBATTERY", data.battery.power);
  setInnerHtml("IDTOTPM", data.pv.totalPower);
  setInnerHtml("IDSOC", data.battery.soc);
  setInnerHtml("IDCONS", data.energy.houseConsumption);
  setInnerHtml("IDGRID", data.energy.gridPower);
  setInnerHtml("IDWBPVPCT", Math.round((Math.abs(data.pv.pvPower) / 12810 )*100), 1);
  setInnerHtml("IDWBEXTPCT", Math.round((Math.abs(data.pv.extPower) / 10240 )*100), 1);
  setInnerHtml("IDWBTOTPCT", Math.round(((Math.abs(data.pv.pvPower)+Math.abs(data.pv.extPower)) / 23050 )*100), 1);
  setInnerHtml("IDWBSHDW", Math.round((23050 * Math.max((Math.abs(data.pv.pvPower) / 12810 ),(Math.abs(data.pv.extPower) / 10240)) ) - (Math.abs(data.pv.pvPower)+(Math.abs(data.pv.extPower)))), 1);
  setInnerHtml("IDWBEPAVAIL", (data.ems.emergencyPower.available && data.battery.soc > 0)?'✔':'✘');
  setInnerHtml("IDWBEPACT", data.ems.emergencyPower.active?'✔':'✘');
  setInnerHtml("IDWBCPD", data.ems.energyProductionCapped?'✔':'✘');
  setInnerHtml("IDLASTTS", new Date().toString());
  setInnerHtml("IDWBPWR", data.wallbox.power);  
}
