import {FC, memo} from 'react';

import {useSelector} from 'react-redux';

import DownloadButton from '../../components/DownloadButton';
import API from '../../libs/API';
import {PaginationResult} from '../../store/pagination/types';
import {RootState} from '../../store/types';

import {NAMES} from './types';

const ButtonC300: FC = memo((): JSX.Element => {
    const {
        requests: {
            resultRequest: {[NAMES.REPORT_LIST]: totalElements},
        },
        pagination: {filter},
    } = useSelector<RootState, RootState>(state => state);

    return (
        <>
            <DownloadButton
                buttonText="C-300"
                url={API.report({command: 'c-300-report'})}
                tooltipText="Выгрузка файла для интеграции с С-300"
                disabled={!(totalElements as Pick<PaginationResult, 'totalElements'>)?.totalElements}
                params={filter[NAMES.REPORT_LIST] as Record<string, string | Array<string>>}
            />
        </>
    );
});

export default ButtonC300;
