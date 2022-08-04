export class payloadForm {
    constructor(
        public commerceInfo?: JSON,
        public nominalSize?: JSON,
        public fuelSource?: string,
        public state?: string,
        public requiredRebates?: any,
        public elegibilityQuestions?: any,
        public utilityProviders?: JSON,
        public levelOneSystemTypeId?: string,
        public sizingConstraint?: string,
        public home?: string // indicates where the data comes from
    ) {}
}