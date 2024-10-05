const Web3 = require('web3');
const web3 = new Web3(process.env.INFURA_URL); // Replace with your Infura URL

const cancelPendingTransaction = async () => {
    // Replace with your Ethereum address and private key
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    web3.eth.accounts.wallet.add(account);
    const deployer = account.address;

    try {
        // Get the current nonce for the address
        const currentNonce = await web3.eth.getTransactionCount(deployer);
        
        // Check for any pending transactions
        const pendingTxs = await web3.eth.getTransactionCount(deployer, "pending");
        
        if (pendingTxs > currentNonce) {
            console.log("You have a pending transaction. Proceeding to cancel...");

            // Create a transaction to cancel the pending transaction
            const cancelTx = {
                from: deployer,
                to: deployer, // Sending to yourself
                value: web3.utils.toWei("0", "ether"), // No Ether sent
                nonce: currentNonce, // Use the same nonce as the pending transaction
                gasPrice: web3.utils.toWei('50', 'gwei'), // Set a high gas price
                gas: 21000 // Standard gas limit for a simple transaction
            };

            // Send the cancel transaction
            const txResponse = await web3.eth.sendTransaction(cancelTx);
            console.log("Cancel transaction sent:", txResponse);
            
            // Wait for the transaction to be mined
            await web3.eth.getTransactionReceipt(txResponse.transactionHash);
            console.log("Cancel transaction mined!");
        } else {
            console.log("No pending transactions found.");
        }
    } catch (error) {
        console.error("Error sending cancel transaction:", error);
    }
};

// Call the function to execute
cancelPendingTransaction();
