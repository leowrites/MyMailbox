import Container from 'react-bootstrap/Container'
import Stack from 'react-bootstrap/Stack'
import ContentCard from './ContentCard'
import ControllBar from './ControllBar'
import { useAuth } from '../context/auth'
import { useEffect, useState } from 'react'
import { generateColors } from './color'
import { WhisperSpinner } from 'react-spinners-kit'
import FlashMessage from '../global/FlashMessage'
import InfiniteScroll from 'react-infinite-scroll-component'
const colors = generateColors(100)

export default function AppPage() {
    // the data we begin with
    const [data, setData] = useState([])
    // save key id if checkbox is selected
    const [buttonDisable, setButtonDisable] = useState(false)
    const [keyId, setKeyId] = useState([])
    const [allChecked, setAllChekced] = useState(false)
    const [showMessage, setShowMessage] = useState({
        header: '',
        message: '',
        show: false
    })
    const auth = useAuth()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        fetch('api/mail/messages')
            .then(res => res.json())
            .then(newD => {
                setData(newD)
            })
    }

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
        // need to send these ids to the server
        setButtonDisable(true)
        fetch('api/mail/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(keyId)
        })
            .then(response => {
                setButtonDisable(false)
                if (response.ok) {
                    // if successful we will remove them from UI
                    setData([...data.filter(d => !keyId.includes(d.id))])
                    setShowMessage({
                        header: 'Successfully Deleted Messages!',
                        message: `You deleted ${keyId.length} messages`,
                        show: true,
                    })
                }
            })
            // show the flash message and set a timer of 3 seconds
            .then(() => {
                setTimeout(() => {
                    setShowMessage({
                        ...showMessage,
                        show: false,
                    })
                    setKeyId([])
                }, 3000
                )
            }
            )
            .catch(err => console.error(err))
    }

    const handleMessageClick = () => {
        setShowMessage({
            ...showMessage,
            show: false,
        })
    }

    return (
        <Container>
            <FlashMessage
                show={showMessage.show}
                header={showMessage.header}
                message={showMessage.message}
                handleMessageClick={handleMessageClick}
            />
            <h4 className='mb-3'>
                Welcome {auth.username}. Let's start unsubscribing
            </h4>
            <Stack gap={5}>
                <ControllBar handleCheckAll={handleCheckAll}
                    handleUnsubscribe={handleUnsubscribe}
                    buttonDisable={buttonDisable}
                />
                {/* <InfiniteScroll
                    dataLength={data.length}
                    next={fetchData}
                    hasMore={true}
                    loader={
                        <Stack direction='horizontal' gap={3}>
                            <h3>Please wait while we retrieve your data... </h3>
                            <WhisperSpinner size={40} color="#686769" loading={true} />
                        </Stack>
                    }
                >
                    {
                        data.map((d, i) => (
                            <ContentCard key={d.id}
                                data={d}
                                handleCheck={handleCheck}
                                checked={keyId.includes(d.id) ? true : false}
                                profileColor={colors[i]} />
                        ))
                    }
                
                </InfiniteScroll> */}
                {
                    data.length > 0 ?
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