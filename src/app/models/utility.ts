export class utilityInfo {
    constructor(
        public utilityId?: any,
        public title?: string,
        public description?: string,
        public state?: number,
        public country?: string,
        public utilitiesProvided?: Array<string>
    ) {}
}