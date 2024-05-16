import Circles from './Loaders/Circles'
import Rings from './Loaders/Rings'

interface Type {
    type: string
}

const Loader: any = (props: Type) => {
    switch(props.type) {
        case 'rings': {
            return <Rings />
        }
        case 'circles': {
            return <Circles />
        }
        default: {
            break;
        }
    }
}

export default Loader;