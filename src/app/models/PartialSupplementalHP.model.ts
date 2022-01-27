export class PartialSupplementalHP {
    constructor(
        public skus: any,
        public outdoorUnit: string,
        public indoorUnit: string,
        public furnace: string,
        public accessories: any,
        public eer: number,
        public seer: number,
        public coolingCapacity: number,
        public hcap47: number,
        public hspf: number,
        public hcap17: number,
        public furnaceInputBTUH: number,
        public afue: number,
        public totalEligibleRebateAmount: number
    ) {}
}