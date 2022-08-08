export class payloadForm {
    constructor(
        public commerceInfo?: JSON,
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