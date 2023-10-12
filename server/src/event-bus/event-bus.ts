import { type BaseService } from '../shared/baseservice';
import { FontColors, logCustom, logEvent, logNewLine } from '../shared/logging';

type Subscription = {
  event: string;
  service: BaseService;
  payload?: any;
};
class EventBusBase {
  private subscriptions: Subscription[] = [];

  /**
   * Denne kalles på av en gitt Service for å utløse et event.
   * Alle /events som er subscribet til dette eventet, vil da kjøre sin .perform()
   */
  publish(event: string, payload?: any) {
    logCustom('Event Bus', 'Event published', FontColors.Muted);
    logCustom('  event', `'${event}'`, FontColors.Muted, false);
    logNewLine();
    //find all subscriptions with given event (service name)
    const subscriptions = this.subscriptions.filter(
      (sub) => sub.event === event,
    );

    // perform the given services
    subscriptions.forEach((sub) => sub.service.perform(payload));
  }
  /**
   * Her registreres hva event som skal utløse hvilken service.
   * feks. kan "test-event" utløse FooService, BarService etc.
   * SubscribeToEvent kunne den het, fordi en service under /events subscriber
   * til hva slags events den vil skal utløse seg. Er dette bakvendtland?
   */
  subscribe(event: string | string[], service: BaseService) {
    if (Array.isArray(event)) {
      event.forEach((e) => {
        this.subscriptions.push({
          event: e,
          service: service,
          // payload: payload,
        });
        logCustom(
          '  subscribe',
          `service ${service.serviceName} subscribed to event '${e}'`,
          FontColors.Muted,
          false,
        );
      });
    } else {
      this.subscriptions.push({
        event: event,
        service: service,
        // payload: payload,
      });
      logCustom(
        '  subscribe',
        `service ${service.serviceName} subscribed to event '${event}'`,
        FontColors.Muted,
        false,
      );
    }
  }
}

const EventBus = new EventBusBase();
export default EventBus;
