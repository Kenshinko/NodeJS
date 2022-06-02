const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

class Timer {
  constructor(date) {
    this.name = date,
    this.expirationDate = this._getDeclaredDate(date),
    this.timer = this._renderTimer.bind(this),
    eventEmitter.on("start-execution", this.timer)
  }

  _getDeclaredDate(date) {
    date = date.split("-");
    return new Date(date[3], date[2] - 1, date[1], date[0]).getTime();
  }

  _renderTimer() {
    const currentDate = new Date().getTime();
    const result = this.expirationDate - currentDate;

    if (result > 0) {
      const secs = parseInt(result / 1000 % 60);
      const mins = parseInt(result / 1000 / 60 % 60);
      const hrs = parseInt(result / 1000 / 60 / 60 % 24);
      const days = parseInt(result / 1000 / 60 / 60 / 24);
    
      console.log(`Таймер ${this.name}. Осталось: ${days} дн : ${hrs} ч : ${mins} мин : ${secs} сек`);
    } else {
      eventEmitter.removeListener("start-execution", this.timer);
      eventEmitter.on("done-execution", () => {console.log(`Таймер ${this.name}. Завершен.`)});
    }
  }
}

const run = () => {
  const timers = process.argv.slice(2).map(time => new Timer(time));

  setInterval(() => {
      if (eventEmitter.listenerCount("start-execution") > 0) {
        process.stdout.cursorTo(0);
        process.stdout.moveCursor(0, - (timers.length));
        process.stdout.clearScreenDown();
        eventEmitter.emit("start-execution");
        eventEmitter.emit("done-execution");
      } else {
        console.log("Таймеры завершились");
        process.exit(1);
      }
  }, 1000)
}

run();