import * as echarts from 'echarts';
import 'echarts-gl';
import {FC, useEffect, useRef} from 'react';

import useGlobalState from '../../hooks/useGlobalState';
import useQuery from '../../hooks/useQuery';
import API from '../../libs/API';
import {METHODS} from '../../store/helper/types';
import {BuildingObject, NAMES as BUILDING_OBJECT_NAMES} from '../BuildingObject/types';
import {METERING_TYPE_NAME} from '../MeteringStation/types';
import {ResourceTypeParams} from '../MeteringStationProfile/types';
import {RESOURCE_TYPE_NAMES} from '../ResourceSupplyCompany/types';
import {ROOM_TYPE_NAME} from '../Room/types';

interface ChartItem {
    date: string;
    paramName: ResourceTypeParams['name'];
    period: string;
    resourceType: RESOURCE_TYPE_NAMES;
    roomType: ROOM_TYPE_NAME;
    type: string;
    units: string;
    value: number;
}

interface ChartItemRequest {
    buildingId: BuildingObject['id'];
    meteringType: string;
    resourceType: string;
    сonsumptionType: string;
}

const MyChart: FC = (): JSX.Element => {
    const elem = useRef<HTMLDivElement | null>(null);
    const chart = useRef<echarts.ECharts | null>(null);

    const [buildingObjectId] = useGlobalState<string>(BUILDING_OBJECT_NAMES.CONTEXT_BUILDING_ID);

    const [parameters] = useQuery<Array<ChartItem>, ChartItemRequest>({
        url: API.buildingObject({command: 'period-consumption'}),
        name: `ResourceTypeParamChart`,
        filter: {
            buildingId: buildingObjectId,
            meteringType: METERING_TYPE_NAME.INDIVIDUAL,
            resourceType: RESOURCE_TYPE_NAMES.HEAT_SUPPLY,
            сonsumptionType: 'MONTH',
        },
        method: METHODS.POST,
    });

    console.log(parameters);

    useEffect(() => {
        if (elem.current) {
            chart.current = echarts.init(elem.current);
        }
    }, []);

    useEffect(() => {
        if (elem.current) {
            const responseFromServer = [
                {paramName: 'test 1', date: '1', value: 30},
                {paramName: 'test 1', date: '2', value: 20},
                {paramName: 'test 1', date: '3', value: 50},
                {paramName: 'test 1', date: '4', value: 10},
                {paramName: 'test 1', date: '5', value: 60},
                {paramName: 'test 1', date: '6', value: 100},
                {paramName: 'test 1', date: '7', value: 40},
                {paramName: 'test 1', date: '8', value: 80},
                {paramName: 'test 1', date: '9', value: 50},
                {paramName: 'test 1', date: '10', value: 90},
                {paramName: 'test 2', date: '1', value: 30},
                {paramName: 'test 2', date: '2', value: 20},
                {paramName: 'test 2', date: '3', value: 50},
                {paramName: 'test 2', date: '4', value: 10},
                {paramName: 'test 2', date: '5', value: 60},
                {paramName: 'test 2', date: '6', value: 100},
                {paramName: 'test 2', date: '7', value: 40},
                {paramName: 'test 2', date: '8', value: 80},
                {paramName: 'test 2', date: '9', value: 50},
                {paramName: 'test 2', date: '10', value: 90},
            ];

            const paramsNames = Array.from(new Set(parameters.map(item => item.paramName)));
            const period = Array.from(new Set(parameters.map(item => item.date)));

            const myData = responseFromServer.map(item => {
                return [paramsNames.indexOf(item.paramName), period.indexOf(item.date), item.value, item.paramName];
            });

            const option = {
                tooltip: {},
                title: {
                    text: 'Показания',
                },
                visualMap: {
                    max: 90,
                    inRange: {
                        color: [
                            '#313695',
                            '#4575b4',
                            '#74add1',
                            '#abd9e9',
                            '#e0f3f8',
                            '#ffffbf',
                            '#fee090',
                            '#fdae61',
                            '#f46d43',
                            '#d73027',
                            '#a50026',
                        ],
                    },
                },
                xAxis3D: {
                    type: 'category',
                    data: period,
                    name: 'Период',
                },
                yAxis3D: {
                    type: 'category',
                    data: paramsNames,
                    name: '',
                },
                zAxis3D: {
                    type: 'value',
                    name: 'Показания',
                },
                grid3D: {
                    boxWidth: 200,
                    boxDepth: 80,
                    viewControl: {
                        // projection: 'orthographic'
                    },
                    light: {
                        main: {
                            intensity: 1.2,
                            shadow: true,
                        },
                        ambient: {
                            intensity: 0.3,
                        },
                    },
                },
                series: [
                    {
                        type: 'bar3D',
                        name: 'Some text',
                        data: myData.map(item => {
                            return {
                                value: [item[1], item[0], item[2]],
                                name: item[3],
                            };
                        }),
                        shading: 'lambert',
                        label: {
                            show: false,
                            fontSize: 16,
                            borderWidth: 1,
                            formatter: ['test123'],
                        },
                        emphasis: {
                            label: {
                                fontSize: 20,
                                color: 'rgba(180,99,255,0.5)',
                            },
                            itemStyle: {
                                color: '#009999',
                            },
                        },
                    },
                ],
            };

            chart.current.setOption(option);
        }
    }, [parameters]);

    return (
        <>
            <div ref={elem} style={{width: '1000px', height: '500px'}} />
        </>
    );
};

export default MyChart;
