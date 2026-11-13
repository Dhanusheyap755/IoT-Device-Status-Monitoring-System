const test = require('node:test');
const assert = require('node:assert');

// Helper to simulate validation logic without spinning up full network listener
function validatePayload(body) {
  const { deviceId, temperature, humidity, status } = body || {};
  const validationErrors = [];

  if (!deviceId || typeof deviceId !== 'string' || deviceId.trim() === '') {
    validationErrors.push('Device ID is mandatory and cannot be empty.');
  } else {
    const formattedId = deviceId.trim().toUpperCase();
    const idPattern = /^IOT\d{3,}$/;
    if (!idPattern.test(formattedId)) {
      validationErrors.push(`Device ID "${deviceId}" is invalid. Must follow pattern like IOT001.`);
    }
  }

  if (temperature === undefined || temperature === null || temperature === '') {
    validationErrors.push('Temperature reading is mandatory.');
  } else {
    const tempNum = Number(temperature);
    if (isNaN(tempNum) || typeof temperature === 'boolean') {
      validationErrors.push(`Temperature must be a valid number. Received: ${temperature}`);
    } else if (tempNum < -40 || tempNum > 125) {
      validationErrors.push(`Temperature (${tempNum}°C) is out of range. Allowed range is -40°C to 125°C.`);
    }
  }

  if (humidity === undefined || humidity === null || humidity === '') {
    validationErrors.push('Humidity reading is mandatory.');
  } else {
    const humNum = Number(humidity);
    if (isNaN(humNum) || typeof humidity === 'boolean') {
      validationErrors.push(`Humidity must be a valid number. Received: ${humidity}`);
    } else if (humNum < 0 || humNum > 100) {
      validationErrors.push(`Humidity (${humNum}%) is out of range. Allowed range is 0% to 100%.`);
    }
  }

  if (!status || typeof status !== 'string' || status.trim() === '') {
    validationErrors.push('Status field is mandatory (must be "online" or "offline").');
  } else {
    const normalizedStatus = status.trim().toLowerCase();
    if (normalizedStatus !== 'online' && normalizedStatus !== 'offline') {
      validationErrors.push(`Invalid status "${status}". Allowed values: "online", "offline".`);
    }
  }

  return {
    isValid: validationErrors.length === 0,
    errors: validationErrors,
  };
}

test('Validation Test 1: Valid payload passes', () => {
  const result = validatePayload({
    deviceId: 'IOT001',
    temperature: 28,
    humidity: 65,
    status: 'online',
  });
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.errors.length, 0);
});

test('Validation Test 2: Invalid temperature (> 125) fails', () => {
  const result = validatePayload({
    deviceId: 'IOT001',
    temperature: 200,
    humidity: 65,
    status: 'online',
  });
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some((e) => e.includes('Temperature (200°C) is out of range')));
});

test('Validation Test 3: Invalid temperature (< -40) fails', () => {
  const result = validatePayload({
    deviceId: 'IOT001',
    temperature: -55,
    humidity: 65,
    status: 'online',
  });
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some((e) => e.includes('Temperature (-55°C) is out of range')));
});

test('Validation Test 4: Invalid humidity (> 100) fails', () => {
  const result = validatePayload({
    deviceId: 'IOT001',
    temperature: 25,
    humidity: 150,
    status: 'online',
  });
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some((e) => e.includes('Humidity (150%) is out of range')));
});

test('Validation Test 5: Missing deviceId fails', () => {
  const result = validatePayload({
    temperature: 25,
    humidity: 50,
    status: 'online',
  });
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some((e) => e.includes('Device ID is mandatory')));
});

test('Validation Test 6: Malformed deviceId pattern fails', () => {
  const result = validatePayload({
    deviceId: 'SENSOR_A',
    temperature: 25,
    humidity: 50,
    status: 'online',
  });
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some((e) => e.includes('Device ID "SENSOR_A" is invalid')));
});

test('Validation Test 7: Non-numeric temperature fails', () => {
  const result = validatePayload({
    deviceId: 'IOT001',
    temperature: 'twenty-eight',
    humidity: 50,
    status: 'online',
  });
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some((e) => e.includes('Temperature must be a valid number')));
});

test('Validation Test 8: Invalid status string fails', () => {
  const result = validatePayload({
    deviceId: 'IOT001',
    temperature: 28,
    humidity: 50,
    status: 'rebooting',
  });
  assert.strictEqual(result.isValid, false);
  assert.ok(result.errors.some((e) => e.includes('Invalid status "rebooting"')));
});
