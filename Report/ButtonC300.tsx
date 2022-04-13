import {FC, memo} from 'react';

import {shallowEqual, useSelector} from 'react-redux';

import DownloadButton from '../../components/DownloadButton';
import API from '../../libs/API';

import {PaginationResult} from '../../store/pagination/types';
import {RootState} from '../../store/types';

import {NAMES} from './types';

interface RootStateWithReport extends Omit<RootState, 'requests'> {
    requests: {
        resultRequest: Record<NAMES.REPORT_LIST, PaginationResult>;
    };
}

const ButtonC300: FC = memo((): JSX.Element => {
    const totalElements = useSelector<RootStateWithReport, number>(
        state => state.requests.resultRequest[NAMES.REPORT_LIST]?.totalElements,
        shallowEqual,
    );

    return (
        <DownloadButton
            buttonText="C-300"
            url={API.report({command: 'c-300-report-excel'})}
            tooltipText="Выгрузка файла для интеграции с С-300"
            disabled={!totalElements}
        />
    );
});

export default ButtonC300;
