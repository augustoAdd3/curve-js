import { PoolTemplate } from "./PoolTemplate";
import { poolBalancesAtricrypto3Mixin, poolBalancesMetaMixin, poolBalancesLendingMixin } from "./mixins/poolBalancesMixin";
import { depositSlippageMixin, depositWrappedSlippageMixin, depositSlippageCryptoMixin, depositWrappedSlippageCryptoMixin } from "./mixins/depositSlippageMixins";
import { depositMetaFactoryMixin, depositZapMixin, depositLendingOrCryptoMixin, depositPlainMixin } from "./mixins/depositMixins";
import { depositWrapped2argsMixin, depositWrapped3argsMixin } from "./mixins/depositWrappedMixins";
import { withdrawExpectedMixin, withdrawExpectedLendingOrCryptoMixin, withdrawExpectedMetaMixin, withdrawExpectedAtricrypto3Mixin, withdrawWrappedExpectedMixin } from "./mixins/withdrawExpectedMixins";
import { withdrawMetaFactoryMixin, withdrawZapMixin, withdrawLendingOrCryptoMixin, withdrawPlainMixin } from "./mixins/withdrawMixins";
import { withdrawWrapped2argsMixin, withdrawWrapped3argsMixin } from "./mixins/withdrawWrappedMixins";
import { withdrawImbalanceMetaFactoryMixin, withdrawImbalanceZapMixin, withdrawImbalanceLendingMixin, withdrawImbalancePlainMixin } from "./mixins/withdrawImbalanceMixins";
import { withdrawImbalanceWrapped2argsMixin, withdrawImbalanceWrapped3argsMixin } from "./mixins/withdrawImbalanceWrappedMixins";
import { withdrawOneCoinExpectedMetaFactoryMixin, withdrawOneCoinExpectedZapMixin, withdrawOneCoinExpected3argsMixin, withdrawOneCoinExpected2argsMixin } from "./mixins/withdrawOneCoinExpectedMixins";
import { withdrawOneCoinMetaFactoryMixin, withdrawOneCoinZapMixin, withdrawOneCoinLendingOrCryptoMixin, withdrawOneCoinPlainMixin } from "./mixins/withdrawOneCoinMixins";
import { withdrawOneCoinWrappedExpected2argsMixin, withdrawOneCoinWrappedExpected3argsMixin } from "./mixins/withdrawOneCoinWrappedExpectedMixins";
import { withdrawOneCoinWrappedLendingOrCryptoMixin, withdrawOneCoinWrappedMixin } from "./mixins/withdrawOneCoinWrappedMixins";


