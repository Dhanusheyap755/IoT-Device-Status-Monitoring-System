const test = require('node:test');
const assert = require('node:assert');
const {
  STATES,
  EVENTS,
  TRANSITION_TABLE,
  evaluateTransition,
} = require('../fsm/deviceStateMachine');

test('FSM Formal Tuple Definitions', () => {
  assert.deepStrictEqual(Object.values(STATES), ['Registered', 'Active', 'Disconnected']);
  assert.strictEqual(STATES.REGISTERED, 'Registered');
  assert.strictEqual(STATES.ACTIVE, 'Active');
  assert.strictEqual(STATES.DISCONNECTED, 'Disconnected');

  assert.ok(EVENTS.VALID_MESSAGE);
  assert.ok(EVENTS.INVALID_MESSAGE);
  assert.ok(EVENTS.COMMUNICATION_FAILURE);
  assert.ok(EVENTS.TIMEOUT);
  assert.ok(EVENTS.RECONNECT);
});

test('Test Rule 1: Registered + ValidMessage -> Active', () => {
  const result = evaluateTransition(STATES.REGISTERED, EVENTS.VALID_MESSAGE);
  assert.strictEqual(result.previousState, 'Registered');
  assert.strictEqual(result.nextState, 'Active');
  assert.strictEqual(result.stateChanged, true);
  assert.strictEqual(result.createsAlert, false);
});

test('Test Rule 2: Registered + CommunicationFailure -> Disconnected', () => {
  const result = evaluateTransition(STATES.REGISTERED, EVENTS.COMMUNICATION_FAILURE);
  assert.strictEqual(result.previousState, 'Registered');
  assert.strictEqual(result.nextState, 'Disconnected');
  assert.strictEqual(result.stateChanged, true);
  assert.strictEqual(result.createsAlert, true);
  assert.strictEqual(result.alertType, 'COMMUNICATION_FAILURE');
  assert.strictEqual(result.severity, 'Error');
});

test('Test Rule 3: Registered + Timeout -> Disconnected', () => {
  const result = evaluateTransition(STATES.REGISTERED, EVENTS.TIMEOUT);
  assert.strictEqual(result.previousState, 'Registered');
  assert.strictEqual(result.nextState, 'Disconnected');
  assert.strictEqual(result.stateChanged, true);
  assert.strictEqual(result.createsAlert, true);
  assert.strictEqual(result.alertType, 'TIMEOUT');
});

test('Test Rule 4: Active + ValidMessage -> Active (Self Loop)', () => {
  const result = evaluateTransition(STATES.ACTIVE, EVENTS.VALID_MESSAGE);
  assert.strictEqual(result.previousState, 'Active');
  assert.strictEqual(result.nextState, 'Active');
  assert.strictEqual(result.stateChanged, false);
  assert.strictEqual(result.createsAlert, false);
});

test('Test Rule 5: Active + CommunicationFailure -> Disconnected', () => {
  const result = evaluateTransition(STATES.ACTIVE, EVENTS.COMMUNICATION_FAILURE);
  assert.strictEqual(result.previousState, 'Active');
  assert.strictEqual(result.nextState, 'Disconnected');
  assert.strictEqual(result.stateChanged, true);
  assert.strictEqual(result.createsAlert, true);
  assert.strictEqual(result.severity, 'Error');
});

test('Test Rule 6: Active + Timeout -> Disconnected', () => {
  const result = evaluateTransition(STATES.ACTIVE, EVENTS.TIMEOUT);
  assert.strictEqual(result.previousState, 'Active');
  assert.strictEqual(result.nextState, 'Disconnected');
  assert.strictEqual(result.stateChanged, true);
  assert.strictEqual(result.createsAlert, true);
});

test('Test Rule 7: Disconnected + ValidMessage -> Active', () => {
  const result = evaluateTransition(STATES.DISCONNECTED, EVENTS.VALID_MESSAGE);
  assert.strictEqual(result.previousState, 'Disconnected');
  assert.strictEqual(result.nextState, 'Active');
  assert.strictEqual(result.stateChanged, true);
  assert.strictEqual(result.createsAlert, true);
  assert.strictEqual(result.alertType, 'RECONNECTION');
});

test('Test Rule 8: Disconnected + Reconnect -> Active', () => {
  const result = evaluateTransition(STATES.DISCONNECTED, EVENTS.RECONNECT);
  assert.strictEqual(result.previousState, 'Disconnected');
  assert.strictEqual(result.nextState, 'Active');
  assert.strictEqual(result.stateChanged, true);
  assert.strictEqual(result.createsAlert, true);
  assert.strictEqual(result.alertType, 'RECONNECTION');
});

test('Test Rule 9: Disconnected + CommunicationFailure -> Disconnected', () => {
  const result = evaluateTransition(STATES.DISCONNECTED, EVENTS.COMMUNICATION_FAILURE);
  assert.strictEqual(result.previousState, 'Disconnected');
  assert.strictEqual(result.nextState, 'Disconnected');
  assert.strictEqual(result.stateChanged, false);
  assert.strictEqual(result.createsAlert, true);
});

test('Test Rule 10: Disconnected + Timeout -> Disconnected', () => {
  const result = evaluateTransition(STATES.DISCONNECTED, EVENTS.TIMEOUT);
  assert.strictEqual(result.previousState, 'Disconnected');
  assert.strictEqual(result.nextState, 'Disconnected');
  assert.strictEqual(result.stateChanged, false);
  assert.strictEqual(result.createsAlert, true);
});

test('Test Rule 11: InvalidMessage preserves state in all states & flags alert', () => {
  const states = [STATES.REGISTERED, STATES.ACTIVE, STATES.DISCONNECTED];
  for (const st of states) {
    const res = evaluateTransition(st, EVENTS.INVALID_MESSAGE);
    assert.strictEqual(res.previousState, st);
    assert.strictEqual(res.nextState, st);
    assert.strictEqual(res.stateChanged, false);
    assert.strictEqual(res.createsAlert, true);
    assert.strictEqual(res.alertType, 'INVALID_MESSAGE');
    assert.strictEqual(res.severity, 'Warning');
  }
});
