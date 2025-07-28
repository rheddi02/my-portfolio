# DNS Configuration for itsmealfred.site

## Required DNS Records

Configure the following DNS records with your domain registrar or DNS provider:

### A Records
```
itsmealfred.site        A    13.239.20.18
www.itsmealfred.site    A    13.239.20.18
```

### Alternative: CNAME for www (if supported)
```
itsmealfred.site        A       13.239.20.18
www.itsmealfred.site    CNAME   itsmealfred.site
```

## DNS Providers Configuration

### Cloudflare
1. Log into Cloudflare Dashboard
2. Select your domain: itsmealfred.site
3. Go to DNS tab
4. Add records:
   - Type: A, Name: @, Content: 13.239.20.18, TTL: Auto
   - Type: A, Name: www, Content: 13.239.20.18, TTL: Auto

### AWS Route 53
```bash
# If using Route 53, you can use CLI
aws route53 change-resource-record-sets --hosted-zone-id YOUR_ZONE_ID --change-batch '{
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "itsmealfred.site",
        "Type": "A",
        "TTL": 300,
        "ResourceRecords": [{"Value": "13.239.20.18"}]
      }
    },
    {
      "Action": "CREATE", 
      "ResourceRecordSet": {
        "Name": "www.itsmealfred.site",
        "Type": "A",
        "TTL": 300,
        "ResourceRecords": [{"Value": "13.239.20.18"}]
      }
    }
  ]
}'
```

### GoDaddy / Namecheap / Other Registrars
1. Log into your domain registrar's control panel
2. Find DNS management or DNS records section
3. Add/modify A records:
   - Host: @ (or blank), Points to: 13.239.20.18
   - Host: www, Points to: 13.239.20.18

## Verification

### Check DNS Propagation
```bash
# Check if DNS is propagated
nslookup itsmealfred.site
nslookup www.itsmealfred.site

# Or use dig
dig itsmealfred.site
dig www.itsmealfred.site

# Online tools
# https://www.whatsmydns.net/#A/itsmealfred.site
# https://dnschecker.org/#A/itsmealfred.site
```

### Test HTTP/HTTPS Access
```bash
# Test HTTP (should redirect to HTTPS)
curl -I http://itsmealfred.site

# Test HTTPS (after SSL setup)
curl -I https://itsmealfred.site

# Test health endpoint
curl https://itsmealfred.site/health
```

## Notes

- DNS propagation can take 24-48 hours globally
- TTL (Time To Live) affects how quickly changes propagate
- Lower TTL = faster propagation but more DNS queries
- Most changes are visible within 15 minutes to 2 hours

## Troubleshooting

### DNS Not Resolving
1. Check if records are correctly configured
2. Wait for propagation (up to 48 hours)
3. Try different DNS servers (8.8.8.8, 1.1.1.1)
4. Clear local DNS cache

### SSL Certificate Issues
1. Ensure DNS is resolving before requesting SSL
2. Make sure ports 80/443 are open in security groups
3. Verify domain ownership with Let's Encrypt

## Security Considerations

- Consider using Cloudflare for DDoS protection
- Enable DNSSEC if supported by your provider
- Use CAA records to restrict certificate authorities
- Monitor DNS for unauthorized changes
