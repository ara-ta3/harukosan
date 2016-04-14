"use strict"

class EventServer {
    constructor(attendeeRepository) {
        this.events = [];
        this.attendeeRepository = attendeeRepository;
        this.update();
    }

    attend(userName, event) {
        this.update();
        return this.attendeeRepository.add(userName, event);
    }

    leave(userName, event) {
        this.update();
        return this.attendeeRepository.remove(userName, event);
    }

    latestEvent() {
        this.update();
        if (this.events.length !== 0) {
            return this.events[0];
        } else {
            return null;
        }
    }

    attendees(event) {
        return this.attendeeRepository.list(event);
    }

    update() {
        this.events = require(`${__dirname}/../../resources/events.json`);
    }
}

module.exports = EventServer;
