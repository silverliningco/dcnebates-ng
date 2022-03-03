export class FormInfo {
    constructor(
        public rebateIds?: any,
        public heated?: boolean,
        public cooled?: boolean,
        public storeId?: number,
        public country?: string,
        public electricUtility?: any,
        public electricUtilityId?: number,
        public gasOilUtility?: number,
        public gasOilUtilityId?: number,
        public state?: string,
        public showAllResults?: boolean,
        public fuelSource?: string,
        public nominalSize?: any,
        public eligibilityDetail?: Array<JSON>,
        public productLine?: number,
        public systemTypeId?: number,
        public matchFilters?: any,
        public rangeFilters?: any,
        
    ) {}
}