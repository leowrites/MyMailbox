import TypeAnimation from 'react-type-animation';
import './TitleText.css'

export default function TitleText() {
    return (
        <div className='title-text' >
            <TypeAnimation
                cursor={true}
                sequence={[
                    'Deleting is only a click a way',
                    2000,
                    'Deleting has never been so easy.',
                    2000
                ]}
                wrapper="h2"
            />
        </div>
    )
}