export class rebateInfo {
    constructor(
        public rebateId?: number,
        public title?: string,
        public description?: string,
        public period?: string,
        public link?: string,
        public rebateCriteria?: Array<any>,
        public rebarebateTiersteId?: Array<any>

    ) {}
}