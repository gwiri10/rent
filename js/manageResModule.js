import { fetchData, updateDocument, addData, deleteItem, fetchComCdMax} from './firebase.js';

window.onload = async function () {
    await Search();
}

async function Search(){
    let cardContainer = document.getElementById("cardList"); // 카드 컨테이너 선택
    cardContainer.innerHTML = '';

    let result = await fetchData("reservations");

    result.forEach((doc) => {
        let data = doc.data();

        //예약상태
        let resStateNm, classNm;
        switch (data.resState) {
            case 1:
                resStateNm = "예약대기";
                classNm = "pending";
                break;
            case 2:
                resStateNm = "예약확정";
                classNm = "complete";
                break;
            case 3:
                resStateNm = "예약취소";
                classNm = "cancel";
                break;
            default:
                resStateNm = "예약대기"; // 정의되지 않은 값에 대한 처리
                classNm = "pending";
        }
        
        const newCarCard = document.createElement('div');
        newCarCard.innerHTML = `
        <div class="reservation-card">
            <div class="reservation-status ${classNm}">${resStateNm}</div>
            <h3 class="reservation-title">${data.driverName} / ${data.carName}</h3>
            <h4 class="reservation-subtitle">${data.pickupDate} ~ ${data.returnDate}</h4>
            <h4 class="reservation-subtitle">${data.pickupSpot}</h4>
    
            <!-- 클릭 시 펼쳐지는 상세 정보 -->
            <div class="reservation-details">
                    <table>
                        <tr>
                            <th>예약자명</th>
                            <td>${data.driverName}</td>
                        </tr>
                        <tr>
                            <th>영문 성</th>
                            <td>${data.lastName}</td>
                        </tr>
                        <tr>
                            <th>영문 이름</th>
                            <td>${data.firstName}</td>
                        </tr>
                        <tr>
                            <th>인수 날짜시간</th>
                            <td>${data.pickupDate}</td>
                        </tr>
                        <tr>
                            <th>인수 장소</th>
                            <td>${data.pickupSpot}</td>
                        </tr>
                        <tr>
                            <th>반납 날짜시간</th>
                            <td>${data.returnDate}</td>
                        </tr>
                        <tr>
                            <th>반납 장소</th>
                            <td>${data.returnSpot}</td>
                        </tr>
                        <tr>
                            <th>도착 항공편</th>
                            <td>${data.flightIn}</td>
                        </tr>
                        <tr>
                            <th>성인 수</th>
                            <td>${data.adultCount}</td>
                        </tr>
                        <tr>
                            <th>소인 수</th>
                            <td>${data.childCount}</td>
                        </tr>
                        <tr>
                            <th>유아 수</th>
                            <td>${data.babyCount}</td>
                        </tr>
                        <tr>
                            <th>영아 수</th>
                            <td>${data.infantCount}</td>
                        </tr>
                        <tr>
                            <th>수령 방법</th>
                            <td>${data.pickupMethod}</td>
                        </tr>
                        <tr>
                            <th>전화번호</th>
                            <td>${data.mobile}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>${data.email}</td>
                        </tr>
                        <tr>
                            <th>풀커버 보험(NOC)</th>
                            <td>${data.insurance}</td>
                        </tr>
                        <tr>
                            <th>주니어 카시트</th>
                            <td>${data.juniorSeat}</td>
                        </tr>
                        <tr>
                            <th>차일드 카시트</th>
                            <td>${data.childSeat}</td>
                        </tr>
                        <tr>
                            <th>베이비 카시트</th>
                            <td>${data.babySeat}</td>
                        </tr>
                        <tr>
                            <th>예약 일시</th>
                            <td>${data.regDate}</td>
                        </tr>
                    </table>
                
                <!-- 예약 관리 버튼들 -->
                <div class="reservation-actions">
                    <button class="cancel-btn">예약취소</button>
                    <button class="confirm-btn">예약확정</button>
                </div>
            </div>
        </div>
        `;
        // 카드 컨테이너에 카드 추가
        cardContainer.appendChild(newCarCard);

        //예약취소
        newCarCard.getElementsByClassName("cancel-btn")[0].onclick = async function(){
            await changeRes(doc.id, 3);
        }

        //예약확정
        newCarCard.getElementsByClassName("confirm-btn")[0].onclick = async function(){
            await changeRes(doc.id, 2);
        }

        newCarCard.addEventListener('click', () => {
            const details = newCarCard.querySelector('.reservation-details');
            details.style.display = details.style.display === 'none'|| details.style.display === '' ? 'block' : 'none';
        });

        //예약대기가 아니면 버튼창 없애기
        if(data.resState != 1){
            newCarCard.getElementsByClassName("reservation-actions")[0].style.display = 'none';
        }
    });
}

async function changeRes(id, state){
    let updateData = {"resState": state}
    let result = await updateDocument("reservations", id,updateData );

    if(result){
        if(state == 2) alert("예약확정 되었습니다.")
        else if(state == 3) alert("예약취소 되었습니다.")

        Search();
    }
}