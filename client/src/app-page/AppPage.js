import Container from 'react-bootstrap/Container'
import Stack from 'react-bootstrap/Stack'
import ContentCard from './ContentCard'
import ControllBar from './ControllBar'
import { useAuth } from '../context/auth'
import { useState, useEffect, useRef } from 'react'
import { WhisperSpinner } from 'react-spinners-kit'
import FlashMessage from '../global/FlashMessage'
import InfiniteScroll from 'react-infinite-scroll-component'
import color from './color'
import './AppPage.css'

export default function AppPage() {
    // the data we begin with
    const [data, setData] = useState([])
    // save key id if checkbox is selected
    const [buttonDisable, setButtonDisable] = useState(false)
    // save the nextPageToken here so that on refresh we lose it
    // so that we can start at top again
    const [nextPageToken, setNextPageToken] = useState(null)
    const [keyId, setKeyId] = useState([])
    const [allChecked, setAllChekced] = useState(false)
    const [showMessage, setShowMessage] = useState({
        header: '',
        message: '',
        show: false
    })
    const [labels, setLabels] = useState(null)
    const [selectedLabel, setSelectedLabel] = useState('CATEGORY_PROMOTIONS')
    const auth = useAuth()
    const isLabelNull = labels === null ? true : false
    const isDataEmpty = data?.length === 0 ? true : false
    const isMounted = useRef(false)
    // if labels is null, get labels
    useEffect(
        () => {
            fetchLabel()
        }, [isLabelNull]
    )

    // this is only triggered once
    useEffect(
        () => {
            console.log('fetching new data')
            fetchData()
        }, []
    )

    useEffect(
        () => {
            if (isDataEmpty && isMounted.current) {
                console.log('fetching new data')
                fetchData()
            } else {
                isMounted.current = true
            }
        }, [isDataEmpty]
    )

    const fetchLabel = () => {
        fetch('api/mail/labels')
            .then(res => res.json())
            .then(data => { setLabels(data) })
    }

    const fetchData = () => {
        // console.log(selectedLabel)
        fetch('api/mail/messages',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nextPageToken: nextPageToken,
                    label: selectedLabel
                })
            })
            .then(res => res.json())
            .then(result => {
                setNextPageToken(result.nextPageToken)
                // console.log(result.data)
                if (result.data) {
                    setData([...data, ...result.data])
                } else {
                    // if no data we just set it to null
                    setData(null)
                }
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
                    const newData = [...data.filter(d => !keyId.includes(d.id))]
                    setData(newData)
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

    const handleOptionChange = (value) => {
        setSelectedLabel(value)
        setData([])
    }

    return (
        <Container>
            <FlashMessage
                show={showMessage.show}
                header={showMessage.header}
                message={showMessage.message}
                handleMessageClick={handleMessageClick}
            />
            <Stack gap={3}>
                <h4 className='mt-3'>
                    Welcome {auth.username}. Let's start deleting.
                </h4>
                <ControllBar handleCheckAll={handleCheckAll}
                    allChecked={allChecked}
                    handleUnsubscribe={handleUnsubscribe}
                    handleOptionChange={handleOptionChange}
                    buttonDisable={buttonDisable}
                    labels={labels}
                />
                {
                    data !== null ?
                        <InfiniteScroll
                            className='infinite-scroll'
                            dataLength={data.length}
                            next={fetchData}
                            hasMore={nextPageToken ? true : false}
                            scrollThreshold={1}
                            loader={
                                <Stack direction='horizontal'>
                                    <div className='ms-auto me-auto'>
                                        <WhisperSpinner size={75} color="#686769" loading={true} />
                                    </div>
                                </Stack>
                            }
                        >
                            {
                                data.map((d, i) => (
                                    <ContentCard key={d.id}
                                        data={d}
                                        handleCheck={handleCheck}
                                        checked={keyId.includes(d.id) ? true : false}
                                        profileColor={color[d.sender[0].toUpperCase()] || '4D6A6D'} />
                                ))
                            }

                        </InfiniteScroll> :
                        <h4>Sorry! Couldn't find any data</h4>
                }
            </Stack>
        </Container>
    )
}