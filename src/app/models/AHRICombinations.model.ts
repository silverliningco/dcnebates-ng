export class AHRICombinations {
    constructor(
        public outdoorUnitAHRIModel: string,
        public indoorUnitAHRIModel: string,
        public furnaceAHRIModel: string,
        public EER: number,
        public SEER: number,
        public HSPF: number,
        public AFUE: number,
        public totalAvailableRebates: number,
        public skus?: any,
        public accessories?: any,
        public coolingCapacity?: number,
        public hcap47?: number,
        public hcap17?: number,
        public furnaceInputBTUH?: number
    ) {}
}