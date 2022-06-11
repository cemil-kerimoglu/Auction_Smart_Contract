const Auction = artifacts.require("Auction");
const helper = require("../helpers/truffleTestHelper.js");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Auction', (accounts) =>  {
    let auction
    const gasPrice = 20000000000

    before(async () => {
        auction = await Auction.new()
    })

    describe("Testing Helper Functions", async () => {
        it("advances the blockchain forward a block", async () => {
            const originalBlockNumber = await web3.eth.getBlockNumber()    // ('latest').then(x => {return x.hash})
            let newBlockNumber = await web3.eth.getBlockNumber()    // ('latest').then(x => {return x.hash})
            newBlockNumber = await helper.advanceBlock()
            assert.equal(newBlockNumber, (originalBlockNumber + 1))
        })
    })

    describe('The Auction', async () => {
        it('has the correct owner', async () => {
            const auctionOwner = await auction.owner()
            assert.equal(auctionOwner, accounts[0])
        })

        it('has the correct state', async () => {
            let state = await auction.auctionState()
            assert.equal(state.toNumber(), 1)
        })

        it('has a starting block', async () => {
            let start = await auction.startBlock()
            assert.isAbove(start.toNumber(), 0)
        })

        it('has the correct ending block', async () => {
            let start = await auction.startBlock()
            let end = await auction.endBlock()
            let difference = end.toNumber() - start.toNumber()
            assert.equal(difference, 7)
        })

        it('places bids according to rules', async() => {
            await auction.placeBid({from: accounts[0], value: web3.utils.toWei('1', 'ether')}).should.be.rejected
            await auction.placeBid({from: accounts[1], value: web3.utils.toWei('0.9', 'ether')}).should.be.rejected
        })

        it('adds the first bidder', async () => {
            balanceBidderBefore = await web3.eth.getBalance(accounts[1])
            balanceBidderBefore = parseFloat(web3.utils.fromWei(balanceBidderBefore, 'ether'))
            let transaction = await auction.placeBid({from: accounts[1], value: web3.utils.toWei('1', 'ether'), gasPrice: gasPrice})     
            let gasUsed = transaction.receipt.gasUsed
            gasFee = gasPrice * gasUsed
            gasFee = parseFloat(web3.utils.fromWei(gasFee.toString(), 'ether')) 
            balanceBidderAfter = await web3.eth.getBalance(accounts[1])
            balanceBidderAfter = parseFloat(web3.utils.fromWei(balanceBidderAfter, 'ether'))
            let amountToTransfer = 1.0
            assert.equal(Math.floor(balanceBidderAfter*1000)/1000, Math.floor((balanceBidderBefore - amountToTransfer - gasFee)*1000)/1000 )
            currentBid = await auction.bids(accounts[1])
            assert.equal(currentBid, web3.utils.toWei('1', 'ether')) 
        })
        
        it('updates the highest bidder as the first bidder', async() => {
            highestBidder = await auction.highestBidder()
            assert.equal(highestBidder, accounts[1])
            highestBindingBid = await auction.highestBindingBid()
            assert.equal(highestBindingBid.toString(), web3.utils.toWei('0.2', 'ether'))
        })

        it('adds a second bidder with higher bid and updates the bidding status', async() => {
            balanceBidderBefore = await web3.eth.getBalance(accounts[2])
            balanceBidderBefore = parseFloat(web3.utils.fromWei(balanceBidderBefore, 'ether'))
            let transaction = await auction.placeBid({from: accounts[2], value: web3.utils.toWei('2', 'ether'), gasPrice: gasPrice})
            let gasUsed = transaction.receipt.gasUsed
            gasFee = gasPrice * gasUsed
            gasFee = parseFloat(web3.utils.fromWei(gasFee.toString(), 'ether'))
            balanceBidderAfter = await web3.eth.getBalance(accounts[2])
            balanceBidderAfter = parseFloat(web3.utils.fromWei(balanceBidderAfter, 'ether'))
            let amountToTransfer = 2.0
            assert.equal(Math.floor(balanceBidderAfter*1000)/1000, Math.floor((balanceBidderBefore - amountToTransfer - gasFee)*1000)/1000 )
            highestBidder = await auction.highestBidder()
            assert.equal(highestBidder, accounts[2])
            highestBindingBid = await auction.highestBindingBid()
            assert.equal(highestBindingBid.toString(), web3.utils.toWei('1.2', 'ether'))
        })

        it('adds a third bidder with lower bid and updates the bidding status', async() => {
            balanceBidderBefore = await web3.eth.getBalance(accounts[3])
            balanceBidderBefore = parseFloat(web3.utils.fromWei(balanceBidderBefore, 'ether'))
            let transaction = await auction.placeBid({from: accounts[3], value: web3.utils.toWei('1.4', 'ether'), gasPrice: gasPrice})
            let gasUsed = transaction.receipt.gasUsed
            gasFee = gasPrice * gasUsed
            gasFee = parseFloat(web3.utils.fromWei(gasFee.toString(), 'ether'))
            balanceBidderAfter = await web3.eth.getBalance(accounts[3]) 
            balanceBidderAfter = parseFloat(web3.utils.fromWei(balanceBidderAfter, 'ether'))
            let amountToTransfer = 1.4
            assert.equal(Math.floor(balanceBidderAfter*1000)/1000, Math.floor((balanceBidderBefore - amountToTransfer - gasFee)*1000)/1000 )
            highestBidder = await auction.highestBidder()
            assert.equal(highestBidder, accounts[2])
            highestBindingBid = await auction.highestBindingBid()
            assert.equal(highestBindingBid.toString(), web3.utils.toWei('1.6', 'ether'))
        })
        
        it('the owner gets the correct amount of money after finalizing the auction', async() => {
            // Turns out this whole operation takes 6 blocks. But I will advance the block number as well.
            await helper.advanceBlock()
            balanceOwnerBefore = await web3.eth.getBalance(accounts[0])
            balanceOwnerBefore = parseFloat(web3.utils.fromWei(balanceOwnerBefore, 'ether'))
            let transaction = await auction.finalizeAuction({from: accounts[0], gasPrice: gasPrice})
            let gasUsed = transaction.receipt.gasUsed
            gasFee = gasPrice * gasUsed
            gasFee = parseFloat(web3.utils.fromWei(gasFee.toString(), 'ether'))
            balanceOwnerAfter = await web3.eth.getBalance(accounts[0])
            balanceOwnerAfter = parseFloat(web3.utils.fromWei(balanceOwnerAfter, 'ether'))
            let amountToTransfer = 1.6
            assert.equal(Math.floor(balanceOwnerAfter*1000)/1000, Math.floor((balanceOwnerBefore + amountToTransfer - gasFee)*1000)/1000 )
        })

        it('the winner gets back the correct amount of money', async () => {
            balanceWinnerBefore = await web3.eth.getBalance(accounts[2])
            balanceWinnerBefore = parseFloat(web3.utils.fromWei(balanceWinnerBefore, 'ether'))
            let transaction = await auction.finalizeAuction({from: accounts[2], gasPrice: gasPrice})
            let gasUsed = transaction.receipt.gasUsed
            gasFee = gasPrice * gasUsed
            gasFee = parseFloat(web3.utils.fromWei(gasFee.toString(), 'ether'))
            balanceWinnerAfter = await web3.eth.getBalance(accounts[2])
            balanceWinnerAfter = parseFloat(web3.utils.fromWei(balanceWinnerAfter, 'ether'))
            let amountToTransfer = 0.4
            assert.equal(Math.floor(balanceWinnerAfter*1000)/1000, Math.floor((balanceWinnerBefore + amountToTransfer - gasFee)*1000)/1000 )
        })

        it('other participants also get their money back', async () => {
            balanceLoserBefore = await web3.eth.getBalance(accounts[3])
            balanceLoserBefore = parseFloat(web3.utils.fromWei(balanceLoserBefore, 'ether'))
            let transaction = await auction.finalizeAuction({from: accounts[3], gasPrice: gasPrice})
            let gasUsed = transaction.receipt.gasUsed
            gasFee = gasPrice * gasUsed
            gasFee = parseFloat(web3.utils.fromWei(gasFee.toString(), 'ether'))
            balanceLoserAfter = await web3.eth.getBalance(accounts[3])
            balanceLoserAfter = parseFloat(web3.utils.fromWei(balanceLoserAfter, 'ether'))
            let amountToTransfer = 1.4
            assert.equal(Math.floor(balanceLoserAfter*1000)/1000, Math.floor((balanceLoserBefore + amountToTransfer - gasFee)*1000)/1000 )
        })

        /*
        it('cancels the auction', async() => {
            await auction.cancelAuction({from: accounts[2]}).should.be.rejected
            await auction.cancelAuction({from: accounts[0]})
            let state = await auction.auctionState()
            assert.equal(state.toNumber(), 3)
        })
        */
    
    })
    
})