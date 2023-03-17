const SC = function SC(web) {
    class SmartContract {
        type = ""
        parameters = {}

        // serialize = ()=>{
        //     let data = {
        //         type: this.type,
        //         parameters: this.parameters
        //     }
        //     return web.Web.serialize()
        // }
    }

    class SmartContractCreatePos extends SmartContract {

        constructor(fee, name = "") {
            super();
            if (fee > 0 && fee < 10000) {
                this.type = "create_pos"
                this.parameters = {
                    fee: fee
                }

                if (name.length > 0 && name.length < 40) {
                    this.parameters["name"] = name
                }
            } else {
                throw new Error("wrong types")
            }

        }
    }

    class SmartContractDelegate extends SmartContract {

        constructor(pos_id, amount) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;
            if (typeof pos_id === "string" && hash_regex.test(pos_id) && typeof amount === "bigint") {
                this.type = "delegate"
                this.parameters = {
                    pos_id: pos_id,
                    amount: amount
                }
            } else {
                throw new Error("wrong types")
            }

        }
    }

    class SmartContractUndelegate extends SmartContract {
        constructor(pos_id, amount) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;
            if (typeof pos_id === "string" && hash_regex.test(pos_id) && typeof amount === "bigint") {
                this.type = "undelegate"
                this.parameters = {
                    pos_id: pos_id,
                    amount: amount
                }
            } else {
                throw new Error("wrong types")
            }

        }
    }

    class SmartContractTransfer extends SmartContract {
        constructor(undelegate_id) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;
            if (typeof undelegate_id === "string" && hash_regex.test(undelegate_id)) {
                this.type = "transfer"
                this.parameters = {
                    undelegate_id: undelegate_id
                }
            } else {
                throw new Error("wrong types")
            }

        }
    }

    class SmartContractPosReward extends SmartContract {
        constructor(pos_id) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;
            if (typeof pos_id === "string" && hash_regex.test(pos_id)) {
                this.type = "pos_reward"
                this.parameters = {
                    pos_id: pos_id
                }
            } else {
                throw new Error("wrong types")
            }
        }
    }

    class SmartContractMint extends SmartContract {
        constructor(token_hash, amount) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;
            if (typeof token_hash === "string" && hash_regex.test(token_hash) && typeof amount === "bigint") {
                this.type = "mint"
                this.parameters = {
                    token_hash: token_hash,
                    amount: amount
                }
            } else {
                throw new Error("wrong types")
            }
        }
    }

    class SmartContractBurn extends SmartContract {
        constructor(token_hash, amount) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;
            if (typeof token_hash === "string" && hash_regex.test(token_hash) && typeof amount === "bigint") {
                this.type = "burn"
                this.parameters = {
                    token_hash: token_hash,
                    amount: amount
                }
            } else {
                throw new Error("wrong types")
            }
        }
    }

    class SmartContractCreateToken extends SmartContract {
        constructor(fee_type, fee_value, fee_min, ticker, decimals, total_supply, name, minable, reissuable, block_reward = 0n, min_stake = 0n, ref_share = 0n, referrer_stake = 0n, max_supply = 0n) {
            super();
            let ticker_regexp = /^[A-Z]{1,6}$/g;

            if (!ticker_regexp.test(ticker))
                throw  new Error("wrong ticker")

            if (decimals < 0n || decimals > 10n)
                throw new Error("wrong decimals")

            if (fee_value < 0n || typeof fee_value === 'bigint')
                throw new Error("wrong decimals")

            if (fee_min < 0n || typeof fee_min === 'bigint')
                throw new Error("wrong decimals")

            if (total_supply < 0n || typeof total_supply === 'bigint')
                throw new Error("wrong decimals")

            if (max_supply < 0n || typeof max_supply === 'bigint')
                throw new Error("wrong decimals")

            if (block_reward < 0n || typeof block_reward === 'bigint')
                throw new Error("wrong decimals")

            if (min_stake < 0n || typeof min_stake === 'bigint')
                throw new Error("wrong decimals")

            if (ref_share < 0n || typeof ref_share === 'bigint')
                throw new Error("wrong decimals")

            if (referrer_stake < 0n || typeof referrer_stake === 'bigint')
                throw new Error("wrong decimals")

            if (minable !== 0 && minable !== 1)
                throw new Error("Incorrect minable flag, expect 0 or 1")

            if (reissuable !== 0 && reissuable !== 1)
                throw new Error("Incorrect reissuable flag, expect 0 or 1")

            if (minable === 1 && reissuable === 1)
                throw new Error("Minable token can't be reissuable")


            this.type = "create_token"
            this.parameters = {
                fee_type: fee_type,
                fee_value: fee_value,
                ticker: ticker,
                decimals: decimals,
                total_supply: total_supply,
                name: name,
                minable: minable,
                reissuable: reissuable
            }

            if (minable === 1) {
                this.parameters["max_supply"] = max_supply
                this.parameters["block_reward"] = block_reward
                this.parameters["min_stake"] = min_stake
                this.parameters["referrer_stake"] = referrer_stake
                this.parameters["ref_share"] = ref_share
            }
        }
    }

    // pools
    class SmartContractPoolCreate extends SmartContract {
        constructor(asset_1, amount_1, asset_2, amount_2) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;

            if (typeof asset_1 !== "string" && !hash_regex.test(asset_1)) {
                throw new Error("wrong asset_1")
            }

            if (typeof asset_2 !== "string" && !hash_regex.test(asset_2)) {
                throw new Error("wrong asset_2")
            }

            if (typeof amount_1 !== "bigint" || amount_1 < 0n) {
                throw new Error("wrong amount_1")
            }

            if (typeof amount_2 !== "bigint" || amount_2 < 0n) {
                throw new Error("wrong amount_2")
            }

            this.type = "pool_create"
            this.parameters = {
                asset_1: asset_1,
                amount_1: amount_1,
                asset_2: asset_2,
                amount_2: amount_2
            }
        }
    }

    class SmartContractPoolLiquidityAdd extends SmartContract {
        constructor(asset_1, amount_1, asset_2, amount_2) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;

            if (typeof asset_1 !== "string" && !hash_regex.test(asset_1)) {
                throw new Error("wrong asset_1")
            }

            if (typeof asset_2 !== "string" && !hash_regex.test(asset_2)) {
                throw new Error("wrong asset_2")
            }

            if (typeof amount_1 !== "bigint" || amount_1 < 0n) {
                throw new Error("wrong amount_1")
            }

            if (typeof amount_2 !== "bigint" || amount_2 < 0n) {
                throw new Error("wrong amount_2")
            }

            this.type = "pool_add_liquidity"
            this.parameters = {
                asset_1: asset_1,
                amount_1: amount_1,
                asset_2: asset_2,
                amount_2: amount_2
            }
        }
    }

    class SmartContractPoolLiquidityRemove extends SmartContract {
        constructor(lt, amount) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;

            if (typeof lt !== "string" && !hash_regex.test(lt)) {
                throw new Error("wrong lt")
            }

            if (typeof amount !== "bigint" || amount < 0n) {
                throw new Error("wrong amount")
            }

            this.type = "pool_remove_liquidity"
            this.parameters = {
                lt: lt,
                amount: amount
            }
        }
    }

    class SmartContractPoolLiquiditySellExact extends SmartContract {
        constructor(asset_in, amount_in, asset_out, amount_out_min) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;

            if (typeof asset_in !== "string" && !hash_regex.test(asset_in)) {
                throw new Error("wrong asset_in")
            }

            if (typeof asset_out !== "string" && !hash_regex.test(asset_out)) {
                throw new Error("wrong asset_out")
            }

            if (typeof amount_in !== "bigint" || amount_in < 1n) {
                throw new Error("wrong amount_in")
            }

            if (typeof amount_out_min !== "bigint" || amount_out_min < 0n) {
                throw new Error("wrong amount_out_min")
            }

            this.type = "pool_sell_exact"
            this.parameters = {
                asset_in: asset_in,
                amount_in: amount_in,
                asset_out: asset_out,
                amount_out_min: amount_out_min
            }
        }
    }

    class SmartContractPoolLiquiditySellExactRouted extends SmartContract {
        constructor(asset0, amount_in, asset1, amount_out_min, plength, asset2 = undefined, asset3 = undefined) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;

            if (typeof asset0 !== "string" && !hash_regex.test(asset0)) {
                throw new Error("wrong asset0")
            }

            if (typeof asset1 !== "string" && !hash_regex.test(asset1)) {
                throw new Error("wrong asset1")
            }

            if (typeof amount_in !== "bigint" || amount_in < 1n) {
                throw new Error("wrong amount_in")
            }

            if (typeof amount_out_min !== "bigint" || amount_out_min < 0n) {
                throw new Error("wrong amount_out_min")
            }
            if (plength > 2 && plength < 4) {
                throw new Error("wrong plength")
            }

            this.type = "pool_sell_exact_routed"
            this.parameters = {
                asset0: asset0,
                amount_in: amount_in,
                asset1: asset1,
                amount_out_min: amount_out_min,
                plength: plength
            }

            if (asset2 !== undefined && typeof asset2 === "string" && hash_regex.test(asset2)) {
                this.parameters["asset2"] = asset2
            }

            if (asset3 !== undefined && typeof asset3 === "string" && hash_regex.test(asset3)) {
                this.parameters["asset3"] = asset3
            }
        }
    }

    class SmartContractPoolLiquidityBuyExact extends SmartContract {
        constructor(asset_in, amount_in_max, asset_out, amount_out) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;

            if (typeof asset_in !== "string" && !hash_regex.test(asset_in)) {
                throw new Error("wrong asset_in")
            }

            if (typeof asset_out !== "string" && !hash_regex.test(asset_out)) {
                throw new Error("wrong asset_out")
            }

            if (typeof amount_in_max !== "bigint" || amount_in_max < 1n) {
                throw new Error("wrong amount_in_max")
            }

            if (typeof amount_out !== "bigint" || amount_out < 1n) {
                throw new Error("wrong amount_out")
            }

            this.type = "pool_buy_exact"
            this.parameters = {
                asset_in: asset_in,
                amount_in: amount_in_max,
                asset_out: asset_out,
                amount_out_min: amount_out
            }
        }
    }

    class SmartContractPoolLiquidityBuyExactRouted extends SmartContract {
        constructor(asset0, amount_in_max, asset1, amount_out, plength, asset2 = undefined, asset3 = undefined) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;

            if (typeof asset0 !== "string" && !hash_regex.test(asset0)) {
                throw new Error("wrong asset0")
            }

            if (typeof asset1 !== "string" && !hash_regex.test(asset1)) {
                throw new Error("wrong asset1")
            }

            if (typeof amount_in_max !== "bigint" || amount_in_max < 1n) {
                throw new Error("wrong amount_in_max")
            }

            if (typeof amount_out !== "bigint" || amount_out < 0n) {
                throw new Error("wrong amount_out")
            }
            if (plength > 2 && plength < 4) {
                throw new Error("wrong plength")
            }

            this.type = "pool_buy_exact_routed"
            this.parameters = {
                asset0: asset0,
                amount_in_max: amount_in_max,
                asset1: asset1,
                amount_out: amount_out,
                plength: plength
            }

            if (asset2 !== undefined && typeof asset2 === "string" && hash_regex.test(asset2)) {
                this.parameters["asset2"] = asset2
            }

            if (asset3 !== undefined && typeof asset3 === "string" && hash_regex.test(asset3)) {
                this.parameters["asset3"] = asset3
            }
        }
    }


    // farms
    class SmartContractFarmCreate extends SmartContract {
        constructor(stake_token, reward_token, block_reward, emission) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;

            if (typeof stake_token !== "string" && !hash_regex.test(stake_token)) {
                throw new Error("wrong stake_token")
            }

            if (typeof reward_token !== "string" && !hash_regex.test(reward_token)) {
                throw new Error("wrong reward_token")
            }

            if (typeof block_reward !== "bigint" || block_reward < 1n) {
                throw new Error("wrong block_reward")
            }

            if (typeof emission !== "bigint" || emission < 1n) {
                throw new Error("wrong emission")
            }

            this.type = "farm_create"
            this.parameters = {
                stake_token: stake_token,
                reward_token: reward_token,
                block_reward: block_reward,
                emission: emission
            }
        }
    }

    class SmartContractFarmIncreaseStake extends SmartContract {
        constructor(farm_id, amount) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;

            if (typeof farm_id !== "string" && !hash_regex.test(farm_id)) {
                throw new Error("wrong farm_id")
            }

            if (typeof amount !== "bigint" || amount < 0n) {
                throw new Error("wrong amount")
            }

            this.type = "farm_increase_stake"
            this.parameters = {
                farm_id: farm_id,
                amount: amount
            }
        }
    }

    class SmartContractFarmDecreaseStake extends SmartContract {
        constructor(farm_id, amount) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;

            if (typeof farm_id !== "string" && !hash_regex.test(farm_id)) {
                throw new Error("wrong farm_id")
            }

            if (typeof amount !== "bigint" || amount < 0n) {
                throw new Error("wrong amount")
            }

            this.type = "farm_decrease_stake"
            this.parameters = {
                farm_id: farm_id,
                amount: amount
            }
        }
    }

    class SmartContractFarmCloseStake extends SmartContract {
        constructor(farm_id) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;

            if (typeof farm_id !== "string" && !hash_regex.test(farm_id)) {
                throw new Error("wrong farm_id")
            }

            this.type = "farm_close_stake"
            this.parameters = {
                farm_id: farm_id
            }
        }
    }

    class SmartContractFarmGetReward extends SmartContract {
        constructor(farm_id) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;

            if (typeof farm_id !== "string" && !hash_regex.test(farm_id)) {
                throw new Error("wrong farm_id")
            }

            this.type = "farm_get_reward"
            this.parameters = {
                farm_id: farm_id
            }
        }
    }

    class SmartContractFarmsAddEmission extends SmartContract {
        constructor(farm_id, amount) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;

            if (typeof farm_id !== "string" && !hash_regex.test(farm_id)) {
                throw new Error("wrong farm_id")
            }

            if (typeof amount !== "bigint" || amount < 0n) {
                throw new Error("wrong amount")
            }

            this.type = "farm_add_emission"
            this.parameters = {
                farm_id: farm_id,
                amount: amount
            }
        }
    }

    //dex

    class SmartContractDexCmdDistribute extends SmartContract {
        constructor(token_hash) {
            super();
            let hash_regex = /^[0-9a-fA-F]{64}$/i;

            if (typeof token_hash !== "string" && !hash_regex.test(token_hash)) {
                throw new Error("wrong token_hash")
            }

            this.type = "farm_add_emission"
            this.parameters = {
                token_hash: token_hash
            }
        }
    }

    class TransactionGenerator{
        from = ""
        to = ""
        amount = 0
        nonce = 0
        data = ""
        ticker = ""

        constructor(net) {
            try{
                fetch(net + "/api/v1/native_token")
                    .then(response => response.json())
                    .then(data => {
                        if (data.hash !== undefined) {
                            // resolve(data.hash)
                            this.ticker = data.hash
                            this.to = data.owner
                            this.amount = data.fee_value
                            this.nonce = Math.floor(Math.random() * 1e10)
                            return {
                                from: this.from,
                                to: this.to,
                                amount:this.amount,
                                ticker: this.ticker,
                                nonce: this.nonce,
                                data: this.data
                            }
                        } else {
                            throw new Error("Not valid for this network")
                        }
                    })
                    .catch(e => {
                        throw new Error("something wrong...\n"+e)
                    })

            }catch (e) {
                console.error(e)
                return undefined
            }

        }
    }

    this.TransactionGenerator = TransactionGenerator

    this.SCGenerators = {
        SmartContract,

        pos: {
            SmartContractCreatePos,
            SmartContractDelegate,
            SmartContractUndelegate,
            SmartContractPosReward,
            SmartContractTransfer,
        },
        token: {
            SmartContractCreateToken,
            SmartContractBurn,
            SmartContractMint,
        },
        pool: {
            SmartContractPoolCreate,
            SmartContractPoolLiquidityAdd,
            SmartContractPoolLiquidityRemove,
            SmartContractPoolLiquiditySellExact,
            SmartContractPoolLiquiditySellExactRouted,
            SmartContractPoolLiquidityBuyExact,
            SmartContractPoolLiquidityBuyExactRouted,
        },
        farm: {
            SmartContractFarmCreate,
            SmartContractFarmIncreaseStake,
            SmartContractFarmDecreaseStake,
            SmartContractFarmCloseStake,
            SmartContractFarmGetReward,
            SmartContractFarmsAddEmission,
        },
        dex: {
            SmartContractDexCmdDistribute
        },
    }
}


module.exports = SC

