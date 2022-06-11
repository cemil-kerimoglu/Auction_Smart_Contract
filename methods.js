methods: {
    auctionState: [Function: bound _createTxObject],
    '0x7fb45099': [Function: bound _createTxObject],
    'auctionState()': [Function: bound _createTxObject],
    bids: [Function: bound _createTxObject],
    '0x62ea82db': [Function: bound _createTxObject],
    'bids(address)': [Function: bound _createTxObject],
    endBlock: [Function: bound _createTxObject],
    '0x083c6323': [Function: bound _createTxObject],
    'endBlock()': [Function: bound _createTxObject],
    highestBidder: [Function: bound _createTxObject],
    '0x91f90157': [Function: bound _createTxObject],
    'highestBidder()': [Function: bound _createTxObject],
    highestBindingBid: [Function: bound _createTxObject],
    '0xf5b56c56': [Function: bound _createTxObject],
    'highestBindingBid()': [Function: bound _createTxObject],
    ipfsHash: [Function: bound _createTxObject],
    '0xc623674f': [Function: bound _createTxObject],
    'ipfsHash()': [Function: bound _createTxObject],
    owner: [Function: bound _createTxObject],
    '0x8da5cb5b': [Function: bound _createTxObject],
    'owner()': [Function: bound _createTxObject],
    startBlock: [Function: bound _createTxObject],
    '0x48cd4cb1': [Function: bound _createTxObject],
    'startBlock()': [Function: bound _createTxObject],
    placeBid: [Function: bound _createTxObject],
    '0xecfc7ecc': [Function: bound _createTxObject],
    'placeBid()': [Function: bound _createTxObject]
  }

  let state = await auction.auctionState()
  // It gives a Big Number (BN). You then convert it to number
  state.toNumber()

  let start = await auction.startBlock()
  // It gives a Big Number (BN). You then convert it to number
  start.toNumber()

