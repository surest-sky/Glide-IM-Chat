import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react'
import { db } from 'src/services/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { getSessionId } from 'src/services/message'
import { orderBy } from 'lodash'

const useActiveChat = () => {
    const [messages, setMessages] = useState([])
    const userInfo = useSelector((state: any) => state.container.authInfo);
    const chatWithUser = useSelector((state: any) => state.chat.chatWithUser);
    const [session_id, setSessionId] = useState(0)
    const chat_messages = useLiveQuery(() => db.chat.where({ "session_id": session_id }).toArray(), [session_id]);


    useEffect(() => {
        if (!chatWithUser.uid || !userInfo?.Uid) {
            return;
        }
        setSessionId(getSessionId(userInfo.Uid, chatWithUser.uid));
    }, [chatWithUser, userInfo])

    useEffect(() => {
        if (!chat_messages) {
            setMessages([])
            return
        }
        setMessages(orderBy(chat_messages, 'mid', 'asc'))
    }, [chat_messages])

    return messages
}

export { useActiveChat }