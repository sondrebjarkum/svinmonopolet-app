import { EVENTS } from '../shared/events';
import { logNeutral, logWarning } from '../shared/logging';

class EventLockImpl {
  private store: { [key: string]: boolean } = {};

  isLocked(event: string) {
    if (this.store[event]) {
      logWarning(
        `tried to start another instance of ${event}, but it's locked or already running`,
      );
      return true;
    }
  }

  lock(event: string) {
    if (this.isLocked(event)) return;
    this.store[event] = true;

    logNeutral(`added ${event} to lock`);
  }

  unlock(event: string) {
    if (!this.store[event]) {
      logWarning(`${event} not found`);
      return;
    }
    delete this.store[event];
    logNeutral(`${event} removed from lock`);
  }
}

const EventLock = new EventLockImpl();
export default EventLock;
