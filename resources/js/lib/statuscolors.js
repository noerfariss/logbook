export const statuscolor = (key) => {
    switch (key) {
        case 'done':
            return `<div className='bg-green-600 uppercase'>DONE</div>`;
            break;

        case 'new':
            return `<div className='bg-orange-600 uppercase'>NEW</div>`;
            break;

        default:
            return `<div className='bg-blue-600 uppercase'>PROCESS</div>`;
            break;
    }
}
