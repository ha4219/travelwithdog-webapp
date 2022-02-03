import React from 'react';
import IMP from 'iamport-react-native';

// import Loading from './Loading';
import {View, Text} from 'react-native';
import ActivityIndicator from 'react-native';

function Loading() {
  return (
    <View
      flex={1}
      alignItems={'center'}
      flexDir={'row'}
      justifyContent={'center'}>
      <View flex={1} alignItems={'center'} justifyContent={'center'}>
        <Text fontSize={20}>잠시만 기다려주세요...</Text>
      </View>
    </View>
  );
}

function Payment({navigation}) {
  /* 가맹점 식별코드, 결제 데이터 추출 */
  // const userCode = navigation.getParam('userCode');
  // const data = navigation.getParam('data');

  /* 결제 후 실행될 콜백 함수 입력 */
  function callback(response) {
    const isSuccessed = getIsSuccessed(response);
    if (isSuccessed) {
      /* 결제 성공한 경우, 리디렉션 위해 홈으로 이동한다 */
      const params = {
        ...response,
        type: 'payment', // 결제와 본인인증 구분을 위한 필드
      };
      navigation.replace('Main', params);
    } else {
      /* 결제 실패한 경우, 이전 화면으로 돌아간다 */
      navigation.goBack();
    }
  }

  function getIsSuccessed(response) {
    const {imp_success, success} = response;

    if (typeof imp_success === 'string') return imp_success === 'true';
    if (typeof imp_success === 'boolean') return imp_success === true;
    if (typeof success === 'string') return success === 'true';
    if (typeof success === 'boolean') return success === true;
  }

  return (
    <IMP.Payment
      // userCode={userCode}
      userCode={'imp44949692'}
      loading={<Loading />}
      data={{
        // ...data,
        pg: 'html5_inicis', // PG사
        pay_method: 'card', // 결제수단
        merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
        amount: 1000, // 결제금액
        name: '아임포트 결제 데이터 분석', // 주문명
        buyer_name: '홍길동', // 구매자 이름
        buyer_tel: '01012341234', // 구매자 전화번호
        buyer_email: 'example@example', // 구매자 이메일
        buyer_addr: '신사동 661-16', // 구매자 주소
        buyer_postcode: '06018', // 구매자 우편번호
        app_scheme: 'travelwithdog',
      }}
      callback={callback}
    />
  );
}

export default Payment;
