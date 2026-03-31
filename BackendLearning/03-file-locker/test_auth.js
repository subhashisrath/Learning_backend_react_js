// Quick test script for auth endpoints
const BASE = "http://localhost:3000";

async function test() {
  console.log("=== Testing Register ===");
  const regRes = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "testuser",
      email: "test@mail.com",
      password: "pass123",
    }),
  });
  const regData = await regRes.json();
  console.log("Status:", regRes.status);
  console.log("Response:", JSON.stringify(regData, null, 2));

  console.log("\n=== Testing Login ===");
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "test@mail.com", password: "pass123" }),
  });
  const loginData = await loginRes.json();
  console.log("Status:", loginRes.status);
  console.log("Response:", JSON.stringify(loginData, null, 2));

  console.log("\n=== Testing Missing Fields (should be 400) ===");
  const badRes = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "bad@mail.com" }),
  });
  const badData = await badRes.json();
  console.log("Status:", badRes.status);
  console.log("Response:", JSON.stringify(badData, null, 2));

  console.log("\n=== Testing Duplicate Registration (should be 400) ===");
  const dupRes = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "testuser",
      email: "test@mail.com",
      password: "pass123",
    }),
  });
  const dupData = await dupRes.json();
  console.log("Status:", dupRes.status);
  console.log("Response:", JSON.stringify(dupData, null, 2));
}

test().catch(console.error);
