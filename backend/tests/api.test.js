
const request = require('supertest');
const app = require('../app');

describe('User API', () => {
  let agent = request.agent(app); // persist session

  const user = { username: `testuser${Date.now()}`, password: 'testpass' };

  test('Register a new user', async () => {
    const res = await agent.post('/api/register').send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Fail to register duplicate user', async () => {
    const res = await agent.post('/api/register').send(user);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/exists/i);
  });

  test('Login with valid credentials', async () => {
    const res = await agent.post('/api/login').send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Fail login with invalid password', async () => {
    const res = await request(app).post('/api/login').send({
      username: user.username,
      password: 'wrongpass'
    });
    expect(res.statusCode).toBe(401);
  });

  test('Fetch users (authenticated)', async () => {
    const res = await agent.get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(u => u.username === user.username)).toBe(true);
  });

  test('Delete a user (authenticated)', async () => {
    // get ID of the test user
    const users = await agent.get('/api/users');
    const id = users.body.find(u => u.username === user.username)?.id;

    const delRes = await agent.delete(`/api/users/${id}`);
    expect(delRes.statusCode).toBe(200);
    expect(delRes.body.success).toBe(true);
  });

  test('Logout and restrict access', async () => {
    await agent.post('/api/logout');
    const res = await agent.get('/api/users');
    expect(res.statusCode).toBe(401);
  });

  test('Update username for an existing user', async () => {
    // Register a user
    const originalUsername = `edituser${Date.now()}`;
    const password = 'password123';
    const agent = request.agent(app);

    await agent.post('/api/register').send({ username: originalUsername, password });
    await agent.post('/api/login').send({ username: originalUsername, password });

    // Fetch users to get ID
    const usersRes = await agent.get('/api/users');
    const user = usersRes.body.find(u => u.username === originalUsername);
    expect(user).toBeDefined();

    // Update username
    const newUsername = `${originalUsername}_updated`;
    const updateRes = await agent.put(`/api/users/${user.id}`).send({ username: newUsername });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.success).toBe(true);

    // Verify update
    const updatedUsers = await agent.get('/api/users');
    const updatedUser = updatedUsers.body.find(u => u.id === user.id);
    expect(updatedUser.username).toBe(newUsername);
  });
});