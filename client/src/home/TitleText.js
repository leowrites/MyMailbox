import TypeAnimation from 'react-type-animation';


export default function TitleText() {
    return (
        <div className='w-50' >
            <TypeAnimation
                cursor={true}
                sequence={[
                    'Unsubscribing is only a click away',
                    2000
                ]}
                wrapper="h2"
            />
        </div>
    )
}