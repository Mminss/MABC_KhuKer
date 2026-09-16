// 공지 데이터 (초기 상태 - 이미 올라간 공지들)
const initialNotices = [
  {
    id: 'slack-1',
    channel: '슬랙',
    title: '동아리 하반기 행사',
    items: {
      date: '9월 20일(토)',
      time: '14:00~17:00',
      place: '본관 3층 강당',
      fee: '5,000원',
      link: 'https://apply.example.com/x9z2',
      deadline: '9월 15일(월) 18시'
    },
    modified: false
  },
  {
    id: 'kakao-1',
    channel: '카톡',
    title: '동아리 하반기 행사',
    items: {
      date: '9월 20일(토)',
      time: '14:00~17:00',
      place: '본관 3층 강당',
      fee: '5,000원',
      link: 'https://apply.example.com/x9z2',
      deadline: '9월 15일(월) 18시'
    },
    modified: false
  },
  {
    id: 'insta-1',
    channel: '인스타',
    title: '동아리 하반기 행사',
    items: {
      date: '9월 20일(토)',
      time: '14시~17시',
      place: '본관 3층 강당',
      fee: '5,000원',
      link: 'bit.ly/apply-x9z2',
      deadline: '9월 15일(월) 18시'
    },
    modified: false
  },
  {
    id: 'form-1',
    channel: '신청폼',
    title: '동아리 하반기 행사',
    items: {
      date: '2025년 9월 21일(일)',
      time: '14:00~17:00',
      place: '본관 3층 대강당',
      fee: '5,000원',
      link: 'https://apply.example.com/x9z2',
      deadline: '9월 15일(월) 18:00'
    },
    modified: false
  }
];

// 수정된 슬랙 공지 (감지 대상)
const modifiedNotice = {
  id: 'slack-modified',
  channel: '슬랙',
  title: '동아리 하반기 행사 (수정)',
  items: {
    date: '9월 20일(토)',
    time: '14:00~17:00',
    place: '본관 3층 강당',
    fee: '5,000원',
    link: 'https://apply.example.com/x9z2',
    deadline: '9월 15일(월) 18시'
  }
};

// 현재 상태
let notices = [...initialNotices];
let isConflictDetected = false;
let conflictItems = [];
let selectedAction = null;

// DOM 요소
const noticeCardsEl = document.getElementById('noticeCards');
const alertAreaEl = document.getElementById('alertArea');
const resultAreaEl = document.getElementById('resultArea');
const actionAreaEl = document.getElementById('actionArea');
const resultTitleEl = document.querySelector('.result-area h2');

// 공지 카드 렌더링
function renderNoticeCards() {
  noticeCardsEl.innerHTML = notices.map(notice => {
    const itemsHtml = Object.entries(notice.items).map(([key, value]) => {
      const label = key === 'fee' ? '참가비' :
                    key === 'link' ? '신청 링크' :
                    key === 'deadline' ? '마감일' :
                    key.charAt(0).toUpperCase() + key.slice(1);
      return `
        <div class="item">
          <span class="item-label">${label}:</span>
          <span class="item-value">${value}</span>
        </div>
      `;
    }).join('');

    const modifiedBadge = notice.modified ?
      '<span class="modified-badge">수정됨</span>' : '';

    return `
      <div class="notice-card ${notice.modified ? 'modified' : 'original'}">
        <span class="channel">${notice.channel}</span>
        <h3>${notice.title} ${modifiedBadge}</h3>
        ${itemsHtml}
      </div>
    `;
  }).join('');
}

// 충돌 감지 시뮬레이션 (notice-conflict 방식)
function detectConflicts() {
  // 슬랙 수정 공지와 다른 채널 공지 비교
  const slack = modifiedNotice;
  const others = notices.filter(n => n.channel !== '슬랙');

  const mismatchItems = [];

  for (const [key, slackValue] of Object.entries(slack.items)) {
    const label = key === 'fee' ? '참가비' :
                  key === 'link' ? '신청 링크' :
                  key === 'deadline' ? '마감일' :
                  key.charAt(0).toUpperCase() + key.slice(1);

    const otherValues = others.map(n => ({
      channel: n.channel,
      value: n.items[key]
    }));

    // 값 비교 (단순 문자열 비교)
    const allSame = otherValues.every(v => v.value === slackValue);
    const allDifferent = otherValues.every(v => v.value !== slackValue);

    let status;
    let excerpt = '';

    if (allSame) {
      // 모두 일치하면 불일치 아님
      continue;
    }

    // 하나라도 다르면 어긋남으로 표시
    const differentChannels = otherValues.filter(v => v.value !== slackValue);
    const sameChannels = otherValues.filter(v => v.value === slackValue);

    if (differentChannels.length > 0) {
      status = '어긋남';
      excerpt = `${slack.channel} - ${label}: "${slackValue}"`;
    } else {
      status = '판별 불가';
      excerpt = `${slack.channel} - ${label}: "${slackValue}"`;
    }

    mismatchItems.push({
      key,
      label,
      slackValue,
      otherValues,
      status,
      excerpt,
      differentChannels,
      sameChannels
    });
  }

  return mismatchItems;
}

