import { coins, tokens } from '@keepix/tokens';
import { WalletLibraryInterface } from './walletLibraryInterface';

/**
 * Wallet class who respect the WalletLibraryInterface for Keepix.
 */
export class Wallet {
    private wallet: any;
    
    constructor() {
    }

    public async init(args: any): Promise<Wallet> {
        if (coins[args.type] === undefined) {
            throw new Error(`Coin ${args.type} not found on the coins-list. Please Add it on our github (token-list).`);
        }
        const lib: WalletLibraryInterface = require(`@keepix/wallets-${coins[args.type].type}`);
        const formattedArgs = {
            ... args,
            keepixTokens: {
                coins,
                tokens
            }
        };
        this.wallet = new lib.Wallet(formattedArgs);
        if (this.wallet.init !== undefined) {
            await this.wallet.init(formattedArgs);
        }
        return this;
    }

    // PUBLIC

    public getPrivateKey() {
        return this.wallet.getPrivateKey();
    }

    public getMnemonic() {
        return this.wallet.getMnemonic();
    }

    public getAddress() {
        return this.wallet.getAddress();
    }

    public async getProdiver() {
        return await this.wallet.getProdiver();
    }

    // always display the balance in 0 decimals like 1.01 ETH
    public async getCoinBalance(walletAddress?: string) {
        return await this.wallet.getCoinBalance(walletAddress);
    }

    // always display the balance in 0 decimals like 1.01 RPL
    public async getTokenBalance(tokenAddress: string, walletAddress?: string) {
        return await this.wallet.getCoinBalance(tokenAddress, walletAddress);
    }

    public async estimateCostOfTx(tx: any) {
        return await this.wallet.getCoinBalance(tx);
    }

    public async estimateCostSendCoinTo(receiverAddress: string, amount: string) {
        return await this.wallet.getCoinBalance(receiverAddress, amount);
    }

    public async sendCoinTo(receiverAddress: string, amount: string) {
        return await this.wallet.sendCoinTo(receiverAddress, amount);
    }

    public async getTokenInformation(tokenAddress: string) {
        if (this.wallet.getTokenInformation === undefined) {
            return undefined;
        }
        return await this.wallet.getTokenInformation(tokenAddress);
    }

    public async sendTokenTo(tokenAddress: string, receiverAddress: string, amount: string) {
        return await this.wallet.sendTokenTo(tokenAddress, receiverAddress, amount);
    }

    public async estimateCostSendTokenTo(tokenAddress: string, receiverAddress: string, amount: string) {
        return await this.wallet.estimateCostSendTokenTo(tokenAddress, receiverAddress, amount);
    }
}