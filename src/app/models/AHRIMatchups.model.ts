export class AHRIMatchups {
    constructor(
        public outdoorUnit: string,
        public indoorUnit: string,
        public furnace: string,
        public eer: number,
        public seer: number,
        public hspf: number,
        public afue: number,
        public totalEligibleRebateAmount: number,
        public skus?: any,
        public accessories?: any,
        public coolingCapacity?: number,
        public hcap47?: number,
        public hcap17?: number,
        public furnaceInputBTUH?: number
    ) {}
}