// 충돌 감지 결과 표시
function showConflictAlert(mismatchItems) {
  const mismatchCount = mismatchItems.length;

  alertAreaEl.innerHTML = `
    <h2>📢 공지 충돌 감지</h2>
    <p>슬랙에 수정된 공지를 감지했습니다. 총 <strong>${mismatchCount}개</strong> 항목에서 다른 채널과 차이가 있습니다.</p>
    <button id="viewDetailsBtn">자세히 보기</button>
  `;

  alertAreaEl.classList.add('visible');

  document.getElementById('viewDetailsBtn').addEventListener('click', () => {
    alertAreaEl.classList.remove('visible');
    showResult(mismatchItems);
  });
}

// 결과 화면 표시
function showResult(mismatchItems) {
  const mismatchOnly = mismatchItems.filter(item => item.status === '어긋남');

  resultTitleEl.innerHTML = `
    <span>📋 항목별 대조 결과</span>
    <button id="backToAlertBtn">← 다시 보기</button>
  `;

  resultAreaEl.innerHTML = `
    <div class="result-content">
      ${mismatchOnly.map(item => `
        <div class="mismatch-item">
          <h4>❌ ${item.label}</h4>
          <div class="channel-values">
            <div><strong>슬랙:</strong> ${item.slackValue}</div>
            ${item.otherValues.map(v => `
              <div>${v.channel}: ${v.value} ${v.value !== item.slackValue ? '⚠️' : '✅'}</div>
            `).join('')}
          </div>
          <div class="source-excerpt">
            <strong>의심 구간:</strong> ${item.excerpt}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  resultAreaEl.classList.add('visible');

  document.getElementById('backToAlertBtn').addEventListener('click', () => {
    resultAreaEl.classList.remove('visible');
    showConflictAlert(mismatchItems);
  });

  // 액션 영역 표시
  actionAreaEl.classList.add('visible');
  actionAreaEl.innerHTML = `
    <button id="applyAllBtn">전체 수정 반영</button>
    <button class="cancel" id="cancelBtn">취소</button>
  `;

  document.getElementById('applyAllBtn').addEventListener('click', applyAll);
  document.getElementById('cancelBtn').addEventListener('click', cancelAction);
}

// 전체 수정 반영
function applyAll() {
  // 다른 채널 공지들의 슬랙 수정 공지 값으로 변경 (가상 UI 반영)
  for (const notice of notices) {
    if (notice.channel !== '슬랙') {
      notice.items = { ...modifiedNotice.items };
      notice.modified = true;
    }
  }

  // 상태 초기화
  isConflictDetected = false;
  conflictItems = [];
  selectedAction = 'applied';

  // UI 업데이트
  alertAreaEl.classList.remove('visible');
  resultAreaEl.classList.remove('visible');
  actionAreaEl.classList.remove('visible');
  renderNoticeCards();

  // 알림 표시
  alertAreaEl.innerHTML = `
    <h2>✅ 전체 수정 반영 완료</h2>
    <p>다른 채널의 공지들이 슬랙 수정 공지 기준으로 업데이트되었습니다.</p>
    <button id="resetBtn">다시 시작</button>
  `;
  alertAreaEl.classList.add('visible');

  document.getElementById('resetBtn').addEventListener('click', resetAll);
}

// 취소
function cancelAction() {
  actionAreaEl.classList.remove('visible');
  resultAreaEl.classList.remove('visible');

  // 결과로 다시 돌아가기
  if (conflictItems.length > 0) {
    showResult(conflictItems);
  }
}

// 다시 시작
function resetAll() {
  notices = [...initialNotices];
  isConflictDetected = false;
  conflictItems = [];
  selectedAction = null;

  alertAreaEl.classList.remove('visible');
  resultAreaEl.classList.remove('visible');
  actionAreaEl.classList.remove('visible');
  renderNoticeCards();
}

// 슬랙 수정 공지 감지 시뮬레이션
function detectModifiedNotice() {
  // 실제 구현에서는 여기서 슬랙 API로 최근 메시지 읽어오기
  // MVP에서는 시뮬레이션으로 처리

  conflictItems = detectConflicts();
  isConflictDetected = true;

  showConflictAlert(conflictItems);
}

// 초기화
renderNoticeCards();

// 2초 후 슬랙 수정 공지 감지 시뮬레이션 시작
setTimeout(() => {
  detectModifiedNotice();
}, 2000);
