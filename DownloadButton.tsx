/**
 * Created by Tsivunin R. on 28.08.2020
 */

import Button, {ButtonProps} from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import axios, {CancelTokenSource} from 'axios';
import {FC, memo, useCallback, useMemo, useRef, useState} from 'react';
import {ReactSVG} from 'react-svg';

import ReportIcon from '../../assets/icons/report.svg';
import {NAMES as BUILDING_OBJECT_NAMES} from '../entities/BuildingObject/types';
import {MeteringType} from '../entities/MeteringStation/types';
import {NAMES} from '../entities/Report/types';
import useFilterPagination from '../hooks/useFilterPagination';
import useGlobalState from '../hooks/useGlobalState';
import useMutation from '../hooks/useMutation';
import useQuery from '../hooks/useQuery';
import useToken from '../hooks/useToken';

import API from '../libs/API';

import {METHODS} from '../store/helper/types';

import Icon from './Icon';

interface Props extends Pick<ButtonProps, 'disabled'> {
    url: string;
    params?: Record<string, string | Array<string>>;
    buttonText?: string;
    buttonIcon?: string;
    tooltipText?: string;
}

const DownloadButton: FC<Props> = memo(
    ({buttonText, tooltipText, buttonIcon, url, params, children, ...rest}): JSX.Element => {
        const access_token = useToken();
        const [buildingId] = useGlobalState<string>(BUILDING_OBJECT_NAMES.CONTEXT_BUILDING_ID);
        const [loading, setLoading] = useState(false);

        const [actualTypes = []] = useQuery<Array<MeteringType>>({
            url: API.buildingObject({id: buildingId, command: 'report', command2: 'statistic-by-type'}),
            name: `REPORT_STAT_TYPE_${buildingId}`,
        });
        console.log(actualTypes);

        const finalUrl = useMemo<string>(() => {
            const queryParams = new URLSearchParams();
            queryParams.append('access_token', access_token);
            Object.entries(params).forEach(([key, value]) => {
                if (typeof value !== 'undefined' && value !== null) {
                    if (Array.isArray(value)) value.forEach(v => queryParams.append(key, v));
                    else queryParams.append(key, value);
                }
            });
            return `${url}?${queryParams.toString()}`;
        }, [access_token, url, params]);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [filter = {}] = useFilterPagination<Record<string, unknown>>(NAMES.REPORT_LIST);

        const canceler = useRef<CancelTokenSource>();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [data, , run, cancel, error] = useMutation({
            url: finalUrl,
            // @ts-ignore
            method: METHODS.GET,
        });

        const download = useCallback(async () => {
            // console.log('download');

            try {
                // run();
                setLoading(true);
                canceler.current = axios.CancelToken.source();
                // console.log(canceler.current);
                const obj = await axios.get<Blob>(finalUrl, {
                    responseType: 'blob',
                    cancelToken: canceler.current.token,
                });
                const {data: blob} = obj;
                const headerLine = obj.headers['content-disposition'];
                const targetField = 'filename=';
                const targetFieldIndex = headerLine.indexOf(targetField);
                const fileName = headerLine.slice(targetFieldIndex + targetField.length);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const urlCreator: typeof URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
                const url = urlCreator.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                urlCreator.revokeObjectURL(url);
                a.remove();
                setLoading(false);
            } catch (e) {
                console.log(e);
                if (!axios.isCancel(e)) {
                    setLoading(false);
                }
            }
        }, [finalUrl]);

        return (
            <>
                <Tooltip title={tooltipText}>
                    <Button
                        {...rest}
                        href={finalUrl}
                        variant="contained"
                        color="primary"
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={
                            <Icon size={20}>
                                <ReactSVG src={buttonIcon} wrapper="span" />
                            </Icon>
                        }
                    >
                        {buttonText}
                    </Button>
                </Tooltip>
                <Tooltip title={tooltipText}>
                    <Button
                        {...rest}
                        variant="contained"
                        color="primary"
                        onClick={download}
                        disabled={loading}
                        startIcon={
                            <Icon size={20}>
                                <ReactSVG src={buttonIcon} wrapper="span" />
                            </Icon>
                        }
                    >
                        {buttonText}
                    </Button>
                </Tooltip>
            </>
        );
    },
);

DownloadButton.defaultProps = {
    buttonText: 'Отчет',
    buttonIcon: ReportIcon,
    tooltipText: 'Выгрузка файла',
    params: {},
};

export default DownloadButton;
