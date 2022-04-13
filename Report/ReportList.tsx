import {FC, memo} from 'react';

import PaginationWrapper from '../../components/PaginationWrapper';
import useGlobalState from '../../hooks/useGlobalState';
import API from '../../libs/API';
import {ColumnProps, RowProps} from '../../store/pagination/types';
import {NAMES as BUILDING_OBJECT_NAMES} from '../BuildingObject/types';

import ListItem from './ListItem';

import {NAMES, ReportItem} from './types';

const headerRows: Array<ColumnProps> = [
    {title: 'Дата'},
    {title: 'Тип помещения'},
    {title: 'Помещение'},
    {title: 'Лицевой счет'},
    {title: 'Серийный номер'},
    {title: 'Показатель расхода'},
    {title: 'Дата начальных показаний'},
    {title: 'Показания на начало периода'},
    {title: 'Дата конечных показаний'},
    {title: 'Показания на конец периода'},
    {title: 'Потреблено за период'},
];

const ReportList: FC = memo((): JSX.Element => {
    const [buildingId] = useGlobalState<string>(BUILDING_OBJECT_NAMES.CONTEXT_BUILDING_ID);

    const rowVariant: RowProps<ReportItem>['rowVariant'] = item => {
        return typeof item.totalValue === 'number' ? undefined : 'warning';
    };

    return (
        <PaginationWrapper
            tableProps={{
                itemRender: (item: ReportItem) => <ListItem item={item} />,
                columns: headerRows,
                lastCellHidden: true,
            }}
            rowVariant={rowVariant}
            name={NAMES.REPORT_LIST}
            url={API.buildingObject({id: buildingId, command: 'report'})}
            isPost
        />
    );
});

export default ReportList;
