export class utilityInfo {
    constructor(
        public utilityId?: any,
        public title?: boolean,
        public description?: boolean,
        public state?: number,
        public country?: string,
        public fuel?: Array<string>
    ) {}
}