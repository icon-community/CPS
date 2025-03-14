// import { setCookie } from '../../../helpers/cookie';
import { callKeyStoreWallet } from '../../ICON/utils';
import { put, call, select } from 'redux-saga/effects';
import { loginSuccess } from 'Redux/Reducers/accountSlice';
import { IconConverter } from 'icon-sdk-js';
import { iconService } from 'Redux/ICON/utils';

export default function* loginPrepWorker() {
  try {
    const getAddress = state => state.account.address;
    const walletAddress = yield select(getAddress);
    let response = yield call(callKeyStoreWallet, {
      method: 'loginPrep',
      params: {
        address: walletAddress,
      },
    });

    const isCouncilManager = !!parseInt(
      IconConverter.toBigNumber(response.isCouncilManager),
    );
    const isPrep = !!parseInt(IconConverter.toBigNumber(response.isPRep));
    const isRegistered = !!parseInt(
      IconConverter.toBigNumber(response.isRegistered),
    );
    const payPenalty = !!parseInt(
      IconConverter.toBigNumber(response.payPenalty),
    );
    const penaltyAmount = parseInt(response.penaltyAmount);
    const votingPRep = parseInt(response.votingPRep);
    const walletBalance = yield iconService.getBalance(walletAddress).execute();

    yield put(
      loginSuccess({
        isCouncilManager,
        isPrep,
        isRegistered,
        payPenalty,
        penaltyAmount,
        walletBalance,
        votingPRep,
      }),
    );
  } catch (error) {
    console.log('error');
    // yield put(courseActions.getCourseInfoFailure());
  }
}
