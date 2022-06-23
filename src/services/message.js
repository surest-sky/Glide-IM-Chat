import { getContactsListApi } from 'src/api/im'
import { map } from 'lodash';

const loadMessageRecord = async () => {
    const {
        data: { Data },
    } = await getContactsListApi();
    const uids = map(Data, 'Id');

}

const loadMessageByUid = async (uid) => {

}


export default loadMessageRecord

