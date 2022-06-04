import TypeAnimation from 'react-type-animation';
import './TitleText.css'

export default function TitleText() {
    return (
        <div className='title-text' >
            <TypeAnimation
                cursor={true}
                sequence={[
                    'A mailbox like you have never seen before.',
                    2000,
                    'Make managing your emails fun.',
                    2000
                ]}
                wrapper="h2"
            />
        </div>
    )
}