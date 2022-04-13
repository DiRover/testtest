import Box from '@material-ui/core/Box';
import {FC, memo} from 'react';

import ContentWrapper from '../../components/ContentWrapper';

import ButtonC300 from './ButtonC300';
import Filter from './Filter';
import ReportList from './ReportList';

const Page: FC = memo((): JSX.Element => {
    return (
        <ContentWrapper>
            <Box px={2.5} pb={2.5}>
                <ButtonC300 />
            </Box>
            <Filter />

            <ReportList />
        </ContentWrapper>
    );
});

export default Page;
