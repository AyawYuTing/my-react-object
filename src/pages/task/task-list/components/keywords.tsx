import React from 'react';
import styles from '../style.less';

interface KeywordListProps {
    list: any[];
}

const keywordList: React.FC<KeywordListProps> = (props) => {
    const { list } = props;
        
    return (
        <>
            { props.children }
        </>
    );
};

export default keywordList;
