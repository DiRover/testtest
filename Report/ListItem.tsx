import TableCell from '@material-ui/core/TableCell';
import {FC, memo} from 'react';

import DateView from '../../components/DateView';
import Utils from '../../libs/Utils';

import {ReportItem} from './types';

interface Props {
    item: ReportItem;
}

const ListItem: FC<Props> = memo(({item}): JSX.Element => {
    const {
        reportDate,
        roomType: {title},
        roomName,
        roomAccount,
        meterSerialNumber,
        paramName,
        startDate,
        startValue,
        endDate,
        endValue,
        totalValue,
    } = item;

    return (
        <>
            <TableCell>
                <DateView date={reportDate} format={Utils.datePickerFormat} />
            </TableCell>
            <TableCell>{title}</TableCell>
            <TableCell>{roomName}</TableCell>
            <TableCell>{roomAccount || Utils.noData}</TableCell>
            <TableCell>{meterSerialNumber}</TableCell>
            <TableCell>{paramName}</TableCell>
            <TableCell>
                <DateView date={startDate} format={Utils.datePickerFormat} />
            </TableCell>
            <TableCell>{startValue || Utils.noData}</TableCell>
            <TableCell>
                <DateView date={endDate} format={Utils.datePickerFormat} />
            </TableCell>
            <TableCell>{endValue || Utils.noData}</TableCell>
            <TableCell>{totalValue || Utils.noData}</TableCell>
        </>
    );
});

export default ListItem;
