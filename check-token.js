// This script helps you check your JWT token
// Run this in the browser console when you're on the frontend

function checkToken() {
    console.log('🔍 Checking JWT Token...\n');
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.log('❌ No token found in localStorage');
        return;
    }
    
    console.log('✅ Token found in localStorage');
    console.log(`Token length: ${token.length} characters`);
    
    // Check token format
    const parts = token.split('.');
    if (parts.length !== 3) {
        console.log('❌ Invalid JWT format (should have 3 parts)');
        return;
    }
    
    console.log('✅ Token has correct JWT format');
    
    try {
        // Decode the payload (second part)
        const payload = JSON.parse(atob(parts[1]));
        console.log('\n📋 Token Payload:');
        console.log('User ID:', payload._id);
        console.log('User Type:', payload.userType);
        console.log('Issued At:', new Date(payload.iat * 1000).toLocaleString());
        console.log('Expires At:', new Date(payload.exp * 1000).toLocaleString());
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (payload.exp < currentTime) {
            console.log('❌ Token is EXPIRED!');
            console.log(`Current time: ${new Date().toLocaleString()}`);
            console.log(`Token expired: ${new Date(payload.exp * 1000).toLocaleString()}`);
        } else {
            console.log('✅ Token is NOT expired');
            const timeLeft = payload.exp - currentTime;
            console.log(`Time remaining: ${Math.floor(timeLeft / 60)} minutes`);
        }
        
    } catch (error) {
        console.log('❌ Error decoding token payload:', error.message);
    }
}

// Run the check
checkToken();

// Also provide a function to clear the token if needed
function clearToken() {
    localStorage.removeItem('token');
    console.log('🗑️ Token cleared from localStorage');
    console.log('Please refresh the page and login again');
}

console.log('\n💡 Available functions:');
console.log('- checkToken() - Check current token');
console.log('- clearToken() - Clear token and logout');
