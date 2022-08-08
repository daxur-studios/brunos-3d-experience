import { Subscription } from 'rxjs';

/**
 * use this to easily manage subscriptions */
export class SubscriptionContainer {
  private _subs: Subscription[] = [];

  set add(s: Subscription) {
    this._subs.push(s);
  }

  dispose() {
    this._subs.forEach((s) => {
      try {
        s.unsubscribe();
      } catch (error) {
        console.error(error);
      }
    });
    this._subs = [];
  }
}
