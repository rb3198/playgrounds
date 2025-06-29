export type SubscriberFn = (offset: number) => any;
export type Subscribe = (cb: SubscriberFn) => void;
export type Unsubscribe = (cb: SubscriberFn) => void;
