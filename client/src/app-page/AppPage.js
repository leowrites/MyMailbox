import Container from 'react-bootstrap/Container'
import Stack from 'react-bootstrap/Stack'
import ContentCard from './ContentCard'
import ControllBar from './ControllBar'
import { useAuth } from '../context/auth'
import { useEffect, useState } from 'react'
import { generateColors } from './color'
import { WhisperSpinner } from 'react-spinners-kit'

const colors = generateColors(100)
// implement infinite scroll
// import InfiniteScroll from 'react-infinite-scroller'
export default function AppPage() {
    const [data, setData] = useState(null)
    // save key id if checkbox is selected
    const [keyId, setKeyId] = useState([])
    const [allChecked, setAllChekced] = useState(false)
    const auth = useAuth()

    useEffect(() => {
        console.log('fetching for messages')
        fetch('api/mail/messages')
            .then(res => res.json())
            .then(data => setData(data))
    }, [])


    const handleCheck = (id) => {
        if (keyId.includes(id)) {
            setKeyId([...keyId.filter(k => k !== id)])
        } else {
            setKeyId([...keyId, id])
        }
    }

    const handleCheckAll = () => {
        if (allChecked) {
            setKeyId([])
            setAllChekced(false)
        } else {
            setKeyId(data.map(d => d.id))
            setAllChekced(true)
        }
    }

    const handleUnsubscribe = () => {
        setData([...data.filter(d => !keyId.includes(d.id))])
        // some real remove data function goes here
    }

    return (
        <Container>
            <h3 className='mb-3'>
                Welcome {auth.username}. Let's start unsubscribing
            </h3>
            <Stack gap={5}>
                <ControllBar handleCheckAll={handleCheckAll}
                    handleUnsubscribe={handleUnsubscribe} />
                {
                    data?.length > 0 ?
                        data.map((d, i) => (
                            <ContentCard key={d.id}
                                data={d}
                                handleCheck={handleCheck}
                                checked={keyId.includes(d.id) ? true : false}
                                profileColor={colors[i]} />
                        )
                        ) :
                        <Stack direction='horizontal' gap={3}>
                            <h3>Please wait while we retrieve your data... </h3>
                            <WhisperSpinner size={40} color="#686769" loading={true} />
                        </Stack>
                }
            </Stack>
        </Container>
    )
}