export const getPool = (poolId: string): PoolTemplate => {
    const poolDummy = new PoolTemplate(poolId);
    class Pool extends PoolTemplate {}
    const isLending = poolDummy.useLending.reduce((a, b) => a || b);
    const isPlain = !isLending && !poolDummy.isMeta && !poolDummy.isCrypto;

    // getPoolBalances
    if (poolId === "atricrypto3") {
        Object.assign(Pool.prototype, poolBalancesAtricrypto3Mixin);
    } else if (poolDummy.isMeta) {
        Object.assign(Pool.prototype, poolBalancesMetaMixin);
    } else if (poolDummy.useLending.reduce((x, y) => x || y)) {
        Object.assign(Pool.prototype, poolBalancesLendingMixin);
    }

    // depositSlippage and depositWrappedSlippage
    if (poolDummy.isCrypto) {
        Object.assign(Pool.prototype, depositSlippageCryptoMixin);
        if (!poolDummy.isFake) Object.assign(Pool.prototype, depositWrappedSlippageCryptoMixin);
    } else {
        Object.assign(Pool.prototype, depositSlippageMixin);
        if (!poolDummy.isFake) Object.assign(Pool.prototype, depositWrappedSlippageMixin);
    }

    // deposit and depositEstimateGas
    if (poolDummy.isMetaFactory) {
        Object.assign(Pool.prototype, depositMetaFactoryMixin);
    } else if (poolDummy.zap && poolId !== 'susd') {
        Object.assign(Pool.prototype, depositZapMixin);
    } else if (isLending || poolDummy.isCrypto) {
        Object.assign(Pool.prototype, depositLendingOrCryptoMixin);
    } else {
        Object.assign(Pool.prototype, depositPlainMixin);
    }

    // depositWrapped and depositWrappedEstimateGas
    if ((isLending || poolDummy.isCrypto) && !poolDummy.zap) {
        Object.assign(Pool.prototype, depositWrapped3argsMixin);
    } else if (!isPlain && !poolDummy.isFake) {
        Object.assign(Pool.prototype, depositWrapped2argsMixin);
    }

    // withdrawExpected
    if (poolId === 'atricrypto3') {
        Object.assign(Pool.prototype, withdrawExpectedAtricrypto3Mixin);
    } else if (poolDummy.isMeta) {
        Object.assign(Pool.prototype, withdrawExpectedMetaMixin);
    } else if (isLending || poolDummy.isCrypto) {
        Object.assign(Pool.prototype, withdrawExpectedLendingOrCryptoMixin);
    } else {
        Object.assign(Pool.prototype, withdrawExpectedMixin);
    }

    // withdraw and withdrawEstimateGas
    if (poolDummy.isMetaFactory) {
        Object.assign(Pool.prototype, withdrawMetaFactoryMixin);
    } else if (poolDummy.zap && poolId !== 'susd') {
        Object.assign(Pool.prototype, withdrawZapMixin);
    } else if (isLending || poolDummy.isCrypto) {
        Object.assign(Pool.prototype, withdrawLendingOrCryptoMixin);
    } else {
        Object.assign(Pool.prototype, withdrawPlainMixin);
    }

    // withdrawWrapped and withdrawWrappedEstimateGas
    if ((isLending || poolDummy.isCrypto) && !poolDummy.zap) {
        Object.assign(Pool.prototype, withdrawWrapped3argsMixin);
        Object.assign(Pool.prototype, withdrawWrappedExpectedMixin);
    } else if (!isPlain && !poolDummy.isFake) {
        Object.assign(Pool.prototype, withdrawWrapped2argsMixin);
        Object.assign(Pool.prototype, withdrawWrappedExpectedMixin);
    }

    // withdrawImbalance and withdrawImbalanceEstimateGas
    if (!poolDummy.isCrypto) {
        if (poolDummy.isMetaFactory) {
            Object.assign(Pool.prototype, withdrawImbalanceMetaFactoryMixin);
        } else if (poolDummy.zap && poolId !== 'susd') {
            Object.assign(Pool.prototype, withdrawImbalanceZapMixin);
        } else if (isLending) {
            Object.assign(Pool.prototype, withdrawImbalanceLendingMixin);
        } else {
            Object.assign(Pool.prototype, withdrawImbalancePlainMixin);
        }
    }

    // withdrawImbalanceWrapped and withdrawImbalanceWrappedEstimateGas
    if (!poolDummy.isCrypto) {
        if (isLending && !poolDummy.zap) {
            Object.assign(Pool.prototype, withdrawImbalanceWrapped3argsMixin);
        } else if (!isPlain && !poolDummy.isFake) {
            Object.assign(Pool.prototype, withdrawImbalanceWrapped2argsMixin);
        }
    }

    // withdrawOneCoinExpected
    if (poolDummy.isMetaFactory) {
        Object.assign(Pool.prototype, withdrawOneCoinExpectedMetaFactoryMixin);
    } else if ((!poolDummy.isCrypto && poolDummy.zap) || poolDummy.isMeta) { // including susd
        Object.assign(Pool.prototype, withdrawOneCoinExpectedZapMixin);
    } else if (poolId === 'ib') {
        Object.assign(Pool.prototype, withdrawOneCoinExpected3argsMixin);
    } else {
        Object.assign(Pool.prototype, withdrawOneCoinExpected2argsMixin);
    }

    // withdrawOneCoin and withdrawOneCoinEstimateGas
    if (poolDummy.isMetaFactory) {
        Object.assign(Pool.prototype, withdrawOneCoinMetaFactoryMixin);
    } else if (poolDummy.zap) { // including susd
        Object.assign(Pool.prototype, withdrawOneCoinZapMixin);
    } else if (isLending || poolDummy.isCrypto) {
        Object.assign(Pool.prototype, withdrawOneCoinLendingOrCryptoMixin);
    } else {
        Object.assign(Pool.prototype, withdrawOneCoinPlainMixin);
    }

    // withdrawOneCoinWrappedExpected
    if (!isPlain && !poolDummy.isFake && !(isLending && poolDummy.zap)) {
        if (poolId === "ib") {
            Object.assign(Pool.prototype, withdrawOneCoinWrappedExpected3argsMixin);
        } else {
            Object.assign(Pool.prototype, withdrawOneCoinWrappedExpected2argsMixin);
        }
    }

    // withdrawOneCoinWrapped and withdrawOneCoinWrappedEstimateGas
    if (!isPlain && !poolDummy.isFake && !(isLending && poolDummy.zap)) {
        if ((isLending || poolDummy.isCrypto) && !poolDummy.zap) {
            Object.assign(Pool.prototype, withdrawOneCoinWrappedLendingOrCryptoMixin);
        } else {
            Object.assign(Pool.prototype, withdrawOneCoinWrappedMixin);
        }
    }

    return new Pool(poolId);
}
