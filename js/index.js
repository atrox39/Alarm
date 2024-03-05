function EqualString(first, second) {
  return first.toLowerCase().trim() === second.toLowerCase().trim();
}

function DifString(first, second) {
  return first.toLowerCase().trim() !== second.toLowerCase().trim();
}

function GetTime24()
{
  const now = new Date();
  let hours = now.getHours();
  hours = hours < 10 ? `0${hours}` : `${hours}`;
  let minutes = now.getMinutes();
  minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minutes}`;
}

class Alarm {
  constructor(title, time = "12:00", activated = false)
  {
    this.title = title;
    this.time = time;
    this.activated = activated;
  }

  active() {
    let currentTime = GetTime24();
    if (currentTime === this.time){
      return true;
    }
    return false;
  }

  toJsonString() {
    return JSON.stringify({
      title: this.title,
      activation: this.time,
      activated: this.activated,
    });
  }
}

const db = {
  getAllAlarmsJSON: function() {
    return JSON.parse(localStorage.getItem('alarms') ?? '[]');
  },
  addAlarm: function(alarm) {
    const alarms = this.getAllAlarmsJSON();
    let exists = false;
    for(let i=0; i<alarms.length;i++) {
      if (EqualString(alarm.title, alarms[i].title)) {
        console.log(alarms[i]);
        exists = true;
        break;
      }
    }
    if (exists){
      alert('Alarm already exists')
      return;
    }
    alarms.push({
      title: alarm.title,
      activation: alarm.time,
      activated: alarm.activated,
    });
    localStorage.setItem('alarms', JSON.stringify(alarms));
  },
  getAllAlarms: function () {
    const alarms = this.getAllAlarmsJSON();
    return alarms.map((a) => new Alarm(a.title, a.activation, a.activated));
  },
  removeAlarm: function(title) {
    const alarms = this.getAllAlarmsJSON();
    localStorage.setItem('alarms', JSON.stringify(alarms.filter((a) => DifString(a.title, title))));
  },
  updateAlarm: function(title, hour = '12:00', activated = false) {
    const alarms = this.getAllAlarmsJSON();
    const index = alarms.findIndex((a) => EqualString(a.title, title));
    if (index !== -1) {
      alarms[index].activation = hour;
      alarms[index].activated = activated;
      localStorage.setItem('alarms', JSON.stringify(alarms));
      return;
    }
    alert('Alarm not found');
  },
  checkAlarms: function() {
    const alarms = this.getAllAlarms();
    for(let i=0;i<alarms.length;i++){
      if (alarms[i].active()){
        if (alarms[i].activated === false) {
          this.updateAlarm(alarms[i].title, alarms[i].time, true);
          console.log('Activated');
          break;
        }
      }
    }
  }
};


setInterval(() => db.checkAlarms(), 500);
