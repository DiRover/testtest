import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import endOfDay from 'date-fns/endOfDay';
import startOfMonth from 'date-fns/startOfMonth';
import {ChangeEvent, FC, memo, useCallback, useEffect, useMemo} from 'react';

import AutoCompleteMUI from '../../components/AutoCompleteMUI/AutoCompleteMUI';
import CustomSelect from '../../components/CustomSelect';
import FilterTabs from '../../components/FilterTabs';

import RangePicker from '../../components/RangePicker';
import Request from '../../components/Request';
import useFilterPagination from '../../hooks/useFilterPagination';
import useGlobalState from '../../hooks/useGlobalState';

import useQuery from '../../hooks/useQuery';
import API from '../../libs/API';

import {METHODS} from '../../store/helper/types';
import {NAMES as BUILDING_OBJECT_NAMES} from '../BuildingObject/types';
import {METERING_TYPE_NAME, MeteringType} from '../MeteringStation/types';
import {ResourceTypeParams} from '../MeteringStationProfile/types';
import {NAMES as NAMES_RSC, RESOURCE_TYPE_NAMES, resourceType as resourceTYPE} from '../ResourceSupplyCompany/types';

import {Room, RoomTypes} from '../Room/types';

import {ReportFilter, NAMES} from './types';

const Filter: FC = memo((): JSX.Element => {
    const [buildingId] = useGlobalState<string>(BUILDING_OBJECT_NAMES.CONTEXT_BUILDING_ID);

    const firstDayOfMonth = useMemo(() => startOfMonth(new Date()).toISOString(), []);
    const currentDayOfMonth = useMemo(() => endOfDay(new Date()).toISOString(), []);

    const [
        {
            startDate = null,
            endDate = null,
            roomTypes = [],
            roomNumbers = null,
            resourceType = '',
            params = [],
            meteringType = null,
        } = {},
        setFilter,
    ] = useFilterPagination<ReportFilter>(NAMES.REPORT_LIST);

    useEffect(
        () =>
            setFilter({
                startDate: firstDayOfMonth,
                endDate: currentDayOfMonth,
                roomTypes: [],
                roomNumbers: null,
                resourceType: undefined,
                params: [],
                meteringType: null,
            }),
        [buildingId, currentDayOfMonth, firstDayOfMonth, setFilter],
    );

    const [actualTypes = []] = useQuery<Array<MeteringType>>({
        url: API.buildingObject({id: buildingId, command: 'report', command2: 'statistic-by-type'}),
        name: `REPORT_STAT_TYPE_${buildingId}`,
    });

    const isActualTypes = useMemo(() => {
        return actualTypes.length > 0;
    }, [actualTypes]);

    useEffect(() => {
        if (isActualTypes && !meteringType) {
            setFilter({meteringType: actualTypes[0].name});
        }
    }, [setFilter, actualTypes, isActualTypes, meteringType]);

    const handleRadioChange = useCallback(
        value => {
            setFilter({meteringType: value as METERING_TYPE_NAME});
        },
        [setFilter],
    );

    const handleSelectRoomType = useCallback(
        ({target: {value: type}}: ChangeEvent<HTMLSelectElement>) => {
            setFilter({roomTypes: Array.isArray(type) ? (type as ReportFilter['roomTypes']) : []});
        },
        [setFilter],
    );

    const handleSelectRooms = useCallback(
        (value: Array<Room>) => {
            setFilter({roomNumbers: value});
        },
        [setFilter],
    );

    const handleSelectResourceType = useCallback(
        ({target: {value}}: ChangeEvent<HTMLSelectElement>) => {
            setFilter({
                resourceType: value as RESOURCE_TYPE_NAMES,
                params: [],
            });
        },
        [setFilter],
    );

    const handleSelectTypeParams = useCallback(
        ({target: {value}}: ChangeEvent<HTMLSelectElement>) => {
            setFilter({
                params: Array.isArray(value) ? (value as ReportFilter['params']) : [],
            });
        },
        [setFilter],
    );

    if (!isActualTypes) return null;

    return (
        <>
            <FilterTabs value={meteringType} onChange={handleRadioChange} options={actualTypes} />
            <Box px={2.5} mt={2.5}>
                <Grid container spacing={2}>
                    <Grid item>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Request
                                    url={API.room({command: 'type'})}
                                    name="roomTypes"
                                    cache
                                    render={(types: Array<RoomTypes> = []) => (
                                        <CustomSelect
                                            value={roomTypes}
                                            onChange={handleSelectRoomType}
                                            multiple
                                            displayEmpty
                                            renderValue={(selected: Array<string>) => {
                                                if (selected.length === 0) {
                                                    return 'Типы помещений';
                                                }

                                                return `Выбрано элементов: ${selected.length}`;
                                            }}
                                        >
                                            <MenuItem value="" disabled>
                                                Типы помещений
                                            </MenuItem>

                                            {types.map(({name, title}) => (
                                                <MenuItem key={name} value={name}>
                                                    {title}
                                                </MenuItem>
                                            ))}
                                        </CustomSelect>
                                    )}
                                />
                            </Grid>
                            <Grid item>
                                <AutoCompleteMUI
                                    url={API.buildingObject({
                                        command: 'room-filter',
                                        id: buildingId,
                                    })}
                                    value={roomNumbers}
                                    renderItem={(item: Room) => <ListItemText primary={item.name} />}
                                    onChange={(rooms: Array<Room>) => handleSelectRooms(rooms)}
                                    emptyText="Помещения"
                                    multiple
                                    params={{
                                        sort: 'name,asc',
                                    }}
                                >
                                    {`Выбрано элементов: ${roomNumbers?.length}`}
                                </AutoCompleteMUI>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Request
                                    url={API.resourceSupplyCompany({command: 'resource-type'})}
                                    name={NAMES_RSC.RESOURCE_TYPES}
                                    cache
                                    render={(types: Array<resourceTYPE> = []) => (
                                        <CustomSelect
                                            value={resourceType}
                                            onChange={handleSelectResourceType}
                                            displayEmpty
                                        >
                                            <MenuItem disabled value="">
                                                Типы ресурсов
                                            </MenuItem>

                                            {types.map(({name, title}) => (
                                                <MenuItem key={name} value={name}>
                                                    {title}
                                                </MenuItem>
                                            ))}
                                        </CustomSelect>
                                    )}
                                />
                            </Grid>

                            <Grid item>
                                <Request
                                    url={API.report({command: 'parameter'})}
                                    name="resourceTypeParam"
                                    filter={{
                                        resourceType,
                                        buildingObjectId: buildingId,
                                    }}
                                    method={METHODS.POST}
                                    render={(items: Array<ResourceTypeParams> = []) => (
                                        <CustomSelect
                                            value={params}
                                            onChange={handleSelectTypeParams}
                                            displayEmpty
                                            multiple
                                            renderValue={(selected: Array<string>) => {
                                                if (selected.length === 0) {
                                                    return 'Показатели расхода ресурса';
                                                }

                                                return `Выбрано элементов: ${selected.length}`;
                                            }}
                                        >
                                            <MenuItem disabled value="">
                                                Показатели расхода ресурса
                                            </MenuItem>
                                            {items?.map(({name, id}) => (
                                                <MenuItem key={name} value={id}>
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </CustomSelect>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <RangePicker
                            disableFuture
                            value={{
                                startDate,
                                endDate,
                            }}
                            onChange={({startDate, endDate}) => {
                                setFilter({
                                    startDate,
                                    endDate,
                                });
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
});
export default Filter;
