import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react'
import { db } from 'src/services/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { getSessionId } from 'src/services/message'
import { orderBy, filter } from 'lodash'

const useActiveChat = () => {
    const [messages, setMessages] = useState([])
    const userInfo = useSelector((state: any) => state.container.authInfo);
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const [session_id, setSessionId] = useState(0)
    const chat_messages = useLiveQuery(() => db.chat.where({ "session_id": session_id }).toArray(), [session_id]);


    useEffect(() => {
        if (!chatWithUser.uid || !userInfo?.uid) {
            return;
        }
        setSessionId(getSessionId(userInfo.uid, chatWithUser.uid));
    }, [chatWithUser, userInfo])

    useEffect(() => {
        if (!chat_messages) {
            setMessages([])
            return
        }
        // setMessages(filter(orderBy(chat_messages, 'mid', 'asc'), (item) => [0, 1].includes(parseInt(item.status))))
        setMessages(filter(orderBy(chat_messages, 'mid', 'asc')))

        // console.log('变化了', filter(orderBy(chat_messages, 'mid', 'asc'), (item) => [0, 1].includes(parseInt(item.status))))
    }, [chat_messages])

    return messages
}

export { useActiveChat }