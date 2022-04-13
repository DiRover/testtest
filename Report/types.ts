import {BuildingObject} from '../BuildingObject/types';
import {METERING_TYPE_NAME, meteringStation} from '../MeteringStation/types';
import {RESOURCE_TYPE_NAMES, resourceType} from '../ResourceSupplyCompany/types';
import {Room, ROOM_TYPE_NAME, RoomTypes} from '../Room/types';

export enum NAMES {
    REPORT_LIST = 'REPORT_LIST',
}

export interface ReportItem {
    reportDate: string;
    roomType: RoomTypes;
    roomName: string;
    roomAccount?: Room['accountNumber'];
    meterSerialNumber: meteringStation['serialNumber'];
    paramName: resourceType['title'];
    startDate: string;
    startValue?: number;
    endDate: string;
    endValue?: number;
    totalValue?: number;
}

export interface ReportFilter {
    startDate?: ReportItem['startDate'];
    endDate?: ReportItem['endDate'];
    roomTypes?: Array<ROOM_TYPE_NAME>;
    roomNumbers?: Array<Room>;
    resourceType?: RESOURCE_TYPE_NAMES;
    params?: Array<string>;
    meteringType?: METERING_TYPE_NAME;
    buildingId?: BuildingObject['id'];
}
