const test = require('node:test');
const assert = require('node:assert');
const { getHealth } = require('../controllers/deviceController');
const { evaluateTransition, STATES, EVENTS } = require('../fsm/deviceStateMachine');

test('API Route Handler Test: getHealth returns proper JSON schema & FLAT specs', async () => {
  const req = {};
  let responseData = null;
  let statusCode = null;

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      responseData = payload;
      return this;
    },
  };

  await getHealth(req, res);

  assert.ok(statusCode === 200 || statusCode === 503, `Expected status 200 or 503, got ${statusCode}`);
  assert.ok(responseData, 'Response data must not be empty');
  assert.strictEqual(responseData.project, 'IoT Device Status Monitoring System');
  assert.strictEqual(responseData.studentRegNo, '24ITR018');
  assert.strictEqual(responseData.institution, 'Velalar College of Engineering and Technology, Erode');
  assert.strictEqual(responseData.fsmSpecification.formalTuple, 'M = (Q, Σ, δ, q0, F)');
  assert.deepStrictEqual(responseData.fsmSpecification.states, ['Registered', 'Active', 'Disconnected']);
  assert.strictEqual(responseData.fsmSpecification.initialState, 'Registered');
  assert.strictEqual(responseData.fsmSpecification.activeState, 'Active');
});

test('FLAT FSM Test Suite: Complete Transition Matrix Verification', () => {
  // 1. Registered Transitions
  assert.strictEqual(evaluateTransition(STATES.REGISTERED, EVENTS.VALID_MESSAGE).nextState, 'Active');
  assert.strictEqual(evaluateTransition(STATES.REGISTERED, EVENTS.COMMUNICATION_FAILURE).nextState, 'Disconnected');
  assert.strictEqual(evaluateTransition(STATES.REGISTERED, EVENTS.TIMEOUT).nextState, 'Disconnected');
  assert.strictEqual(evaluateTransition(STATES.REGISTERED, EVENTS.INVALID_MESSAGE).nextState, 'Registered');

  // 2. Active Transitions
  assert.strictEqual(evaluateTransition(STATES.ACTIVE, EVENTS.VALID_MESSAGE).nextState, 'Active');
  assert.strictEqual(evaluateTransition(STATES.ACTIVE, EVENTS.COMMUNICATION_FAILURE).nextState, 'Disconnected');
  assert.strictEqual(evaluateTransition(STATES.ACTIVE, EVENTS.TIMEOUT).nextState, 'Disconnected');
  assert.strictEqual(evaluateTransition(STATES.ACTIVE, EVENTS.INVALID_MESSAGE).nextState, 'Active');

  // 3. Disconnected Transitions
  assert.strictEqual(evaluateTransition(STATES.DISCONNECTED, EVENTS.VALID_MESSAGE).nextState, 'Active');
  assert.strictEqual(evaluateTransition(STATES.DISCONNECTED, EVENTS.RECONNECT).nextState, 'Active');
  assert.strictEqual(evaluateTransition(STATES.DISCONNECTED, EVENTS.COMMUNICATION_FAILURE).nextState, 'Disconnected');
  assert.strictEqual(evaluateTransition(STATES.DISCONNECTED, EVENTS.TIMEOUT).nextState, 'Disconnected');
  assert.strictEqual(evaluateTransition(STATES.DISCONNECTED, EVENTS.INVALID_MESSAGE).nextState, 'Disconnected');
});
