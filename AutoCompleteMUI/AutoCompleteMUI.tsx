/**
 * Created by VIATKIN A.A on 22.04.2020
 */

import {css} from '@emotion/core';
import styled from '@emotion/styled';

import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Popover from '@material-ui/core/Popover';
import ClearIcon from '@material-ui/icons/Clear';
import axios, {AxiosResponse, CancelTokenSource} from 'axios';
import {FC, memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import DropDownChevron from '../../../assets/icons/dropdown_icon.svg';
import useHashObject from '../../hooks/useHashObject';
import {Common, Pagination, PaginationResult} from '../../store/pagination/types';
import SearchInput from '../SearchInput';

interface Props {
    url: string;
    renderItem: (item: Common) => ReactNode;
    value?: Common | Array<Common>;
    onChange: (value?: Common | Array<Common>) => void;
    emptyText?: string;
    autoOpen?: boolean;
    params?: Record<string, unknown>;
    multiple?: true;
}

const Cont = styled.div`
    position: relative;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`;

const Button = styled.button<{hasData: boolean}>`
    margin: 0;
    padding: 0 42px 0 14px;
    min-width: 270px;
    height: 32px;
    border: none;
    border-radius: 16px;
    background: no-repeat calc(100% - 14px) center/14px 9px url('${DropDownChevron}') var(--main-dark);
    color: #fff;
    font-size: 1rem;
    text-align: left;
    outline: none;
    cursor: pointer;

    &:not(:disabled):hover {
        background-color: var(--main-dark);
    }

    ${({hasData}) =>
        hasData &&
        css`
            background-image: none;
        `}
`;

const ClearButtonWrapper = styled.div`
    position: absolute;
    right: 6px;
    top: 50%;
    color: #fff;
    transform: translateY(-50%);
`;

const paginationParams: Pick<Pagination, 'page' | 'size'> = {page: 0, size: 25};

const isMultiple = (multiple: boolean, local: Common | Array<Common>): local is Array<Common> =>
    multiple || Array.isArray(local);

const AutoCompleteMUI: FC<Props> = memo(
    ({url, value, onChange, renderItem, emptyText, autoOpen, children, params, multiple}): JSX.Element => {
        const btnRef = useRef<HTMLButtonElement>(null);
        const [btn, setBtn] = useState<HTMLButtonElement | null>(null);
        const t = useRef(0);
        const canceler = useRef<CancelTokenSource>(null);
        const [items, setItems] = useState<Array<Common>>([]);
        const [request, setRequest] = useState(false);
        const [query, setQuery] = useState('');
        const [local, setLocal] = useState(value);

        const itemsId = useMemo(() => {
            return Array.isArray(value) && value.length ? new Set(value.map(item => item.id)) : new Set();
        }, [value]);

        const open = !!btn;

        useEffect(() => {
            setLocal(value);
        }, [value]);

        const cancel = useCallback(() => {
            clearTimeout(t.current);
            if (canceler.current) {
                canceler.current.cancel();
                canceler.current = null;
            }
        }, []);

        const onClose = useCallback(() => {
            setBtn(null);
            setQuery('');
            setItems([]);
        }, []);

        const onSelect = useCallback(
            (value?: Common, isSelected?: boolean) => {
                if (isMultiple(multiple, local) && value) {
                    const addOrDeleteItemInLocal = (): Array<Common> => {
                        return isSelected ? local.filter(item => item.id !== value.id) : [...local, value];
                    };
                    const nextValue = local ? addOrDeleteItemInLocal() : [value];
                    setLocal(nextValue);
                    onChange(nextValue);
                    return;
                }
                setLocal(value);
                onChange(value);
                onClose();
            },
            [local, multiple, onChange, onClose],
        );

        const [hashedParams] = useHashObject(params);

        const getData = useCallback(() => {
            setRequest(true);

            t.current = window.setTimeout(async () => {
                canceler.current = axios.CancelToken.source();

                const {data}: AxiosResponse<PaginationResult<Common>> = await axios.post(
                    url,
                    {searchString: query},
                    {
                        params: {...paginationParams, ...hashedParams},
                        cancelToken: canceler.current.token,
                    },
                );
                setItems(data.content);
                setRequest(false);
            }, 300);
        }, [url, query, hashedParams]);

        useEffect(() => {
            if (open) {
                getData();

                return () => cancel();
            }
        }, [getData, open, cancel]);

        useEffect(() => {
            if (autoOpen) {
                btnRef.current.click();
            }
        }, [autoOpen]);

        return (
            <>
                <Cont>
                    <Button
                        ref={btnRef}
                        type="button"
                        onClick={({currentTarget}) => setBtn(currentTarget)}
                        hasData={!!local}
                    >
                        {local ? children : emptyText}
                    </Button>

                    {local && (
                        <ClearButtonWrapper>
                            <IconButton
                                onClick={e => {
                                    e.stopPropagation();
                                    onSelect(null);
                                }}
                                size="small"
                                color="inherit"
                            >
                                <ClearIcon />
                            </IconButton>
                        </ClearButtonWrapper>
                    )}
                </Cont>

                <Popover
                    open={open}
                    anchorEl={btn}
                    onClose={onClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <Box width={320}>
                        <Box p={1} display="flex" flexDirection="column">
                            <SearchInput
                                value={query}
                                onChange={({target: {value}}) => setQuery(value)}
                                placeholder="Поиск"
                                autoFocus
                                loading={request}
                            />
                        </Box>

                        <List disablePadding>
                            {items.map(item => {
                                const isSelected = Array.isArray(value) ? itemsId.has(item.id) : value?.id === item.id;
                                return (
                                    <ListItem
                                        divider
                                        key={item.id}
                                        button
                                        selected={isSelected}
                                        onClick={() => onSelect(item, isSelected)}
                                    >
                                        {renderItem(item)}
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                </Popover>
            </>
        );
    },
);

AutoCompleteMUI.defaultProps = {
    value: null,
    autoOpen: false,
    emptyText: 'Выбрать',
    params: Object.freeze({}),
};

export default AutoCompleteMUI;
