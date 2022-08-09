
export class CommerceInfo {
    constructor(
        public storeId?:  number,
        public showAllResults?: boolean,
    ) {}
}

export class payloadForm {
    constructor(
        public commerceInfo?: CommerceInfo,
        public nominalSize?: JSON,
        public fuelSource?: string,
        public state?: string,
        public requiredRebates?: any,
        public eligibilityCriteria?: any,
        public utilityProviders?: JSON,
        public levelOneSystemTypeId?: number,
        public levelTwoSystemTypeId?: number,
        public sizingConstraint?: string,
        public home?: string // indicates where the data comes from
    ) {}
}