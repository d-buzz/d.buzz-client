### DBUZZ FRONTEND
Frontend for DBUZZ Community

### Contribution

All development will be on the ```dev``` branch.

Code will be pushed to ```dev``` branch after reviewing.

**TESTNET**: ```testnet``` branch will only be updated via ```dev``` branch.

Once testing and bug are fixed on ```Testnet```, the code will be pushed to ```stable``` branch.

**MAINNET**: ```mainnet``` branch will only be updated for production via ```stable``` branch.

1. Clone ```dev``` branch ```git clone -b dev https://github.com/d-buzz/d.buzz-client.git```
2. Create a local branch
3. Open PR and make sure the base branch should be ```dev``` branch
3. Changes will be reviewed and merged to ```dev``` branch
4. Changes will be deployed to ```TESTNET``` for beta testing
5. Stable code on ```TESTNET``` will be deployed to our ```MAINNET``` as a new release


### Testing
Perform a lint test:
```npm run lint```

### Commit Messages
We use Semantic Commit Messages:
https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716

### CI/CD
2. CircleCI (Testing)
1. Fleek - IPFS (Deployment)

### Versioning
We use Semantic Versioning for our releases:
https://semver.org/
