import { Subscription } from 'rxjs';

/**
 * use this to easily manage subscriptions */
export class SubscriptionContainer {
  public subs: Subscription[] = [];

  set add(s: Subscription) {
    this.subs.push(s);
  }

  dispose() {
    this.subs.forEach((s) => {
      try {
        s.unsubscribe();
      } catch (error) {
        console.error(error);
      }
    });
    this.subs = [];
  }
}
