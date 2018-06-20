const assert = require('assert')
const ganache = require('ganache-cli')

// capital letter for Web3 => constructor function, no instance
const Web3 = require('web3')
//instance
const web3 = new Web3(ganache.provider())
const { interface, bytecode } = require('../compile')


let accounts
let inbox
const INITIAL_MESSAGE = "INITIAL MESSAGE"

beforeEach(async () => {
  // Get a list of all account
  accounts = await web3.eth.getAccounts()

  // Use one of these account to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy( { data: bytecode, arguments: [INITIAL_MESSAGE] })
    .send( { from: accounts[0], gas: '1000000' })
})


describe('Inbox', () => {

  it('deploys a contract', () => {
    // assert.ok => is this value defined
    assert.ok(inbox.options.address)
  })

  it('has a default message', async () => {
    const message = await inbox.methods.message().call()
    assert.equal(message,INITIAL_MESSAGE)
  })

  it('can change a message', async () => {
    await inbox.methods.setMessage("ALTERED MESSAGE").send({ from: accounts[0] }) // returns the transaction hash
    const message = await inbox.methods.message().call()
    assert.equal(message,"ALTERED MESSAGE")
  })

})
