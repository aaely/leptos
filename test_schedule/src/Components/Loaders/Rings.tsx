import { RingLoader } from 'react-spinners';
import { Box } from 'gestalt';
import "gestalt/dist/gestalt.css";


const Rings = () => {
    return (
    <Box
    position="fixed"
    dangerouslySetInlineStyle={{
        __style: {
            bottom: 300,
            left: '45%',
            transform: "translateX(-50%)",

        }
    }}
    >
    <RingLoader 
    color="green"
    size = {200}
    />
    </Box>
    );
}

export default Rings;