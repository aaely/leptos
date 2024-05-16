import React from 'react';
import { CircleLoader } from 'react-spinners';
import { Box } from 'gestalt';
import "gestalt/dist/gestalt.css";

const Circles = () => {
    return (
    <Box
    position="fixed"
    dangerouslySetInlineStyle={{
        __style: {
            bottom: '70%',
            left: '45%',
            transform: "translateX(-50%)",

        }
    }}
    >
    <CircleLoader 
    color="green"
    size = {200}
    />
    </Box>
    );
}

export default Circles;