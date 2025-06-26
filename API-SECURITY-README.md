# DevSync API Security System

This document explains the API security implementation for the DevSync backend.

## Security Overview

The DevSync API uses a three-tier security system:

1. **Public Routes** - No authentication required
2. **API Key Protected Routes** - Requires `x-api-key` header
3. **VPN Key Protected Routes** - Requires `x-vpn-key` header (highest security)

## Security Configuration

### Environment Variables
```env
API_SECRET_KEY=super@123
VPN_API_KEY=vpn-private-key-2024-secure-access
```

### Security Levels

#### Public Routes (🌐)
- `/auth/github` - GitHub OAuth
- `/api/leaderboard` - Public leaderboard
- `/api/events` - Events listing  
- `/api/accepted-projects` - Accepted projects

#### API Key Protected Routes (🔑)
- `/api/user` - User profile data
- `/api/users` - Users list
- `/api/stats` - Platform statistics
- `/api/github` - GitHub integration
- `/api/projects` - Projects management
- `/api/sponsorship` - Sponsorship inquiries
- `/api/tickets` - Support tickets
- `/api/protected` - Protected test endpoints

#### VPN Key Protected Routes (🛡️)
- `/api/admin` - Admin management (requires session auth too)
- `/api/vpn` - VPN test endpoints

## Usage

### Making API Requests

#### Public Route
```bash
curl -X GET http://localhost:3000/api/events
```

#### API Key Protected Route
```bash
curl -X GET -H "x-api-key: super@123" http://localhost:3000/api/user
```

#### VPN Key Protected Route  
```bash
curl -X GET -H "x-vpn-key: vpn-private-key-2024-secure-access" http://localhost:3000/api/vpn/admin-data
```

## Testing Security

### Run the Test Suite

1. **Start your backend server:**
   ```bash
   npm start
   # OR
   node index.js
   ```

2. **Run security tests:**
   ```bash
   node api-security-test.js
   ```

### Test Results
The test suite will:
- ✅ Verify all routes respond correctly to security requirements
- ❌ Identify any security misconfigurations
- ⚠️ Show warnings for routes needing additional session auth
- 📊 Provide comprehensive security report

## Security Features

### Rate Limiting
- Applied to all `/api/*` routes
- Prevents abuse and DoS attacks

### API Key Validation
- Validates `x-api-key` header against `API_SECRET_KEY`
- Returns 401 if missing, 403 if invalid

### VPN Key Validation  
- Validates `x-vpn-key` header against `VPN_API_KEY`
- Provides highest security level for admin operations

### Error Responses
```json
// Missing API key
{
  "success": false,
  "message": "API key is required. Please provide x-api-key header or apiKey query parameter."
}

// Invalid API key
{
  "success": false,
  "message": "Invalid API key. Access denied."
}

// Invalid VPN key
{
  "success": false,
  "message": "VPN access required. Invalid or missing VPN key."
}
```

## File Structure

```
devsync-opensource/
├── security-config.js          # Security configuration
├── middleware/apiAuth.js       # Authentication middleware
├── api-security-test.js        # Comprehensive test suite
└── index.js                    # Main application (security applied)
```

## Troubleshooting

### Common Issues

1. **Tests failing?**
   - Ensure server is running on http://localhost:3000
   - Check API keys in .env file
   - Restart server after security changes

2. **Routes not protected?**
   - Verify security middleware is applied before route definitions
   - Check console output for security application messages

3. **Admin routes returning 401?**
   - Admin routes require both VPN key AND session authentication
   - This is expected behavior for security

### Security Best Practices

1. **Never expose API keys** in client-side code
2. **Rotate keys regularly** in production
3. **Use HTTPS** in production environments
4. **Monitor API usage** and implement proper logging
5. **Consider IP whitelisting** for VPN routes

## Development

### Adding New Routes

1. **Add route to security-config.js:**
   ```javascript
   const SECURITY_CONFIG = {
     '/api/new-route': 'api-key', // or 'public' or 'vpn-key'
     // ... existing routes
   };
   ```

2. **Add test to api-security-test.js:**
   ```javascript
   const ROUTE_TESTS = [
     { path: '/api/new-route', method: 'GET', security: 'api-key', description: 'New route' },
     // ... existing tests
   ];
   ```

3. **Run tests to verify:**
   ```bash
   node api-security-test.js
   ```

---

**✅ Your API is now secured with comprehensive authentication and testing!**
