import fetch from 'node-fetch'; // or use built-in fetch if Node 18+

async function testLogin() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@lic.com', password: 'admin123' })
    });
    
    const data = await res.json();
    console.log('Status Code:', res.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Fetch Error:', error);
  }
}

testLogin();
