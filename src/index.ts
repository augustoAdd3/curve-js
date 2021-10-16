import { ethers } from "ethers";
import { Networkish } from "@ethersproject/networks";
import {
    Pool,
    getBestPoolAndOutput,
    exchangeExpected,
    exchangeEstimateGas,
    exchange,
    crossAssetExchangeAvailable,
    crossAssetExchangeOutputAndSlippage,
    crossAssetExchangeExpected,
    crossAssetExchangeEstimateGas,
    crossAssetExchange,
} from "./pools";
import { curve as _curve } from "./curve";
import {
    getCrv,
    getLockedAmountAndUnlockTime,
    getVeCrv,
    getVeCrvPct,
    createLockEstimateGas,
    createLock,
    isApproved,
    approveEstimateGas,
    approve,
    increaseAmountEstimateGas,
    increaseAmount,
    increaseUnlockTimeEstimateGas,
    increaseUnlockTime,
    withdrawLockedCrvEstimateGas,
    withdrawLockedCrv,
} from "./boosting";
import { getBalances, getAllowance, hasAllowance, ensureAllowanceEstimateGas, ensureAllowance } from "./utils";

async function init (
    providerType: 'JsonRpc' | 'Web3' | 'Infura',
    providerSettings: { url?: string, privateKey?: string } | { externalProvider: ethers.providers.ExternalProvider } | { network?: Networkish, apiKey?: string },
    options: { gasPrice?: number, maxFeePerGas?: number, maxPriorityFeePerGas?: number, chainId?: number } = {}
): Promise<void> {
    await _curve.init(providerType, providerSettings, options);
    // @ts-ignore
    this.signerAddress = _curve.signerAddress;
}

function setCustomFeeData (customFeeData: { gasPrice?: number, maxFeePerGas?: number, maxPriorityFeePerGas?: number }): void {
    _curve.setCustomFeeData(customFeeData);
}

const curve = {
    init,
    setCustomFeeData,
    signerAddress: '',
    Pool,
    getBalances,
    getAllowance,
    hasAllowance,
    ensureAllowance,
    getBestPoolAndOutput,
    exchangeExpected,
    exchange,
    crossAssetExchangeAvailable,
    crossAssetExchangeOutputAndSlippage,
    crossAssetExchangeExpected,
    crossAssetExchange,
    estimateGas: {
        ensureAllowance: ensureAllowanceEstimateGas,
        exchange: exchangeEstimateGas,
        crossAssetExchange: crossAssetExchangeEstimateGas,
    },
    boosting: {
        getCrv,
        getLockedAmountAndUnlockTime,
        getVeCrv,
        getVeCrvPct,
        isApproved,
        approve,
        createLock,
        increaseAmount,
        increaseUnlockTime,
        withdrawLockedCrv,
        estimateGas: {
            approve: approveEstimateGas,
            createLock: createLockEstimateGas,
            increaseAmount: increaseAmountEstimateGas,
            increaseUnlockTime: increaseUnlockTimeEstimateGas,
            withdrawLockedCrv: withdrawLockedCrvEstimateGas,
        },
    },
}

export default curve;
